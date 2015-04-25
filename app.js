var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var routes = require('./routes/index');
var users = require('./routes/users');

var app = express();

// creating the server on port 3000.
var server = require('http').createServer(app);
var port = 3000;
server.listen(port);
console.log("Server Socket started and listening on port : " + port);

// initializing sockets
var sio = require('socket.io').listen(server);

// Maintains the map of data.user nickname and the corresponding socket id.
var clients = {};
// Maintains the map of socket ids and the corresponding nicknames. This is the inverse of the previous map.
var socketsOfClients = {};

// callback on socket connection from the client.
sio.sockets.on('connection', function(socket) {
    console.log('Web client connected');
    // Callback for register call from the client.
    socket.on('register', function(data) {
        console.log("Request Received");
        // Check if the client name does not exists.
        if(clients[data.user] === undefined) {
            // Assign the new nickname and set the corresponding socket id.
            clients[data.user] = socket.id;
            socketsOfClients[socket.id] = data.user;
            console.log("Sending response");
            // Send the response to the client for a successful registration
            socket.emit('response', {status:true, text: "Welcome, " + data.user});
        } else if(clients[data.user] === socket.id) {
            // If the client nickname is the same as saved with the right socket id then its just a reconnection.
            // Hence a success message is sent back.
            socket.emit('response', {status:true, text: "Welcome, " + data.user});
        } else {
            // If the nickname exists with different socket Id,
            // then return failure as the status since 2 users should have different nicknames.
            socket.emit('response', {status:false});
        }
    });

    // Callback function when receiving chat message from the client.
    socket.on('chat', function(data) {
        // Retrieves the nick name of the client who sent the message.
        var client = socketsOfClients[socket.id];
        // Appends the clients nickname to the message
        var message = "<b>"+ client + "</b>: " + data.message
        // Broadcasts the chat message to all the other clients connected to the server.
        sio.sockets.emit('message', {message: message});
    });

    // Callback function called when the client disconnects.
    socket.on('disconnect', function() {
        // getting the client name from the socketid.
        var name = socketsOfClients[socket.id];
        // Deleting the client from both the clients list as well removing the socket ids.
        delete clients[name];
        delete socketsOfClients[socket.id];
        console.log('Web Client Disconnected');
    });
});

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', routes);
app.use('/users', users);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});


module.exports = app;
