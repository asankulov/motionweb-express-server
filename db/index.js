const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/motionweb_express_server').then(() => {
  console.log('connected');
});

const Post = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  text: {
    type: String,
  },
}, { timestamps: true, strict: 'throw' });

module.exports = {
  Post: mongoose.model('posts', Post),
};
