//===========================//
//JADE TEMPLATE
//===========================//
var express = require('express');
var app = express();
var PORT = process.argv[2];
var TEMPLATE = process.argv[3];

//Set path to views
app.set('view engine', 'jade');

app.get('/home', function(req, res) {
    res.render(TEMPLATE, {date: new Date().toDateString()})
});
app.listen(PORT);
