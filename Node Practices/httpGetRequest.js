var http = require("http");

module.exports = function(url, concatStreamDepency, callback){

    http.get(url, function(res){

        //Set Encoding
        res.setEncoding('utf8');

        //Got some data
        var result = '';
        var counter = 0;
        res.on("data", function(data){

            result += data;

        });

        //End
        res.on('end', function(){

            //Method by freecodecamp
            // data = data.toString()
            // console.log(data.length)
            // console.log(data)


            //My method, more dirty
            var chars = result.split('');
            counter = chars.length;
            callback(counter, result);

        })

        //Error
        res.on('error', console.error)

    });

}
