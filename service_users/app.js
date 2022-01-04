const express = require('express');
const cors = require('cors')
require('dotenv').config();

const routes = require('./routes');

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors());

app.use('/', routes)

module.exports = app;