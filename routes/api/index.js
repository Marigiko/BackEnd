const router = require('express').Router();
const isAuthenticated = require('../../config/middleware/isAuthenticated');

router.get('/secrets', isAuthenticated, (req, res) => {
  res.json('This is a secret');
});

module.exports = router;
