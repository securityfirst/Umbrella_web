require('isomorphic-unfetch')

const express = require('express')
const router = express.Router()
const Parser = require('rss-parser')
let parser = new Parser()

router.post('/rss', (req, res) => {
	try {
		let { sources } = req.body

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

		// TODO: Async/await not working with parser.parseURL
		sources.forEach(async (source, i) => {
			try {
				const rss = await parser.parseURL(source)
				data.push(rss)
			} catch (e) {
				console.error('[API] /feeds/rss parser exception: ', e)
			}

			if (i === sources.length - 1) {
				res.status(200).send(data)
			}
		})
	} catch (e) {
		console.error("[API] /feeds/rss exception: ", e)
		res.statusMessage = 'Failed to retrieve RSS feeds'
		res.status(500).end()
	}
})

module.exports = router