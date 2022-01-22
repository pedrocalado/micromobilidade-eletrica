const express = require('express');

const vehicleTypes = require('./vehicle-types');
const vehicles = require('./vehicles');

const router = express.Router();

const defaultRoutes = [
    {
        path: '/vehicle-types',
        route: vehicleTypes,
    },
    {
        path: '/vehicles',
        route: vehicles,
    }
]

defaultRoutes.forEach((route) => {
    router.use(route.path, route.route);
});

module.exports = router;