const express = require('express');
const cors = require('cors')
require('dotenv').config();

const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./api-docs/docs.json');

const routes = require('./routes');

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors());

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.use('/', routes)

module.exports = app;