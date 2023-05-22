const mongoose = require('mongoose');
const { Schema } = mongoose;

const courseSchema = new Schema({
  name: { type: String, required: true },
  nametutor: { type: String, required: true },
  nameuser: { type: String, default: ''},
  key: { type: String, required: true },
  status : { type: String, default: 'null'},
  content : { type: String, default: 'null' },
  datePost  : { type: Date, required: true, default: Date.now },
  updatedAt: { type: Date, required: true, default: Date.now }
});

const Course = mongoose.model('course', courseSchema);

module.exports = Course;