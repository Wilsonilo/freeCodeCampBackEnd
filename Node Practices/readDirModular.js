var fsController = require('fs');

module.exports = function(directory, extension, callback) {

    fsController.readdir(directory, function readDirDone(err, data){

        //Check error
        if(err !== null){

            return callback(err);

        } else {

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

            //return callback
            return callback(null, data);
        }

    });

}
