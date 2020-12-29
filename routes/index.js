const express = require('express');

const router = express.Router();

router.use('/user', require('./users'));
router.use('/auth', require('./auth'));

/* GET home page. */
router.get('/', (req, res) => {
  res.render('index', { title: 'Express' });
});

module.exports = router;
