var express = require('express');
var app = express();
var landsaleCalls = require('./elasticScripts/number_calls_around_landsale.js');
var callsByCategory = require('./elasticScripts/calls_by_category.js');
var monthMaxCalls = require("./elasticScripts/get_months_max_calls.js");
var cityMaxCalls = require("./elasticScripts/get_city_max_calls.js");

app.use('/', express.static('./html'));
app.use('/css', express.static('./css'));
app.use('/js', express.static('./js'));

var server = app.listen(8000, function () {
   var host = server.address().address
   var port = server.address().port
   
})

app.get('/landsaleCalls', function(req, res) {
    landsaleCalls.getNumberCallsAroundLandsale().then(function(response){
        res.send(response);
    });
});

app.get('/callsByCategory', function(req, res) {
    callsByCategory.getCallsByCategory().then(function(response){
        res.send(response);
    });
});

app.get('/monthsMaxCalls', function(req, res) {
    monthMaxCalls.getMonthsMaxCalls().then(function(response){
        res.send(response);
    });
});

app.get('/cityMaxCalls', function(req, res) {
    cityMaxCalls.getCityMaxCalls().then(function(response){
        res.send(response);
    });
});
