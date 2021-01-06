const express = require('express');

const router = express.Router();

router.use('/user', require('./user'));
router.use('/group', require('./group'));

module.exports = router;
