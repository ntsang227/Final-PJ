const express = require('express');
const bodyParser = require('body-parser');
const session = require('express-session');
const app = express();
require('./db/mongodb/database.js');
//const admins = require('./db/models/admins.js');
// sử dụng EJS làm view engine
app.set('view engine', 'ejs');

// middleware
app.use(bodyParser.urlencoded({ extended: true }));

app.use(session({
  secret: 'secret_key',
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false }
}));

// định nghĩa route
app.get('/admin', function(req, res) {
  res.render('Admin/login.ejs', { message: '' });
});

const admins = require('./routes/admins.js');

app.use('/', admins);

module.exports = app;