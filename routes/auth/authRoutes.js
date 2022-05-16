const router = require('express').Router();
const db = require('../../models');
const passport = require('../../config/passport');
const authenticator = require('authenticator');
const nodemailer = require('nodemailer');
require('dotenv').config();

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

const sendEmail = (email, link, name) => {
  let transport = nodemailer.createTransport({
    service: "Gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    }
  });

  var mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: "Email confirmation",
    html: `${name}<br>To activate your account <a href="${link}">Click here</a>`
  }

  transport.sendMail(mailOptions, (error, response) => {
    if(error) {
      console.log(error);
    } else {
      console.log("Message sent");
    }
  });
}

var Rand,Host,link;

router.get('/send/:to/:name', (req, res) => {
  const { name } = req.params;
  const { to } = req.params;

  Rand = Math.floor((Math.random() * 100) + 54);
  console.log("HERE IS THE RAND",Rand);
  Host = req.get('Host');
  link = `http://${req.get('Host')}/verify/${Rand}`;

  sendEmail(to, link, name);
  res.json("Email sent");
})

router.get('/verify/:id',(req, res) => {
  const { id } = req.params;

  if(id == Rand) {
    console.log("email if verified"); 
    res.end(`<h1>Email is been Successfully verified<h1>`);
  } else {
    console.log("email is not verified");
    res.end("<h1>Bad Request</h1>");
    }
});

module.exports = router;
