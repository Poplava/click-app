var app = angular.module('App', []);

var socket = io();

app.controller('MainCtrl', MainCtrl);

function MainCtrl($scope) {
    var items = [];

    socket.on('items', function(msg) {
        var message = JSON.parse(msg);

        message.unshift(0, items.length);
        items.splice.apply(items, message);

        $scope.$apply();
    });

    socket.on('item', function(msg) {
        var message = JSON.parse(msg),
            model = _.findWhere(items, {left: message.left, top: message.top});

        if (model) {
            model.color = message.color;
            model.size = message.size;
        } else {
            items.push(message);
        }

        $scope.$apply();
    });

    socket.on('remove', function(msg) {
        var message = JSON.parse(msg),
            model = _.findWhere(items, {left: message.left, top: message.top});

        if (model) {
            items.splice(_.indexOf(items, model), 1);
        }

        $scope.$apply();
    });

    $scope.color = '#f00';
    $scope.items = items;

    $scope.createItem = function($event) {
        var item = {
            left: $event.offsetX,
            top: $event.offsetY,
            size: 1,
            color: $scope.color
        };

        items.push(item);
        socket.emit('item', JSON.stringify(item));
    };

    $scope.clickItem = function($event, item) {
        if (item.size < 5) {
            item.size++;
            item.color = $scope.color;
            socket.emit('item', JSON.stringify(item));
        } else {
            items.splice(_.indexOf(items, item), 1);
            socket.emit('remove', JSON.stringify(item));
        }

        $event.preventDefault();
        $event.stopPropagation();

        return false;
    };
}

MainCtrl.$inject = ['$scope'];