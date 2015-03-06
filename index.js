var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);

app.use(express.static('www'));

var names = {};
var votes = {};

function getSocketNames(sockets) {
    return sockets.map(function (socket) {
        return names[socket.id] || socket.id;
    });
}

io.on('connection', function(socket){
    console.log('a user connected');
    socket.broadcast.emit('votersChanged', getSocketNames(io.sockets.sockets));
    socket.on('disconnect', function(){
        console.log('Voter disconnected', socket.id);
        console.log('user disconnected');
    });
    socket.on('rename', function(name){
        socket.broadcast.emit('votersChanged', getSocketNames(io.sockets.sockets));
        names[socket.id] = name;
        console.info(socket.id, 'is called', name);
    });
    socket.on('vote', function(voter, vote){
        console.info('Vote received from ', voter, vote);
        io.emit('voteReceived', voter, vote);
        votes[socket.id] = vote;
    });
});

http.listen(3000, function(){
    console.log('listening on *:3000');
});