const express = require('express');
const usersController = require('../controllers/usersController')
// const { userValidatorRules, validate } = require('../validators/users')
const validate = require('../middlewares/validate');
const usersValidation = require('../validators/users')

const router = express.Router();

router.route('/')
    .get(usersController.listUsers)
    // .post(userValidatorRules(), validate, usersController.createUser)
    .post(validate(usersValidation.createUser), usersController.createUser)

module.exports = router;