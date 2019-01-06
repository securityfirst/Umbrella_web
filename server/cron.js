const CronJob = require('cron').CronJob;
const fs = require('fs');
const git = require('simple-git');
const contentDir = appRoot + '/static/assets/content';

function initGithubContent() {
	const job = new CronJob('0 0 0/1 1/1 * * *', async function() {
		const d = new Date();
		console.log('[CRON] INITIALIZE_CONTENT: Starting job at', d);

		if (fs.existsSync(contentDir)) {
			console.log('[CRON] INITIALIZE_CONTENT: Pulling from master...');
			git(contentDir).pull('origin', 'master', null, () => console.log('[CRON] INITIALIZE_CONTENT: Updated.'));
		} else {
			console.log('[CRON] INITIALIZE_CONTENT: Cloning content repository...');
			git(appRoot).clone('https://github.com/klaidliadon/umbrella-content.git', contentDir, () => console.log('[CRON] INITIALIZE_CONTENT: Finished.'));
		}
	});

	job.start();

	console.log('[CRON] Initialized GitHub content job');
}

module.exports = function init() {
	initGithubContent();
}