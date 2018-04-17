const MongoStore = require('./MongoStore.js');
const GitAPI = require('./GitAPI.js');

// Class to store and fetch Repo based data
class RepoStore extends MongoStore {
	constructor() {
		super();
		this.collection = 'repos';
	}

	// Get all Repos
	GetAll(callback) {
		super.GetAll('repos', {}, (data) => {
			// If 0 or timestamp invalid (too old) -> refresh
			if (data.length === 0) {
				const gitAPI = new GitAPI();
				gitAPI.GetReposFromOrg('cmda-minor-web', (data) => {
					callback(data);
					data.forEach((repo) => {
						this.Store(repo, () => {
							// Store it!
						});
					});
				});
			} else {
				callback(data);
			}
		});
	}

	Store(repo, callback) {

	}

	// StoreAll(repos, callback) {
	// 	repos.forEach((repo) => {
	// 		Store(repo, () => {

	// 		});
	// 	});
	// }
}

module.exports = RepoStore;