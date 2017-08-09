//===========================//
//HTTP JSON API SERVER
//Needs through2-map
//https://www.npmjs.com/package/through2-map
//===========================//

var PORT = process.argv[2];
var http = require("http");
var url  = require("url");

var server = http.createServer(function(req, res){

    //Set headers response
    res.writeHead(200, { 'Content-Type': 'application/json' });

    //Get some info
    var reqUrl = url.parse(req.url, true);
    var query  = reqUrl.query;

    //Parser time
    if(reqUrl.pathname === '/api/parsetime'){

        var date = new Date(query.iso);
        res.end(JSON.stringify({
            'hour': date.getHours(),
            'minute': date.getMinutes(),
            'second': date.getSeconds()
        }));

    }

    //Unitime
    if(reqUrl.pathname === '/api/unixtime'){
        var date = Date.parse(query.iso);
        //console.log("unixtime: ", date);
        res.end(JSON.stringify({'unixtime': date }))
    }


});
server.listen(PORT);
