const Joi = require('joi');

const schemas = {
    createUser: Joi.object().keys({
        name: Joi.string().required(),
        email: Joi.string().required().email(),
        password: Joi.string().required().length(6),
        birth_date: Joi.date().required()
    }),
};

module.exports = schemas;