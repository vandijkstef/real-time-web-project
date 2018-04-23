const ws = require('ws').Server;
const uniqid = require('uniqid');
const ChatStore = require('./scripts/ChatStore.js');

const Setup = (server) => {
	const wss = new ws({server});
	wss.on('connection', (ws, req) => {
		let clientID = uniqid();
		
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
					ws.client = clientID;
					wsData.clients[clientID] = {};
					wsData.clients[clientID].user = msgData;
					delete wsData.toRemove[clientID];
					// ws.send('Hello client: ' + clientID);
				}
				// And broadcast that global data to all clients
				WSbroadcast(JSON.stringify(wsData), ws, wss);
				break;
			case 'MESSAGE':
				console.log(msgData);
				HandleChatMessage(msgData, ws, wss);
				break;
			default:
				ws.send('Not implemented: ' + clientID);
				break;
			}
		});
	
		ws.on('close', () => {
			console.log('Disconnected: ' + clientID);
			// I need to postpone this action untill im sure they didn't just reconnect
			// delete wsData.clients[clientID];
			wsData.toRemove[clientID] = {};
			setTimeout(() => {
				Object.keys(wsData.toRemove).forEach((clientID) => {
					console.log(clientID);
					delete wsData.clients[clientID];
				});
				WSbroadcast(JSON.stringify(wsData), ws, wss);
			}, 1000);
		});
	});
};
const wsData = { // Yes, this will be cleared on restart
	clients: {},
	toRemove: {}
};

const WSbroadcast = (data, ws, wss) => {
	wss.clients.forEach(function each(client) {
		if (client.readyState === ws.OPEN) {
			client.send(data);
		}
	});
};

const WSbroadcastMessage = (message, ws, wss) => {
	wss.clients.forEach(function each(client) {
		if (client.readyState === ws.OPEN) {
			// console.log('this', client.client, message);
			if (message.sendBy == client.client || message.for == client.client) {
				client.send(JSON.stringify(message));
			}
		}
	});
};

const HandleChatMessage = (message, ws, wss) => {
	console.log(message.sendBy, ws.client);
	if (message.sendBy != ws.client) {
		console.log('Chat auth error');
		return;
	} else {
		const chatStore = new ChatStore();
		chatStore.Store(message, (message) => {
			WSbroadcastMessage(message, ws, wss);
		});
	}
	// Broadcast the msg back to the relevant users, with the msg ID

	// msg.yours = true;
	// ws.send(JSON.stringify(msg));
};

module.exports = Setup;