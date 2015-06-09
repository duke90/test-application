#! /usr/bin/env node

var express = require('express'),
    bodyParser = require('body-parser'),
    app = express();

/**
 * CONFIGURATION
 */
var config = {
    port: 30000,
    host: 'localhost'
};

/**
 * APP INIT
 */
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.listen(config.port, config.host, function () {
  var host = this.address().address;
  var port = this.address().port;

  console.log('Test app is listening at http://%s:%s', host, port);
});

/**
 * ROUTES
 */
app.post('/validate', function (req, res) {
    console.log('Incoming post');
    console.log(req.body);
    res.send('Post on pertestperajax');
});