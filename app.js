var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var routes = require('./routes/index');
var users = require('./routes/users');

var app = express();

var server = require('http').createServer(app);
var port = 3000;
server.listen(port);
console.log("Server Socket started and listening on port : " + port);

var sio = require('socket.io').listen(server);

var clients = {};
var socketsOfClients = {};

sio.sockets.on('connection', function(socket) {
    console.log('Web client connected');
    socket.on('register', function(data) {
        console.log("Request Received");
        if(clients[data.user] === undefined) {
            clients[data.user] = socket.id;
            socketsOfClients[socket.id] = data.user;
            console.log("Sending response");
            socket.emit('response', {status:true, text: "Welcome, " + data.user});
        } else if(clients[data.user] === socket.id) {
            socket.emit('response', {status:true});
        } else {
            socket.emit('response', {status:false});
        }
    });

    socket.on('chat', function(data) {
        var client = socketsOfClients[socket.id];
        var message = "<b>"+ client + "</b>: " + data.message
        sio.sockets.emit('message', {message: message});
    });

    socket.on('disconnect', function() {
        var name = socketsOfClients[socket.id];
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
