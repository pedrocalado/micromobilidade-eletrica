const jwt = require('jsonwebtoken');
const config = require('../config/config');

const auth = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (token == null) return res.sendStatus(401);

    jwt.verify(token, config.jwt.secret, (err, user) => {
        if (err) return res.sendStatus(403);

        req.user = user;

        next();
    })
}

module.exports = auth;