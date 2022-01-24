const mongoose = require('mongoose');

const priceSchema = mongoose.Schema({
    value: {
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
    price: priceSchema
}, { collection: 'vehicle_types' });

const VehicleType = mongoose.model('VehicleType', schema);

module.exports = VehicleType;