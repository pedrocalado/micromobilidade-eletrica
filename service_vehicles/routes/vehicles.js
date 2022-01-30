const express = require('express');
const vehiclesController = require('../controllers/vehicles');
const validate = require('../middlewares/validate');
const vehiclesValidator = require('../validators/vehicles');
const api = require('../middlewares/api');
const auth = require('../middlewares/auth');
const admin = require('../middlewares/admin');

const router = express.Router();

router.route('/')
    .get(vehiclesController.list)
    .post(auth, admin, validate(vehiclesValidator.create), vehiclesController.create)

router.get('/near', vehiclesController.listNearby)
router.get('/:id', auth, vehiclesController.details)
router.put('/:id', auth, admin, validate(vehiclesValidator.update), vehiclesController.update)
router.put('/:id/status', api, vehiclesController.updateAvailableStatus)
router.put('/:id/location', api, vehiclesController.updateLocation)
router.put('/:id/autonomy', api, vehiclesController.updateAutonomy)

module.exports = router;