//===========================//
//GOOD OLD FORM
//===========================//
var express = require('express');
var app = express();
var bodyparser = require('body-parser')
var PORT = process.argv[2];

// middleware
app.use(bodyparser.urlencoded({extended: false}));

// /form post method
app.post('/form', function(req, res) {

    //instead of end can use res.send();

    res.end(req.body.str.split('').reverse().join(''));
    //console.log(req.body);
});
app.listen(PORT);
