const express = require('express');
const router = express.Router();
const Course = require('../models/course');

router.post('/search', async (req, res) => {
  const { query, grade, subject, status } = req.body;

  // Build the query object
  const searchQuery = {};
  if (query) {
    searchQuery.$or = [
      { name: new RegExp(query, 'i') },
      { desc: new RegExp(query, 'i') }
    ];
  }
  if (grade) {
    searchQuery.grade = grade;
  }
  if (subject) {
    searchQuery.subject = subject;
  }
  if (status) {
    searchQuery.status = status;
  }

  try {
    const courses = await Course.find(searchQuery);
    res.json({ success: true, data: courses });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Could not search for courses' });
  }
});

module.exports = router;