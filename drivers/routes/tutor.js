const express = require('express');
const bodyParser = require('body-parser');
const Admin = require('../../db/models/admins.js');
const Tutor = require('../../db/models/tutor.js');
const Review = require('../../db/models/reviews.js');
const Course = require('../../db/models/course.js');
const router = express.Router();

//Yêu cầu chuyển hướng
  router.get('/', checkMember ,function(req, res) {
    req.session.destroy();
    res.render('Tutor_Student/main/index.ejs', { username: req.session.username });
  }); 
  // Chuyển hướng đến trang home tutor 
  router.get('/home', checkMember ,function(req, res) { 
    res.render('Tutor_Student/main/index.ejs', { username: req.session.username });
  }); 
  router.get('/profile', checkMember ,function(req, res) {
    res.render('Tutor_Student/account/index.ejs', { username: req.session.username });
  }); 
  router.get('/courses', checkMember ,function(req, res) {
    res.render('Tutor_Student/main/course.ejs', { username: req.session.username });
  });
  //Chuyển hướng đến đăng kí thành viên
  router.get('/register', function (req, res) {
    res.render('Tutor_Student/signup/index.ejs', { message: '' });
  });
  //Chuyển hướng đến login 
  router.get('/login', function(req, res) {
    res.render('Tutor_Student/login/index.ejs', { message: '' });
  });
//Post đăng kí tài khoản
router.post('/register', async (req, res) => { //NOSONAR
  const tutor = new Tutor({
    username: req.body.username,
    email: req.body.email,
    password: req.body.password
  })
  const email = req.body.email;
  const username = req.body.username;
  const existingUsername = await Tutor.findOne({ username});
  const existingEmail = await Tutor.findOne({ email });
  if (existingEmail) {
    return res.render('Tutor_Student/signup',{ message: 'Email đã được đăng ký.' });
  }
  if (existingUsername) {
    return res.render('Tutor_Student/signup',{ message: 'Username đã được sử dụng.' });
  }
  try {
    await tutor.save();
    res.redirect('/tutor/login');
  }
  catch (error) {
    res.status(400).json({ message: error.message })
  }
});
//Post login 
  router.post('/login', async function (req, res) { //NOSONAR 
    const email = req.body.email;
    const password = req.body.password;
    try {
      const tutor = await Tutor.findOne({ email: email});
      if (!tutor) {
        res.render('Tutor_Student/login', { message: 'Tên đăng nhập hoặc mật khẩu không đúng.' });
      } else if (tutor.password !== password) {
        res.render('Tutor_Student/login', { message: 'Tên đăng nhập hoặc mật khẩu không đúng.' });
      } else if (tutor.status !== 'active') {
        res.render('Tutor_Student/login', { message: 'Tài khoản bị khóa' });
      } else {
        
        req.session.loggedin = true;
        req.session.email = email;
        req.session.username = tutor.username;
        res.redirect('/tutor/home');
      }
    } catch (err) {
      console.error(err);
      res.render('Tutor_Student/login', { message: 'Đã xảy ra lỗi khi đăng nhập.' });
    }
  });

  router.get('/profile', checkMember, async function (req, res) { //NOSONAR
    try {
      const emailtutor = req.session.email;
      const tutors = await Tutor.findOne({ email: emailtutor })
      const name = tutors.username; 
      console.log(name);
      const reviews = await Review.findOne({nametutor: name});
      const course = await Course.findOne({nametutor: name});
      const birthday = new Date(tutors.birthday);
      const options = { day: 'numeric', month: 'numeric', year: 'numeric' };
      const formattedBirthday = birthday.toLocaleDateString('vi-VN', options);

      res.render('Tutor_Student/account/index.ejs', {
        tutors,
        reviews,
        course,
        formattedBirthday,
        username: req.session.username,
      });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  });
  
//Functions
  // Function check member
  function checkMember(req, res, next){
    try {
    if (req.session.loggedin) {
        next();  
    } else {  
        res.redirect('/tutor/login');
    }
  }
  catch (error) {
    res.status(500).json({ message: 'Lỗi' })
    }
  }
module.exports = router; 