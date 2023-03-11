const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/motionweb').then(() => {
  console.log('connected');
});

const Post = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  text: {
    type: String,
    required: true,
  },
  votes: {
    type: Number,
    required: false,
    default: 0,
  },
  isPaid: {
    type: Boolean,
    required: false,
    default: false,
  },
  hashtags: {
    type: [String],
  }
}, { timestamps: true, strict: false });

module.exports = {
  Post: mongoose.model('posts', Post),
};
