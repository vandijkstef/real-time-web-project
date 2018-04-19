const express = require('express');
const router = express.Router();
const RepoStore = require('../scripts/RepoStore.js');
const ForkStore = require('../scripts/ForkStore.js');
const subjects = require('../subjects.json');

router.get('/', (req, res) => {
	const repoStore = new RepoStore();
	repoStore.GetAll((dataRepos) => {
		const data = [];
		subjects.forEach((subject) => {
			const subjectData = {};
			subjectData.id = subject.id;
			subjectData.repos = [];
			dataRepos.forEach((dataRepo) => {
				if (subject.repos.includes(dataRepo.name)) {
					subjectData.repos.push(dataRepo);
				}
			});
			data.push(subjectData);
		});
		res.render('repos', { title: 'Repos', repos: data });
	});
});

router.get('/:id', (req, res) => {
	const repoStore = new RepoStore();
	repoStore.Get(req.params.id, (dataRepo) => {
		// console.log(dataRepo);
		const forkStore = new ForkStore();
		forkStore.GetAll(dataRepo, (dataForks) => {
			console.log(dataForks);
			res.render('repo', { title: dataRepo.name, repo: dataRepo, forks: dataForks });
		});
	});
});

module.exports = router;
