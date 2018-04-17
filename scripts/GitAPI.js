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
		this.callCallback(forks_url, (data) => {
			const forks = [];
			data.forEach((fork) => {
				const newFork = {
					owner: {
						name: fork.owner.login,
						avatar: fork.owner.avatar_url,
						profile: fork.owner.html_url,
					},
					urls: {
						contributors: fork.contributors_url,
						github: fork.html_url
					}
				};
				forks.push(newFork);
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

