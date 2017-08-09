//===========================//
//JUGGLING ASYNC
//Using Async:
//https://caolan.github.io/async/
//===========================//
var urls = [process.argv[2], process.argv[3], process.argv[4]];
var httpGetRequest = require("./httpGetRequestAsync");

//Function callback
function callBackStream(error, completeStringArray){
    if(error !== null){
        console.log(error);
    } else {

        for(var i = 0; i < completeStringArray.length; i ++){
            console.log(completeStringArray[i]);
        }

    }
}

//Call the httpRequest
httpGetRequest(urls, callBackStream);
