var LogPacket = require('./logpacket.js');

function testPacket(arr, secret) {
	var testBuf = new Buffer(arr);

	try {
		var packet = LogPacket.parse(testBuf, secret);
	} catch (e) {
		console.log('Error: ' + e.message);
	}

	console.log('Packet valid: ' + (packet instanceof LogPacket).toString());

	if (packet instanceof LogPacket) {
		console.log('Packet type: ' + packet.getType().toString(16));
		console.log('Packet message: ' + packet.getMessage());
	}
}

var helloPacket = [ 0xFF, 0xFF, 0xFF, 0xFF, 0x52, 0x48, 0x65, 0x6c, 0x6c, 0x6f, 0x0a, 0x00 ];
var secretPacket = [ 0xFF, 0xFF, 0xFF, 0xFF, 0x53, 0x31, 0x32, 0x33, 0x48, 0x65, 0x6c, 0x6c, 0x6f, 0x0a, 0x00 ];

console.log('> Testing 0x52 packet');
testPacket(helloPacket);
console.log('');

console.log('> Testing 0x53 packet (no secret provided)');
testPacket(secretPacket);
console.log('');

console.log('> Testing 0x53 (secret provided)');
testPacket(secretPacket, "123");
