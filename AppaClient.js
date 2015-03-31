///////////////////
// I AM CLIENT   //
///////////////////


var net = require("net");
var client = net.Socket();

var name;

// function manual(client) {
//   console.log("If you are not sure how to sign up for the meet-up, type manual and hit enter.\n If you know what's up, hit enter");

//   process.stdin.setEncoding('utf8');

//   var listener = function() {
//     name = process.stdin.read();
//     if (name != null) {
//       name = name.trim();
//       client.write("action-client-name|" + name);
      
//       process.stdin.removeListener('readable', listener);
//     }
//   };

//   process.stdin.on('readable', listener);
// }

function getAndWriteNameToServer(client) {
  console.log('To sign up for the upcoming Meet-up, enter your name, email and hit enter:');

  process.stdin.setEncoding('utf8');

  var listener = function() {
    name = process.stdin.read();
    if (name != null) {
      name = name.trim();
      client.write("action-client-name|" + name);
      
      process.stdin.removeListener('readable', listener);
    }
  };

  process.stdin.on('readable', listener);
}





client.connect(3000, function() {
  console.log("connected to server");

  client.on("data", function(data) {
    data = data.toString().trim();

    var protocol = data.split('|');

    // protocol requires action for the client
    if (protocol[0] === 'action-name') {
      // server wants us to provide name of this client
      getAndWriteNameToServer(client);
    } else if (protocol[0] === 'action-ready-to-chat') {
      // server says you may chat now

      console.log("You have been signed up for the upcoming Meet-up! See you there, " + name);

      process.stdin.on('readable', function() {
        var message = process.stdin.read();
        if (message != null) {
          client.write("action-client-says|" + name + "|" + message);
        }
      });

    } else if (protocol[0] === 'action-what-she-said') {
      var whoSaidIt = protocol[1];
      var whatSheSaid = protocol[2];

      console.log(whoSaidIt + ": " + whatSheSaid);
    }// } else if {

    //  process.stdin.on('readable', function() {
    //    var message = process.stdin.read();
    //    if (message === "/kick" + name) {

    //      client.write("action-client-says|" + clients[] + "|" + "kicked out");
    //    }
    //  });

    // }








    //console.log(data.toString().trim()) 
  });

  client.on("end", function() {
    console.log("We'll see you there! Have a good day!");
    client.end();
  });
});