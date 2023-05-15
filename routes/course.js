const express = require('express');
const Course = require('../db/models/course.js');
const router = express.Router();

router.get('/course', function(req, res) {
    const str = 'Hello';
    res.send(str)
});

module.exports = router;