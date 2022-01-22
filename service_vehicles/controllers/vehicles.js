const { Vehicle, VehicleType } = require('../models');
const config = require('../config/config');

const list = async (req, res) => {
    const vehicles = await Vehicle.find({}, {
        _id: true,
        registration: true,
        year: true,
        month: true,
        vehicle_type_id: true
    });

    const data = [];
    for (vehicle of vehicles) {
        const type = await VehicleType.findById(vehicle.vehicle_type_id, { _id: true, name: true });

        data.push({
            registration: vehicle.registration,
            year: vehicle.year,
            month: vehicle.month,
            vehicle_type: type
        })
    }

    res.send(data)
}

const create = async (req, res) => {
    const { registration, year, month, vehicle_type_id } = req.body;

    try {
        // Check if vehicle type exists
        const type = await VehicleType.findById(vehicle_type_id);

        if (!type) {
            return res.status(400).send("O tipo de veículo não existe.")
        }

        const vehicle = await Vehicle.create({
            registration, year, month, vehicle_type_id
        })
        res.status(201).send(vehicle)
    } catch (error) {
        res.status(400).send(error)
    }
}

const listNearby = async (req, res) => {
    //TODO
}

module.exports = {
    list,
    create
}