const express = require('express');
const usersController = require('../controllers/usersController');
const validate = require('../middlewares/validate');
const usersValidation = require('../validators/users');
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
    .get(usersController.listUsers)
    // Register endpoint with form-data to handle file upload
    .post(upload.single('picture'), validate(usersValidation.createUser), usersController.createUser)

module.exports = router;