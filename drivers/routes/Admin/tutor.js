const express = require('express');
const bodyParser = require('body-parser');
const Admin = require('../../../db/models/admins.js');
const Tutor = require('../../../db/models/tutor.js');
const Review = require('../../../db/models/reviews.js');
const Course = require('../../../db/models/course.js');
const router = express.Router();
//Yêu cầu chuyển hướng
  // Chuyển hướng đến trang chủ reviews
  router.get('/tutor/index.html',checkAdmin, async (req, res) => {// NOSONAR
    try {
      const tutors = await Tutor.find()
      const name = tutors.username;
      const reviews = await Review.find(name);
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
  router.get('/tutor/details.html/:id',checkAdmin, async function(req, res) {// NOSONAR
    try {
      const id = req.params.id;
      const tutors = await Tutor.findById(id);
      const name = tutors.username;
      const reviews = await Review.find({nametutor: name});
      const course = await Course.find({ nametutor: new RegExp('.*' + name + '.*', 'i') });
      //console.log(JSON.stringify(reviews)) 
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
  router.get('/tutor/reviews.html',checkAdmin, async function(req, res) {// NOSONAR
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
  //Chuyển hướng đến details reviews 
  router.get('/tutor/reviews/details/:id',checkAdmin, async function(req, res) {// NOSONAR
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
router.get('/tutor/block/:id', checkAdmin, async function(req, res) {// NOSONAR
  try {
    const id = req.params.id;
    const status = "inactive";
    await Tutor.findByIdAndUpdate(id, { $set: { status } }, { new: true });
    //lấy lại danh sách
    const tutors = await Tutor.find()
    const name = tutors.username;
    const reviews = await Review.find(name);
    res.render('Admin/tutor/index', 
    {
      message: 'Đã khóa tài khoản' ,
      username: req.session.username,
      tutors,
      reviews
    });
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})
//Yêu cầu mở khóa tài khoản
router.get('/tutor/unblock/:id', checkAdmin, async function(req, res) { // NOSONAR
  try {
    const id = req.params.id;
    const status = "active";
    await Tutor.findByIdAndUpdate(id, { $set: { status } }, { new: true });
    //lấy lại danh sách
    const tutors = await Tutor.find()
    const name = tutors.username;
    const reviews = await Review.find(name);
    res.render('Admin/tutor/index', 
    {
      message: 'Đã mở khóa tài khoản' ,
      username: req.session.username,
      tutors,
      reviews
    });
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})
//Xóa Người dùng
router.get('/tutor/delete/:id', function (req, res) {
  Tutor.findOneAndDelete({ _id: req.params.id })
  .then(data => {
      if (!data) {
      console.log('Lỗi khi thao tác xóa');
      return res.redirect('/admin/tutor/index.html');
      }
      console.log('Xóa thành công người dùng có id:', req.params.id);
      return res.redirect('/admin/tutor/index.html');
  })
  .catch(err => {
      console.log('Error deleting item from database:', err);
      console.log('Lỗi khi xoá bản tin');
      return res.redirect('/admin/news');
  });
});
//Tìm kiếm gia sư 
router.get('/tutor/search' ,checkAdmin,  async (req, res) => {  // NOSONAR
  try {
    const query = req.query.query;
    const filter = req.query.filter;
    let tutors;
    let reviews;
    console.log("Nội dung tìm kiếm: ",query, "với tùy chọn là " ,filter );
    if (!filter && query) {
      tutors = await Tutor.find({
        $or: [
          { username: new RegExp('.*' + query + '.*', 'i') },
          { email: new RegExp('.*' + query + '.*', 'i') }
        ]
      });
        const name = tutors.username;
        reviews = await Review.find(name);
    }else if (filter && !query) {
      tutors = await Tutor.find(
          { status: filter },
      );
        const name = tutors.username;
        reviews = await Review.find(name);
    }else{
      tutors = await Tutor.find();
      const name = tutors.username;
      reviews = await Review.find(name); 
    }
    //console.log("Kết quả tìm kiếm: ",tutors );
    res.render('Admin/tutor/index.ejs', 
            {
                reviews,
                tutors ,
                username: req.session.username,
                });
  } catch (err) {
      res.status(500).json({ message: err.message })
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
module.exports = router; 