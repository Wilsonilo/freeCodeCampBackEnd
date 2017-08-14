var express = require('express');
var app     = express();
var multer  = require('multer')
var upload  = multer({ dest: 'uploads/' });
var PORT    = 3000;

//Home
app.get('/', function(request, response){
    response.sendFile(__dirname + '/public/index.html');
});


//Home
app.post('/get-file-size', upload.single('file'), function(request, response, next){

    //Check if we have file
    var file =  request.file
    response.end("File Size: "+ formatBytes(file.size, 3) + "\n File-Type: "+ file.mimetype);
});


//Listener
var listener = app.listen(PORT, function(){
    console.log("APP Listening at port: ", listener.address().port);
});

//HELPER
//https://stackoverflow.com/questions/15900485/correct-way-to-convert-size-in-bytes-to-kb-mb-gb-in-javascript
function formatBytes(a,b){if(0==a)return"0 Bytes";var c=1024,d=b||2,e=["Bytes","KB","MB","GB","TB","PB","EB","ZB","YB"],f=Math.floor(Math.log(a)/Math.log(c));return parseFloat((a/Math.pow(c,f)).toFixed(d))+" "+e[f]}

