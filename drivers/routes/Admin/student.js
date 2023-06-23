const express = require('express');
const bodyParser = require('body-parser');
const Admin = require('../../../db/models/admins.js');
const Tutor = require('../../../db/models/tutor.js');;
const Course = require('../../../db/models/course.js');
const User = require('../../../db/models/users.js');
const router = express.Router();
//Yêu cầu chuyển hướng
  router.get('/user/index.html', checkAdmin ,function(req, res) {
    res.render('Admin/student/index', { username: req.session.username });
  }); 
  

//Functions
    // Function check Admin
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