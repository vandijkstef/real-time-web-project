const MongoStore = require('./MongoStore.js');
const uniqid = require('uniqid');

class ChatStore extends MongoStore {
	constructor() {
		super('chat');
	}

	GetConversation(userID, otherID, callback) {
		super.GetAll({ sendBy: {$in: [userID.toString(), otherID.toString()]}, for: {$in: [userID.toString(), otherID.toString()]}}, (result) => {
			callback(result);
		});
	}

	Store(message, callback) {
		message._id = uniqid();
		super.PutUpdate(message, () => {
			callback(message);
		});
	}
}

module.exports = ChatStore;