const Joi = require('joi');
const pick = require('../utils/pick');

const validate = (schema) => (req, res, next) => {
    const result = schema.validate(req.body);
    const { error } = result;
    const valid = error == null;

    if (valid) {
        next();
    } else {
        const { details } = error;
        const message = details.map(i => i.message).join(',');

        console.log("error", message);
        res.status(422).json({ error: message })
    }
}

module.exports = validate;
