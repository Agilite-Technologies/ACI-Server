const domain = process.argv[2];

// General libraries
var fs = require('fs');
var exec = require('child_process').exec;

// Express
var express = require('express');
var multer = require('multer');
var upload = multer({dest: 'uploads/'});

// Authentication library
var auth = require('./lib/auth');

// Basic Express setup
var app = express();

app.set('view engine', 'pug');

// Get Metadata page
app.get('/nginx', function (req, res) {
    res.render('index', {domain: domain});
});

// Access denied page
function accessDenied(res) {
    res.statusCode = 401;
    res.setHeader('WWW-Authenticate', 'Basic realm=blub');
    res.send('nope.');
}

// Upload (experimental)
app.post('/upload', upload.single('aci'), function (req, res) {
    res.end();
    file = req.file.path;
    dest = 'tar/' + Date.now();

    cmd = 'mkdir ' + dest + ' && tar -xf ' + file + ' -C ' + dest;

    exec(cmd, function (error, stdout, stdderr) {
        if (error === null) {
            fs.readFile(dest + '/manifest', 'utf8', function (err, res) {
                if (!err) {
                    manifest = JSON.parse(res);
                    //console.log(manifest);

                    console.log('New ACI:');
                    console.log(' * Name:     ' + manifest.name);
                    console.log(' * Version:  ' + (manifest.labels.version || "none"));

                    // Delete extracted tar
                    exec('rm -r ' + dest);
                }
            });
        }
    });

});

// Get nginx aci container
app.get('/linux/amd64/' + domain + '/aci/nginx-latest.aci', function (req, res) {

    if (auth.authorized(req)) {
        res.sendFile(__dirname + '/nginx.aci');
    } else {
        accessDenied(res);
    }
});

// Start the server
app.listen(3002, function () {
    console.log('ACI-Server listening on port 3002!');
});
