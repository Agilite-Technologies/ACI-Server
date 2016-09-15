var express = require('express');
var app = express();

app.get('/', function (req, res) {
    res.sendfile(__dirname + '/index.html');
});

app.get('/nginx', function (req, res) {
    res.sendfile(__dirname + '/index.html');
});

app.get('/linux/amd64/DOMAIN/aci/nginx-latest.aci', function (req, res) {
    res.sendfile(__dirname + '/nginx.aci');
});

app.listen(3002, function () {
    console.log('Example app listening on port 3002!');
});
