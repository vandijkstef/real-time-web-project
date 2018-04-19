const express = require('express');
const router = express.Router();
const RepoStore = require('../scripts/RepoStore.js');

router.get('/', (req, res) => {
	const repoStore = new RepoStore();
	repoStore.GetAll((dataRepos) => {
		// console.log(data); // This should always be the repo's. Like... always, else we killed the app
		console.log(dataRepos);
		res.render('repos', { title: 'Repos', repos: dataRepos });
	});
});

router.get('/:id', (req, res) => {
	const repoStore = new RepoStore();
	repoStore.Get(req.params.id, (dataRepo) => {
		console.log(dataRepo);
		res.render('repo', { title: dataRepo.name, repo: dataRepo });
	});
});

module.exports = router;
