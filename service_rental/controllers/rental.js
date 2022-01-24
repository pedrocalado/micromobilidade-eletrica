const config = require('../config/config');
const axios = require('axios');
const { Rental } = require('../models');

const start = async (req, res) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    const { vehicle_id } = req.body;

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

    const { value, period } = vehicleType.price;

    // return res.json(vehicleType)

    // Inicialmente, é sempre descontado o valor da tarifa do tipo de veículo
    // Verificar se o utilizador possui este valor mínimo

    if (userBalance < value) {
        return res.status(400).json({
            message: "O utilizador não possui saldo suficiente."
        })
    }

    try {
        const startDate = Date.now();
        const rental = await Rental.create({
            vehicle_id,
            user_id: userId,
            start_rental_date: startDate,
        })

        // Remove value from user's balance
        const usersServiceUrl = config.usersService.removeBalance(userId)
        console.log(usersServiceUrl)
        const response = await axios.post(usersServiceUrl, {
            value
        }, {
            headers: {
                "API-Key": config.headerApiKey
            }
        })

        console.log(response.data)

        res.status(201).send(rental)
    } catch (error) {
        res.status(400).send(error)
    }
}

const list = () => { }

module.exports = {
    start,
    list
}