const express = require('express');
const Admin = require('../../../db/models/admins.js');
const Course = require('../../../db/models/course.js');
const Tutor = require('../../../db/models/tutor.js');
const Notification = require('../../../db/models/notification.js');
const router = express.Router();

//Admin Login
  router.get('/', function(req, res) {
    if(req.session.loggedin){
      res.redirect("/admin/home");
    }else{
      res.render('Admin/login/index', { message: 'Bạn cần đăng nhập để tiếp tục' });
    }
  });
  router.get('/login', function(req, res) {
    req.session.loggedin = false;
    res.render('Admin/login/index', { message: 'Bạn cần đăng nhập để tiếp tục' });
  });
  
  router.post('/login', async function(req, res) { //NOSONAR 
        const username = req.body.username;
        const password = req.body.password;
        try {
          const admin = await Admin.findOne({ username: username });
          if (!admin) {
            res.render('Admin/login', { message: 'Tên đăng nhập hoặc mật khẩu không đúng.' });
          } else if (admin.password !== password) {
            res.render('Admin/login', { message: 'Tên đăng nhập hoặc mật khẩu không đúng.' });
          } else {
            req.session.loggedin = true;
            req.session.username = username;
            res.redirect('/admin/home');
          }
        } catch (err) {
          console.error(err);
          res.render('Admin/login', { message: 'Đã xảy ra lỗi khi đăng nhập.' });
        }
      });
      
  router.get('/home',checkAdmin, async function(req, res) { //NOSONAR
      try {
          if (req.session.loggedin) {
            const courses = await Course.find();
            const tutor = await Tutor.find();
            const notification = await Notification.find();
            res.render('Admin/main/index', 
            { 
              notification,
              courses,
              tutor,
              username: req.session.username,
            });
          } else {
            res.redirect('/');
          }
      }
      catch (error) {
          res.status(500).json({ message: 'Lỗi' })
      }
    });
  //yêu cầu trang chủ admin
  router.get('/admin',checkAdmin, function(req, res) {
    try {
        res.render('Admin/login/index', { message: 'Bạn không có đủ quyền!' });
    }
    catch (error) {
        res.status(500).json({ message: 'Lỗi' })
    }
    
  });
  //Đăng xuất 
  router.get('/logout', checkAdmin,  function(req, res) {
    try {
      req.session.loggedin = false;
        res.render('Admin/login/index',{ message: 'Bạn đã đăng xuất khỏi server' });
    }
    catch (error) {
        res.status(500).json({ message: 'Lỗi' })
    }
  });
  router.get('/noti/:id',checkAdmin, async function(req, res) { //NOSONAR
    try {
        res.redirect('/admin/course/apply-course.html')
    }
    catch (error) {
        res.status(500).json({ message: 'Lỗi' })
    }
  });
//Functions
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