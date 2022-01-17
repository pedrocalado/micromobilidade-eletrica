const express = require('express');
const vehiclesController = require('../controllers/vehicles');
const validate = require('../middlewares/validate');
const vehiclesValidator = require('../validators/vehicles');

const router = express.Router();

router.route('/')
    .get(vehiclesController.list)
    .post(validate(vehiclesValidator.create), vehiclesController.create)

module.exports = router;