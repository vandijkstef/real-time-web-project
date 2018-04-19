const express = require('express');
const router = express.Router();
const request = require('request');
const UserStore = require('../scripts/UserStore.js');

router.get('/', (req, res) => {
	res.redirect('https://github.com/login/oauth/authorize?client_id=' + process.env.GITOAUTHCLIENT + '&allow_signup=false')
	// res.render('login', { title: 'Login', clientID: process.env.GITOAUTHCLIENT});
});

// TODO: improve error handling
// Github enters here with a code
router.get('/oauth', (req, res) => {
	// We pass that code back along with our secret token.
	const authRequest = {
		uri: 'https://github.com/login/oauth/access_token',
		body: JSON.stringify({
			client_id: process.env.GITOAUTHCLIENT,
			client_secret: process.env.GITOAUTHSECRET,
			code: req.query.code
		}),
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
			'Accept': 'application/json'
		}
	};
	request(authRequest, (err, authData) => {
		if (err) throw err;
		const token = JSON.parse(authData.body);
		if (token.error) {
			// throw token.error;
		}
		const authRequest = {
			uri: 'https://api.github.com/user?access_token=' + token.access_token,
			method: 'GET',
			headers: {
				'Accept': 'application/json',
				'User-Agent': 'NodeJS'
			}
		};
		request(authRequest, (err, userData) => {
			const userStore = new UserStore();
			const user = JSON.parse(userData.body);
			// We possibly want to improve the datamodel with all the info we got here. TODO: Create userStore.update();
			console.log(user);
			userStore.Test(user, (exsisting) => {
				console.log('is there', exsisting);
				if (exsisting) {
					req.session.user = user;
					// Github user is a known user to the minor
					// TODO: Store token.access_token
					// TODO: Setup session?

					res.render('login', { title: 'Logged in', clientID: process.env.GITOAUTHCLIENT});
				} else {
					// Who dis?!
					res.render('login', { title: 'NOT Logged in', clientID: process.env.GITOAUTHCLIENT});
				}
			});
		});
	});
});



module.exports = router;
