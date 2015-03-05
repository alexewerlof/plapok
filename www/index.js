angular.module('plapok', [])
    .controller('IndexCtrl', function ($scope) {
        $scope.amVoting = false;
        $scope.choices = [1, 2, 3, 4, 7, '?'];
        $scope.voters = [
            {
                name: 'Alex',
                vote: 2
            },
            {
                name: 'Oskar',
                vote: 3
            },
            {
                name: 'Rickard',
                vote: '?'
            },
            {
                name: 'Tobias',
                vote: '...'
            }
        ];
        $scope.startVoting = function () {
            $scope.amVoting = true;
        }
    });