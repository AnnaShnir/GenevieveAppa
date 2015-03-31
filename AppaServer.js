var net = require("net");  
var port = 3000;
var fs = require('fs')

var clients = [];




// adding startsWith ince node seems to be missing it
String.prototype.startsWith = function(str) {
  return this.indexOf(str) === 0;
}


/*
 Chat protocol.
    - name - name of the client
    - message - client posting message
 */


function broadcastMessage(from, message) {
  for (var i = 0; i < clients.length; i++) {
    if (clients[i].client != from) {
      clients[i].socket.write("action-what-she-said|" + from + "|" + message);
    }
  }
}


function onClientConnected(socket) {
  console.log("[server.onClientConnected] client connected");

  socket.write("action-name");
}

var server = net.createServer(function(socket) {
  onClientConnected(socket);

/*
  process.stdin.setEncoding('utf8');

  process.stdin.on('readable', function() {
    var chunk = process.stdin.read();
    if (chunk != null) {
      client.write("Server: " + chunk);
    }
  });
*/
// socket.write(randomComplement);
  
  socket.on("data", function(data) {
    data = data.toString().trim();

      fs.writeFile('attendees.txt', clients, function (err) {
    if (err) throw err;
    console.log('one sign up added');
  });

    var protocol = data.split('|');

    if (protocol[0] === 'action-client-name') {
      // if server receives this action, it means that 
      // client is providing name to it
      //    format: action-client-name|NAME
      var clientName = protocol[1];
      var email = protocol[2];
      clients.push( { 'client': clientName, 'socket': socket, 'email': email});

      socket.write("action-ready-to-chat");
    } else if (protocol[0] === 'action-client-says') {
      // client sent a chat message

      var receivedMessage = protocol[2];
      console.log("New message from: " + protocol[1] + " message: " + receivedMessage);

      // if ( receivedMessage.startsWith('manual') ) {
      //   socket.write("Manual: something something from the specs")
      // }

      ///////////////////////////////
      //separate commands for G.:
      // if ( receivedMessage.startsWith('/Genie&!*') ) {  // the passphrase can be agreed upon with G.
      //   // client sent command:
      //   var commands = receivedMessage.split(' ');
      //   function printlist() {
      //     //send a message to Genie containing JSON file with names of those who signed up
      //   }



        // if (commands[0] === '/Genie&!*' && commands[1] 'printlist') {
        //   // looks like G. wants a list of attendees for the upcomung Meet-up
        //   // printlist(commands[1]);

  //     } else {

  //       // send the new message to every other client connected
  //       broadcastMessage(protocol[1], receivedMessage);
  //     }
    }







  });

  socket.on("end", function() {
    console.log("client disconnected");
  });
});

server.listen(port, function() {
  console.log("listening on port" + port);
});