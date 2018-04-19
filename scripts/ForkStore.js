const MongoStore = require('./MongoStore.js');
const GitAPI = require('./GitAPI.js');
const UserStore = require('./UserStore.js');

class ForkStore extends MongoStore {
	constructor() {
		super('forks');
	}

	GetAll(dataRepo, callback) {
		// TODO:
		const gitAPI = new GitAPI();
		const userStore = new UserStore();
		console.log(dataRepo, callback, gitAPI, userStore);
	}
}

module.exports = ForkStore;