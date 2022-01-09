const Joi = require('joi');

const createUser = {
    body: Joi.object().keys({
        name: Joi.string().required(),
        email: Joi.string().required().email(),
        password: Joi.string().required().length(6),
        birth_date: Joi.date().required()
    })
};

module.exports = {
    createUser
};