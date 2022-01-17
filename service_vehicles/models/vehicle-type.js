const mongoose = require('mongoose');

const priceSchema = mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    period: {
        type: String,
        enum: ['minute', 'hour', 'day']
    }
});

const schema = mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    prices: [priceSchema]
});

const VehicleType = mongoose.model('VehicleType', schema);

module.exports = VehicleType;