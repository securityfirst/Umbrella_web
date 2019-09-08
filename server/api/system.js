const express = require('express')
const router = express.Router()
// const apicache = require('apicache')
const fs = require('fs')

// router.use(apicache.middleware('60 minutes'))

router.get('/locale', (req, res) => {
	try {
		const file = fs.readFileSync(appRoot + '/static/assets/locale/system-locale.json')
		const json = JSON.parse(file)

		return res.status(200).send(JSON.stringify(json))
	} catch (err) {
		console.error('[API] /system/locale - File retrieval error: ', err)
		res.statusMessage = 'Failed to retrieve content'
		return res.status(500).end()
	}
})

module.exports = router