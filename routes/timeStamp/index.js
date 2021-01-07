const express = require('express');

const authUtil = require('../../middlewares/authUtil');

const timeStampController = require('../../controller/timeStampController');

const upload = require('../../modules/multer');

const router = express.Router();

router.post('/', authUtil.checkToken, upload.single('image'), timeStampController.createTimeStamp); // create timeStamp controller function required

module.exports = router;
