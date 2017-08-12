var express = require('express');
var app     = express();
var get_ip = require('ipware')().get_ip;

//Create global get request
app.get('*', function(request, response){

    //Declare some information from the request.
    var result = {};

    //Avoids undefined
    if(request.headers !== undefined){

        var ip = get_ip(request); //https://github.com/un33k/node-ipware
        //console.log(ip);

        result['ip'] = ip;
        result['user-agent'] = request.headers['user-agent'];
        result['language'] = request.headers['accept-language'].split(',')[0];
    }

    //Set headers response and respond.
    response.writeHead(200, { 'Content-Type': 'application/json' });
    response.end( JSON.stringify(result) );

});

//Listen
var appListener = app.listen(3000, function(){
    console.log("App running and listening at Port: ", appListener.address().port);
});
