const express = require('express');
const jwt = require('jsonwebtoken');

const { User } = require('../db');

const router = express.Router();


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
        .json({ message: 'Email or password are incorrect' });
    }

    const token = jwt.sign(
      { user: { _id: user._id, email: user.email } },
      'TOP_SECRET',
    );

    res.json({ token });
  },
);

module.exports = router;
