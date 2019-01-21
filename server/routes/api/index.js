const express = require('express');
const router = express.Router();

const github = require('./github')

router.use('/github', github);

module.exports = router;