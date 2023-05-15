const mongoose = require('mongoose');
const { Schema } = mongoose;

const courseSchema = new Schema({
  name: { type: String, required: true },
  nameuser: { type: String, required: true },
  nametutor: { type: String, required: true },
  key: { type: String, required: true }
});

const Course = mongoose.model('course', courseSchema);

module.exports = Course;