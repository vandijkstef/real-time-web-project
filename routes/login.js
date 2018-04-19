const express = require('express');
const router = express.Router();
const request = require('request');

router.get('/', (req, res) => {
	res.render('login', { title: 'Login', clientID: process.env.GITOAUTHCLIENT});
});

// TODO: improve error handling
// Github enters here with a code
router.get('/oauth', (req, res) => {
	console.log(req.query);
	// We pass that code back along with our secret token.
	const clientServerOptions = {
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
	request(clientServerOptions, (err, response) => {
		if (err) throw err;
		const token = response.body;
		if (token.error) {
			throw token.error;
		}
		// TODO: Store token.access_token
		res.render('login', { title: 'Logged in', clientID: process.env.GITOAUTHCLIENT});
	});
});



module.exports = router;
