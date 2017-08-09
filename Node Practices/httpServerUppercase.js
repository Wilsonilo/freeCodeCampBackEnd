//===========================//
//HTTP UPPERCASERER
//Needs through2-map
//https://www.npmjs.com/package/through2-map
//===========================//
//Set some stuff
var PORT = process.argv[2];
var http = require("http");
var map = require('through2-map')

var server = http.createServer(function(req, res){

    req.pipe(map(function (chunk) {
       return chunk.toString().toUpperCase();
     })).pipe(res)
    //res.end();
});

server.listen(PORT);
