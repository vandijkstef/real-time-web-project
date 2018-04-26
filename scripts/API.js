const request = require('request');

// Base API class
class API {
	constructor(server) {
		this.server = server;
	}

	callCallback(url, callback) {
		url = url.replace(this.server, ''); // Should we somehow ask a complete url, strip it
		// console.log(this.server + url + '?' + (this.auth + '&' || '') + 'per_page=99');
		request({
			url: this.server + url + '?' + (this.auth + '&' || '') + 'per_page=99',
			headers: {
				'User-Agent': 'NODEJS'
			}
		}, function (error, response, body) {
			let data;
			try {
				data = JSON.parse(body);
				callback(data);
			} catch(err) {
				callback({
					message: 'Could not parse received data',
					data: data,
					body: body
				});
			}
		});
	}
}

module.exports = API;