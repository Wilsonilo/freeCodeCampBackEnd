//===========================//
//FILTERED LS
//===========================//

//Imports
var fs = require('fs');

//Declar stuff
var dir = process.argv[2];
var ext = process.argv[3];

//Read dir
function readDirOfUser(directory, extension){
    fs.readdir(dir, function readDirDone(err, data){

        if(err === null){

            data = data.reduce(function(acumulator, value){

                var explode = value.split(".");
                //console.log(explode[0], explode[1]);
                if(explode[1] === extension){
                    //console.log(value);
                    return acumulator.concat(value);
                } else{

                    return acumulator;
                }

            }, []);

            //I could filter on the loop, but i wanted to use reduce
            for(var i = 0; i < data.length; i++){

                console.log(data[i]);
            }

        } else {

            console.log(err);
        }

    });

}

//Avoid empty
if(dir !== undefined && ext !== undefined){

    //Run function
    readDirOfUser(dir, ext);
}
