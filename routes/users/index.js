const express = require('express');

const router = express.Router();
const userController = require('../../controller/userController');
const isLoggedIn = require('../../middlewares/authUtil');

router.post('/signup', userController.signup);
router.post('/signin', userController.signin);
router.put('/refreshtoken', isLoggedIn.reIssue);

router.get('/mypage', isLoggedIn.checkToken, userController.getMyPage);

module.exports = router;
