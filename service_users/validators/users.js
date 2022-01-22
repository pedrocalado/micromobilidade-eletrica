const Joi = require('joi').extend(require('@joi/date'));
const { roles } = require('../config/roles');

const register = {
    body: Joi.object().keys({
        name: Joi.string().required(),
        email: Joi.string().required().email(),
        password: Joi.string().required().length(6),
        birth_date: Joi.date().format('DD/MM/YYYY').utc().required(),
        gender: Joi.string().valid('male', 'female').required()
    })
};

const create = {
    body: Joi.object().keys({
        name: Joi.string().required(),
        email: Joi.string().required().email(),
        password: Joi.string().required().length(6),
        birth_date: Joi.date().format('DD/MM/YYYY').utc().required(),
        gender: Joi.string().valid('male', 'female').required(),
        role: Joi.string().valid(...roles)
    })
};

module.exports = {
    create,
    register
};