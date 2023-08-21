const express = require('express');
const bodyParser = require('body-parser');
const News = require('../../db/models/news.js');
const Tutor = require('../../db/models/tutor.js');
const Review = require('../../db/models/reviews.js');
const Course = require('../../db/models/course.js');
const router = express.Router();

const stripe = require('stripe')('sk_test_51NTGMgAD16dsBsnGCco498WE2Kanpe4eCq5kloqGgAXrv8GVleFig26MHcjpBesu0dtd6ODpiJBxAI0exhi7C8vh00bo8rgU5m');
var stripePublishableKey = 'pk_test_51NTGMgAD16dsBsnGlXKRXyVAGDO3LjzvW1oL6w3uPryK5OS2t52KOv45rWxlI3YkfcCbZ1x5XEvEfznLvpdgcNDF00cBVAmUy4';
var stripeSecretKey ='sk_test_51NTGMgAD16dsBsnGCco498WE2Kanpe4eCq5kloqGgAXrv8GVleFig26MHcjpBesu0dtd6ODpiJBxAI0exhi7C8vh00bo8rgU5m';

router.get('/checkout.html',checkMember, async (req, res) => { //NOSONAR 
    try {
        const news = await News.find();
        res.render('User/account/payment' );
    } catch (err) {
        console.log(err);
    }
  });
//payment 
const calculateOrderAmount = (items) => {
    // Replace this constant with a calculation of the order's amount
    // Calculate the order total on the server to prevent
    // people from directly manipulating the amount on the client
    return 1000;
  };
  
  router.post("/create-payment-intent", checkMember, async (req, res) => {//NOSONAR
    const { items } = req.body;
    
    try {
      // Tạo PaymentIntent trong Stripe
      const paymentIntent = await stripe.paymentIntents.create({
        amount: calculateOrderAmount(items),
        currency: "usd",
        automatic_payment_methods: {
          enabled: true,
        },
      });
  
      res.send({
        clientSecret: paymentIntent.client_secret,
      });
    } catch (error) {
      console.error(error);
      res.status(500).send("Lỗi trong quá trình xử lý thanh toán");
    }
  });
  router.post("/payment", checkMember, async (req, res) => {//NOSONAR
    const { message } = req.body;
    var wallet =200000;
    try {
        if (message === 'success') {
         // Lấy thông tin Tutor từ database
            const tutorId = req.session.id_tutor; // Giả sử bạn đã xác định được ID của tutor từ phiên đăng nhập
            const tutor = await Tutor.findById(tutorId); // Thay thế câu truy vấn này bằng phương thức thích hợp để tìm Tutor
        
            // Kiểm tra xem Tutor có tồn tại không
            if (!tutor) {
                return res.status(404).send("Tutor không tồn tại");
            }
        
            // Cộng số tiền vào trường wallet
            tutor.wallet += wallet;
        
            // Lưu lại thông tin Tutor vào database
            await tutor.save();
            console.log("Cộng tiền vào", tutor.username ,"số tiền", wallet )
          // Xử lý logic tiếp theo ở đây
        } else {
          console.log('Lỗi: Thông báo không hợp lệ');
          res.status(400).send('Lỗi: Thông báo không hợp lệ');
        }
    } catch (error) {
      console.error(error);
      res.status(500).send("Lỗi trong quá trình xử lý thanh toán");
    }
  });
  
  
//Functions
// Function check member
function checkMember(req, res, next) {
    try {
      if (req.session.loggedin_tutor) {
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