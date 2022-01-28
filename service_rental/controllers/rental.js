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

    // if (!vehicle.available) {
    //     return res.status(400).json({
    //         message: "O veículo não se encontra disponível."
    //     })
    // }

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

        rental = await Rental.findByIdAndUpdate(rental.id, {
            periods_paid: 1,
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

    let nextPayment = null;
    const startDate = new Date(rental.start_rental_date);
    const now = new Date();

    console.log(startDate)

    if (rental.period === 'minute' || rental.period === 'hour') {
        // const paidUntil =
        const minutesPaid = rental.period === 'hour' ? 60 * rental.periods_paid : rental.periods_paid;
        const paidUntil = new Date().setTime(startDate.getTime() + (minutesPaid * 60 * 1000))
        console.log(paidUntil)
    } /* else if(rental.period === 'km') {
        
    } */

    res.json(rental)
}

const list = () => { }

module.exports = {
    start,
    check,
    list
}