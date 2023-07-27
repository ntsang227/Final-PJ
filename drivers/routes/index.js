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
//go to home page
router.get('/', async (req, res) => { //NOSONAR 
  try {
      const news = await News.find();
      res.render('index.ejs', { news } );
  } catch (err) {
      console.log(err);
  }
});

//go to news page
router.get('/news', async (req, res) => { //NOSONAR 
  try {
      const news = await News.find();
      res.render('User/news/index', { news } );
  } catch (err) {
      console.log(err);
  }
});

//go to service page
router.get('/service', async (req, res) => { //NOSONAR 
  try {
      res.render('User/service/service');
  } catch (err) {
      console.log(err);
  }
});
router.get('/about', async (req, res) => { //NOSONAR 
  try {
      res.render('User/service/about', {stripePublishableKey});
  } catch (err) {
      console.log(err);
  }
});
//go to contact page 
router.get('/contact', async (req, res) => { //NOSONAR 
  try {
      res.render('User/service/contact');
  } catch (err) {
      console.log(err);
  }
});
router.post('/pay', async (req, res) => { //NOSONAR
  try {
    const { stripeToken, email } = req.body;

    const paymentIntent = await stripe.paymentIntents.create({
      amount: 100,
      currency: 'usd',
      payment_method: stripeToken,
      confirm: true,
      receipt_email: email // Thêm dòng này để gửi email đến chủ thẻ
    });

    res.render('User/service/testpay.ejs');
  } catch (error) {
    res.send(error.message);
  }
});

//get news details :id
router.get('/details/:id', async (req, res) => { //NOSONAR 
    req.session.destroy();
    const id = req.params.id;
    const news = await News.findById(id);
    res.render('User/news/details', { news } );
  });
  
module.exports = router; 