var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var Voter = require('./voter');

app.use(express.static('www'));

function getSocketNames(sockets) {
    return sockets.map(function (socket) {
        return names[socket.id] || socket.id;
    });
}

io.on('connection', function(socket){
    console.log(socket.id, 'connected');
    var voter = new Voter(socket);
});

http.listen(3000, function(){
    console.log('listening on *:3000');
});