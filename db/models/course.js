const mongoose = require('mongoose');
const { Schema } = mongoose;

const courseSchema = new Schema({
  name: { type: String, required: true },
  // Thay đổi trường tutor thành tham chiếu ObjectId của đối tượng Tutor
  tutor: { type: Schema.Types.ObjectId, ref: 'tutors' },
  // Thay đổi trường student thành tham chiếu ObjectId của đối tượng Tutor
  student: { type: Schema.Types.ObjectId, ref: 'tutors' },
  category: { type: String, required: true },
  subject: { type: String, required: true },
  key: { type: String, required: true },
  status: { type: String, default: 'open' },
  hidden: { type: Boolean, default: false },
  decs: { type: String, default: 'null' },
  datePost: { type: Date, required: true, default: Date.now },
  updatedAt: { type: Date, required: true, default: Date.now }
});

const Course = mongoose.model('course', courseSchema);

module.exports = Course;