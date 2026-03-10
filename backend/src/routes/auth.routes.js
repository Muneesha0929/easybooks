const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');

const User = require('../models/User');
const { register, login, getProfile } = require('../controllers/auth.controller');
const { protect } = require('../middleware/auth.middleware');

console.log("AUTH ROUTES FILE LOADED Successfully");

/* ======================
   MULTER CONFIG
====================== */

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/profile');
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({ storage });

/* ======================
   ROOT TEST ROUTE
====================== */

router.get('/', (req, res) => {
  res.json({
    success: true,
    message: "AUTH ROOT WORKING"
  });
});

/* ======================
   PUBLIC ROUTES
====================== */

router.post('/register', register);
router.post('/login', login);

/* ======================
   GET CURRENT USER
====================== */

router.get('/me', protect, getProfile);

/* ======================
   UPDATE PROFILE
====================== */

router.put('/user', protect, async (req, res) => {

  try {

    const { name, email } = req.body;

    const user = await User.findByIdAndUpdate(
      req.user._id,
      { name, email },
      { new: true }
    ).select('-password');

    res.json({
      success: true,
      user
    });

  } catch (error) {

    console.error(error);

    res.status(500).json({
      success: false,
      message: "Failed to update profile"
    });

  }

});

/* ======================
   UPLOAD PROFILE PHOTO
====================== */

router.post('/upload-photo', protect, upload.single('photo'), async (req, res) => {

  try {

    const photoPath = `/uploads/profile/${req.file.filename}`;

    const user = await User.findByIdAndUpdate(
      req.user._id,
      { profilePhoto: photoPath },
      { new: true }
    );

    res.json({
      success: true,
      photo: photoPath,
      user
    });

  } catch (error) {

    console.error(error);

    res.status(500).json({
      success: false,
      message: "Photo upload failed"
    });

  }

});

/* ======================
   CHANGE PASSWORD
====================== */

router.put('/user/change-password', protect, async (req, res) => {

  try {

    const { newPassword } = req.body;

    const user = await User.findById(req.user._id);

    user.password = newPassword;

    await user.save();

    res.json({
      success: true,
      message: "Password updated successfully"
    });

  } catch (error) {

    console.error(error);

    res.status(500).json({
      success: false,
      message: "Failed to change password"
    });

  }

});

module.exports = router;