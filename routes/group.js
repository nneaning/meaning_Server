const express = require('express');

const router = express.Router();
const groupController = require('../controller/groupController');
const isLoggedIn = require('../middlewares/authUtil');

router.post('/', isLoggedIn.checkToken, groupController.createGroup);
router.post('/join', isLoggedIn.checkToken, groupController.joinGroup);

module.exports = router;
