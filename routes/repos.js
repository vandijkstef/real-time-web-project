const express = require('express');
const router = express.Router();
// const GitAPI = require('../scripts/GitAPI.js');
const RepoStore = require('../scripts/RepoStore.js');

router.get('/', function(req, res) {
	// First, require an extended Mongo class, let that choose to (re)fetch data or not...
	// So, prefered syntax;
	const repoStore = new RepoStore();
	repoStore.GetAll((data) => {
		// console.log(data); // This should always be the repo's. Like... always
		res.render('index', { title: 'Repos' });
	});

});

module.exports = router;
