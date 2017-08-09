//===========================//
//TIME SERVER
//===========================//
//Set some stuff
var PORT = process.argv[2];
var net = require('net');

//Create server
var server = net.createServer(function (socket) {
    //console.log(socket);

    //New date
    var date = new Date();
    var returnDate = date.getFullYear()+"-"+date.getMonth()+"-"+date.getDate()+" "+date.getHours()+":"+checkTime(date.getMinutes())+":"+checkTime(date.getMilliseconds());
    //console.log(returnDate);
    //Swend to socket
    socket.write(returnDate);

    //Close
    socket.end();
})

//Listen to port
server.listen(PORT);

//Helper
function checkTime(i) {
    if (i < 10) {i = "0" + i};  // add zero in front of numbers < 10
    return i;
}
