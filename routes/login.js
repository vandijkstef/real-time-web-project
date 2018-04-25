const express = require('express');
const router = express.Router();
const request = require('request');
const UserStore = require('../scripts/UserStore.js');

router.get('/', (req, res) => {
	res.redirect('https://github.com/login/oauth/authorize?client_id=' + process.env.GITOAUTHCLIENT + '&allow_signup=false');
});

router.get('/logout', (req, res) => {
	req.session.destroy(function(err) {
		if (err) throw err;
		res.redirect('/');
	});
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
			userStore.Test(user, (exsisting) => {
				if (exsisting) {
					user.token = token.access_token;
					userStore.Store(user, (userData) => {
						req.session.user = userData;
						res.locals.user = req.session.user; // This will be handled by middleware in the following requests, so this is probably useless since I redirect now
						res.redirect('/profile');
					});
				} else {
					// Who dis?!
					req.session.user = null;
					res.render('login', { title: 'Niet ingelogd', clientID: process.env.GITOAUTHCLIENT, error: 'Heb je al geforkt en gecommit in deze organisatie?'});
				}
			});
		});
	});
});

module.exports = router;