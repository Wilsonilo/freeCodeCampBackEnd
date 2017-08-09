//===========================//
//HTTP CLIENT
//===========================//
var urlToReques = process.argv[2];

http.get(urlToReques, function(res){

    //Set Encoding
    res.setEncoding('utf8');

    //Got some data
    var result = '';
    res.on("data", function(data){

        console.log(data);

    });

    //End
    res.on('end', function(){


    })

    //Error
    res.on('error', console.error)


});
