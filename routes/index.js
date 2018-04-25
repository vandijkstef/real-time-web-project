const express = require('express');
const router = express.Router();

router.get('/', function(req, res) {
	res.render('index', { title: 'Home' });
});

router.get('/session', function(req, res) {
	if (req.session.user) {
		const user = req.session.user;
		const publicUser = {
			id: user._id,
			displayName: user.niceName || user.systemName,
			systemName: user.systemName,
			niceName: user.niceName,
			avatar: user.avatar,
			urls: user.urls,
		};
		res.send(JSON.stringify(publicUser));
	} else {
		const data = {
			error: 'Not logged in'
		};
		res.send(data);
	}
});

module.exports = router;
