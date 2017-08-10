
//===========================//
//SERVE FILE
//===========================//
var express = require('express');
var app = express();
var path = require('path')
var PORT = process.argv[2];
var FILETOSERVE = process.argv[3];

//Freecodecamp
//    app.use(express.static(process.argv[3]||path.join(__dirname, 'public')));

//me
app.use(express.static(FILETOSERVE));
app.listen(PORT);
