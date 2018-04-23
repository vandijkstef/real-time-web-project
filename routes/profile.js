const express = require('express');
const router = express.Router();
const UserStore = require('../scripts/UserStore.js');

router.get('/', function(req, res) {
	if (!req.session.user) {
		res.redirect('/');
	} else {
		res.render('profile', { title: 'Profile', profile: req.session.user, yours: true });
	}
});

router.get('/:id', function(req, res) {
	if (!req.session.user) {
		res.redirect('/');
	} else {
		if (req.params.id == req.session.user._id) {
			res.redirect('/profile');
		}
		const userStore = new UserStore();
		userStore.Get(req.params.id, (profileUser) => {
			res.render('profile', { title: 'Profile', profile: profileUser });
		});
	}
});

module.exports = router;
