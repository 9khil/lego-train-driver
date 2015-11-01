#LEGO Train Driver

Project for controlling a Lego train with Tessel and ir-sensor (1st generation Tessel and ir-attx4).

#Running

Install tessel-cli, read more here: https://github.com/tessel/t1-docs/blob/master/cli.md#installation

First make sure you have all the packages installed by running `npm install`, and then run the entire package on the Tessel by issuing the command `tessel run .`.

Visit the Tessel's IP in a browser, and you should see this lovely interface ([Tessel WiFi docs](http://start.tessel.io/wifi)):

<img alt="LEGO Train Driver interface" width="300" src="docs/interface.png" />

The green diode on the Tessel will turn on when there is an active socket connection. The blue when the train is driving.

#Problems?

- Use node 0.12.x 
- Check tessel-ip in index.html. Must be updated to Tessels IP.
- Tessel v1 docs: https://github.com/tessel/t1-docs

