#    logaddress-protocol - A Python implementation of the Source Engine's UDP logging protocol.
#    Copyright (C) 2014  Jack Wilsdon
#
#    This program is free software: you can redistribute it and/or modify
#    it under the terms of the GNU Affero General Public License as published by
#    the Free Software Foundation, either version 3 of the License, or
#    (at your option) any later version.
#
#    This program is distributed in the hope that it will be useful,
#    but WITHOUT ANY WARRANTY; without even the implied warranty of
#    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
#    GNU Affero General Public License for more details.
#
#    You should have received a copy of the GNU Affero General Public License
#    along with this program.  If not, see <http://www.gnu.org/licenses/>.

class LogPacket:
	def __init__(self, ptype, message):
		if not isinstance(ptype, int):
			raise TypeError('ptype must be an int')

		if not isinstance(message, str):
			raise TypeError('message must be a str')

		self._ptype = ptype
		self._message = message

	@property
	def ptype(self):
		return self._ptype if isinstance(self._ptype, int) else 0x00
	
	@property
	def message(self):
		return self._message if isinstance(self._message, str) else ''

	def __str__(self):
		return '<logpacket.LogPacket ptype={0} message=\"{1}\">'.format(self.ptype, self.message)

	@staticmethod
	def parse(packet, secret = None, strict_secret = True):
		if not isinstance(packet, bytes):
			raise TypeError('packet must be a bytes str')

		if not isinstance(secret, (type(None), str)):
			raise TypeError('secret must be None or a str')

		if not isinstance(strict_secret, bool):
			raise TypeError('strict_secret must be a bool')

		packet_len = len(packet)

		if packet_len < 7:
			raise Exception('packet too short (' + str(packet_len) + ' < 7)')

		for i in range(4):
			if ord(packet[i]) != 0xFF:
				raise Exception('invalid header value')

		if ord(packet[packet_len - 1]) != 0x00:
			raise Exception('invalid footer value')

		ptype, offset, footer = ord(packet[4]), 5, 2

		if ord(packet[packet_len - 2]) != 0x0a:
			footer = 1

		if ptype == 0x53:
			if isinstance(secret, str):
				secret_len = len(bytes(secret))
				packet_secret = packet[offset:(offset + secret_len)]
				if secret != packet_secret and strict_secret:
					raise Exception('secret does not match')

				offset += secret_len
			else:
				raise Exception('missing secret for packet type 0x53')
		elif ptype != 0x52:
			raise Exception('invalid packet type ' + hex(ptype))
	
		if offset >= (packet_len - footer):
			if isinstance(secret, str):
				raise Exception('packet too short to contain secret (invalid secret or no message)')
			else:
				raise Exception('packet is empty')

		message = packet[offset:(packet_len - footer)]

		return LogPacket(ptype, message)
