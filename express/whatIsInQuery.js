//===========================//
// WHAT'S IN QUERY
//===========================//
var express     = require('express');
var app         = express();
var PORT        = process.argv[2];

app.get('/search', function(req, res){

    var query = req.query;
    delete query.__proto__;
    var jsonResponse = JSON.stringify(req.query);
    res.send(jsonResponse);

    //Looks like that there is no need for JSON.stringify
    //query is already an Object that can be returend
    //Freecodecamp:
    // app.get('/search', function(req, res){
    //   var query = req.query
    //   res.send(query)
    // })

});

app.listen(PORT);
