const mongoose = require('mongoose');
const validator = require('validator');
const { roles } = require('../config/roles');

const userSchema = mongoose.Schema({
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
    password: {
        type: String,
        required: true,
        trim: true,
        minlength: 6
    },
    birthDate: {
        type: Date,
        required: true
    },
    gender: {
        type: String
    },
    balance: {
        type: Number,
        default: 0
    },
    role: {
        type: String,
        enum: roles
    }
}, {
    timestamps: true,
});

/**
 * @typedef User
 */
const User = mongoose.model('User', userSchema);

module.exports = User;