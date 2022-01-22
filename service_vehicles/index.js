const mongoose = require('mongoose');
const app = require('./app');
const config = require('./config/config');
const server = require('http').createServer(app);

mongoose.connect(config.mongoose.url, config.mongoose.options).then(() => {
    // logger.info('Connected to MongoDB');
    console.log('Connected to MongoDB');

    server.listen(config.port, () => {
        // logger.info(`Listening to port ${config.port}`);
        console.log(`Listening to port ${config.port}`);
    });
});