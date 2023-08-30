const express = require('express');
const bodyParser = require('body-parser');
const Admin = require('../../../db/models/admins.js');
const router = express.Router();
const fs = require('fs');
const path = require('path');
const moment = require('moment-timezone');

const stripe = require('stripe')('sk_test_51NTGMgAD16dsBsnGCco498WE2Kanpe4eCq5kloqGgAXrv8GVleFig26MHcjpBesu0dtd6ODpiJBxAI0exhi7C8vh00bo8rgU5m');

router.get('/payment', checkAdmin, async (req, res) => { //NOSONAR
  try {
    const charges = await stripe.charges.list();
    const transactions = charges.data.map(charge => {
      return {
        email: charge.receipt_email,
        amount: charge.amount * 231,
        time: new Date(charge.created * 1000),
      };
    });

    const dateSet = new Set(transactions.map(transaction => transaction.time.toLocaleDateString()));
    const dates = Array.from(dateSet);

    const dailyTransactions = dates.map(date => {
      const transactionsOnDate = transactions.filter(transaction => transaction.time.toLocaleDateString() === date);
      const totalAmount = transactionsOnDate.reduce((total, transaction) => total + transaction.amount, 0);
      return {
        date,
        email: transactionsOnDate[0].email,
        total: totalAmount
      };
    });

    const sumAmount = transactions.reduce((total, transaction) => total + transaction.amount, 0);

    res.render('Admin/payment/index', { transactions: dailyTransactions, sumAmount, username: req.session.username, author: req.session.author, });
  } catch (error) {
    console.error('Lỗi khi truy vấn thông tin giao dịch từ Stripe:', error);
    res.status(500).send('Đã xảy ra lỗi');
  }
});

router.get('/detail-payment', checkAdmin, async (req, res) => { //NOSONAR
  try {
    // Gọi API của Stripe để lấy thông tin giao dịch
    const charges = await stripe.charges.list();

    // Tạo một danh sách chứa thông tin giao dịch
    const transactions = charges.data.map(charge => {
      return {
        email: charge.receipt_email,
        amount: charge.amount * 231,
        time: moment(charge.created * 1000).tz('Asia/Ho_Chi_Minh').format('HH:mm:ss DD/MM/YYYY'),
        status: charge.status
      };
    });
    

    // Render trang '/admin/payment/detail' với thông tin giao dịch đã lấy
    res.render('Admin/payment/details', { transactions, username: req.session.username , author: req.session.author,});
  } catch (error) {
    console.error('Lỗi khi truy vấn thông tin giao dịch từ Stripe:', error);
    res.status(500).send('Đã xảy ra lỗi');
  }
});
router.get('/payment/search', checkAdmin, async (req, res) => { //NOSONAR 
  try {
    const date = req.query.query;
    console.log(date);
    // Kiểm tra xem ngày được nhập vào có hợp lệ hay không
    const transactionDate = new Date(date);
    if (isNaN(transactionDate.getTime())) {
      throw new Error('Ngày giao dịch không hợp lệ');
    }

    // Chuyển đổi ngày thành milliseconds để so sánh với timestamps trong Stripe
    const startTimestamp = Math.floor(transactionDate.setHours(0, 0, 0, 0) / 1000);
    const endTimestamp = Math.floor(transactionDate.setHours(23, 59, 59, 999) / 1000);

    // Gọi API của Stripe để lấy thông tin giao dịch trong ngày đã chỉ định
    const charges = await stripe.charges.list({
      created: {
        gte: startTimestamp,
        lte: endTimestamp
      }
    });

    const transactions = charges.data.map(charge => {
      return {
        email: charge.receipt_email,
        amount: charge.amount / 100,
        time: new Date(charge.created * 1000),
        status: charge.status
      };
    });

    const sumAmount = transactions.reduce((total, transaction) => total + transaction.amount, 0);

    // Tiếp tục xử lý và render trang như trong code ban đầu
    res.render('Admin/payment/index', { transactions, username: req.session.username, author: req.session.author, sumAmount });
  } catch (error) {
    console.error('Lỗi khi truy vấn thông tin giao dịch từ Stripe:', error);
    res.status(500).send('Đã xảy ra lỗi');
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