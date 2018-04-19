const API = require('./API.js');

// Class to interact with the Github API
class GitAPI extends API {
	constructor() {
		super('https://api.github.com');
		if (process.env.GITTOKEN) {
			this.auth = '?access_token=' + process.env.GITTOKEN;
		} else {
			console.log('No Git API token: Server calls limited');
		}
	}
	
	GetReposFromOrg(organisation, callback) {
		this.callCallback('/orgs/' + organisation + '/repos', (data) => {
			callback(data);
		});
	}

	GetAllForks(forks_url, callback) {
		this.callCallback(forks_url + '?per_page=100', (data) => {
			const forks = [];
			data.forEach((fork) => {
				forks.push(fork);
			});
			callback(forks);
		});
	}

	CountAllCommits(obj, callback) {
		let fetched = 0;
		let count = 0;
		obj.data.forks.forEach((fork, i, forks) => {
			this.callCallback(fork.urls.contributors, (gitData) => {
				fetched++;
				if (gitData.length > 0) {
					const ownerContributions = gitData.filter((data) => {
						return data.login === fork.owner.name;
					});
					count += ownerContributions[0].contributions;
					if (fetched === forks.length) {
						callback(count);
					}
				}
			});
		});
	}
}

module.exports = GitAPI;

