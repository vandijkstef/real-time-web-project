const express = require('express');
const router = express.Router();
const UserStore = require('../scripts/UserStore.js');
const ChatStore = require('../scripts/ChatStore.js');

router.get('/', function(req, res) {
	if (!req.session.user) {
		res.redirect('/');
	} else {
		res.render('profile', { title: 'Jouw profiel', profile: req.session.user, yours: true });
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
			const chatStore = new ChatStore();
			chatStore.GetConversation(req.session.user._id, profileUser._id, (chatData) => {
				res.render('profile', { title: 'Profiel van ' + (profileUser.niceName || profileUser.systemName) , profile: profileUser, chat: chatData });
			});
		});
	}
});

module.exports = router;
