const express = require('express');
const Admin = require('../db/models/admins.js');
const router = express.Router();

  //News - yêu cầu chuyển hướng
  router.get('/' , checkAdmin ,   function(req, res) {
    try {
      res.render('Admin/news/index', { username: req.session.username });
    }
    catch (error) {
        res.status(500).json({ message: 'Lỗi' })
    }
  });
  router.get('/delete', checkAdmin ,   function(req, res) {
    try {
      res.render('Admin/news/delete', { username: req.session.username });
    }
    catch (error) {
        res.status(500).json({ message: 'Lỗi' })
    }
  });
  router.get('/add',checkAdmin,  function(req, res) {
    try {
        res.render('Admin/news/add', { username: req.session.username });
    }
    catch (error) {
        res.status(500).json({ message: 'Lỗi' })
    }
  });
//CheckAdmin function
  function checkAdmin(req, res, next){
    try {
      if (req.session.loggedin) {
        next();  
      } else {
        res.redirect('/admin');
      }
  }
  catch (error) {
      res.status(500).json({ message: 'Lỗi' })
    }
  }

module.exports = router;