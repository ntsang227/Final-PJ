const express = require('express');
const Admin = require('../../db/models/admins.js');
const router = express.Router();

//Admin Login
router.get('/', function(req, res) {
    res.render('Admin/login/index', { message: 'Bạn cần đăng nhập để tiếp tục' });
  });
  
router.post('/login', async function(req, res) {
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
    
router.get('/home',checkAdmin, async function(req, res) {
    try {
        if (req.session.loggedin) {
          res.render('Admin/main/index', { username: req.session.username });
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
        req.session.destroy();
        res.render('Admin/login/index',{ message: 'Bạn đã đăng xuất khỏi server' });
    }
    catch (error) {
        res.status(500).json({ message: 'Lỗi' })
    }
  });

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