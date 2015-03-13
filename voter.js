var election = require('./election');

function Voter(io, socket) {
  this._io = io;
  this._socket = socket;
  //leave the default room
  this.leave();
  this.name = this._socket.id;
  var self = this;
  ['isActive', 'vote', 'join', 'leave', 'rename', 'disconnect'].forEach(function (eventName) {
    self._socket.on(eventName, function (/* arguments */) {
      self[eventName].apply(self, arguments);
      console.info(self._socket.id + '(' + self.name + ')', eventName, arguments);
    });
  });
}

Voter.prototype.getRoom = function () {
  return this._socket.rooms[0];
};

Voter.prototype.isActive = function (value) {
  this.active = value;
  this.sendUpdate();
};

Voter.prototype.vote = function (vote) {
  this.vote = vote;
  this.sendUpdate();
};

Voter.prototype.join = function (roomName) {
  this.leave();
  this.room = election.getElection(this._io, this.name);
  this.room.add(this);
};

Voter.prototype.sendUpdate = function () {
  if (this.room) {
    this.room.sendUpdate();
  }
};

Voter.prototype.leave = function () {
  //TODO: update the old Election after leaving
  //TODO: use Election
  for (var i = 0; i < this._socket.rooms.length; i++) {
    this._socket.leave(this._socket.rooms[i]);
  }
  this.sendUpdate();
};

Voter.prototype.rename = function (name) {
  this.name = name;
  this.sendUpdate();
};

Voter.prototype.disconnect = function () {
  //release all event listeners and set the socket to null so that it can be garbage collected
  this.sendUpdate();
};

module.exports = Voter;