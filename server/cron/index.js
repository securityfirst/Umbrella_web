const githubContentJob = require('./githubContent')

class Cron {
	constructor() {
		this.jobsRunning = new Map()
	}

	start() {
		this.jobsRunning.set('github_content', githubContentJob.start())
	}

	stop() {
		this.jobsRunning.forEach(job => job.stop())
		this.jobsRunning.clear()
	}
}

module.exports = new Cron()