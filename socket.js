const ws = require('ws').Server;

const Setup = (server) => {
	const wss = new ws({server});
	wss.on('connection', (ws, req) => {
		// Fetch sessionID
		const value = '; ' + req.headers.cookie;
		const parts = value.split('; ' + 'connect.sid' + '=');
		const sessionID = parts.pop().split(';').shift().replace('s%3A', '').split('.').shift();
	
		if (wsData.clients[sessionID] === undefined) {
			// Fetch session data
			let session;
			console.log('do I has?');
			// const sessionsFile = './sessions/' + sessionID + '.json';
			// if (fs.existsSync(sessionsFile)) {
			// 	session = JSON.parse(fs.readFileSync(sessionsFile, {encoding: 'utf8'}));
			// }
			// Add to memstore
			wsData.clients[sessionID] = {
				id: sessionID
			};
			// Add avatar data, if available
			if (session && session.avatar) {
				wsData.clients[sessionID].avatar = session.avatar.avatar;
				wsData.clients[sessionID].emoji = session.avatar.emoji;
			}
		}
		
		ws.on('message', (message) => {
			// Tell the terminal we got a message
			const action = message.split(';')[0];
			console.log('received', message, action, sessionID);
			switch (action) {
			case 'HI':
				// Say hello to the client, be nice
				ws.send('Hello client: ' + sessionID);
				ws.send(JSON.stringify(wsData.clients[sessionID]));
				// Also, give the client the data
				ws.send(JSON.stringify(wsData));
				// And broadcast that global data to all clients
				WSbroadcast(JSON.stringify(wsData), ws, wss);
				break;
			case 'REGISTER':
				Register(message, sessionID, ws, wss);
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
			console.log('Disconnected: ' + sessionID);
			delete wsData.clients[sessionID];
			WSbroadcast(JSON.stringify(wsData), ws, wss);
		});
	});
};
const wsData = { // Yes, this will be cleared on restart
	clients: {}
};

const WSbroadcast = (data, ws, wss) => {
	wss.clients.forEach(function each(client) {
		if (client !== ws && client.readyState === ws.OPEN) {
			client.send(data);
		}
	});
};

const Register = (message, sessionID, ws, wss) => {
	const avatar = {
		avatar: message.split(';')[1].split(':')[1],
	};
	// avatar.emoji = emoji.find(avatar.avatar).emoji;
	wsData.clients[sessionID].avatar = avatar.avatar;
	wsData.clients[sessionID].emoji = avatar.emoji;
	ws.send('registered:' + avatar.emoji);
	// Also, give the client the data
	ws.send(JSON.stringify(wsData));
	// And broadcast that global data to all clients
	WSbroadcast(JSON.stringify(wsData), ws, wss);

	// Fetch session file
	// const sessionsFile = './sessions/' + sessionID + '.json';
	// const session = JSON.parse(fs.readFileSync(sessionsFile, {encoding: 'utf8'}));
	// Place avatar in session
	// session.avatar = avatar;
	// Store the session
	// fs.writeFileSync(sessionsFile, JSON.stringify(session));
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