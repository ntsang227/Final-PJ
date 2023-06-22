
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const http = require('http');
const fs = require('fs');
const path = require('path');
const methodOverride = require('method-override');

const app = express();
app.use(bodyParser.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));

// Sử dụng middleware flash
//app.use(flash());

app.use(methodOverride('_method'));

app.set('view engine', 'ejs');

app.use(express.static(path.join(__dirname, 'public')));
// Kết nối đến database bằng cách import file database.js 
require('./db/mongodb/database.js');

// middleware
app.use(bodyParser.urlencoded({ extended: true }));

app.use(session({
  secret: 'secret_key',
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false }
}));

// định nghĩa route
const admins = require('./drivers/routes/Admin/admins.js');
const news = require('./drivers/routes/Admin/news.js');
const course = require('./drivers/routes/Admin/course.js');
const tutorAdmin = require('./drivers/routes/Admin/tutor.js');

const tutor = require('./drivers/routes/tutor.js');
//const user = require('./drivers/routes/users.js');

const index = require('./drivers/routes/index.js');

app.use('/',index);

app.use('/admin', [ admins, course, news , tutorAdmin ]);

app.use('/tutor',tutor);


module.exports = app;