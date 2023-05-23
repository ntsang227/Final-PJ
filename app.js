
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const session = require('express-session');
const http = require('http');
const fs = require('fs');
const app = express();
const path = require('path');
const methodOverride = require('method-override');
const flash = require('connect-flash');

app.use(express.urlencoded({ extended: true }));

// Sử dụng middleware flash
app.use(flash());

app.use(methodOverride('_method'));

app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname, 'public')));
// Kết nối đến database bằng cách import file database.js 
require('./db/mongodb/database.js');
// Đọc nội dung file html
const homePage = fs.readFileSync('public/index.html');

// Trả về file html Home Page user
app.get('/', (req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/html' });
  res.write(homePage);
  res.end();
});
const dirCss = path.join(__dirname, 'public/styles.css');

app.get('/styles.css', function(req, res) {
    res.setHeader('Content-Type', 'text/css');
    res.sendFile(dirCss);
  });

const imageDir = path.join(__dirname, 'public/images');
const images = fs.readdirSync(imageDir);

app.get('/images/:imageName', (req, res) => { 
  const imageName = req.params.imageName;
  const imagePath = path.join(__dirname, `./public/images/${imageName}`);
  
  if (fs.existsSync(imagePath)) {
    const image = fs.readFileSync(imagePath);
    res.writeHead(200, {'Content-Type': 'image/jpeg' });
    res.end(image);
  } else {
    res.status(404).send('Image not found');
  }
});

// middleware
app.use(bodyParser.urlencoded({ extended: true }));

app.use(session({
  secret: 'secret_key',
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false }
}));

// định nghĩa route


const admins = require('./drivers/routes/admins.js');
const course = require('./drivers/routes/course.js');
const tutor = require('./drivers/routes/tutor.js');
const user = require('./drivers/routes/users.js');
const news = require('./drivers/routes/news.js');

app.use('/admin', admins);
app.use('/course', course);
app.use('/news', news);
app.use('/tutor',tutor);
app.use('/user',user);

module.exports = app;