const express = require('express');
const mongoose = require('mongoose');
const http = require('http');
const fs = require('fs');



// Kết nối đến database bằng cách import file database.js 
//require('../src/DB/database.js');
require('../src/api/mongodb.js');
// Đọc nội dung file html
const homePage = fs.readFileSync('./public/index.html');
// Tạo server và render file html khi client request
const server = http.createServer((req, res) => {
  if (req.url === '/') {
    res.writeHead(200, { 'Content-Type': 'text/html' });
    res.write(homePage);
    res.end();
  }
});

// Chạy server tại cổng 3000
server.listen(3001, () => {
  console.log('User client is running at port 3001');
});
// Đọc nội dung file html
const adminPage = fs.readFileSync('./src/Admin/index.html');
const adminStyles = fs.readFileSync('./src/Admin/style.css', 'utf8');
// Tạo server và render file html admin khi client request
const adminServer = http.createServer((req, res) => {
  if (req.url === '/') {
  res.writeHead(200, { 'Content-Type': 'text/html' });
  res.write(adminPage);
  res.end();
  } else if (req.url === '/style.css') {
  res.writeHead(200, { 'Content-Type': 'text/css' });
  res.write(adminStyles);
  res.end();
  }
  });
// Chạy server admin tại cổng 8000
adminServer.listen(8000, () => {
  console.log('Admin client is running at port 8000');
});
/*
const MongoClient = require('mongodb').MongoClient;
const ObjectId = require('mongodb').ObjectId;
const app = express();
const url = 'mongodb://localhost:27017';
const dbName = 'Final_Project';

// Kết nối đến MongoDB
MongoClient.connect(url, function(err, client) {
  if (err) throw err;
  const db = client.db(dbName);

  // Khai báo các API endpoint
  app.get('/api/admins', function(req, res) {
    db.collection('admins').find().toArray(function(err, result) {
      if (err) throw err;
      res.json(result);
    });
  });

  app.post('/api/admins', function(req, res) {
    const user = req.body;
    db.collection('admins').insertOne(user, function(err, result) {
      if (err) throw err;
      res.json(result);
    });
  });

  app.put('/api/admins/:id', function(req, res) {
    const id = ObjectId(req.params.id);
    const user = req.body;
    db.collection('admins').updateOne({_id: id}, {$set: user}, function(err, result) {
      if (err) throw err;
      res.json(result);
    });
  });

  app.delete('/api/admins/:id', function(req, res) {
    const id = ObjectId(req.params.id);
    db.collection('admins').deleteOne({_id: id}, function(err, result) {
      if (err) throw err;
      res.json(result);
    });
  });

  // Bắt đầu lắng nghe các yêu cầu từ client
  app.listen(9000, function() {
    console.log(`Server is listening on port 9000`);
  }
  );
});*/
