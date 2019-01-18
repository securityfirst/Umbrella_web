const githubContentJob = require('./githubContent');
const githubTreeJob = require('./githubTree');

class Cron {
	constructor() {
		this.jobsRunning = new Map();
	}

	start() {
		this.jobsRunning.set('github_content', githubContentJob.start());
		this.jobsRunning.set('github_true', githubTreeJob.start());
	}

	stop() {
		this.jobsRunning.forEach(job => job.stop());
		this.jobsRunning.clear();
	}
}

module.exports = new Cron();