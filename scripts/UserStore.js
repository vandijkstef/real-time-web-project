const MongoStore = require('./MongoStore.js');

class UserStore extends MongoStore {
	constructor() {
		super('users');
	}

	Test(gitUser, callback) {
		super.GetAll({_id: gitUser.id}, (data) => {
			if (data.length === 1) {
				callback(true);
			} else {
				callback(false);
			}
		});
	}

	// Test if user exsists, store if not
	TestAndStore(gitOwner, callback) {
		super.GetAll({_id: gitOwner.id}, (data) => {
			if (data.length === 1) {
				callback(data[0]);
			} else {
				this.Store(gitOwner, () => {
					super.GetAll({_id: gitOwner.id}, (data) => {
						callback(data[0]);
					});
				});
			}
		});
	}

	// Actually stores the user
	Store(gitOwner, callback) {
		const data = {
			_id: gitOwner.id,
			niceName: gitOwner.name,
			systemName: gitOwner.login,
			avatar: gitOwner.avatar_url,
			type: gitOwner.type,
			urls: {
				html: gitOwner.html_url,
				userInfo: gitOwner.url
			}
		};
		if (gitOwner.token) {
			data.token = gitOwner.token;
		}
		this.Expand(data, (data) => {
			super.PutUpdate(data, () => {
				callback(data);
			});
		});
	}

	Expand(data, callback) {
		// TODO: Fetch additional urls.userInfo (name, email, location etc.)
		callback(data);
	}
}

module.exports = UserStore;