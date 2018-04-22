const ws = require('ws').Server;
const uniqid = require('uniqid');

const Setup = (server) => {
	const wss = new ws({server});
	wss.on('connection', (ws, req) => {
		// Fetch sessionID
		const value = '; ' + req.headers.cookie;
		const parts = value.split('; ' + 'connect.sid' + '=');
		const sessionID = parts.pop().split(';').shift().replace('s%3A', '').split('.').shift();
		
		let clientID = uniqid();
		// if (wsData.clients[sessionID] === undefined) {
		// 	// Fetch session data
		// 	// TODO: ...
		// 	// TODO: Why am I still using the sessionID? We get the full session passed from the client right? - Holy F, I exposed all session ID's....

		// 	// Add to memstore
		// 	wsData.clients[sessionID] = {
		// 		id: sessionID
		// 	};
		// }
		
		ws.on('message', (message) => {
			const msgData = JSON.parse(message);
			switch (msgData.action) {
			case 'HI':
				// Say hello to the client, be nice
				if (msgData.error) {
					// ws.send('Hello guest: ' + clientID);
				} else {
					// Register client in Memstore
					clientID = msgData.id;
					wsData.clients[clientID] = {};
					wsData.clients[clientID].user = msgData;
					// ws.send('Hello client: ' + clientID);
				}
				// And broadcast that global data to all clients
				WSbroadcast(JSON.stringify(wsData), ws, wss);
				break;
			case 'MESSAGE':
				HandleChatMessage(message, sessionID, ws, wss);
				break;
			default:
				ws.send('Not implemented: ' + sessionID);
				break;
			}
		});
	
		ws.on('close', () => {
			console.log('Disconnected: ' + clientID);
			delete wsData.clients[clientID];
			WSbroadcast(JSON.stringify(wsData), ws, wss);
		});
	});
};
const wsData = { // Yes, this will be cleared on restart
	clients: {}
};

const WSbroadcast = (data, ws, wss) => {
	wss.clients.forEach(function each(client) {
		if (client.readyState === ws.OPEN) {
			client.send(data);
		}
	});
};

const HandleChatMessage = (message, sessionID, ws, wss) => {
	const theMsg = message.split(';')[1].split(':')[1];
	const msg = {
		user: wsData.clients[sessionID],
		msg: theMsg
	};
	WSbroadcast(JSON.stringify(msg), ws, wss);
	msg.yours = true;
	ws.send(JSON.stringify(msg));
};

module.exports = Setup;