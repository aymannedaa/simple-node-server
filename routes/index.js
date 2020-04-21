const express = require('express');

const router = express.Router();

const number = Math.ceil(Math.random() * 100000);

/* GET home page. */
router.get('/', (req, res) => {
  res.render('index', { title: `Demo server version ${process.env.npm_package_version}`, random: number });
});

router.get('/demo', (req, res) => {
  res.send("I'm alive!");
});

module.exports = router;
