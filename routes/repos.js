const express = require('express');
const router = express.Router();
const RepoStore = require('../scripts/RepoStore.js');

router.get('/', function(req, res) {
	const repoStore = new RepoStore();
	repoStore.GetAll((dataRepos) => {
		// console.log(data); // This should always be the repo's. Like... always, else we killed the app
		res.render('index', { title: 'Repos', repos: dataRepos });
	});

});

module.exports = router;
