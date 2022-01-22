const { VehicleType } = require('../models');
const config = require('../config/config');

const list = async (req, res) => {
    const types = await VehicleType.find({}, {
        _id: true,
        name: true,
    });

    res.send(types);
}

const create = async (req, res) => {
    const { name } = req.body;

    try {
        const type = await VehicleType.create({
            name
        })
        res.status(201).send(type)
    } catch (error) {
        res.status(400).send(error)
    }
}

module.exports = {
    list,
    create
}