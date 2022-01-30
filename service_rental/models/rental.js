const mongoose = require('mongoose');
// const uniqueValidator = require('mongoose-unique-validator');
// const validator = require('validator');

const rentalSchema = mongoose.Schema({
    // name: {
    //     type: String,
    //     required: true,
    //     trim: true
    // },
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
    },
    vehicle_id: {
        type: mongoose.Schema.Types.ObjectId,
    },
    start_rental_date: {
        type: Date,
        required: true
    },
    finish_rental_date: {
        type: Date,
    },
    period: {
        type: String,
        enum: ['minute', 'hour', 'km'],
        required: true
    },
    price_per_period: {
        type: Number,
        required: true
    },
    // Períodos já descontados ao utilizador
    periods_paid: {
        type: Number,
        default: 0
    },
    status: {
        type: String,
        enum: ['in_progress', 'completed'],
        default: 'in_progress'
    },
    amount_paid: {
        type: Number
    },
}, {
    timestamps: true,
});
// rentalSchema.plugin(uniqueValidator);

/**
 * @typedef Rental
 */
const Rental = mongoose.model('rental', rentalSchema);

module.exports = Rental;