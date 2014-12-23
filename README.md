#LEGO Train Driver

Project for making a LEGO train go by the touch of a button on a phone.

#Running

Run the `index.js` file on the Tessel, by running: `tessel run index.js`

Update the IP in `index.html` to reflect that of the Tessel. For instructions on WiFi, see the [Tessel website](http://start.tessel.io/wifi).

Serve the html file over http. `python -m SimpleHTTPServer` works fine, and connect in a browser.

The green diode on the Tessel will turn on when there is an active socket connection. The blue when the train is driving.

