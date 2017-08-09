// ==========================//
// READFILE SYNC with callback
// ==========================//

//Imports
var fs = require('fs');

//GLOBALS
var file = process.argv[2];
var counterLines = undefined;

//HELPERS
function readFileSexy(callback){

    fs.readFile(file, function (err, data){

        if(err === null){

            var buf = data.toString().split('\n');
            //can return here
            //console.log(buf.length-1);

            //but im using and outside function to practice
            counterLines = buf.length-1;
            returnCallback();

        } else {

            console.log(err);
        }

    });
}


//Declare outside to be the callback after the callback
function returnCallback(){

    //show result
    console.log(counterLines);
}

//Run function
readFileSexy(returnCallback);

