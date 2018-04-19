const express = require('express');
const router = express.Router();

router.get('/', function(req, res) {
	res.render('class', { title: 'Class' });
});

module.exports = router;
