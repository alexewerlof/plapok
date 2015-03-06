angular.module('plapok', [])
    .factory('socket', function () {
    })
    .controller('IndexCtrl', function ($scope) {
        var socket = io();
        $scope.myName = '';
        $scope.amVoting = false;
        $scope.choices = [1, 2, 3, 4, 7, '?'];
        $scope.voters = [];
        socket.on('connect', function(){
            $scope.id = socket.id;
            if ($scope.myName) {
                $scope.rename();
            }
            $scope.$apply();
        });
        socket.on('votersChanged', function(voters){
            $scope.voters = voters;
            $scope.$apply();
        });
        $scope.votes = {};
        socket.on('voteReceived', function(voter, vote){
            $scope.votes[voter] = vote;
            $scope.$apply();
        });
        $scope.startVoting = function () {
            $scope.amVoting = true;
            socket.emit('startVoting');
        };
        $scope.submitVote = function (vote) {
            socket.emit('vote', $scope.myName, vote);
        };
        $scope.rename = function () {
            socket.emit('rename', $scope.myName);
        }
    });