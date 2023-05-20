const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const newSchema = new Schema({
  name: { type: String, required: true },
  content: { type: String, required: true },
  createdAt: { type: Date, required: true, default: Date.now },
  updatedAt: { type: Date, required: true, default: Date.now }
});

const New = mongoose.model('New', newSchema);

module.exports = New;