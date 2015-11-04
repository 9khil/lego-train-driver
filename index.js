var tessel = require('tessel'),
    ws = require('nodejs-websocket'),
    http = require('http'),
    irLib = require('ir-attx4'),
    LegoIR = require('lego-ir'),
    fs = require('fs');


/* IR */
var infrared = irLib.use(tessel.port['A']);


/* Lego */
var lego = new LegoIR({
  mode: 'comboPWM',
  channel: 1
});

var legoBuffer = lego.move({
  outputA: 'forward2',
  outputB: 'forward2'
});




var led = tessel.led[1].output(0);
var connectionLed = tessel.led[0].output(0);

var errorLed = tessel.led[2].output(0);

var lastDirection = undefined;

infrared.on('ready', function(){
  if(err) throw new Error(err);
  console.log("Connected to IR module!");
  console.log("Starting WebServer");

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
                sendRawIrSignal(lego.move({
                  outputA: 'forward',
                  outputB: 'forward'
                }));
              lastDirection = 'forwards';
              break;
            case "backwards":
              sendMessage('backwards');
              sendRawIrSignal(lego.move({
                outputA: 'backward',
                outputB: 'backward'
              }));
              lastDirection = 'backwards';
              break;
            case "stop":
              sendMessage('stopped');
              sendRawIrSignal(lego.move({
                outputA: 'brake',
                outputB: 'brake'
              }));
              break;
            case "backward2": //testing
              sendMessage('forward2');
              sendRawIrSignal(lego.move({
                outputA: 'forward2',
                outputB: 'forward2'
              }));
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

      }).listen(1338);

      socket.on('error', function(error) {
      //  servo.move(1, 0.5); // Stop train please..
      });

  /*

    */

});

function sendRawIrSignal(legoBuff){
  infrared.sendRawSignal(38, legoBuff, function(err) {
      if(err) throw new Error(err);
      console.log("IR Signal Sent!");
    });
}
