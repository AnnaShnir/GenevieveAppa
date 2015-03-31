var net = require('net');
var fs = require('fs')
var port = 3000;
var clients = [];
String.prototype.startsWith = function(str) {
  return this.indexOf(str) === 0;
}

var server = net.createServer(function(socket) {
  console.log('client connected');
  socket.write('Hello Client');

  socket.on('data', function(data) {
  data = data.toString().trim();    
  var protocol = data.split('|');


  });

  socket.on('end', function() {
    console.log('client disconnected');
  });
});
server.listen(port, function() {
  console.log("listening on port" + port);
});

