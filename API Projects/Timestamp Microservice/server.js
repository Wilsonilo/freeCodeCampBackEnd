//Require express for the server and moment to be easy to format the date / time.
var express = require('express');
var moment  = require('moment');
var app     = express();

// http://expressjs.com/en/starter/static-files.html
//app.use(express.static('public'));

//January 1 , 2016
//1450137600

//Respond to get requests
app.get('*', function(request, response){

    //Prepare result
    var result = {};
    var urlquery = request.params[0].split('/');

    //Get request info
    if(urlquery[1] !== undefined){

        var date = urlquery[1];

        //Check if we are dealing with unix or normal date
        if(!isNaN(date)){
            result['unixtime']  = Number(date);
            result['normal']    = new Date(Number(date)*1000);
            result['momentFormat'] = moment(new Date(Number(date)*1000)).format('MMMM Do YYYY, h:mm:ss a');
            console.log('UNIX TIMESTAMP');
        } else {

            result['unixtime']  = parseInt((new Date(date).getTime() / 1000).toFixed(0));
            result['normal']    = date
            result['momentFormat'] = moment(new Date(date)).format('MMMM Do YYYY, h:mm:ss a');
            console.log('NORMAL TIMESTAMP');
        }

    }

    //Set headers response
    response.writeHead(200, { 'Content-Type': 'application/json' });

    //Respond
    response.end( JSON.stringify(result) );

});


//Listener
var listener = app.listen(3000, function(){
    console.log("Simple Timestamp API listening at port: " + listener.address().port);
})
