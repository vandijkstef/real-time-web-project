const MongoStore = require('./MongoStore.js');
const GitAPI = require('./GitAPI.js');
const async = require('async'); 

// Class to store and fetch Repo based data
class RepoStore extends MongoStore {
	constructor() {
		super();
		this.collection = 'repos';
	}

	// Get all Repos
	GetAll(callback) {
		super.GetAll('repos', {}, (dataRepos) => {
			// If 0 or timestamp invalid (too old) -> refresh
			if (dataRepos.length === 0) {
				const gitAPI = new GitAPI();
				gitAPI.GetReposFromOrg('cmda-minor-web', (gitRepos) => {
					async.forEach(gitRepos, (gitRepo, callback) => { 	
						this.Store(gitRepo, () => {
							callback(); 
						});	
					}, () => {
						super.GetAll('repos', {}, (dataRepos) => {
							callback(dataRepos);
						});
					});  
				});
			} else {
				console.log('got data');
				callback(dataRepos);
			}
		});
	}

	Store(gitRepo, callback) {
		// const user = gitRepo.owner; // TODO: Store the owner as well
		const data = {
			_id: gitRepo.id,
			name: gitRepo.name,
			lastSaved: Date.now(),
			description: gitRepo.description,
			urls: {
				html: gitRepo.html_url,
				forks: gitRepo.forks_url
			}
		};
		super.Put('repos', data, () => {
			callback();
		});
	}

	// StoreAll(repos, callback) {
	// 	repos.forEach((repo) => {
	// 		Store(repo, () => {

	// 		});
	// 	});
	// }
}

module.exports = RepoStore;