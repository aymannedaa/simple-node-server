var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Demo server' });
});

router.get('/demo', function(req, res, next) {
  res.send("I'm alive!");
});

module.exports = router;
