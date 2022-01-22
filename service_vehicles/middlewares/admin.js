const config = require('../config/config');
const axios = require('axios');

const admin = async (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (token == null) return res.sendStatus(403);

    // Check it the user is admin
    try {
        const usersServiceUrl = config.usersService.adminUrl;
        const isAdmin = await axios.post(usersServiceUrl, {}, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })

        if (isAdmin.data.is_admin) {
            next();
        } else {
            return res.sendStatus(403);
        }
    } catch (err) {
        return res.sendStatus(403);
    }
}

module.exports = admin;