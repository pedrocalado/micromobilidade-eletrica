const express = require('express');
const httpProxy = require('express-http-proxy');
const { setupLogging } = require("./logging");

const app = express();
const port = 3002;

setupLogging(app);

app.get('/hello', (req, resp) => {
    return resp.send('HELLO WORLD!');
})

function selectProxyHost(req) {
    switch (true) {
        case req.path.startsWith('/users'):
            return 'http://localhost:5000/';
        case req.path.startsWith('/vehicles'):
            return 'http://localhost:3001/';
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