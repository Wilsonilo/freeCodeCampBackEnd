//===========================//
//MAKE IT MODULAR
//===========================//
// //Declar stuff
var dir = process.argv[2];
var ext = process.argv[3];
var readDirModular = require('./readDirModular');

//Create function callback
//@array: gets an array and prints it
function callbackFromModule(error, data){

    //All good
    if(error === null){

        for(var i = 0; i < data.length; i ++){

            console.log(data[i]);
        }

    } else {

        //Error
        console.log(error);
    }

}

//Call it and pass parameters and callback function
readDirModular(dir, ext, callbackFromModule);
