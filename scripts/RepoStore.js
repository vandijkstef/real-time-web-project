const MongoStore = require('./MongoStore.js');
const GitAPI = require('./GitAPI.js');
const UserStore = require('./UserStore.js');
const async = require('async'); 

// Class to store and fetch Repo based data
// This should be the only location where GitAPI is used
class RepoStore extends MongoStore {
	constructor() {
		super('repos');
	}

	// Get all Repos
	GetAll(callback) {
		super.GetAll({}, (dataRepos) => {
			// If 0 or timestamp invalid (too old) -> refresh
			if (dataRepos.length === 0) {
				const gitAPI = new GitAPI();
				gitAPI.GetReposFromOrg(process.env.GITORG, (gitRepos) => {
					async.forEach(gitRepos, (gitRepo, callback) => { 	
						this.Store(gitRepo, () => {
							callback(); 
						});	
					}, () => {
						super.GetAll({}, (dataRepos) => {
							callback(dataRepos, 'new');
						});
					});  
				});
			} else {
				callback(dataRepos, 'not modified');
			}
		});
	}

	Store(gitRepo, callback) {
		const user = gitRepo.owner;
		const userStore = new UserStore();
		userStore.TestAndStore(user, (dataUser) => {
			const data = {
				_id: gitRepo.id,
				name: gitRepo.name,
				description: gitRepo.description,
				owner: dataUser._id,
				urls: {
					html: gitRepo.html_url,
					forks: gitRepo.forks_url
				}
			};
			super.PutUpdate(data, () => {
				callback();
			});
		});
		
	}

}

module.exports = RepoStore;