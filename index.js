var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);

app.use(express.static('www'));

var names = {};
var votes = {};
var active = {};

function getSocketNames(sockets) {
    return sockets.map(function (socket) {
        return names[socket.id] || socket.id;
    });
}

io.on('connection', function(socket){
    console.log(socket.id, 'connected');
    socket.broadcast.emit('votersChanged', getSocketNames(io.sockets.sockets));
    socket.on('disconnect', function(){
        console.log('Voter disconnected', socket.id);
        console.log('user disconnected');
    });
    socket.on('rename', function(name){
        names[socket.id] = name;
        console.info(socket.id, 'is called', name);
        socket.broadcast.emit('votersChanged', getSocketNames(io.sockets.sockets));
    });
    socket.on('vote', function(voter, vote){
        console.info('Vote received from ', voter, vote);
        io.emit('voteReceived', voter, vote);
        votes[socket.id] = vote;
    });
    socket.on('isActive', function (value) {
        active[socket.id] = value;
        console.info(socket.id, 'is', value ? 'active' : 'passive');
    });
});

http.listen(3000, function(){
    console.log('listening on *:3000');
});