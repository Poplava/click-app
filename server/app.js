var express = require('express');
var _ = require('underscore');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);

var items = [];

app.set('views', './client');
app.set('view engine', 'jade');

app.get('/', function (req, res) {
    res.render('index.jade');
});

app.use(express.static('client'));

io.on('connection', function(socket) {
    io.emit('items', JSON.stringify(items));
    console.log('a user connected');
    socket.on('item', function(msg) {
        var message = JSON.parse(msg),
            model = _.findWhere(items, {left: message.left, top: message.top});

        if (model) {
            model.size = message.size;
            model.color = message.color;
        } else {
            model = {
                left: message.left,
                top: message.top,
                size: message.size,
                color: message.color
            };

            items.push(model);
        }
        console.log('message: ' + msg);
        console.log(items);

        io.emit('item', JSON.stringify(model));
    });

    socket.on('remove', function(msg) {
        var message = JSON.parse(msg),
            model = _.findWhere(items, {left: message.left, top: message.top});

        items.splice(items.indexOf(model, 1));

        io.emit('remove', JSON.stringify(model));

        console.log('delete: ' + msg);
        console.log(items);
    });
});

http.listen(3000, function(){
    console.log('listening on *:3000');
});