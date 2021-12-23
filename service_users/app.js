const express = require('express');
const cors = require('cors')
require('dotenv').config();

const routes = require('./routes');

const PORT = process.env.PORT || 5000;

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors());

app.use('/', routes)

app.listen(PORT, () => {
    console.log(`servidor a executar em http://localhost:${PORT}`);
});