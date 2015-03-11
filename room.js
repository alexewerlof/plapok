function Room(io, name) {
  this._name = name;
  this._io = io;
}

Room.prototype.sendToAll = function (/* argument */) {
  var members = this._io.sockets.in(this._name);
  members.emit.apply(members, arguments);
};

Room.prototype.members = function () {
  return this._io.sockets.in(this._name);
};

Room.prototype.tellMembers = function () {
  //TODO: write me. Maybe starting with return this._io.sockets.in(this._name);
};

Room.prototype.getStatus = function () {
  this._io
};