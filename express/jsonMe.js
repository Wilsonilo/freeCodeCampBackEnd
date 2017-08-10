//===========================//
// JSON ME
//===========================//
var express     = require('express');
var app         = express();
var PORT        = process.argv[2];
var FILE        = process.argv[3];
var fs          = require('fs');
app.get('/books', function(req, res){

    //Read File
    fs.readFile(FILE, function(err, data){

        if(err === null){
             var obj = JSON.parse(data);
             res.end(JSON.stringify(obj));

        } else {
            res.end('ERROR');
        }

    });

});

//This one was weird, this is freecodecamp
/*
app.get('/books', function(req, res){
      var filename = process.argv[3]
      fs.readFile(filename, function(e, data) {
        if (e) return res.send(500)
        try {
          books = JSON.parse(data)
        } catch (e) {
          res.send(500)
        }
        res.json(books)
      })
})
*/

app.listen(PORT);
