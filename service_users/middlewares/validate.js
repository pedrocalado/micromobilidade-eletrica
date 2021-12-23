const Joi = require('joi');
// const ApiError = require('../utils/ApiError');

const validate = (schema, property) => {
    return (req, res, next) => {
        const joiSchema = Joi.object(schema);
        const { error } = joiSchema.validate(req.body);
        const valid = error == null;

        if (valid) {
            console.log('Valid')
            next();
        } else {
            const { details } = error;
            const message = details.map(i => i.message).join(',');

            console.log("error", message);
            res.status(422).json({ error: message })
        }
    }
};

module.exports = validate;
