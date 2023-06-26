const express = require('express');
const bodyParser = require('body-parser');
const News = require('../../db/models/news.js');
const Tutor = require('../../db/models/tutor.js');
const Review = require('../../db/models/reviews.js');
const Course = require('../../db/models/course.js');
const { response } = require('../../app.js');
const router = express.Router();

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
//go to contact page 
router.get('/contact', async (req, res) => { //NOSONAR 
  try {
      res.render('User/service/contact');
  } catch (err) {
      console.log(err);
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