//===========================//
//HELLO WORLD
//===========================//
var express = require('express');
var app = express();
var PORT = process.argv[2];

app.get('/home', function(req, res) {
    res.end('Hello World!')
})
app.listen(PORT);
