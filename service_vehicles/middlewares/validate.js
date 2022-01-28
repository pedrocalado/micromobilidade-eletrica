const Joi = require('joi');
const pick = require('../utils/pick');

const validate = (schema) => (req, res, next) => {
    const validSchema = pick(schema, ['params', 'query', 'body']);
    const object = pick(req, Object.keys(validSchema));
    const result = Joi.compile(validSchema)
        .prefs({ errors: { label: 'key' } })
        .validate(object);
    const { error } = result;
    const valid = error == null;

    if (valid) {
        next();
    } else {
        const { details } = error;
        const message = details.map(i => i.message).join(',');

        res.status(422).json({ error: message })
    }
}

module.exports = validate;
