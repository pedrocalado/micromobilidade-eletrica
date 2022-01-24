const express = require('express');
const rentalController = require('../controllers/rental');
const validate = require('../middlewares/validate');
const rentalValidator = require('../validators/rental');
const auth = require('../middlewares/auth');
const admin = require('../middlewares/admin');

const router = express.Router();

router.get('/', auth, admin, rentalController.list)
router.post('/start', auth, validate(rentalValidator.start), rentalController.start)

module.exports = router;