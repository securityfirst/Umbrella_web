const express = require('express');
const router = express.Router();

const set = require('lodash/set');
const get = require('lodash/get');

router.get('/tree', async (req, res) => {
	let lessons;

	try {
		const repoReq = await fetch(`https://api.github.com/repos/klaidliadon/umbrella-content/branches/master?access_token=${process.env.GITHUB_ACCESS_TOKEN}`);
		const repo = await repoReq.json();

		const masterTreeReq = await fetch(`https://api.github.com/repos/klaidliadon/umbrella-content/git/trees/${repo.commit.sha}?recursive=1&access_token=${process.env.GITHUB_ACCESS_TOKEN}`);
		lessons = await masterTreeReq.json();
	} catch (err) {
		console.error('[API] /github/tree - Tree fetch error: ', err);
		return res.status(500).send('Failed to retrieve lessons.');
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

			else console.error(`[API] /github/tree - Content type ${node.type} is neither tree nor blob.`);

			return lessonsSet;
		}, {});

		console.log('[API] /github/tree - Prepared lessons.');
	} catch (e) {
		console.error('[API] /github/tree - Create lesson JSON exception: ', e);
		return res.status(500).send('Failed to retrieve lessons.');
	}

	if (!lessons) {
		console.error('[API] /github/tree - Failed to create lessons object.');
		return res.status(500).send('Failed to retrieve lessons.');
	}

	console.log("lessons: ", lessons);

	return res.status(200).send(lessons);
});

router.get('/content/:sha', async (req, res) => {
	let content;

	try {
		const contentReq = await fetch(`https://api.github.com/repos/klaidliadon/umbrella-content/git/blobs/${req.params.sha}?access_token=${process.env.GITHUB_ACCESS_TOKEN}`);
		content = await contentReq.json();
	} catch (err) {
		console.error('[API] /github/content/:sha - Content fetch error: ', err)
		return res.status(500).send('Failed to retrieve content.');
	}

	if (!content) {
		console.error('[API] /github/content/:sha - Failed to create content object.');
		return res.status(500).send('Failed to retrieve content.');
	}

	return res.status(200).send(content.content);
})

module.exports = router;