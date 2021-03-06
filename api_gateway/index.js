const express = require('express');
const httpProxy = require('express-http-proxy');
const { setupLogging } = require("./logging");

const app = express();
const port = process.env.PORT;
const usersHost = process.env.SERVICE_USERS_HOST;
const usersPort = process.env.SERVICE_USERS_PORT;
const vehiclesHost = process.env.SERVICE_VEHICLES_HOST;
const vehiclesPort = process.env.SERVICE_VEHICLES_PORT;
const rentalHost = process.env.SERVICE_RENTAL_HOST;
const rentalPort = process.env.SERVICE_RENTAL_PORT;

setupLogging(app);

function selectProxyHost(req) {
    switch (true) {
        case req.path.startsWith('/users'):
            return `http://${usersHost}:${usersPort}/`;
        case req.path.startsWith('/vehicles'):
            return `http://${vehiclesHost}:${vehiclesPort}/`;
        case req.path.startsWith('/rental'):
            return `http://${rentalHost}:${rentalPort}/`;
        default:
            return null;
    }
}

app.use((req, res, next) => {
    const host = selectProxyHost(req);

    if (host) {
        httpProxy(host)(req, res, next);
    } else {
        next();
    }
});

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);
})