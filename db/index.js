const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const { USER_ROLES } = require('../constants');

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

const User = new mongoose.Schema({
  // firstName: {
  //   type: String,
  //   required: true,
  // },
  // lastName: {
  //   type: String,
  //   required: true,
  // },
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    enum: [USER_ROLES.BASIC, USER_ROLES.ADVANCED],
    default: USER_ROLES.BASIC,
  },
});

User.pre('save', async function (next) {
  this.password = await bcrypt.hash(this.password, 10);

  next();
});

User.methods.isValidPassword = async function (password) {
  return bcrypt.compare(password, this.password);
}

module.exports = {
  Post: mongoose.model('posts', Post),
  User: mongoose.model('users', User),
};
