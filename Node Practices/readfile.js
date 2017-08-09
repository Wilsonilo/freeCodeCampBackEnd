//Imports
var fs = require('fs');

//==========================//
//READ FILE ASYNC
//==========================//

//set parameter for file
var file = process.argv[2];


//Read File
if (file !== undefined){

    var buf = fs.readFileSync(file).toString().split('\n');
    console.log(buf.length-1);

}
