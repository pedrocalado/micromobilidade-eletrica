const express = require('express');
const usersController = require('../controllers/users');
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
    .get(usersController.list)
    // Register endpoint with form-data to handle file upload
    .post(upload.single('picture'), validate(usersValidation.create), usersController.create)

module.exports = router;