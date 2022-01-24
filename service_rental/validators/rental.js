const Joi = require('joi');
Joi.objectId = require('joi-objectid')(Joi);

const schemas = {
    start: Joi.object().keys({
        vehicle_id: Joi.objectId().required(),
    }),
};

module.exports = schemas;