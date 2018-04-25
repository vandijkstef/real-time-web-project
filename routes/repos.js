const express = require('express');
const router = express.Router();
const RepoStore = require('../scripts/RepoStore.js');
const ForkStore = require('../scripts/ForkStore.js');
const subjects = require('../subjects.json');
const async = require('async');

router.get('/', (req, res) => {
	// class details
	const data = {};
	if (req.session.user) {
		data.title = 'Classes';

	} else {
		data.title = 'Archive';
	}
	data.classes = subjects;
	res.render('repos', data);
});

// Detail/class page - show all repos and forks - class details for users
router.get('/:class', (req, res) => {
	const data = {};
	data.title = 'Class';
	const subject = subjects.find((subject) => {return subject.id === req.params.class;});

	if (!subject) {
		res.redirect('/repo');
	} else {
		data.subject = subject;
		const repoStore = new RepoStore();

		// GetAll gets all Repos, we actually just need the repo's attached to this class
		// On the other hand, this just fetches all from DB, but makes sure they are there as well with a single API call.
		// Otherwise I'd have to pull specific repo's which might not even be stored yet
		repoStore.GetAll((dataRepos) => {
			const classRepos = dataRepos.filter((dataRepo) => {
				let gotOne = false;
				subject.repos.forEach((subjectRepo) => {
					if (dataRepo.name === subjectRepo) {
						gotOne = true;
					}
				});
				return gotOne;
			});
			// console.log(classRepos);
			// Show forks
			const forkStore = new ForkStore();
			async.forEach(classRepos, (classRepo, callback) => {
				console.log(classRepo);
				forkStore.GetAll(classRepo, (dataForks, status) => {
					console.log(status);
					callback();
					// res.render('repo', {
					// 	title: dataRepo.name,
					// 	repo: dataRepo,
					// 	forks: dataForks
					// });
				});
				// this.Store(dataRepo, classRepo, () => {
				// });
			}, () => {
				res.render('class', data);
				// super.GetAll({parent: dataRepo.id}, (dataForks) => {
				// 	callback(dataForks, 'new');
				// });
			});


			// const repoData = [];
			// subjects.forEach((subject) => {
			// 	const subjectData = {};
			// 	subjectData.id = subject.id;
			// 	subjectData.label = subject.label;
			// 	subjectData.repos = [];
			// 	repoData.push(subjectData);
			// });
		});


		
	}
	
});

// Repo specific page, not sure what I wanna show here..
router.get('/:class/:repo', (req, res) => {
	const repoStore = new RepoStore();
	repoStore.Get(req.params.repo, (dataRepo) => {
		// console.log(dataRepo);
		const forkStore = new ForkStore();
		forkStore.GetAll(dataRepo, (dataForks) => {
			// console.log(dataForks);
			res.render('repo', {
				title: dataRepo.name,
				repo: dataRepo,
				forks: dataForks
			});
		});
	});
});

// Fork specific page, also not sure what I wanna show here..
router.get('/:class/:repo/:fork', (req, res) => {
	res.render('repo', {title: 'repo', repo: {name: 'test'}});
});

module.exports = router;
