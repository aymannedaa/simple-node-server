const express = require('express');

const router = express.Router();

/* GET home page. */
router.get('/', (req, res) => {
  res.render('index', { title: 'Demo server' });
});

router.get('/demo', (req, res) => {
  res.send("I'm alive!");
});

module.exports = router;
