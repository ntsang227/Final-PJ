const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
  tutorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'tutors',
    required: true
  },
  content: {
    type: String,
    required: true
  },
  rate: {
    type: Number,
    required: true
  },
  createdAt: {
    type: Date, 
    required: true, 
    default: Date.now 
  },
  updatedAt: {
    type: Date, 
    required: true, 
    default: Date.now 
  }
});

const Review = mongoose.model('Review', reviewSchema);

module.exports = Review;
