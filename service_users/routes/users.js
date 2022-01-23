const express = require('express');
const usersController = require('../controllers/users');
const validate = require('../middlewares/validate');
const usersValidation = require('../validators/users');
const auth = require('../middlewares/auth');
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
    .get(auth, usersController.list)
    // Register endpoint with form-data to handle file upload
    .post(validate(usersValidation.create), usersController.create);

router.post('/register', upload.single('picture'), validate(usersValidation.register), usersController.register)
router.post('/login', usersController.login);
router.get('/me', auth, usersController.profile)

router.post('/check-auth', usersController.checkAuth)
router.post('/check-admin', usersController.checkAdmin)

module.exports = router;