const express = require('express');
const router = express.Router();
const { registerUser, loginUser, getUserProfile, uploadProfileImage } = require('../controllers/userController');
const { protect } = require('../middlewares/auth');
const { upload } = require('../config/cloudinary');

router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/profile', protect, getUserProfile);
router.post('/upload-profile', protect, upload.single('profileImage'), uploadProfileImage);

module.exports = router;
