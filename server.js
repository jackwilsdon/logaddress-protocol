var dgram = require('dgram'),
    LogPacket = require('./logpacket.js');

var server = dgram.createSocket('udp4');

var secret = "";

function getAddress(address) {
	return address.address + ':' + address.port;
}

server.on('listening', function() {
	console.log('Server listening on ' + getAddress(server.address()));
});

server.on('message', function(message, remote) {
	var packet = LogPacket.parse(new Buffer(message), (secret.length > 0) ? secret : undefined);
	console.log(getAddress(remote) + " - " + packet.toString());
});

server.on('close', function() {
	console.log('Closed server');
});

server.bind(1337);
