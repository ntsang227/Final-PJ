const mongoose = require('mongoose');

// Define the subject schema
const subjectSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  }
});

// Define the grade schema
const gradeSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  subjects: [subjectSchema]
});

// Create the models for grades and subjects
const Grade = mongoose.model('Grade', gradeSchema);
const Subject = mongoose.model('Subject', subjectSchema);

module.exports = { Grade, Subject };
