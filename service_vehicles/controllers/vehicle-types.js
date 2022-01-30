const { VehicleType } = require('../models');
const config = require('../config/config');

const list = async (req, res) => {
    const types = await VehicleType.find({}, {
        _id: true,
        name: true,
        price: true
    });

    res.send(types);
}

const create = async (req, res) => {
    const { name, price } = req.body;
    const { value, period } = price;

    try {
        const type = await VehicleType.create({
            name,
            price: {
                value,
                period
            }
        })
        res.status(201).send(type)
    } catch (error) {
        res.status(400).send(error)
    }
}

const details = async (req, res) => {
    const id = req.params.id

    try {
        const vehicleType = await VehicleType.findById(id)

        if (!vehicleType) {
            return res.sendStatus(404)
        }

        res.json(vehicleType)
    } catch (err) {
        res.sendStatus(404)
    }
}

const update = async (req, res) => {
    const id = req.params.id;

    const { name, price } = req.body;
    const { value, period } = price;

    try {
        const vehicleType = await VehicleType.findByIdAndUpdate(id, {
            name,
            price: {
                value,
                period
            }
        }, { new: true })

        if (!vehicleType) {
            return res.sendStatus(404)
        }

        res.json(vehicleType)
    } catch (err) {
        res.sendStatus(404)
    }
}

module.exports = {
    list,
    create,
    details,
    update
}