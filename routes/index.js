const express = require('express');

const router = express.Router();

/* GET home page. */
router.get('/', (req, res) => {
  res.render('index', { title: `Demo server version ${process.env.npm_package_version}` });
});

router.get('/demo', (req, res) => {
  res.send("I'm alive!");
});

module.exports = router;
