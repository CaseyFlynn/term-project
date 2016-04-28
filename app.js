'use strict';

/**
 * Module dependencies.
 */

var express = require('express');
var http = require('http');
var socket = require('./routes/socket.js');


var app = express();
var server = http.createServer(app);

/* Config values */
app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/public'));
app.set('port', 8080);

if (process.env.NODE_ENV === 'development') {
    app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
}

/* Socket.io Communication to clients*/
var io = require('socket.io').listen(server);
io.sockets.on('connection', socket);


/*communication to twitter-scrape server*/
var clientio = require('socket.io-client');

//TODO: move to config
var tweetServer = 'http://40.76.197.56:3000';
//var tweetServer = 'http://localhost:3000';
var socketClient = clientio.connect(tweetServer, {reconnect: true});

var counter = 0;
var candidateNames = ['sandersTweet','hilldogTweet','trumpTweet','cruzTweet'];

socketClient.on('tweet', function(data) {
    if (data.text.toLowerCase().indexOf('sanders') > -1) {
        io.emit('tweet',{tweet: data, candidate: 'sandersTweet'})
    }
    if (data.text.toLowerCase().indexOf('clinton') > -1) {
        io.emit('tweet',{tweet: data, candidate: 'hilldogTweet'})
    }
    if (data.text.toLowerCase().indexOf('trump') > -1) {
        io.emit('tweet',{tweet: data, candidate: 'trumpTweet'})
    }
    if (data.text.toLowerCase().indexOf('cruz') > -1) {
        io.emit('tweet',{tweet: data, candidate: 'cruzTweet'})
    }
});


/* Start server */
server.listen(app.get('port'), function (){
    console.log('Express server listening on port %d in %s mode', app.get('port'), app.get('env'));
});

module.exports = app;