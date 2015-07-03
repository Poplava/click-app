var app = angular.module('App', []);

app.controller('MainCtrl', MainCtrl);

function MainCtrl($scope, $interval) {
    var finish;

    $scope.init = function(date) {
        finish = moment(date);
        $interval($scope.update, 1000);
        $scope.update();
    };

    $scope.update = function() {
        $scope.timerH = finish.diff(moment(), 'hours');
        $scope.timerM = finish.diff(moment(), 'minutes') % 60;
        $scope.timerS = finish.diff(moment(), 'seconds') % 60;
    };
}

MainCtrl.$inject = ['$scope', '$interval'];
