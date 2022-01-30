const express = require('express');
const rentalController = require('../controllers/rental');
const validate = require('../middlewares/validate');
const rentalValidator = require('../validators/rental');
const api = require('../middlewares/api');
const auth = require('../middlewares/auth');
const admin = require('../middlewares/admin');

const router = express.Router();

router.get('/', auth, admin, rentalController.list)
router.post('/start', auth, validate(rentalValidator.start), rentalController.start)
router.get('/:id/check', api, rentalController.check)
router.get('/active-rental', auth, rentalController.userActiveRental)

module.exports = router;