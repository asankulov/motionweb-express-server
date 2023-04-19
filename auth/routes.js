const express = require('express');
const jwt = require('jsonwebtoken');

const { User } = require('../db');
const { JWT_SECRET, ERROR_MESSAGES } = require('../constants');
const multer = require('multer');
const mime = require('mime-types');

const router = express.Router();


const multerStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, './assets/images');
  },
  filename: (req, file, cb) => {
    const filename = '' + process.hrtime().join('') + '.' + mime.extension(file.mimetype);
    cb(null, filename);
  },
})

const upload = multer({ storage: multerStorage });
router.post('/file', upload.single('image'), (req, res) => {
  console.log(req.file);

  res.status(200).json({
    filePath: '/' + req.file.path,
  });
});

router.post('/files', upload.array('image', 10), (req, res) => {
  console.log(req.files);

  res.sendStatus(200);
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
