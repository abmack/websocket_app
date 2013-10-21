//node.js websocket server setup
var app = require('http').createServer(handler)
  , io = require('socket.io').listen(app)
  , fs = require('fs')

//set server port
app.listen(1337);

//server request handler
function handler (req, res) {
  fs.readFile(__dirname + '/index.html',
  function (err, data) {
    if (err) {
      res.writeHead(500);
      return res.end('Error loading index.html');
    }

    res.writeHead(200);
    res.end(data);
  });
}

//resets only on server restart
var archive = "";

//server socket event setup, upon successfull connection, 
io.sockets.on('connection', function (socket) {
    
    //newly connected client is sent the archive of comments
    socket.emit('message', archive);

    //receives message from a client and broadcasts it to other clients
    socket.on('message', function (msg, fn) { 
        archive = '<p>' + msg + '</p>' + archive;
        socket.broadcast.emit('message', msg);
        fn('success');
    });

});
