require('isomorphic-unfetch')

const express = require('express')
const router = express.Router()
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
			console.error('Request incomplete');
			res.statusMessage = 'Request incomplete'
			return res.status(400).end()
		}

		let data = []

		fetch(`${process.env.API_HOST}v3/feed?country=${location}&sources=0`)
			.then(res => {
				if (!res.ok) {
					console.error("[API] /feeds error: ", res)
					res.statusMessage = 'Failed to retrieve feeds'
					return res.status(500).end()
				}

				return res.json()
			})
			.then(data => res.status(200).send(data))
			.catch(err => {
				console.error("[API] /feeds error: ", err)
				res.statusMessage = 'Failed to retrieve feeds'
				return res.status(500).end()
			})
	} catch (e) {
		console.error("[API] /feeds exception: ", e)
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
			console.error('Request incomplete');
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
		console.error("[API] /feeds/rss exception: ", e)
		res.statusMessage = 'Failed to retrieve RSS feeds'
		res.status(500).end()
	}
})

module.exports = router