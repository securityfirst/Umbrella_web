const CronJob = require('cron').CronJob;
const fs = require('fs');
const git = require('simple-git');
const contentDir = appRoot + '/static/assets/content';

class Cron {
	constructor() {
		this.jobsRunning = new Map();
	}

	run() {
		this.initGithubContent();
	}

	stop() {
		this.jobsRunning.forEach(job => job.stop());
		this.jobsRunning.clear();
	}

	initGithubContent() {
		// Every hour = 0 0 0/1 1/1 * * *
		const job = new CronJob('*/5 * * * *', async function() {
			const d = new Date();
			console.log('[CRON] GITHUB_CONTENT: Starting job at', d);

			if (fs.existsSync(contentDir)) {
				console.log('[CRON] GITHUB_CONTENT: Pulling from master...');
				git(contentDir).pull('origin', 'master', null, () => console.log('[CRON] GITHUB_CONTENT: Updated.'));
			} else {
				console.log('[CRON] GITHUB_CONTENT: Cloning content repository...');
				git(appRoot).clone('https://github.com/klaidliadon/umbrella-content.git', contentDir, () => console.log('[CRON] GITHUB_CONTENT: Finished.'));
			}
		});

		job.start();
		this.jobsRunning.set('github_content', job);

		console.log('[CRON] Initialized GitHub content job');
	}
}

module.exports = new Cron();