const { body, validationResult } = require('express-validator');
const Joi = require('joi');

const userValidatorRules = () => {
    return [
        body('name').notEmpty(),
        body('email').notEmpty(),
        body('password').notEmpty().isLength({ min: 6 }),
        body('birth_date').notEmpty().isDate(),
    ];
}

const validate = (req, res, next) => {
    const errors = validationResult(req)
    if (errors.isEmpty()) {
        return next()
    }
    const extractedErrors = []
    errors.array().map(err => extractedErrors.push({ [err.param]: err.msg }))

    return res.status(422).json({
        errors: extractedErrors,
    })
}

const schemas = {
    createUser: Joi.object().keys({
        name: Joi.string().required(),
        email: Joi.string().required().email(),
        password: Joi.string().required().length(6),
        birth_date: Joi.date().required()
    }),
};

module.exports = schemas;

// module.exports = {
//     userValidatorRules,
//     validate,
// }