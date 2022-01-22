const express = require('express');
const vehiclesController = require('../controllers/vehicles');
const validate = require('../middlewares/validate');
const vehiclesValidator = require('../validators/vehicles');
const auth = require('../middlewares/auth');

const router = express.Router();

router.route('/')
    .get(vehiclesController.list)
    .post(auth, validate(vehiclesValidator.create), vehiclesController.create)

module.exports = router;