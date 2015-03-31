var net = require("net");  
var port = 3000;
var fs = require('fs')

var clients = [];
var headcount = 0;

// adding startsWith ince node seems to be missing it
String.prototype.startsWith = function(str) {
  return this.indexOf(str) === 0;
}


/*
 Chat protocol.
    - name - name of the client
    - message - client posting message
 */

function onClientConnected(socket) {
  console.log("[server.onClientConnected] client connected");
  socket.write("If you're new here, type 'manual' :) To sign up for the upcoming Meet-up, enter 'sign up, your name, email, and hit enter");
}

var server = net.createServer(function(socket) {
  onClientConnected(socket);
  
  socket.on("data", function(data) {
    data = data.toString().trim();
    var protocol = data.split(' ');
    console.log(protocol);
    headcount+=1;
    console.log(headcount);
    socket.write("your number in line is " + headcount);
    // socket.write("your number in the longest line of developers is" + headcoount);
    if (protocol[0] === 'manual') {
      socket.write("to sign-up for the next Meet-up ")
    }


    if (protocol[0] === 'sign up,') {
      // if server receives this action, it means that 
      // client is providing name to it
      //    format: action-client-name|NAME
      var clientName = protocol[1];
      var email = protocol[2];
      clients.push( { 'client': clientName, 'email': email});


      var attendees = JSON.stringify(clients.join(""));
      fs.writeFile("attendees.json", attendees, function(err) {    
        if (err) {
          console.log(err);
        }
        });
      fs.readFile("attendees.json", function(err) {   
        if (err) {
          console.log(err);
        }
      });

      socket.write("Thanks for signiing up!");

    } else if (protocol[0] === '/Genie&!*' && protocol[1] === 'printlist') {
      fs.readFile("attendees.json", function(err, data) {
        if (err) {
          console.log(err);
        } else {
          socket.write(data);
        }
      });
    }
  });

  socket.on("end", function() {
    console.log("client disconnected");
  });
});

server.listen(port, function() {
  console.log("listening on port" + port);
});