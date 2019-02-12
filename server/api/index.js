const express = require('express')
const router = express.Router()
const cors = require("cors")
const apicache = require("apicache")

const github = require('./github')
const feeds = require('./feeds')

const whitelist = [process.env.ROOT]

const corsOptions = {
  optionsSuccessStatus: 200, // some legacy browsers (IE11, various SmartTVs) choke on 204
  origin: (origin, callback) => {
    if (whitelist.indexOf(origin) !== -1 || !origin) callback(null, true)
    else callback(new Error('Not allowed by CORS'))
  }
}

router.use(cors(corsOptions))
router.use(apicache.middleware('60 minutes'))

router.use('/github', github)
router.use('/feeds', feeds)

module.exports = router