var app = angular.module('App', []);

app.controller('MainCtrl', MainCtrl);

function MainCtrl($scope, $interval) {
    var finish = moment('2015-07-03 19:00');

    $scope.update = function() {
        $scope.timerH = finish.diff(moment(), 'hours');
        $scope.timerM = finish.diff(moment(), 'minutes') % 60;
        $scope.timerS = finish.diff(moment(), 'seconds') % 60;
    };

    $interval($scope.update, 10);
}

MainCtrl.$inject = ['$scope', '$interval'];
