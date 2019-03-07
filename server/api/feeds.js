require('isomorphic-unfetch')

const express = require('express')
const router = express.Router()
const isUrl = require('is-url')
const Parser = require('rss-parser')
let parser = new Parser()

router.post('/', (req, res) => {
	try {
		const { location, sources } = req.body

		if (
			!location || 
			!sources || 
			!(sources instanceof Array) ||
			!sources.length
		) {
			console.error('[API] /feeds: Request incomplete')
			res.statusMessage = 'Request incomplete'
			return res.status(400).end()
		}

		let data = []

		fetch(`${process.env.API_HOST}v3/feed?country=${location}&sources=0`)
			.then(resp => {
				if (!resp.ok) {
					console.error('[API] /feeds error: ', resp)
					res.statusMessage = 'Failed to retrieve feeds'
					return res.status(500).end()
				}

				return resp.json()
			})
			.then(data => res.status(200).send(data))
			.catch(err => {
				console.error('[API] /feeds error: ', err)
				res.statusMessage = 'Failed to retrieve feeds'
				return res.status(500).end()
			})
	} catch (e) {
		console.error('[API] /feeds exception: ', e)
		res.statusMessage = 'Failed to retrieve feeds'
		res.status(500).end()
	}
})

router.post('/rss', async (req, res) => {
	try {
		const { sources } = req.body

		if (
			!sources || 
			!(sources instanceof Array) ||
			!sources.length
		) {
			console.error('[API] /feeds/rss: Request incomplete')
			res.statusMessage = 'Request incomplete'
			return res.status(400).end()
		}

		let data = []

		for (let i = 0; i < sources.length; i++) {
			try {
				const rss = await parser.parseURL(sources[i])
				data.push(rss)
			} catch (e) {
				console.error('[API] /feeds/rss parser exception: ', e)
			}

			if (i === sources.length - 1) {
				res.status(200).send(data)
			}
		}
	} catch (e) {
		console.error('[API] /feeds/rss exception: ', e)
		res.statusMessage = 'Failed to retrieve RSS feeds'
		res.status(500).end()
	}
})

router.post('/rss/add', async (req, res) => {
	try {
		const { source } = req.body

		if (!source || !isUrl(source)) {
			console.error('[API] /feeds/rss/add: Request incomplete')
			res.statusMessage = 'Request incomplete'
			return res.status(400).end()
		}

		const rss = await parser.parseURL(source)

		console.log("rss: ", rss);
		if (!rss) {
			console.error('[API] /feeds/rss/add: RSS source is not valid')
			res.statusMessage = 'RSS source is not valid'
			return res.status(500).end()
		}

		return res.status(200).send(rss)

	} catch (e) {
		console.error('[API] /feeds/rss/add exception: ', e)
		res.statusMessage = 'Failed to add RSS source'
		res.status(500).end()
	}
})

module.exports = router