const express = require('express');
const Admin = require('../../../db/models/admins.js');
const Course = require('../../../db/models/course.js');
const Reviews = require('../../../db/models/reviews.js');
const Tutor = require('../../../db/models/tutor.js');
const Notification = require('../../../db/models/notification.js');
const router = express.Router();
const stripe = require('stripe')('sk_test_51NTGMgAD16dsBsnGCco498WE2Kanpe4eCq5kloqGgAXrv8GVleFig26MHcjpBesu0dtd6ODpiJBxAI0exhi7C8vh00bo8rgU5m');
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
        console.log(username, password);
        try {
          const admin = await Admin.findOne({ $or: [{ username: username }] });
          if (!admin) {
            res.render('Admin/login', { message: 'Tên đăng nhập hoặc mật khẩu không đúng.' });
          } else if (admin.password !== password) {
            res.render('Admin/login', { message: 'Tên đăng nhập hoặc mật khẩu không đúng.' });
          } else {
            req.session.loggedin = true;
            req.session.username = username;
            res.redirect('/admin/home');
          }
          console.log(admin);
        } catch (err) {
          console.error(err);
          res.render('Admin/login', { message: 'Đã xảy ra lỗi khi đăng nhập.' });
        }
      });
      
  router.get('/home',checkAdmin, async function(req, res) { //NOSONAR
      try {
          if (req.session.loggedin) {
            const courses = await Course.find();
            const reviews = await Reviews.find();
            const tutor = await Tutor.find();
            const notification = await Notification.find();
            // Gọi API của Stripe để lấy thông tin giao dịch
            const charges = await stripe.charges.list();

            // Chỉ lấy các thông tin email, số tiền, và thời gian giao dịch từ danh sách giao dịch
            const transactions = charges.data.map(charge => {
              return {
                email: charge.receipt_email,
                amount: charge.amount * 231 , // Chia cho 100 để chuyển từ "cent" sang "VND"
                time: new Date(charge.created * 1000), // Do Stripe trả về timestamp tính bằng giây, nên nhân cho 1000 để chuyển sang millisecond để có thể render đúng định dạng thời gian
              };
            });
            // Tính tổng số tiền giao dịch
            const sumAmount = transactions.reduce((total, transaction) => total + transaction.amount, 0);
            res.render('Admin/main/index', 
            { 
              notification,
              courses,
              tutor,
              username: req.session.username,
              sumAmount,
              reviews
            });
          } else {
            res.redirect('/');
          }
      }
      catch (error) {
          res.status(500).json({ message: 'Có lỗi xảy ra vui lòng thử lại sau!' })
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