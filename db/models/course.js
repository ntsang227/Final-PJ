const mongoose = require('mongoose');
const { Schema } = mongoose;

const courseSchema = new Schema({
  name: { type: String, required: true },
  nametutor: { type: String,  default: '' },
  nameuser: { type: [String], default: ''},
  category: { type: String, required: true },
  subject: { type: String, required: true },
  key: { type: String, required: true },
  status : { type: String, default: 'null'},
  decs : { type: String, default: 'null' },
  datePost  : { type: Date, required: true, default: Date.now },
  updatedAt: { type: Date, required: true, default: Date.now }
});

const Course = mongoose.model('course', courseSchema);

module.exports = Course;