require('isomorphic-unfetch');

const CronJob = require('cron').CronJob;
const fs = require('fs');

const set = require('lodash/set');
const get = require('lodash/get');

class GithubTree {
	constructor() {
		this.filename = 'github_tree.json'
		this.directory = appRoot + '/data';
	}

	exists() {
		return fs.existsSync(this.directory);
	}

	async sync() {
		console.log("this.directory: ", this.directory);
		let lessons;

		try {
			console.log("this.exists(): ", this.exists());
			
			// Prepare directory first
			if (!this.exists()) {
				fs.mkdirSync(this.directory);
				console.log("Made directory. Exists: ", this.exists())
			}
		} catch (e) {
			console.error('[CRON] GITHUB_TREE: Prepare directory exception: ', e);
			return;
		}

		try {
			const repoReq = await fetch(`https://api.github.com/repos/klaidliadon/umbrella-content/branches/master`);
			const repo = await repoReq.json();

			const masterTreeReq = await fetch(`https://api.github.com/repos/klaidliadon/umbrella-content/git/trees/${repo.commit.sha}?recursive=1`);
			lessons = await masterTreeReq.json();
		} catch (e) {
			console.error('[CRON] GITHUB_TREE: Content fetch exception: ', e);
			return;
		}

		try {
			lessons = lessons.tree.reduce((lessonsSet, node) => {
				// if the node is a directory
				if (node.type === "tree") {
					// get the path string in dot notation
					const pathDotNotation = node.path.replace(/\//g, ".");
					// preset path with content array
					set(lessonsSet, pathDotNotation, get(lessonsSet, pathDotNotation, {content: []}));
				} 
				// otherwise if the node is a file
				else if (node.type === "blob") {
					// get the path string without filname in dot notation
					const nodePaths = node.path.split("/");
					const pathDotNotation = nodePaths.slice(0, -1).join(".");
					const filename = nodePaths.slice(-1)[0];
					// get the original object, default {content: []}
					let obj = get(lessonsSet, pathDotNotation);
					// add file sha
					obj.content.push({filename, sha: node.sha, url: node.url});
					// overwrite the object
					set(lessonsSet, pathDotNotation, obj);
				}

				else console.error(`[CRON] GITHUB_TREE: Content type ${node.type} is neither tree nor blob.`);

				return lessonsSet;
			}, {});

			console.log('[CRON] GITHUB_TREE: Prepared lessons.');
		} catch (e) {
			console.error('[CRON] GITHUB_TREE: Create lesson JSON exception: ', e);
			return;
		}

		if (!lessons) {
			console.error('[CRON] GITHUB_TREE: Failed to create lessons object.');
			return;
		}

		try {
			fs.writeFileSync(`${this.directory}/${this.filename}`, JSON.stringify(lessons, null, 2), {flag: 'w'});
			console.log('[CRON] GITHUB_TREE: Lessons JSON written to system.');
		} catch (e) {
			console.error('[CRON] GITHUB_TREE: Write file exception: ', e);
		}
	}

	start() {
		// First prepare
		this.sync();

		// Every hour = 0 0 0/1 1/1 * * *
		const job = new CronJob('0 0 0/1 1/1 * * *', () => {
			console.log('[CRON] GITHUB_TREE: Starting job at', new Date());
			this.sync();
		});

		job.start();

		console.log('[CRON] Initialized GitHub tree job');

		return job;

	}
}

module.exports = new GithubTree();