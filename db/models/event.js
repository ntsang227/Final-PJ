const mongoose = require('mongoose');
const { Schema } = mongoose;

const eventSchema = new Schema({
  nametutor: { type: String,  default: '' },
  content : { type: [ String ], default: [] },
  dateAdd : { type: Date, required: true, default: Date.now }
});

const Event = mongoose.model('event', eventSchema);

module.exports = Event;