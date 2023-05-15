const express = require('express');
const Admin = require('../db/models/admins.js');
const router = express.Router();

//Post Method
router.post('/admins/post', async (req, res) => {
    const admin = new Admin({
        name: req.body.name,
        email: req.body.email,
        username : req.body.username,
        password : req.body.password
    })
    try {
        const newAdmin = await admin.save();
        res.status(200).json(newAdmin)
    }
    catch (error) {
        res.status(400).json({ message: error.message })
    }
})

//Get all Method
router.get('/admins/getAll', async (req, res) => {
    try {
        const admin = await Admin.find();
        res.json(admin)
    }
    catch (error) {
        res.status(500).json({ message: error.message })
    }
})

router.get('/', function(req, res) {
    res.render('Admin/login.ejs', { message: '' });
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
          res.redirect('/home');
        }
      } catch (err) {
        console.error(err);
        res.render('Admin/login', { message: 'Đã xảy ra lỗi khi đăng nhập.' });
      }
    });
    
router.get('/home', function(req, res) {
    if (req.session.loggedin) {
      res.render('Admin/home.ejs', { username: req.session.username });
    } else {
      res.redirect('/admin');
    }
  });
  //yêu cầu trang chủ admin
  router.get('/admin', function(req, res) {
    res.render('Admin/login.ejs', { message: 'Bạn không có đủ quyền!' });
  });
  router.get('/logout',  function(req, res) {
    req.session.destroy();
    res.render('Admin/login.ejs', { message: 'Bạn đã đăng xuất khỏi server' });
  });

module.exports = router;