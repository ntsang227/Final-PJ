const express = require('express');
const Tutor = require('../db/models/tutor.js');
const router = express.Router();

//Post Method
router.post('/register', async (req, res) => {
  const tutor = new Tutor({
    username: req.body.username,
    email: req.body.email,
    password: req.body.password
  })
  try {
    const newTutor = await tutor.save();
    res.redirect('/tutor/login');
  }
  catch (error) {
    res.status(400).json({ message: error.message })
  }
});
router.get('/login', function(req, res) {
  res.render('Tutor_Student/login/index.ejs', { message: '' });
});


router.post('/login', async function (req, res) {
  const email = req.body.email;
  const password = req.body.password;
  try {
    const tutor = await Tutor.findOne({ email: email});
    if (!tutor) {
      res.render('Tutor_Student/login', { message: 'Tên đăng nhập hoặc mật khẩu không đúng.' });
    } else if (tutor.password !== password) {
      res.render('Tutor_Student/login', { message: 'Tên đăng nhập hoặc mật khẩu không đúng.' });
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
//Get method
router.get('/home', checkMember ,function(req, res) {
  res.render('Tutor_Student/main/index.ejs', { email: req.session.username  });
});

router.get('/register', function (req, res) {
  res.render('Tutor_Student/signup/index.ejs');
});
// Functions check member
function checkMember(req, res, next){
  try {
  if (req.session.loggedin) {
      next();  
  } else {
      res.redirect('/login');
  }
}
catch (error) {
  res.status(500).json({ message: 'Lỗi' })
  }
}
module.exports = router; 