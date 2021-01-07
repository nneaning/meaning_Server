const express = require('express');

const router = express.Router();

router.use('/user', require('./users'));
router.use('/group', require('./group'));

router.use('/timestamp', require('./timeStamp'));

module.exports = router;
