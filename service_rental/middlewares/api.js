const config = require('../config/config');

const auth = (req, res, next) => {
    const apiKeyHeader = req.headers['api-key'];

    console.log("API Key" + apiKeyHeader)

    if (apiKeyHeader == null) return res.sendStatus(401);

    if (apiKeyHeader !== config.headerApiKey) return res.sendStatus(403);

    next();
}

module.exports = auth;