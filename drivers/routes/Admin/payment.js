const express = require('express');
const bodyParser = require('body-parser');
const Admin = require('../../../db/models/admins.js');
const router = express.Router();
const fs = require('fs');
const path = require('path');

const stripe = require('stripe')('sk_test_51NTGMgAD16dsBsnGCco498WE2Kanpe4eCq5kloqGgAXrv8GVleFig26MHcjpBesu0dtd6ODpiJBxAI0exhi7C8vh00bo8rgU5m');

router.get('/payment', checkAdmin, async (req, res) => {
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

    res.render('Admin/payment/index', { transactions: dailyTransactions, sumAmount, username: req.session.username });
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
        amount: charge.amount / 100, // Chia cho 100 để chuyển từ "cent" sang "USD"
        time: new Date(charge.created * 1000), // Do Stripe trả về timestamp tính bằng giây, nên nhân cho 1000 để chuyển sang millisecond để có thể render đúng định dạng thời gian
        status: charge.status
      };
    });

    // Render trang '/admin/payment/detail' với thông tin giao dịch đã lấy
    res.render('Admin/payment/details', { transactions, username: req.session.username });
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