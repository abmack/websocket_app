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

//user id assignment count
//resets only on server restart
var count = 1;
var archive = "";

//server socket event setup, upon successfull connection, 
io.sockets.on('connection', function (socket) {
    
    //server informs client of its userId
    socket.emit('assignment', count++);
    
    //newly connected client is sent the archive of comments
    socket.emit('message', archive);

    //receives message from a client and broadcasts it to other clients
    socket.on('message', function (msg, fn) { 
        archive += '<p>' + msg + '</p>';
        socket.broadcast.emit('message', msg);
        fn('success');
    });

});