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
		data.title = 'Klas';

	} else {
		data.title = 'Archief';
	}
	data.classes = subjects;
	res.render('repos', data);
});

// Detail/class page - show all repos and forks - class details for users
router.get('/:class', (req, res) => {
	const data = {};
	data.title = 'Klas';
	const subject = subjects.find((subject) => {return subject.id === req.params.class;});

	if (!subject) {
		res.redirect('/repo');
	} else {
		data.subject = subject;
		const repoStore = new RepoStore();

		repoStore.GetAll((dataRepos) => {
			// Filter the correct repos out of the set
			const classRepos = dataRepos.filter((dataRepo) => {
				let gotOne = false;
				subject.repos.forEach((subjectRepo) => {
					if (dataRepo.name === subjectRepo) {
						gotOne = true;
					}
				});
				return gotOne;
			});
			// Get forks on filtered repos
			const forkStore = new ForkStore();
			data.repoData = [];
			async.forEach(classRepos, (classRepo, callback) => {
				forkStore.GetAll(classRepo, (dataForks) => {
					// console.log(dataForks, status);
					const forkData = {
						repo: classRepo,
						forks: dataForks
					};
					data.repoData.push(forkData);
					callback();
				});
			}, () => {
				res.render('class', data);
			});
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
