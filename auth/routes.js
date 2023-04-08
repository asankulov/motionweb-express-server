const express = require('express');
const jwt = require('jsonwebtoken');

const { User } = require('../db');
const { JWT_SECRET, ERROR_MESSAGES } = require('../constants');

const router = express.Router();

router.post('/image', (req, res) => {
  res.json({
    imageLink: 'http://localhost:3000/image.png'
  })
});


router.post(
  '/signup',
  async (req, res) => {
    const { email, password } = req.body;
    await User.create({ email, password });

    res.json({
      message: 'Signed up successfully!',
    });
  }
);

router.post(
  '/login',
  async (req, res) => {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user || !user.isValidPassword(password)) {
      return res
        .status(400)
        .json({ message: ERROR_MESSAGES.INVALID_CREDENTIALS });
    }

    const token = jwt.sign(
      { user: { _id: user._id, role: user.role } },
      JWT_SECRET,
    );

    res.json({ token });
  },
);

module.exports = router;
