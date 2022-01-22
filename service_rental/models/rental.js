const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');
const validator = require('validator');

const rentalSchema = mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true,
        validate(value) {
            if (!validator.isEmail(value)) {
                throw new Error('Invalid email');
            }
        }
    },
    startRentalDate: {
        type: Date, 
        required: true
    },
    finishRentalDate: {
        type: Date, 
        required: true
    },
    renew: {
        type: Number, 
        default:0
    },
    payableAmount: {
        type: Number
    },
    amountPaid: {
        type: Number
    },
    paid: {
        type: Boolean
    }
}, {
    timestamps: true,
});
rentalSchema.plugin(uniqueValidator);

/**
 * @typedef Rental
 */
const Rental = mongoose.model('rental', rentalSchema);

module.exports = Rental;