const express = require('express');
const bodyParser = require('body-parser');
const Admin = require('../../../db/models/admins.js');
const Tutor = require('../../../db/models/tutor.js');
const Course = require('../../../db/models/course.js');
const User = require('../../../db/models/users.js');
const router = express.Router();
//Yêu cầu chuyển hướng
  router.get('/user/index.html', checkAdmin , async (req, res) => {
    try {
    const students = await User.find()
      res.render('Admin/student/index', 
      {
        students,
        username: req.session.username,
        
      });
    }
    catch (error) {
        res.status(500).json({ message: error.message })
    }
  }); 
  //Khóa tài khoản
  router.get('/student/block/:id', checkAdmin, async function(req, res) {// NOSONAR
    try {
      const id = req.params.id;
      const status = "inactive";
      await User.findByIdAndUpdate(id, { $set: { status } }, { new: true });
      //lấy lại danh sách
      const students = await User.find()
      res.render('Admin/student/index', 
      {
        message: 'Đã khóa tài khoản' ,
        username: req.session.username,
        students
      });
    } catch (error) {
      res.status(500).json({ message: error.message })
    }
  })
  //Yêu cầu mở khóa tài khoản
  router.get('/student/unblock/:id', checkAdmin, async function(req, res) { // NOSONAR
    try {
      const id = req.params.id;
      const status = "active";
      await User.findByIdAndUpdate(id, { $set: { status } }, { new: true });
      //lấy lại danh sách
      const students = await User.find()
      res.render('Admin/student/index', 
      {
        message: 'Đã mở khóa tài khoản' ,
        username: req.session.username,
        students
      });
    } catch (error) {
      res.status(500).json({ message: error.message })
    }
  })

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