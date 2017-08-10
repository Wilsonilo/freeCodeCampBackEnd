//===========================//
//PARAM PAM PAM
//===========================//
var express     = require('express');
var app         = express();
var PORT        = process.argv[2];
var crypto      = require('crypto');

app.put('/message/:id', function(req, res){

    var id = req.params.id;
    var cryptoResponse = crypto.createHash('sha1')
    .update(new Date().toDateString() + id)
    .digest('hex');
    res.send(cryptoResponse);

});

app.listen(PORT);
