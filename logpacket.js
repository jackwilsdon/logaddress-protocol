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

function LogPacket(type, message, secret) {
	if (typeof(type) !== 'number') {
		throw new Error('invalid argument: type must be a number');
	}

	if (typeof(message) !== 'string') {
		throw new Error('invalid argument: message must be a string');
	}

	if (typeof(secret) !== 'undefined' && typeof(secret) !== 'string') {
		throw new Error('invalid argument: secret must be undefined or a string');
	}

	this._type = type;
	this._message = message;
}

LogPacket.prototype.getType = function() {
	return (typeof(this._type) === 'number') ? this._type : 0x00;
};

LogPacket.prototype.getMessage = function() {
	return (typeof(this._message) === 'string') ? this._message : false;
};

LogPacket.prototype.toString = function() {
	return "LogPacket {type: " + this.getType().toString() + ", message: \"" + this.getMessage().toString() + "\"}";
};

LogPacket.parse = function(buf, secret) {
	if (!(buf instanceof Buffer)) {
		throw new Error('invalid argument: buf must be a buffer');
	}

	if (typeof(secret) !== 'undefined' && typeof(secret) !== 'string') {
		throw new Error('invalid argument: secret must be undefined or a string');
	}

	if (buf.length < 7) throw new Error('packet too short (' + buf.length.toString() + ' < 7)');
	
	for (var i = 0; i < 4; i++) {
		if (buf[i] !== 0xFF) throw new Error('invalid header value'); 
	}

	if (buf[buf.length - 1] !== 0x00) {
		throw new Error('invalid footer value');
	}

	var type = buf[4],
	    offset = 5,
	    footer = 2;

	if (buf[buf.length - 2] !== 0x0a) {
		footer = 1;
	}

	if (type === 0x53) {
		if (typeof(secret) === 'string') {
			offset += Buffer.byteLength(secret);
		} else {
			throw new Error('missing secret for packet type 0x53');
		}
	} else if (type !== 0x52) {
		throw new Error('invalid packet type ' + type.toString(16));
	}

	if (offset >= (buf.length - footer)) {
		if (typeof(secret) === 'string') {
			throw new Error('packet too short to contain secret (invalid secret or no message)');
		} else {
			throw new Error('packet is empty');
		}
	}

	var msgbuf = buf.slice(offset, buf.length - footer);
	
	var message = msgbuf.toString();

	return new LogPacket(type, message, secret);
};

module.exports = LogPacket;
