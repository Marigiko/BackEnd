const express = require('express');
const session = require('express-session');
const logger = require('morgan');
const passport = require('passport');
const bodyParser = require('body-parser');
const db = require('./models');
const routes = require('./routes');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 8000;

//Serve static files from the React app build directory
app.use(express.static(path.join(__dirname,'client/build')));

// Express boilerplate middleware
app.use(logger('dev'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Express session middleware
app.use(session({ secret: 'keyboard cat', resave: true, saveUninitialized: true }));
app.use(passport.initialize());
app.use(passport.session());

// Routing
app.use('/api', routes);

// Sync sequelize models then start Express app
db.sequelize.sync({ force: false })
  .then(() => {
    console.log(`${process.env.DB_NAME} database connected`);
  })
  .then(() => {
    app.listen(PORT, () => {
      console.log(`App listening on PORT ${PORT}`);
    });
  });
