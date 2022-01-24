const express = require('express');
const vehiclesController = require('../controllers/vehicles');
const validate = require('../middlewares/validate');
const vehiclesValidator = require('../validators/vehicles');
const auth = require('../middlewares/auth');
const admin = require('../middlewares/admin');

const router = express.Router();

router.route('/')
    .get(vehiclesController.list)
    .post(auth, admin, validate(vehiclesValidator.create), vehiclesController.create)

router.get('/:id', auth, vehiclesController.details)

module.exports = router;