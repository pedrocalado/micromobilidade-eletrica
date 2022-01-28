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
    start_rental_date: {
        type: Date,
        required: true
    },
    finish_rental_date: {
        type: Date,
        // required: true
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
    // renew: {
    //     type: Number,
    //     default: 0
    // },
    // payable_amount: {
    //     type: Number
    // },
    amount_paid: {
        type: Number
    },
    paid: {
        type: Boolean
    }
}, {
    timestamps: true,
});
// rentalSchema.plugin(uniqueValidator);

/**
 * @typedef Rental
 */
const Rental = mongoose.model('rental', rentalSchema);

module.exports = Rental;