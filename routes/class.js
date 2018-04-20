const express = require('express');
const router = express.Router();

router.get('/', function(req, res) {
	if (!req.session.user) {
		res.redirect('/');
	} else {
		res.render('class', { title: 'Class' });
	}
});

module.exports = router;
