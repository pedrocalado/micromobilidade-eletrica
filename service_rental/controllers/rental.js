const config = require('../config/config');
const axios = require('axios');
const { Rental } = require('../models');

const start = async (req, res) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    // Value represents the amount of 'minute', 'hour' or 'km' 
    // the user wants, depending on the vehicle_type

    const { vehicle_id, value } = req.body;

    // Get the current user data

    let user;
    try {
        const usersServiceUrl = config.usersService.me;
        const response = await axios.get(usersServiceUrl, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })

        user = response.data;
    } catch (err) {
        return res.status(err.response.status).json({
            message: err.response.data
        })
    }

    const { _id: userId, balance: userBalance } = user

    // Check if the current user has any ongoing rental

    const countUserRentals = await Rental.find({ user_id: userId, status: 'in_progress' }).count()

    if (countUserRentals > 0) {
        return res.status(400).json({
            message: "O utilizador possui um aluguer a decorrer."
        })
    }

    // Check if vehicle exists and is available for rental

    let vehicle;
    try {
        const vehiclesServiceUrl = config.vehiclesService.vehiclesUrl;
        const response = await axios.get(`${vehiclesServiceUrl}/${vehicle_id}`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })

        vehicle = response.data;
    } catch (err) {
        return res.status(err.response.status).json({
            message: err.response.data
        })
    }

    if (!vehicle.available) {
        return res.status(400).json({
            message: "O veículo não se encontra disponível para aluguer."
        })
    }

    // Get the vehicle type

    let vehicleType;

    try {
        const vehicleTypesServiceUrl = config.vehiclesService.vehicleTypesUrl;
        const response = await axios.get(`${vehicleTypesServiceUrl}/${vehicle.vehicle_type_id}`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })

        vehicleType = response.data;
    } catch (err) {
        return res.status(err.response.status).json({
            message: err.response.data
        })
    }

    const { price } = vehicleType;

    if (userBalance < price.value) {
        return res.status(400).json({
            message: "O utilizador não possui saldo suficiente."
        })
    }

    try {
        const startDate = Date.now();
        let rental = await Rental.create({
            vehicle_id,
            user_id: userId,
            period: price.period,
            price_per_period: price.value,
            start_rental_date: startDate,
        })

        // Remove value from user's balance
        const usersServiceUrl = config.usersService.removeBalance(userId)
        await axios.post(usersServiceUrl, {
            value: price.value
        }, {
            headers: {
                "api-key": config.headerApiKey
            }
        })

        // Update the vehicle status
        await axios.put(`${config.vehiclesService.vehiclesUrl}/${vehicle._id}/status`, {
            available: false
        }, {
            headers: {
                "api-key": config.headerApiKey
            }
        })

        rental = await Rental.findByIdAndUpdate(rental.id, {
            periods_paid: 1,
            amount_paid: price.value
        }, { new: true })

        res.status(201).send(rental)
    } catch (error) {
        res.status(400).send(error)
    }
}

