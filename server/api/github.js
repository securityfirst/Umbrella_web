require('isomorphic-unfetch')

const express = require('express')
const router = express.Router()
const apicache = require('apicache')
const fs = require('fs')

const set = require('lodash.set')
const get = require('lodash.get')

// router.use(apicache.middleware('60 minutes'))

router.get('/tree', async (req, res) => {
	let lessons

	try {
		const repoReq = await fetch(
			`https://api.github.com/repos/${process.env.GITHUB_CONTENT_REPO}/branches/master`, 
			{
				method: 'GET',
				headers: {
					'Authorization': `token ${process.env.GITHUB_ACCESS_TOKEN}`
				}
			}
		)

		const repo = await repoReq.json()

		const masterTreeReq = await fetch(
			`https://api.github.com/repos/${process.env.GITHUB_CONTENT_REPO}/git/trees/${repo.commit.sha}?recursive=1`,
			{
				method: 'GET',
				headers: {
					'Authorization': `token ${process.env.GITHUB_ACCESS_TOKEN}`
				}
			}
		)

		lessons = await masterTreeReq.json()
	} catch (err) {
		console.error('[API] /github/tree - Tree fetch error: ', err)
		res.statusMessage = 'Failed to retrieve GitHub repository'
		return res.status(500).end()
	}

	try {
		lessons = lessons.tree.reduce((lessonsSet, node) => {
			// if the node is a directory
			if (node.type === 'tree') {
				// get the path string in dot notation
				const pathDotNotation = node.path.replace(/\//g, '.')
				// preset path with content array
				set(lessonsSet, pathDotNotation, get(lessonsSet, pathDotNotation, {content: []}))
			} 
			// otherwise if the node is a file
			else if (node.type === 'blob') {
				// get the path string without filname in dot notation
				const nodePaths = node.path.split('/')
				const pathDotNotation = nodePaths.slice(0, -1).join('.')
				const filename = nodePaths.slice(-1)[0]
				// get the original object, default {content: []}
				let obj = get(lessonsSet, pathDotNotation)
				// add file sha
				obj.content.push({filename, sha: node.sha, url: node.url})
				// overwrite the object
				set(lessonsSet, pathDotNotation, obj)
			}

			else console.error(`[API] /github/tree - Content type ${node.type} is neither tree nor blob.`)

			return lessonsSet
		}, {})
	} catch (e) {
		console.error('[API] /github/tree - Create lesson JSON exception: ', e)
		res.statusMessage = 'Failed to retrieve GitHub repository'
		return res.status(500).end()
	}

	if (!lessons) {
		console.error('[API] /github/tree - Failed to create lessons object.')
		res.statusMessage = 'Failed to retrieve GitHub repository'
		return res.status(500).end()
	}

	return res.status(200).send(lessons)
})

router.get('/content/:sha', async (req, res) => {
	let content

	try {
		const contentReq = await fetch(
			`https://api.github.com/repos/${process.env.GITHUB_CONTENT_REPO}/git/blobs/${req.params.sha}`,
			{
				method: 'GET',
				headers: {
					'Authorization': `token ${process.env.GITHUB_ACCESS_TOKEN}`
				}
			}
		)
		
		content = await contentReq.json()
	} catch (err) {
		console.error('[API] /github/content/:sha - Content fetch error: ', err)
		res.statusMessage = 'Failed to retrieve content'
		return res.status(500).end()
	}

	if (!content) {
		console.error('[API] /github/content/:sha - Failed to create content object.')
		res.statusMessage = 'Failed to retrieve content'
		return res.status(500).end()
	}

	return res.status(200).send(content.content)
})

router.get('/locale', (req, res) => {
	try {
		const file = fs.readFileSync(appRoot + '/static/assets/locale/github-locale.json')
		const json = JSON.parse(file)

		return res.status(200).send(JSON.stringify(json))
	} catch (err) {
		console.error('[API] /github/locale - File retrieval error: ', err)
		res.statusMessage = 'Failed to retrieve content'
		return res.status(500).end()
	}
})

module.exports = router