const jwt = require('jsonwebtoken');
const config = require('../config/config');
const { User } = require('../models')

const admin = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (token == null) return res.sendStatus(401);

    jwt.verify(token, config.jwt.secret, async (err, user) => {
        if (err) return res.sendStatus(403);

        const dbUser = await User.findOne({ email: user.email })

        if (!dbUser || dbUser.role != 'admin') {
            if (err) return res.sendStatus(403);
        }

        next();
    })
}

module.exports = admin;