const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const newSchema = new Schema({
  name: { type: String, default: 'Khóa học mới'},
  status: { type: String, default: 'Chưa xem'},
  actionName: { type: String, default: 'null'},
  category: { type: String, default: 'null'},
  categoryId: { type: String, required: true , default: 'null' },
  createdAt: { type: Date, required: true, default: Date.now },
  updatedAt: { type: Date, required: true, default: Date.now }
});

const Notification = mongoose.model('Notification', newSchema);

module.exports = Notification;