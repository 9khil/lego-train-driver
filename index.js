var tessel = require('tessel'),
    ws = require('nodejs-websocket'),
    http = require('http'),
    fs = require('fs');

var led = tessel.led[1].output(0);
var connectionLed = tessel.led[0].output(0);

var errorLed = tessel.led[2].output(0);

var lastDirection = undefined;

// Start web server.
    http.createServer(function (request, response) {
      console.log('Request received');
      response.writeHead(200, {'Content-Type': 'text/html'});

      fs.readFile('./index.html', function(error, data) {
        if (error) {
          console.log('Could not read file');
          console.log(error);
          errorLed.output(1);
        }

        response.end(data);
      });
    }).listen(80, '127.0.0.1');
    console.log('WebServer started.');

    // Listen for clients
    var socket = ws.createServer(function(connection) {

      function sendMessage(message) {
        try {
          connection.sendText(message);
        } catch (e) {
          errorLed.output(1);
        }
      }

      // Turn on connection LED
      connectionLed.output(1);
      console.log('Socket client connection established!');

      connection.on('text', function(string) {

        console.log('Received ' + string);

        switch(string) {
          case "forwards":
            sendMessage('forwards');
         
            lastDirection = 'forwards';
            break;
          case "backwards":
            sendMessage('backwards');
       
            lastDirection = 'backwards';
            break;
          case "stop":
            sendMessage('stopped');

            if (lastDirection === 'forwards') {
       //       servo.move(1, 0.425);
            } else {
       //       servo.move(1, 0.555);
            }

            setTimeout(function() {
   //           servo.move(1, 0.5);
            }, 300);

            break;
          default:
            console.log('and that is not a command!');
        }

        led.toggle();

      });

      connection.on('close', function(code, reason) {
      //  servo.move(1, 0.5); // Resetting servo
        console.log('Lost connection');
        console.log('code', code);
        console.log('reason', reason);

        // Turn off connection LED
        connectionLed.output(0);
      });

    }).listen(1337);

    socket.on('error', function(error) {
    //  servo.move(1, 0.5); // Stop train please..
    });