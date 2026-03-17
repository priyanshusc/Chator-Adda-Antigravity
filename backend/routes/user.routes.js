const express = require('express');
const router = express.Router();
const { registerUser, loginUser, getUserProfile, uploadProfileImage, seedAdmin, updateCart } = require('../controllers/userController');
const { protect } = require('../middlewares/auth');
const { upload } = require('../config/cloudinary');

router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/seed-admin', seedAdmin);
router.get('/profile', protect, getUserProfile);
router.post('/upload-profile', protect, upload.single('profileImage'), uploadProfileImage);
router.post('/cart', protect, updateCart);

module.exports = router;
