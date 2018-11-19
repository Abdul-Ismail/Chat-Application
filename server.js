var express = require('express')
const path = require('path');

var app = express()
const port = process.env.PORT || 5000;

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname+'/client/public/index.html'));
});

app.listen(port)