const check = async (req, res) => {
    const id = req.params.id

    let rental;

    try {
        rental = await Rental.findById(id)
    } catch (err) {
        return res.sendStatus(404)
    }

    if (!rental) {
        return res.sendStatus(404)
    }

    /**
     * Codes:
     * completed    Aluguer já terminou
     * ending       Aluguer a terminar daqui a x segundos
     * no_balance   Cliente não tem saldo, aluguer termina em x
     * in_progress  Aluguer a decorrer
     */

    const nowTimestamp = new Date().getTime();

    if (rental.finish_rental_date) {
        const finishDateTimestamp = new Date(rental.finish_rental_date).getTime();

        if (finishDateTimestamp < nowTimestamp) {
            return res.json({
                code: "completed",
                message: "O aluguer já terminou.",
                ...rental.toObject()
            })
        } else {
            const timeDiff = (finishDateTimestamp - nowTimestamp) / 1000;

            return res.json({
                code: "ending",
                time_left: timeDiff,
                message: `Aluger a terminar dentro de ${timeDiff} segundos.`,
                ...rental.toObject()
            })
        }
    }

    const startDateTimestamp = new Date(rental.start_rental_date).getTime();

    let checkBalance = false;
    let payNewPeriod = false;

    if (rental.period === 'minute' || rental.period === 'hour') {
        const minutesPaid = rental.period === 'hour' ? 60 * rental.periods_paid : rental.periods_paid;
        const paidUntil = new Date().setTime(startDateTimestamp + (minutesPaid * 60 * 1000))

        const timeDiff = (paidUntil - nowTimestamp) / 1000

        // Verificar 30s antes de terminar, se o utilizador tem saldo para o próximo perído
        if (timeDiff <= 0) {
            checkBalance = true;

            // Descontar o próximo período
            if (timeDiff <= 0) {
                payNewPeriod = true
            }
        }
    }

    // Verificar se o utilizador possui saldo para o próximo período
    // Se não tiver saldo suficiente, alertar e para viagem daqui a 1 minuto
    if (checkBalance) {
        let user;
        try {
            const response = await axios.get(`${config.usersService.url}/${rental.user_id}`, {
                headers: {
                    "api-key": config.headerApiKey
                }
            })

            user = response.data;
        } catch (err) {
            return res.status(err.response.status).json({
                message: err.response.data
            })
        }

        const { _id: userId, balance: userBalance } = user

        if (userBalance < rental.price_per_period) {
            // Terminar daqui a 1 minuto
            const finishDate = new Date().setTime(new Date().getTime() + (60 * 1000));

            await Rental.findByIdAndUpdate(rental.id, {
                finish_rental_date: finishDate,
                status: "completed",
            });

            // Update the vehicle status
            await axios.put(`${config.vehiclesService.vehiclesUrl}/${rental.vehicle_id}/status`, {
                available: true
            }, {
                headers: {
                    "api-key": config.headerApiKey
                }
            })

            return res.json({
                code: "no_balance",
                message: "O utilizador não possui saldo suficiente."
            })
        }

        if (payNewPeriod) {
            // Remove value from user's balance
            const usersServiceUrl = config.usersService.removeBalance(userId)
            await axios.post(usersServiceUrl, {
                value: rental.price_per_period
            }, {
                headers: {
                    "api-key": config.headerApiKey
                }
            })

            rental = await Rental.findByIdAndUpdate(rental.id, {
                $inc: {
                    periods_paid: 1,
                    amount_paid: rental.price_per_period
                },
            }, { new: true })

            return res.json({
                code: "new_period",
                ...rental.toObject()
            })
        }
    }

    res.json({
        code: "in_progress",
        ...rental.toObject()
    })
}

const userActiveRental = async (req, res) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    // Get the current user data

    let user;
    try {
        const usersServiceUrl = config.usersService.me;
        const response = await axios.get(usersServiceUrl, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })

        user = response.data;
    } catch (err) {
        return res.status(err.response.status).json({
            message: err.response.data
        })
    }

    const { _id: userId } = user

    // Check if the current user has any ongoing rental

    const rental = await Rental.findOne({ user_id: userId, status: 'in_progress' })

    if (rental) {
        return res.json(rental);
    }

    return res.status(404).json({

    });
}

const userRentals = async (req, res) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    // Get the current user data

    let user;
    try {
        const usersServiceUrl = config.usersService.me;
        const response = await axios.get(usersServiceUrl, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })

        user = response.data;
    } catch (err) {
        return res.status(err.response.status).json({
            message: err.response.data
        })
    }

    const { _id: userId } = user

    // Check if the current user has any ongoing rental

    const rentals = await Rental.find({ user_id: userId }, {
        _id: true,
        user_id: true,
        vehicle_id: true,
        start_rental_date: true,
        finish_rental_date: true,
        period: true,
        price_per_period: true,
        periods_paid: true,
        status: true,
        amount_paid: true,
    })

    return res.json(rentals.map(rental => {
        let data = {
            ...rental.toObject()
        }

        if (rental.status == 'completed' && rental.finish_rental_date) {
            const startDateTimestamp = new Date(rental.start_rental_date).getTime();
            const finishDateTimestamp = new Date(rental.finish_rental_date).getTime();

            const duration = parseInt((finishDateTimestamp - startDateTimestamp) / 1000);

            data = { ...data, duration }
        };

        return data;
    }));
}

const stop = async (req, res) => {
    const id = req.params.id

    let rental;

    try {
        rental = await Rental.findById(id)
    } catch (err) {
        return res.sendStatus(404)
    }

    if (!rental) {
        return res.sendStatus(404)
    }

    const nowTimestamp = new Date().getTime();

    if (rental.finish_rental_date) {
        const finishDateTimestamp = new Date(rental.finish_rental_date).getTime();

        if (finishDateTimestamp < nowTimestamp) {
            return res.json({
                code: "completed",
                message: "O aluguer já terminou.",
                ...rental.toObject()
            })
        }
    }

    const finishDate = Date.now();

    await Rental.findByIdAndUpdate(rental.id, {
        finish_rental_date: finishDate,
        status: "completed",
    });

    // Update the vehicle status
    await axios.put(`${config.vehiclesService.vehiclesUrl}/${rental.vehicle_id}/status`, {
        available: true
    }, {
        headers: {
            "api-key": config.headerApiKey
        }
    })

    return res.json({
        code: "completed",
        message: "Aluguer terminado com sucesso."
    })
}

module.exports = {
    start,
    check,
    stop,
    userRentals,
    userActiveRental,
    // list
}