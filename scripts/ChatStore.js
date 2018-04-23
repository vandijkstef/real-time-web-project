const MongoStore = require('./MongoStore.js');
const uniqid = require('uniqid');

class ChatStore extends MongoStore {
	constructor() {
		super('chat');
	}

	Store(message, callback) {
		message._id = uniqid();
		super.PutUpdate(message, () => {
			callback(message);
		});
	}
}

module.exports = ChatStore;