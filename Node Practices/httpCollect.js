//===========================//
//HTTP COLLECT
//Using Concat Stream dependency, need to install that one.
//https://www.npmjs.com/package/concat-stream
//===========================//
var urlToRequest = process.argv[2];
var concat = require('concat-stream');
var httpGetRequest = require("./httpGetRequest");

//Function callback
function callBackStream(counter, completeString){

    console.log(counter);
    console.log(completeString);
}

//Call the httpRequest
httpGetRequest(urlToRequest, concat, callBackStream);
