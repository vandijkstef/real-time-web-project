const request = require('request');

// Base API class
class API {
	constructor(server) {
		this.server = server;
	}

	callCallback(url, callback) {
		url = url.replace(this.server, ''); // Should we somehow ask a complete url, strip it
		request({
			url: this.server + url + (this.auth || ''),
			headers: {
				'User-Agent': 'NODEJS'
			}
		}, function (error, response, body) {
			try {
				const data = JSON.parse(body);
				callback(data);
			} catch(err) {
				callback({
					message: 'Could not parse received data'
				});
			}
		});
	}
}

module.exports = API;