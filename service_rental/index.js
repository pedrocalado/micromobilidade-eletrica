const mongoose = require('mongoose');
const app = require('./app');
const config = require('./config/config');
const server = require('http').createServer(app);

mongoose.connect(config.mongoose.url, config.mongoose.options).then(() => {
    console.log('Connected to MongoDB');

    server.listen(config.port, () => {
        console.log(`Listening to port ${config.port}`);
    });
});