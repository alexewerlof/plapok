angular.module('plapok', [])
    .factory('socket', function () {
    })
    .controller('IndexCtrl', function ($scope) {
        var socket = io();
        $scope.myName = localStorage['myName'] || '';
        $scope.myRoom = localStorage['myRoom'] || '';
        $scope.isActive = false;
        $scope.amVoting = false;
        $scope.choices = [1, 2, 3, 5, 8, 13, 21, '?'];
        $scope.voters = [];
        $scope.status = 'connecting...';
        socket.on('connect', function(){
            $scope.status = 'connected';
            $scope.id = socket.id;
            if ($scope.myName) {
                $scope.rename();
            }
            if ($scope.myRoom) {
                $scope.join();
            }
            if ($scope.isActive) {
                socket.emit('isActive', true);
            }
            $scope.$apply();
        });
        socket.on('disconnect', function () {
            $scope.status = 'disconnected';
            $scope.$apply();
        });
        socket.on('reconnecting', function () {
            $scope.status = 'reconnecting...';
            $scope.$apply();
        });
        $scope.$watch('isActive', function (value) {
            socket.emit('isActive', value);
        });
        $scope.$watch('myRoom', function (value) {
            localStorage['myRoom'] = value;
        });
        $scope.$watch('myName', function (value) {
            localStorage['myName'] = value;
        });
        $scope.isConnected = function () {
            return socket.connected;
        };
        socket.on('votersChanged', function(voters){
            $scope.voters = voters;
            $scope.$apply();
        });
        $scope.votes = {};
        socket.on('voteReceived', function(voter, vote){
            $scope.voters[voter] = vote;
            $scope.$apply();
        });
        $scope.startVoting = function () {
            $scope.amVoting = true;
            socket.emit('startVoting');
        };
        $scope.submitVote = function (vote) {
            socket.emit('vote', vote);
        };
        $scope.rename = function () {
            socket.emit('rename', $scope.myName);
        };
        $scope.join = function () {
            socket.emit('join', $scope.myRoom);
        };
        $scope.leave = function () {
            socket.emit('leave', $scope.myRoom);
        };
    });