//This object holds the mapping between room names and their Room objects
var rooms = {};

//A factory method that either returns an exisitng room or creates a new one
function getElection (io, name) {
  return rooms[name] || new Election(io, name);
}

function Election(io, name) {
  this._name = name;
  this._io = io;
}

Election.prototype.sendToAll = function (/* argument */) {
  var members = this._io.sockets.in(this._name);
  members.emit.apply(members, arguments);
};

Election.prototype.members = function () {
  return this._io.sockets.in(this._name);
};

Election.prototype.tellMembers = function () {
  var members = this.members();
  members.emit.apply(members, arguments);
};

Election.prototype.add = function (voter) {
  voter.join(this._name);
  this.sendUpdate();
};

Election.prototype.sendUpdate = function () {
  this.tellMembers('update', {
    name: this._name,
    status: 'voting', //TODO: shouldn't be hard coded
    members: _.pluck(this.members(), 'name', 'isActive', 'vote')
  })
};

Election.prototype.getStatus = function () {
  this._io
};

module.exports.getElection = getElection;