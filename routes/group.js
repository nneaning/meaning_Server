const express = require('express');

const router = express.Router();
const groupController = require('../controller/groupController');
const isLoggedIn = require('../middlewares/authUtil');

// router.get('/', isLoggedIn.checkToken, groupController.getGroupList);

module.exports = router;
