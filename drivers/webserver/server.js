const express = require('express');
const mongoose = require('mongoose');
const http = require('http');
const fs = require('fs');
const app = express();
const path = require('path');

// Kết nối đến database bằng cách import file database.js 
require('../../db/mongodb/database.js');
// Đọc nội dung file html
const homePage = fs.readFileSync('./public/index.html');
// Đọc nội dung file html
const adminPage = fs.readFileSync('./models/Admin/index.html');
// Đọc nội dung file css 
const adminStyles = fs.readFileSync('./models/Admin/style.css', 'utf8');

// Trả về file html Home Page user
app.get('/', (req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/html' });
  res.write(homePage);
  res.end();
});
// Trả về file html Home Page Admin
app.get('/admin', (req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/html' });
  res.write(adminPage);
  res.end();
});
// Trả về file css
app.get('/style.css', (req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/css' });
  res.write(adminStyles);
  res.end();
});

app.use(express.static('../../public'));

const dirCss = path.join(__dirname, '../../public/styles.css');

app.get('/styles.css', function(req, res) {
    res.setHeader('Content-Type', 'text/css');
    res.sendFile(dirCss);
  });

const imageDir = path.join(__dirname, '../../public/images');
const images = fs.readdirSync(imageDir);

app.get('/images/:imageName', (req, res) => { 
  const imageName = req.params.imageName;
  const imagePath = path.join(__dirname, `../../public/images/${imageName}`);
  
  if (fs.existsSync(imagePath)) {
    const image = fs.readFileSync(imagePath);
    res.writeHead(200, {'Content-Type': 'image/jpeg' });
    res.end(image);
  } else {
    res.status(404).send('Image not found');
  }
});

// code để nạp file index sau khi đăng nhập
const adminhomePage = fs.readFileSync('./models/Admin/doc/index.html');
app.get('/doc/index.html', (req, res) => { 
  res.writeHead(200, { 'Content-Type': 'text/html' });
  res.write(adminhomePage);
  res.end();
})


// Api routes
// const routes = require('../../data-access/routes/users.js');
 //const admins = require('../../data-access/routes/admins.js');
// app.use('/api', routes);
//app.use('/api', admins);


// Chạy server admin tại cổng 8000
app.listen(3000, () => {
  console.log('Database server, Admin client and User client are running at port 3000');
});