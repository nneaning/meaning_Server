const express = require('express');

const authUtil = require('../../middlewares/authUtil');

const timeStampController = require('../../controller/timeStampController');

const router = express.Router();

router.post('/', authUtil.checkToken, timeStampController.createTimeStamp); // create timeStamp controller function required

module.exports = router;
