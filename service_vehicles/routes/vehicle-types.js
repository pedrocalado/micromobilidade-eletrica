const express = require('express');
const vehicleTypesController = require('../controllers/vehicle-types');
const validate = require('../middlewares/validate');
const vehicleTypesValidator = require('../validators/vehicle-types');

const router = express.Router();

router.route('/')
    .get(vehicleTypesController.list)
    .post(validate(vehicleTypesValidator.create), vehicleTypesController.create)

module.exports = router;