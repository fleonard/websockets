var port = 8081;
var express = require('express');
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io').listen(server);

console.log("Listening on port " + port);
server.listen(port);

console.log(__dirname);

app.use(express.static(__dirname + '/css'));

app.get('/', function (req, res) {
  res.sendfile(__dirname + '/index.html');
});

var usernames = {};

io.sockets.on('connection', function (socket) {

    socket.on('sendchat', function (data) {
        io.sockets.emit('updatechat', socket.username, data);
    });

    socket.on('adduser', function(username){
        socket.username = username;
        usernames[username] = username;
        socket.emit('updatechat', 'SERVER', 'you have connected');
        socket.broadcast.emit('updatechat', 'SERVER', username + ' joined');
        io.sockets.emit('updateusers', usernames);
    });

    socket.on('disconnect', function(){
        delete usernames[socket.username];
        io.sockets.emit('updateusers', usernames);
        socket.broadcast.emit('updatechat', 'SERVER', socket.username + ' has left');
    });
});
