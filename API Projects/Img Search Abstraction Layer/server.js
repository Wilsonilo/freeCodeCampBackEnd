var express         = require('express');
var http            = require('http');
var https           = require('https');
var mongodb         = require('mongodb');
var app             = express();
var PORT            = 3000;
var APIKEY          = process.env.APIKEYSEARCHGOOGLE; // https://developers.google.com/custom-search/json-api/v1/using_rest
var MLABURL         = process.env.MLABDB; // mlab.com
var collectionMongo = 'searches';
var MongoClient     = mongodb.MongoClient;

//General / README display
app.get('/', function(request, response){
    response.sendFile(__dirname + '/README.md');
});

//Search request with GET
app.get('/api/imgsearch/', function(request, response){

    //Set variables for later use
    var searchQuery = request.query.query;
    var offset      = request.query.offset;

    //Check for nill query var passed
    if(searchQuery === undefined){
        response.end('No query string, please check documentation and try again');
    } else {

        //Make new request to Google
        console.log("Search Request: ", searchQuery);

        //Insert Search Query to DB
        MongoClient.connect(MLABURL, function(err, db){

            if(err){
                response.end('Error connecting DB');
            } else {
                var insert = {
                    'term': searchQuery,
                    'when': new Date()
                };
                db.collection(collectionMongo).insertOne(insert, function(err, result){

                    if(err){

                        response.end('Error inserting search into DB:', err);

                    }else {

                        console.log('Search Query Saved to DB: ', searchQuery);

                    }

                });
            }

            db.close();
        });


        //Conform link with parameters.
        var searchType  = 'image';
        var cx          = '005855291891466971673:xf7xlzs4mfs'; //Created on dashboard for searches on Google
        var basicUrl    = 'https://www.googleapis.com/customsearch/v1';
        var num         = 10; // Results per page
        var urlConform  = basicUrl + "?q="+searchQuery +"&searchType="+searchType+"&cx="+cx+"&key="+APIKEY+"&num="+num;
        var result      = {};

        //Append offset if we have one.
        if(offset !== undefined){
            urlConform += '&start='+offset;
        }

        //Request // Alternative: https://www.npmjs.com/package/request
        https.get(urlConform, function(responseGoogle){

            var dataFromGoogle = '';

            //Set Encoding
            responseGoogle.setEncoding('utf8');

            //Fetch Data
            responseGoogle.on('data', function(data){
                dataFromGoogle += data;
            });

            //When we finish, call callback
            responseGoogle.on('end', function(){

                var dataFromGoogleJSON = JSON.parse(JSON.stringify(dataFromGoogle));
                callbackFromGoogle(dataFromGoogleJSON);

            });

            //Error
            responseGoogle.on('error', function(error){
            });


        });

        //Callback Function
        function callbackFromGoogle(JSONData){

            var jsonParse = JSON.parse(JSONData);
            var items = jsonParse.items;

            if(items.length === 0) {
                response.end('Google Call Ended with no result or an error ocurred.')
            } else {
                response.writeHead(200, {'Content-Type': 'application/json'});
                response.end(JSON.stringify(items));
            }
        }

    }

});

//Search request with GET
app.get('/api/latests/', function(request, response){

    //Connect to DB
    MongoClient.connect(MLABURL, function(err, db){

        if(err){
            response.end('Error connecting DB');
        } else {

            db.collection(collectionMongo).find({}, {'_id': 0}).sort({date: -1}).limit(10).toArray(function(err, docs){
                if(err){
                    response.end(err);
                }else {
                    console.log("RESULT :", docs);
                    if(docs.length > 0){
                        response.writeHead(200, {'Content-Type': 'application/json'});
                        response.end(JSON.stringify(docs));
                    } else {
                        response.end('No searches found on the database.');
                    }
                }
            });
        }

        db.close();

    });

});

//Listener
var listener = app.listen(PORT, function(){
    console.log("APP Listening at port: ", listener.address().port);
});
