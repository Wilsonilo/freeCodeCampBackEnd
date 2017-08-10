//===========================//
//STYLYSH CSS
//===========================//
var express     = require('express');
var app         = express();
var PORT        = process.argv[2];
var PATH        = process.argv[3];
var path = require('path')

// middleware stylyus
app.use(require('stylus').middleware(__dirname + '/public'));
app.use(express.static(process.argv[3]||path.join(__dirname, 'public')));


app.listen(PORT);
