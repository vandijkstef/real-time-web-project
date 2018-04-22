const express = require('express');
const router = express.Router();
const UserStore = require('../scripts/UserStore.js');

router.get('/', function(req, res) {
	if (!req.session.user) {
		res.redirect('/');
	} else {
		const userStore = new UserStore();
		userStore.GetAll({}, (users) => {
			console.log(users);
			res.render('profile', { title: 'Profile', profile: req.session.user, yours: true, users: users });
		});
	}
});

router.get('/:id', function(req, res) {
	if (!req.session.user) {
		res.redirect('/');
	} else {
		// TODO: Get user by their ID
		// TODO: Redirect users back to their own profile, if they try to look at their own profile
		const userStore = new UserStore();
		userStore.GetAll({}, (users) => {
			res.render('profile', { title: 'Profile', profile: req.session.user, users: users });
		});
	}
});

module.exports = router;
