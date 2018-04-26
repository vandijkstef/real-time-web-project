let ws;

/// FORMS ///
// Catch all form submissions and hook up the actions needed
const CatchForms = () => {
	const forms = document.querySelectorAll('form');
	forms.forEach((form) => {
		form.addEventListener('submit', (e) => {
			e.preventDefault();
			switch (e.target.id) {
			case 'chatmessage':
				ws.send(SocketMessages.message(form));
				break;
			default:
				console.warn('Form not implemented');
				break;
			}
		});
	});
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
		let data;
		try {
			data = JSON.parse(e.data);
			console.log(data);			
		} catch(err) {
			console.warn('We didn\'t receive an object', e.data);
		} finally {
			if (data.action === 'MESSAGE') {
				HandleIncomingMessage(data);
			} else {
				UpdateUI(data);
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

// Standardize send socket messages
const SocketMessages = {
	hi: () => {
		mySession.action = 'HI';
		return JSON.stringify(mySession);
	},
	register: (element) => {
		const value = element.querySelector('select[name=name]').value;
		return `REGISTER;ELEMENT:${value};`;
	},
	message: (form) => {
		const msg = {
			action: 'MESSAGE',
			text: form.querySelector('input[name=message]').value,
			sendBy: form.querySelector('input[name=you]').value,
			for: form.querySelector('input[name=other]').value
		};
		return JSON.stringify(msg);
	}
};

/// UI ///
// Memstore elements
const elements = {};

// Initialize UI
const InitUI = () => {
	CatchForms();
	SetButtons();
};

// Update the UI based on all wsData received
const UpdateUI = (wsData) => {
	UIOnline();
	UpdateUserList(wsData);
};

const UpdateUserList = (wsData) => {
	if (!elements.userList) {
		elements.userList = document.querySelector('.userside > ul');
		elements.userListItems = document.querySelectorAll('.userside li');
	}
	if (elements.userList) {
		// Set all users offline
		elements.userListItems.forEach((userListItem) => {
			userListItem.classList.add('offline');
			userListItem.classList.remove('online');
		});
		// Set them back online if they are in the data
		Object.keys(wsData.clients).forEach((clientID) => {
			const userElement = document.querySelector(`#userstatus-${clientID}`);
			userElement.classList.remove('offline');
			userElement.classList.add('online');
		});
	}
};

const HandleIncomingMessage = (msgData) => {
	if (!elements.chatInput) {
		elements.chatInput = document.querySelector('input[name=message]');
	}
	if (!elements.chatUl) {
		elements.chatUl = document.querySelector('#chat ul');
	}

	const chatLi = document.createElement('li');

	chatLi.id = msgData._id;
	chatLi.innerText = msgData.text;
	if (msgData.sendBy == mySession.id) {
		elements.chatInput.value = '';
		chatLi.classList.add('yours');
	}
	
	elements.chatUl.appendChild(chatLi);
	elements.chatUl.scrollTop = elements.chatUl.scrollHeight;
};

// Set UI to offline, try to reconnect
const UIOffline = () => {
	if (elements.userList) {
		elements.userList.classList.add('uioffline');
	}
	if (!elements.chatInput) {
		elements.chatInput = document.querySelector('input[name=message]');
	}
	if (!elements.chatUl) {
		elements.chatUl = document.querySelector('#chat ul');
	}
	if (!elements.chatSubmit) {
		elements.chatSubmit = document.querySelector('#chat input[type=submit]');
	}
	if (elements.chatInput) {
		elements.chatInput.classList.add('uioffline');
	}
	if (elements.chatUl) {
		elements.chatUl.classList.add('uioffline');
	}
	if (elements.chatSubmit) {
		elements.chatSubmit.classList.add('uioffline');
		elements.chatSubmit.disabled = true;
	}
	setTimeout(() => {
		Socket();
	}, 5000);
};

const UIOnline = () => {
	const offlineElements = document.querySelectorAll('.uioffline');
	if (elements.chatSubmit) {
		elements.chatSubmit.disabled = false;
	}
	offlineElements.forEach((element) => {
		element.classList.remove('uioffline');
	});
};

document.addEventListener('DOMContentLoaded', () => {
	InitUI();
	Socket();
});