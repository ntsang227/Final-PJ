const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const newSchema = new Schema({
  name: { type: String, required: true },
  content: { type: String, required: true },
  category: { type: String, required: true , default: 'null' },
  createdAt: { type: Date, required: true, default: Date.now },
  updatedAt: { type: Date, required: true, default: Date.now }
});

const Notification = mongoose.model('Notification', newSchema);

module.exports = Notification;