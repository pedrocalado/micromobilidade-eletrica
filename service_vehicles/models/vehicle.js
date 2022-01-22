const mongoose = require('mongoose');

const schema = mongoose.Schema({
    registration: {
        type: String,
        required: true,
    },
    year: {
        type: Number,
        required: true
    },
    month: {
        type: Number,
        required: true
    },
    vehicle_type_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "VehicleType"
    },
    coordinates: {
        lat: {
            type: Number
        },
        lon: {
            type: Number
        }
    }
});

const Vehicle = mongoose.model('Vehicle', schema);

module.exports = Vehicle;