 /**
 *    logaddress-protocol - A JS implementation of the Source Engine's UDP logging protocol.
 *    Copyright (C) 2014  Jack Wilsdon
 *
 *    This program is free software: you can redistribute it and/or modify
 *    it under the terms of the GNU Affero General Public License as published by
 *    the Free Software Foundation, either version 3 of the License, or
 *    (at your option) any later version.
 *
 *    This program is distributed in the hope that it will be useful,
 *    but WITHOUT ANY WARRANTY; without even the implied warranty of
 *    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 *    GNU Affero General Public License for more details.
 *
 *    You should have received a copy of the GNU Affero General Public License
 *    along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */

var dgram = require('dgram'),
    LogPacket = require('./logpacket.js');

var server = dgram.createSocket('udp4');

var secret = '';

function getAddress(address) {
	return address.address + ':' + address.port;
}

server.on('listening', function() {
	console.log('Server listening on ' + getAddress(server.address()));
});

server.on('message', function(message, remote) {

	var value = 'Invalid packet';

	try {
		var packet = LogPacket.parse(new Buffer(message), (secret.length > 0) ? secret : undefined);
		value = packet.toString();
	} catch (e) {
		value = 'Invalid packet [' + e.message + ']';
	}

	console.log(getAddress(remote) + ' - ' + value);
});

server.on('close', function() {
	console.log('Closed server');
});

server.bind(1337);
