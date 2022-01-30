const mongoose = require('mongoose');

const pointSchema = new mongoose.Schema({
    geometry: {
        type: {
            type: String,
            enum: ['Point'],
            required: true
        },
        coordinates: {
            type: [Number],
            required: true
        }
    }
});

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
    location: pointSchema,
    available: {
        type: Boolean,
        default: true
    },
    max_autonomy: {
        type: Number,
        required: true
    },
    current_autonomy: {
        type: Number,
        required: true
    }
});

schema.index({
    location: "2dsphere"
})

const Vehicle = mongoose.model('Vehicle', schema);

module.exports = Vehicle;