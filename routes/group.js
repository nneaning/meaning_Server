const express = require('express');

const router = express.Router();
const groupController = require('../controller/groupController');
const isLoggedIn = require('../middlewares/authUtil');
const upload = require('../modules/multer');

router.post('/', isLoggedIn.checkToken, groupController.createGroup);
router.post('/upload', upload.single('image'), groupController.createGroupImage);
router.post('/join', isLoggedIn.checkToken, groupController.joinGroup);

module.exports = router;
