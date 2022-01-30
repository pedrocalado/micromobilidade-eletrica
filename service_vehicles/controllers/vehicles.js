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
        const type = await VehicleType.findById(vehicle.vehicle_type_id, { _id: true, name: true, price: true });

        data.push({
            _id: vehicle._id,
            registration: vehicle.registration,
            year: vehicle.year,
            month: vehicle.month,
            vehicle_type: type
        })
    }

    res.send(data)
}

const create = async (req, res) => {
    const { registration, year, month, vehicle_type_id, max_autonomy, current_autonomy } = req.body;

    try {
        // Check if vehicle type exists
        const type = await VehicleType.findById(vehicle_type_id);

        if (!type) {
            return res.status(400).send("O tipo de veículo não existe.")
        }

        const vehicle = await Vehicle.create({
            registration, year, month, vehicle_type_id, max_autonomy, current_autonomy
        })
        res.status(201).send(vehicle)
    } catch (error) {
        res.status(400).send(error)
    }
}

const details = async (req, res) => {
    const id = req.params.id

    try {
        const vehicle = await Vehicle.findById(id)

        if (!vehicle) {
            return res.sendStatus(404)
        }

        res.json(vehicle)
    } catch (err) {
        res.sendStatus(404)
    }
}

const listNearby = async (req, res) => {
    const km = req.query.distance ?? 1;
    const lat = req.query.lat;
    const lon = req.query.lon;

    const vehicles = await Vehicle.find({
        available: 1,
        location: {
            $near: {
                $geometry: {
                    type: 'Point',
                    coordinates: [lat, lon]
                },
                $maxDistance: km * 1000
            }
        }
    }, { registration: 1 });

    res.json(vehicles);
}

const update = async (req, res) => {
    const id = req.params.id;

    const { registration, year, month, vehicle_type_id } = req.body;

    try {
        const vehicle = await Vehicle.findByIdAndUpdate(id, {
            registration, year, month, vehicle_type_id
        }, { new: true })

        if (!vehicle) {
            return res.sendStatus(404)
        }

        res.json(vehicle)
    } catch (err) {
        res.sendStatus(404)
    }
}

const updateAvailableStatus = async (req, res) => {
    const id = req.params.id
    const { available } = req.body

    try {
        const vehicle = await Vehicle.findByIdAndUpdate(id, {
            available
        }, { new: true })

        if (!vehicle) {
            return res.sendStatus(404)
        }

        res.json(vehicle)
    } catch (err) {
        res.sendStatus(404)
    }
}

const updateLocation = async (req, res) => {
    const id = req.params.id
    const { lat, lon } = req.body

    console.log(id)
    console.log(lat)
    console.log(lon)

    try {
        const vehicle = await Vehicle.findByIdAndUpdate(id, {
            "location.coordinates": [lat, lon]
        }, { new: true })

        console.log(vehicle)

        if (!vehicle) {
            return res.sendStatus(404)
        }

        res.json(vehicle)
    } catch (err) {
        console.log(err)
        res.sendStatus(400)
    }
}

const updateAutonomy = async (req, res) => {
    const id = req.params.id
    const { value } = req.body

    try {
        const vehicle = await Vehicle.findByIdAndUpdate(id, {
            current_autonomy: value
        }, { new: true })

        if (!vehicle) {
            return res.sendStatus(404)
        }

        res.json(vehicle)
    } catch (err) {
        res.sendStatus(404)
    }
}

module.exports = {
    list,
    create,
    details,
    updateAvailableStatus,
    listNearby,
    update,
    updateLocation,
    updateAutonomy
}