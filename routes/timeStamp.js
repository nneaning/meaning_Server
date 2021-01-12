const express = require('express');

const router = express.Router();
const timeStampController = require('../controller/timeStampController');
const isLoggedIn = require('../middlewares/authUtil');
const upload = require('../modules/multer');

router.post('/', isLoggedIn.checkToken, upload.single('image'), timeStampController.createTimeStamp);
router.get('/calendar', isLoggedIn.checkToken, timeStampController.getCalendar);

module.exports = router;
