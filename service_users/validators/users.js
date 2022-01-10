const Joi = require('joi').extend(require('@joi/date'));

const createUser = {
    body: Joi.object().keys({
        name: Joi.string().required(),
        email: Joi.string().required().email(),
        password: Joi.string().required().length(6),
        birth_date: Joi.date().format('DD/MM/YYYY').utc().required(),
        gender: Joi.string().valid('male', 'female').required()
    })
};

module.exports = {
    createUser
};