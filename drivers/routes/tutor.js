const express = require('express');
const bodyParser = require('body-parser');
const Admin = require('../../db/models/admins.js');
const Tutor = require('../../db/models/tutor.js');
const Review = require('../../db/models/reviews.js');
const Course = require('../../db/models/course.js');
const router = express.Router();

//Yêu cầu chuyển hướng
router.get('/', checkMember, function (req, res) {
  req.session.destroy();
  res.render('Tutor_Student/main/index.ejs', { username: req.session.username });
});
// Chuyển hướng đến trang home tutor 

router.get('/home', checkMember, async (req, res) => {
  try {
    const courses = await Course.find();
    console.log(courses);
    res.render('Tutor_Student/main/index.ejs',
      {
        courses,
      });
  }
  catch (error) {
    res.status(500).json({ message: error.message })
  }
})

// //Chuyển hướng đến đăng kí thành viên
// router.get('/register', function (req, res) {
//   res.render('Tutor_Student/signup/index.ejs', { message: '' });
// });
//Chuyển hướng đến đăng kí thành viên
router.get('/register', function (req, res) {
  res.render('Tutor_Student/signup/index.ejs', { message: '' });
});

//Chuyển hướng đến login 
router.get('/login', function (req, res) {
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
  const existingUsername = await Tutor.findOne({ username });
  const existingEmail = await Tutor.findOne({ email });
  if (existingEmail) {
    return res.render('Tutor_Student/signup', { message: 'Email đã được đăng ký.' });
  }
  if (existingUsername) {
    return res.render('Tutor_Student/signup', { message: 'Username đã được sử dụng.' });
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
      //Tìm thông tin 
      const tutors = await Tutor.findOne({ email: emailtutor })
      const name = tutors.username; 
      const reviews = await Review.findOne({nametutor: name});
      const course = await Course.findOne({nametutor: name});
      //Định dạng chỉ ngày tháng năm cho birthday
      const birthday = new Date(tutors.birthday);
      const options = { day: 'numeric', month: 'numeric', year: 'numeric' };
      const formattedBirthday = birthday.toLocaleDateString('vi-VN', options);
      //render 
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
///
// Router
router.put('/save', checkMember, function(req, res) {
  const name = req.body.name;
  const email = req.body.email;
  const phone = req.body.phonenumber;
  const birthday= new Date(req.body.birthday);

  const address = req.body.address;
 
  // Tìm và cập nhật thông tin người dùng theo name và email nhập từ client
  Tutor.findOneAndUpdate({ email: email }, {
     $set: { phonenumber: phone, birthday: birthday, address: address } }, { new: true })
    .then(tutor => {
      if (!tutor) {
        res.status(404).json({ message: 'User not found' });
      } else {
        console.log('tutor: ', tutor);
        res.json({ message: 'User data updated successfully' });
       
      }
    })
    
    .catch(err => {
      console.error(err);
      res.status(500).json({ message: 'Internal server error' });
    });
});

//Functions
// Function check member
function checkMember(req, res, next) {
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