var express = require('express');
var mongodb = require('mongodb');
var url     = require('url');
var app     = express();

// Mongo Client Setup
var MongoClient     = mongodb.MongoClient;
var mongoCollection = 'urls';

// MLab Address, i set the address with username/password on my machine
// Change it for your Address, example:
// mongodb://<dbuser>:<dbpassword>@ds035623.mlab.com:PORT/DBNAME
var mongourl        = process.env.MLABDB;

//Serve README without URL
app.get('/', function(request, response){
    response.sendFile(__dirname + '/README.md');
});

//Serve README with url
app.get('/:url', function(request, response){

    var idurl = request.params.url;

    //Check if we have there is an url passed.
    if(idurl !== undefined){

        var resultjson = {};
        console.log("id url passed: ", idurl);

        //Connect to mongo
        MongoClient.connect(mongourl, function(err, db){

             //Check for error on connection
            if(err){

                console.log("ERROR on connection: ", err);
                response.sendFile(__dirname + '/README.md');

            } else{

                console.log("Connection established");

                //Make query to look for url
                var query = {'idconvert': idurl};

                //Query db for url.
                db.collection(mongoCollection).findOne(query, function(err, result){

                    //Check if error
                        if(err){

                            console.log("ERROR on query: ", err);
                            response.sendFile(__dirname + '/README.md');

                        } else {

                            console.log("Got result: ", result);
                            if(result === null){

                                //No result return readme
                                response.sendFile(__dirname + '/README.md');

                            } else {

                                //Go to result
                                console.log("Record Found: ", result);
                                response.redirect(result['originalurl']);

                            }

                        }

                });


            }


        });

    } else {

        response.sendFile(__dirname + '/README.md');

    }

});

//New URL Shortener Request, global catch
app.get('/new/*', function(request, response){

    //Set result object
    var resultjson      = {};

    //Protect agains undefined
    if(request.params[0] !== undefined){

        //Parse the url and get the href to check in mongo
        //Also set the hostname / domain for future use.
        var urlToSet    = url.parse(request.params[0], true);
        var myHostname  = request.headers.host;
        var urlAddress  = urlToSet.href;

        //Avoid keep moving forward if ENV address for mongo is not set
        if(mongourl !== undefined){

            console.log("Mondo URL set: ", mongourl);

            //Check in mongo if we have this url to avoid duplicates
            //usually you make duplicates to avoid conflicts with urls
            //of others users and speacilly if you works stats
            //but for now lets works like this.
            MongoClient.connect(mongourl, function(err, db){

                //Check for error on connection
                if(err){

                    console.log("ERROR on connection: ", err);
                    return;

                } else{

                    console.log("Connection established");

                    //Make query to look for url
                    var query = {'originalurl': urlAddress};
                    console.log(urlAddress);
                    //Query db for url.
                    var requestUrlResult = db.collection(mongoCollection).findOne(query, function(err, result){

                        //Check if error
                        if(err){

                            console.log("ERROR on query: ", err);
                            callbackForJson();

                        } else {

                            console.log("Query good: ",  result);

                            //Check if we have a result, if we do
                            //return that, if not insert and return
                            if(result === null){

                                console.log("Record not found");

                                //ID for this insert
                                var uuid = guid();
                                var insert = {
                                    'originalurl'   : urlAddress,
                                    'shorturl'      : "http://" + myHostname + "/" + uuid,
                                    'idconvert'     : uuid
                                };

                                //Insert
                                db.collection(mongoCollection).insertOne(insert, function(err, result){

                                    //Check if error
                                    if(err){

                                        console.log("ERROR on query: ", err);
                                        callbackForJson();

                                    } else {

                                        //Set for result return;
                                        resultjson['shorturl']      = insert['shorturl'];
                                        resultjson['originalurl']   = urlAddress;
                                        console.log(resultjson);
                                        callbackForJson();

                                    }


                                });

                            } else {


                                console.log("Record Found: ", result);
                                resultjson['shorturl']      = result['shorturl'];
                                resultjson['originalurl']   = result['originalurl'];
                                callbackForJson();

                            }
                        }

                    });


                }

            });

        }

    }

    //Set Callback to use it later.
    function callbackForJson(){

        //Set JSON header and respond.
        response.writeHead({'Content-Type': 'application/json'});
        response.end( JSON.stringify(resultjson) );

    }

});

//Listener
var appListener = app.listen(3000, function(){
    console.log("Running App on port: " + appListener.address().port);
});


// HELPERS
// Create random UIID //https://stackoverflow.com/questions/105034/create-guid-uuid-in-javascript
function guid(){
    var S4 = function() {
       return (((1+Math.random())*0x10000)|0).toString(16).substring(1);
    };
    return (S4()+S4()+"-"+S4()+"-"+S4()+"-"+S4()+"-"+S4()+S4()+S4());
}
