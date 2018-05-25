const MongoStore = require('./MongoStore.js');
const GitAPI = require('./GitAPI.js');
const UserStore = require('./UserStore.js');
const async = require('async'); 

class ForkStore extends MongoStore {
	constructor() {
		super('forks');
	}

	GetAll(dataRepo, callback) {
		super.GetAll({repo: dataRepo._id}, (dataForks) => {
			if (dataForks.length === 0 || super.Validate(dataForks)) {
				const gitAPI = new GitAPI();
				gitAPI.GetAllForks(dataRepo.urls.forks, (gitForks) => {
					// console.log(dataRepo.urls.forks);
					async.forEach(gitForks, (gitFork, callback) => {
						this.Store(dataRepo, gitFork, () => {
							callback();
						});
					}, () => {
						super.GetAll({parent: dataRepo._id}, (dataForks) => {
							// console.log(dataForks);
							callback(dataForks, 'new');
						});
					});
				});
			} else {
				// console.log(dataForks);
				callback(dataForks, 'not modified');
			}
		});
	}

	GetFromUser(userID, callback) {
		super.GetAll({owner: userID}, (dataForks) => {
			callback(dataForks, 'not modified');
		});
	}

	Store(dataRepo, gitFork, callback) {
		const user = gitFork.owner;
		const userStore = new UserStore();
		userStore.TestAndStore(user, (dataUser) => {
			const data = {
				_id: gitFork.id,
				repo: dataRepo._id,
				repoName: dataRepo.name,
				owner: dataUser._id,
				ownerName: dataUser.niceName || dataUser.systemName,
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