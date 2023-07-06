const mongoose = require('mongoose');
const { Schema } = mongoose;

const applySchema = new Schema({
  name: { type: String, required: true },
  nametutor: { type: String,  default: '' },
  nameuser: { type: String, default: ''},
  courseId: { type: String, required: true },
  datePost  : { type: Date, required: true, default: Date.now },
  updatedAt: { type: Date, required: true, default: Date.now }
});

const Apply = mongoose.model('apply', applySchema);

module.exports = Apply;