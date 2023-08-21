
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const http = require('http');
const fs = require('fs');
const path = require('path');
const methodOverride = require('method-override');
const socketio = require('socket.io');


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


// Đối tượng cấu hình session thứ nhất
const sessionConfig1 = {
  secret: 'secret_key_1',
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false }
};

// Đối tượng cấu hình session thứ hai
const sessionConfig2 = {
  secret: 'secret_key_2',
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false }
};

// Middleware sử dụng đối tượng cấu hình session thứ nhất
app.use(session(sessionConfig1));

// Middleware sử dụng đối tượng cấu hình session thứ hai
app.use(session(sessionConfig2));


// định nghĩa route
const admins = require('./drivers/routes/Admin/admins.js');
const news = require('./drivers/routes/Admin/news.js');
const course = require('./drivers/routes/Admin/course.js');
const tutorAdmin = require('./drivers/routes/Admin/tutor.js');
const student = require('./drivers/routes/Admin/student.js');
const payment = require('./drivers/routes/Admin/payment.js');
const payments = require('./drivers/routes/payment.js');

const tutor = require('./drivers/routes/tutor.js');

const index = require('./drivers/routes/index.js');

app.use('/',index);

app.use('/admin', [ admins, course, news , tutorAdmin, student, payment ]);

app.use('/tutor', [ tutor , payments ]);


module.exports = app;