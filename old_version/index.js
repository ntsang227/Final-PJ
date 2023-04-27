const express = require('express');
const mongoose = require('mongoose');
const http = require('http');
const fs = require('fs');
const app = express();

// Kết nối đến database bằng cách import file database.js 
require('./api/database.js');
// Đọc nội dung file html
const homePage = fs.readFileSync('./public/index.html');
// Đọc nội dung file html
const adminPage = fs.readFileSync('./src/Admin/index.html');
// Đọc nội dung file css 
const adminStyles = fs.readFileSync('./src/Admin/style.css', 'utf8');

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

// Api routes
const routes = require('./api/routes/routes');
const admins = require('./api/routes/admins');

app.use('/api', routes);
app.use('/api', admins);
// Đăng kí thư mục chứ tài nguyên tĩnh
app.use(express.static('./Admin'));
// Điều hướng đến link trong trang index
app.get('/admin/home.html', (req, res) => {
    res.sendFile(__dirname + '/Admin/admin/home.html');
});
// Chạy server admin tại cổng 8000
app.listen(3000, () => {
  console.log('Database server, Admin client and User client are running at port 3000');
});