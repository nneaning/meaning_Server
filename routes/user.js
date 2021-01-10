/* eslint-disable import/no-unresolved */
const express = require('express');

const router = express.Router();
const userController = require('../controller/userController');
const isLoggedIn = require('../middlewares/authUtil');

router.post('/signup', userController.signup);
router.post('/signin', userController.signin);
router.put('/refreshtoken', isLoggedIn.reIssue);

router.put('/onboard', isLoggedIn.checkToken, userController.updateOnboard);

router.get('/daypromise', isLoggedIn.checkToken, userController.getDailyMaxim);
router.post('/daypromise', userController.createDailyMaxim);

router.get('/mypage', isLoggedIn.checkToken, userController.getMyPage);

module.exports = router;
