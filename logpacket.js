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

	if (buf[buf.length - 2] !== 0x0a || buf[buf.length - 1] !== 0x00) {
		throw new Error('invalid footer value');
	}

	var type = buf[4],
	    offset = 5;

	if (type === 0x53) {
		if (typeof(secret) === 'string') {
			offset += Buffer.byteLength(secret);
		} else {
			throw new Error('missing secret for packet type 0x53');
		}
	} else if (type !== 0x52) {
		throw new Error('invalid packet type ' + type.toString(16));
	}

	if (offset >= (buf.length - 2)) {
		if (typeof(secret) === 'string') {
			throw new Error('packet too short to contain secret (invalid secret or no message)');
		} else {
			throw new Error('packet is empty');
		}
	}

	var msgbuf = buf.slice(offset, buf.length - 2);
	
	var message = msgbuf.toString();

	return new LogPacket(type, message, secret);
};

module.exports = LogPacket;
