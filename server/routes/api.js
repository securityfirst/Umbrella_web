const express = require('express');
const router = express.Router();

router.post('/auth', (req, res, next) => {
	next();
});

module.exports = router;