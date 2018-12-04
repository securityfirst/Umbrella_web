const express = require('express');
const router = express.Router();

router.use('/', (req, res, next) => {
    next();
});

module.exports = router;