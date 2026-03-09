const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '30d' });
};

// Register user
const registerUser = async (req, res) => {
    // 1. Destructure 'username' from the request body
    const { name, username, email, password } = req.body;

    try {
        // 2. Check if EITHER email or username already exists
        const userExists = await User.findOne({ $or: [{ email }, { username }] });
        if (userExists) {
            return res.status(400).json({ message: 'User with this email or username already exists' });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // 3. Include 'username' in the creation object
        const user = await User.create({
            name,
            username,
            email,
            password: hashedPassword,
        });

        if (user) {
            res.status(201).json({
                _id: user.id,
                name: user.name,
                username: user.username,
                email: user.email,
                role: user.role,
                token: generateToken(user._id),
            });
        } else {
            res.status(400).json({ message: 'Invalid user data' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const updateCart = async (req, res) => {
    try {
        const user = await User.findById(req.user._id);
        if (user) {
            user.cart = req.body.cartItems || []; // Get the items from frontend

            // THE FIX: Force MongoDB to recognize the array change
            user.markModified('cart');

            await user.save(); // Now this will actually trigger the updatedAt!
            res.json(user.cart);
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Login User
const loginUser = async (req, res) => {
    const { username, password } = req.body;
    try {
        const user = await User.findOne({ username });

        if (user && (await bcrypt.compare(password, user.password))) {
            res.json({
                _id: user.id,
                name: user.name,
                username: user.username,
                email: user.email,
                role: user.role,
                profileImg: user.profileImg,
                cart: user.cart, // <-- NEW: Send the saved cart back on login
                token: generateToken(user._id),
            });
        } else {
            res.status(401).json({ message: 'Invalid username or password' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get profile
const getUserProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user._id).select('-password');
        if (user) {
            res.json(user);
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Upload Profile Image
const uploadProfileImage = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: 'No file uploaded' });
        }
        const user = await User.findById(req.user._id);
        if (user) {
            user.profileImg = req.file.path; // URL from Cloudinary
            await user.save();
            res.json({ message: 'Profile image updated successfully', profileImg: user.profileImg });
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Seed an Admin User
const seedAdmin = async (req, res) => {
    try {
        const adminExists = await User.findOne({ role: 'admin' });
        if (adminExists) {
            return res.status(400).json({ message: 'Admin already exists' });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash('admin123', salt);

        const adminUser = await User.create({
            name: 'Super Admin',
            username: 'admin',
            email: 'admin@chatoradda.com',
            password: hashedPassword,
            role: 'admin'
        });

        res.status(201).json({ message: 'Admin created successfully', email: adminUser.email, password: 'admin123' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { registerUser, loginUser, getUserProfile, uploadProfileImage, seedAdmin, updateCart };
