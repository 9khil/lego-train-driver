var tessel = require('tessel');
var servolib = require('servo-pca9685');
var ws = require('nodejs-websocket');

var servo = servolib.use(tessel.port['A']);
var led = tessel.led[1].output(0);
var connectionLed = tessel.led[0].output(0);

var lastDirection = undefined;

servo.on('ready', function() {
  servo.configure(1, 0.05, 0.12, function() {
    // Set servo position to zero
    servo.move(1, 0.5); // Resetting servo
    console.log('Ready for clients...');

    // Listen for clients
    var socket = ws.createServer(function(connection) {

      // Turn on connection LED
      connectionLed.output(1);
      console.log('Socket client connection established!');

      connection.on('text', function(string) {

        console.log('Received ' + string);

        switch(string) {
          case "forwards":
            connection.sendText('forwards');
            servo.move(1, 1);
            lastDirection = 'forwards';
            break;
          case "backwards":
            connection.sendText('backwards');
            servo.move(1, 0.2);
            lastDirection = 'backwards';
            break;
          case "stop":
            connection.sendText('stopped');

            if (lastDirection === 'forwards') {
              servo.move(1, 0.425);
            } else {
              servo.move(1, 0.555);
            }

            setTimeout(function() {
              servo.move(1, 0.5);
            }, 300);

            break;
          default:
            console.log('and that is not a command!');
        }

        led.toggle();

      });

      connection.on('close', function(code, reason) {
        servo.move(1, 0.5); // Resetting servo
        console.log('Lost connection');
        console.log('code', code);
        console.log('reason', reason);

        // Turn off connection LED
        connectionLed.output(0);
      });

    }).listen(1337);

  });
});
