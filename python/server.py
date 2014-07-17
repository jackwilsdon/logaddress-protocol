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

import socket
from logpacket import LogPacket

sock = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)

sock.bind(('', 1337))

secret = ''

def get_address(address):
	return '{0}:{1}'.format(*address)

print('Server listening on {0}'.format(get_address(sock.getsockname())))

while True:
	message, remote = sock.recvfrom(65507)

	value = 'Invalid packet'

	try:
		packet = LogPacket.parse(message, secret if len(secret) > 0 else None)

		value = packet
	except Exception as e:
		value = 'Invalid packet [{0}]'.format(e)

	print(value)
