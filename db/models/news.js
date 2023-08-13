const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const newSchema = new Schema({
  name: { type: String, required: true },
  content: { type: String, required: true },
  status: { type: String, default: 'active' },
  image: { type: String, required: true , default: 'null' },
  sourceUrl: { type: String, default: 'null' },
  createdAt: { type: Date, required: true, default: Date.now },
  updatedAt: { type: Date, required: true, default: Date.now }
});

const New = mongoose.model('New', newSchema);

module.exports = New;