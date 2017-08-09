//===========================//
//HTTP FILE SERVER
//Doc from nodejs fas little confusing, found better understanding with:
//https://docs.nodejitsu.com/articles/advanced/streams/how-to-use-fs-create-read-stream/
//===========================//
//Set some stuff
var PORT = process.argv[2];
var FILE = process.argv[3];
var http = require("http");
var fs   = require("fs");

//Create server
var server = http.createServer(function(req, res){

    var readStream = fs.createReadStream(FILE);

    // This will wait until we know the readable stream is actually valid before piping
    readStream.on('open', function () {
        // This just pipes the read stream to the response object (which goes to the client)
        readStream.pipe(res);
    });

    // This catches any errors that happen while creating the readable stream (usually invalid names)
    readStream.on('error', function(err) {
        res.end(err);
    });

});

server.listen(PORT);
