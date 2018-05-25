const express = require('express');
const router = express.Router();
const UserStore = require('../scripts/UserStore.js');
const ChatStore = require('../scripts/ChatStore.js');
const ForkStore = require('../scripts/ForkStore.js');

router.get('/', function(req, res) {
	if (!req.session.user) {
		res.redirect('/');
	} else {
		// console.log(req.session.user._id);
		res.redirect(`/profile/${req.session.user._id}`);
		// res.render('profile', { title: 'Jouw profiel', profile: req.session.user, yours: true });
	}
});

router.get('/:id', function(req, res) {
	if (!req.session.user) {
		res.redirect('/');
	} else {
		const data = {};
		if (req.params.id == req.session.user._id) {
			// res.redirect('/profile');
			data.yours = true;
		}
		const userStore = new UserStore();
		userStore.Get(req.params.id, (profileUser) => {
			const chatStore = new ChatStore();
			chatStore.GetConversation(req.session.user._id, profileUser._id, (chatData) => {
				const forkStore = new ForkStore();
				forkStore.GetFromUser(profileUser._id, (dataForks) => {
					data.title = 'Profiel van ' + (profileUser.niceName || profileUser.systemName);
					data.profile = profileUser;
					data.chat = chatData;
					data.repoData = dataForks;
					console.log(dataForks);
					res.render('profile', data);
				})
			});
		});
	}
});

module.exports = router;
