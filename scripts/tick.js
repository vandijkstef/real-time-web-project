const RepoStore = require('./RepoStore.js');

// Server tick - Try to revalidate data before a user accesses them.
function Tick() {
	const tickMeta = {
		id: Date.now(),
		events: []
	};
	console.log('Tick: ' + Date.now());
	const repoStore = new RepoStore();
	repoStore.GetAll((dataRepos, status) => {
		tickMeta.events.push('Fetched Organisation Repos...: ' + status);
		console.log('Tick', tickMeta);
		// const ForkStore = new Fork
	});
}

// Fire the Tick on startup
Tick();

// Repeat the Tick at a set interval
if (process.env.EXECUTE_TICK === true) {
	setInterval(() => {
		Tick();
	}, 60 * 1000);
}