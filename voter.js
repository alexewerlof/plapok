var Room = require('./room');

function Voter(io, socket) {
  this._io = io;
  this._socket = socket;
  //leave the default room
  this.leave();
  this.name = this._socket.id;
  ['isActive', 'vote', 'join', 'leave', 'rename', 'disconnect'].forEach(function (eventName) {
    this.addEventListener(eventName, this[eventName]);
  }, this);
  this.tellRoommates('votersChanged');
}

Voter.prototype.addEventListener = function (name, handler) {
  var self = this;
  self._socket.on(name, function (/* arguments */) {
    handler.apply(self, arguments);
    console.info(self._socket.id, self.name, name, arguments);
  });
};

Voter.prototype.getRoom = function () {
  return this._socket.rooms[0];
};

Voter.prototype.tellRoommates = function (/* arguments */) {
  var roomName = this.getRoom();
  if (roomName) {
    var roommates = this._io.sockets.in(roomName);
    roommates.emit.apply(roommates, arguments);
  } else {
    console.warn(this.name, 'cannot tell roommates because socket is not in any room');
  }
};

Voter.prototype.isActive = function (value) {
  this.active = value;
};

Voter.prototype.vote = function (vote) {
  this.vote = vote;
  this.tellRoommates('voteReceived', this.name, this.vote);
};

Voter.prototype.join = function (roomName) {
  this.leave();
  this._socket.join(roomName);
};

Voter.prototype.leave = function () {
  for (var i = 0; i < this._socket.rooms.length; i++) {
    this._socket.leave(this._socket.rooms[i]);
  }
};

Voter.prototype.rename = function (name) {
  this.name = name;
};

Voter.prototype.disconnect = function () {
  //release all event listeners and set the socket to null so that it can be garbage collected
};

module.exports = Voter;