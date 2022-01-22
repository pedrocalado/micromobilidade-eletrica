const Joi = require('joi');
Joi.objectId = require('joi-objectid')(Joi);

const create = {
    body: Joi.object().keys({
        registration: Joi.string().required(),
        year: Joi.number().required(),
        month: Joi.number().integer().min(1).max(12).required(),
        vehicle_type_id: Joi.objectId()
    })
};

module.exports = {
    create
};