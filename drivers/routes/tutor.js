const express = require('express');
const bodyParser = require('body-parser');
const Admin = require('../../db/models/admins.js');
const Tutor = require('../../db/models/tutor.js');
const Review = require('../../db/models/reviews.js');
const Course = require('../../db/models/course.js');
const router = express.Router();
//Yêu cầu chuyển hướng
  // Chuyển hướng đến trang home tutor 
  router.get('/home', checkMember ,function(req, res) {
    res.render('Tutor_Student/main/index.ejs', { username: req.session.username });
  }); 
  //Chuyển hướng đến đăng kí thành viên
  router.get('/register', function (req, res) {
    res.render('Tutor_Student/signup/index.ejs');
  });
  // Chuyển hướng đến trang chủ reviews
  router.get('/',checkAdmin, async (req, res) => {
    try {
        const reviews = await Review.find();
        const nametutor = reviews.nametutor;
        const tutors = await Tutor.find(nametutor)
        //console.log(JSON.stringify(news)) 
        res.render('Admin/tutor/index', 
        {
            reviews,
            tutors,
            username: req.session.username,
            });
    }
    catch (error) {
        res.status(500).json({ message: error.message })
    }
  }) 
  // Chuyển hướng đến details tutor
  router.get('/details/:id',checkAdmin, async function(req, res) {
    try {
      const id = req.params.id;
      const tutors = await Tutor.findById(id);
      const name = tutors.nametutor;
      const reviews = await Review.find(name);
      const course = await Course.find({ nametutor: new RegExp('.*' + name + '.*', 'i') });
      //console.log(JSON.stringify(news)) 
      res.render('Admin/tutor/details', 
      {
          tutors,
          reviews,
          course,
          username: req.session.username,
          });
  }
  catch (error) {
      res.status(500).json({ message: error.message })
  }
  }) 
  //chuyển hướng đến reviews
  router.get('/reviews',checkAdmin, async function(req, res) {
    try {
      const reviews = await Review.find();
      res.render('Admin/tutor/reviews/index', 
      {
          reviews,
          username: req.session.username,
          });
  }
  catch (error) {
      res.status(500).json({ message: error.message })
  }
  }) 
  //Chuyển hướng đến login 
  router.get('/login', function(req, res) {
    res.render('Tutor_Student/login/index.ejs', { message: '' });
  });
  //Chuyển hướng đến details reviews 
  router.get('/reviews/details/:id',checkAdmin, async function(req, res) {
    try {
      const id = req.params.id;
      const reviews = await Review.findById(id);
      res.render('Admin/tutor/reviews/details', 
      {
          reviews,
          username: req.session.username,
          });
    }
    catch (error) {
        res.status(500).json({ message: error.message })
    }
  }) 
//Yêu cầu khóa tài khoản
router.get('/block/:id', checkAdmin, async function(req, res) {
  try {
    const id = req.params.id;
    const status = "inactive";
    await Tutor.findByIdAndUpdate(id, { $set: { status } }, { new: true });
    res.redirect('/tutor/');
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})
//Yêu cầu mở khóa tài khoản
router.get('/unblock/:id', checkAdmin, async function(req, res) {
  try {
    const id = req.params.id;
    const status = "active";
    await Tutor.findByIdAndUpdate(id, { $set: { status } }, { new: true });
    res.redirect('/tutor/');
    // res.render('Admin/tutor/index', 
    // {
    //   username: req.session.username ,
    //   message : 'Đã mở khóa'
    // });
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

//Post đăng kí tài khoản
router.post('/register', async (req, res) => {
  const tutor = new Tutor({
    username: req.body.username,
    email: req.body.email,
    password: req.body.password
  })
  try {
    await tutor.save();
    res.redirect('/tutor/login');
  }
  catch (error) {
    res.status(400).json({ message: error.message })
  }
});
//Post login 
  router.post('/login', async function (req, res) {
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
  // Function check member
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