const router = require('express').Router();
const db = require('../../models');
const passport = require('../../config/passport');
const authenticator = require('authenticator');

router.post('/login', passport.authenticate('local'), (req, res) => {
  console.log(req);
  res.json(req.user);
});

router.get('/logout', (req, res) => {
  req.logout();
  res.json('logout successful');
});

router.post('/singup', (req, res) => {
  db.User.create({
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    email: req.body.email,
    password: req.body.password,
  })
    .then((dbResponse) => {
      res.json(dbResponse);
    })
    .catch((err) => {
      res.json(err);
    });
});

router.get('/two_auth_qr', (req, res) => {
  let formattedKey = authenticator.generateKey();
  res.json({
    key: formattedKey,
  });
});

router.post('/two_auth_token', (req, res) => {
  let validatedToken = authenticator.verifyToken(req.body.key, req.body.token); 
  
  if(validatedToken.delta) {
    res.json({ validated: true });
  } else {
    res.json({ validated: false });
  }
});

router.get('/user_data', (req, res) => {
  if(!req.user) {
    res.json({});
  } else {
    res.json({
      email: req.user.email,
      id: req.user.id,
    });
  }
});

module.exports = router;
