const config = require('../config/config');
const axios = require('axios');

const auth = async (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (token == null) return res.sendStatus(403);

    // Check it the token is valid in the users service
    try {
        const usersServiceUrl = config.usersService.authUrl;
        console.log(usersServiceUrl)
        const isAuth = await axios.post(usersServiceUrl, {
            token
        })

        console.log(isAuth)

        if (isAuth.data.is_authenticated) {
            next();
        } else {
            return res.sendStatus(403);
        }
    } catch (err) {
        return res.sendStatus(403);
    }
}

module.exports = auth;