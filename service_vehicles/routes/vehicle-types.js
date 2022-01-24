const express = require('express');
const vehicleTypesController = require('../controllers/vehicle-types');
const validate = require('../middlewares/validate');
const vehicleTypesValidator = require('../validators/vehicle-types');
const auth = require('../middlewares/auth');
const admin = require('../middlewares/admin');

const router = express.Router();

router.route('/')
    .get(vehicleTypesController.list)
    .post(auth, admin, validate(vehicleTypesValidator.create), vehicleTypesController.create)

router.get('/:id', auth, vehicleTypesController.details)

module.exports = router;