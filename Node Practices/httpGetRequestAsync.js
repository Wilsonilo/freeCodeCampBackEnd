var async = require("async");
var httpGetRequest = require("./httpGetRequest"); // singular
module.exports = function(urls, callback){


    //Run Async calls
    async.parallel({
        one: function(callbackin) {

            httpGetRequest(urls[0], callbackin);

        },
        two: function(callbackin) {
            httpGetRequest(urls[1], callbackin);

        },
        three: function(callbackin) {
            httpGetRequest(urls[2], callbackin);

        }
    }, function(err, results) {

        if(err){

            return callback(err);

        } else {

            return callback(null, [results.one, results.two, results.three]);
        }
    });

}
