const MongoStore = require('./MongoStore.js');
const GitAPI = require('./GitAPI.js');
const UserStore = require('./UserStore.js');
const async = require('async'); 

class ForkStore extends MongoStore {
	constructor() {
		super('forks');
	}

	GetAll(dataRepo, callback) {
		super.GetAll({parent: dataRepo.id}, (dataForks) => {
			if (dataForks.length === 0) {
				const gitAPI = new GitAPI();
				gitAPI.GetAllForks(dataRepo.urls.forks, (gitForks) => {
					async.forEach(gitForks, (gitFork, callback) => {
						this.Store(dataRepo, gitFork, () => {
							callback();
						});
					}, () => {
						super.GetAll({parent: dataRepo.id}, (dataForks) => {
							callback(dataForks, 'new');
						});
					});
				});
			} else {
				callback(dataForks, 'not modified');
			}
		});
	}

	Store(dataRepo, gitFork, callback) {
		const user = gitFork.owner;
		const userStore = new UserStore();
		userStore.TestAndStore(user, (dataUser) => {
			const data = {
				_id: gitFork.id,
				repo: dataRepo._id,
				owner: dataUser._id,
				urls: {
					html: gitFork.html_url,
					contributors: gitFork.contributors_url
				}
			};
			super.PutUpdate(data, () => {
				callback();
			});
		});
	}
}

module.exports = ForkStore;