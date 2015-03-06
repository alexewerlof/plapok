function Voter (socket) {
    this._socket = socket;
    this.name = this._socket.id;
    ['isActive', 'vote', 'join', 'rename', 'disconnect'].forEach(function (eventName) {
        this.addEventListener(eventName);
    }, this);
    this.tellRoommates('votersChanged');
}

Voter.prototype.addEventListener = function (fnName) {
    var self = this;
    self._socket.on(fnName, function (/* arguments */) {
        self[fnName].apply(self, arguments);
    });
};

Voter.prototype.getRoom = function () {
    if (this._socket.rooms.length) {
        return this._socket.rooms[0];
    }
};

Voter.prototype.tellRoommates = function (/* arguments */) {
    var roomId = this.getRoom();
    if (roomId) {
        this._socket.io.to(roomId).emit.apply(this._socket.io, arguments);
    } else {
        console.warn(this.name, 'cannot tell roommates because socket is not in any room');
    }
};

Voter.prototype.isActive = function (value) {
    this.active = value;
    console.info(this.name, 'is', value ? 'active' : 'passive');
};

Voter.prototype.vote = function (vote) {
    console.info('Vote received from', this.name, vote);
    this.tellRoommates('voteReceived', this.name, vote);
    votes[socket.id] = vote;
};

Voter.prototype.join = function (roomName) {
    this._socket.join(roomName);
    console.info(this.name, 'joined', roomName);
    //TODO: leave any other room
};

Voter.prototype.rename = function (name) {
    console.info(this.name, 'is renamed to', name);
    this.name = name;
};

Voter.prototype.disconnect = function () {
    console.log('Voter disconnected', this.name);
};

module.exports = Voter;