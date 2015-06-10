#! /usr/bin/env node

var express = require('express'),
    bodyParser = require('body-parser'),
    app = express(),
    TA = {};

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

TA.validateData = function(data) {
    console.log(data);
    var response = {
        status: 'OK'
    };
    
    if (!data.username || !data.useremail) {
        response.status = 'REQUIRED_FIELD_MISSING';
    }
    
    if (data.birthdate) {
        var timestamp = Date.parse(data.birthdate);

        if ( isNaN(timestamp) ) {
            response.status = 'INVALID_DATE';
        } else {
            var timeDiff = Date.now() - timestamp;
            var diffDays = Math.round(timeDiff / (1000 * 3600 * 24));
            
            if ( diffDays < (18*365) ) {
                response.status = 'NOT_EIGHTEEN';
            }
        }
    }
    
    return response;
};

/**
 * ROUTES
 */
app.post('/validate', function (req, res) {
    console.log('Incoming post');
    res.send( TA.validateData(req.body) );
});