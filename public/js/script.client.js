let ws;

/// FORMS ///
// Catch all form submissions and hook up the actions needed
const CatchForms = () => {
	console.log('settings forms');
};

/// BUTTONS ///
// Set all non-submit buttons
const SetButtons = () => {
	console.log('Set buttons');
};

/// SOCKET ///
let mySession;
// The socket, the whole socket and nothing but the socket
const Socket = () => {
	if ('WebSocket' in window) {
		if (!mySession) {
			console.log('Fetching session');
			fetch(window.location.protocol + '//' + window.location.host + '/session', {
				credentials: 'include'  
			})
				.then((res) => res.json())
				.catch((error) => {
					console.error('Error:', error);
				})
				.then((response) => {
					mySession = response;
					DoSocket();
				});
		} else {
			DoSocket();
		}
	}
};

const DoSocket = () => {
	console.log('Starting Client Websocket');
	let host = location.origin.replace(/^http/, 'ws');
	ws = new WebSocket(host);
	ws.onopen = () => {
		ws.send(SocketMessages.hi());
	};
	ws.onmessage = (e) => {
		try {
			const data = JSON.parse(e.data);
			console.log(data);
		} catch(err) {
			const action = e.data.split(':')[0];
			const param = e.data.split(':')[1];
			switch (action) {
			default:
				console.log(action, param);
				break;
			}
		}
	};
	ws.onclose = () => {
		console.log('Socket connection closed, retrying');
		UIOffline();
	};
	ws.onerror = () => {
		console.log('Woops, we got a Socket error.');
	};
};

// Standardize socket messages
const SocketMessages = {
	hi: () => {
		mySession.action = 'HI';
		return JSON.stringify(mySession);
	},
	register: (element) => {
		const value = element.querySelector('select[name=name]').value;
		return `REGISTER;ELEMENT:${value};`;
	},
	message: (msg) => {
		return `MESSAGE;CHAT:${msg};`;
	}
};

/// UI ///
// Memstore elements
const elements = {};

// Initialize UI
const InitUI = () => {
	console.log('init UI');
	CatchForms();
	SetButtons();
};




// Set UI to offline, try to reconnect
const UIOffline = () => {
	console.warn('WS Offline, retrying: Do some front-end stuff will ya?');
	setTimeout(() => {
		Socket();
	}, 5000);
};

document.addEventListener('DOMContentLoaded', () => {
	InitUI();
	Socket();
});