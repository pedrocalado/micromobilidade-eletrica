const express = require('express');
const usersController = require('../controllers/users');
const validate = require('../middlewares/validate');
const usersValidation = require('../validators/users');
const auth = require('../middlewares/auth');
const admin = require('../middlewares/admin');
const api = require('../middlewares/api');
const multer = require('multer');
var db = require('mime-db')

var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/')
    },
    filename: function (req, file, cb) {
        const mime = db[file.mimetype]
        const extension = mime?.extensions[0]

        cb(null, Date.now() + '.' + extension)
    }
})

const upload = multer({ storage: storage });

const router = express.Router();

router.route('/')
    .get(auth, admin, usersController.list)
    .post(auth, admin, validate(usersValidation.create), usersController.create);

router.post('/register', upload.single('picture'), validate(usersValidation.register), usersController.register)
router.post('/login', usersController.login);
router.get('/me', auth, usersController.profile)

router.get('/:id', api, usersController.details)

router.post('/:id/add-balance', api, usersController.addBalance)
router.post('/:id/remove-balance', api, usersController.removeBalance)

router.post('/check-auth', api, usersController.checkAuth)
router.post('/check-admin', api, usersController.checkAdmin)

module.exports = router;