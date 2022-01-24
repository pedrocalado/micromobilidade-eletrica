const Joi = require('joi');

const create = {
    body: Joi.object().keys({
        name: Joi.string().required(),
        price: Joi.object({
            value: Joi.number().required(),
            period: Joi.string().valid('minute', 'hour', 'day').required()
        }).required()
    })
};

module.exports = {
    create
};