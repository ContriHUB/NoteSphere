// routes/adminAuth.js
const express = require('express');
const User = require('../models/User');
const router = express.Router();
const bcrypt = require('bcryptjs');
const { body, validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');
const fetchuser = require('../middleware/fetchUser');

const JWT_SECRET = process.env.JWT_SECRET || 'FEED'; // Use environment variable for security

// Admin Registration Route
// Endpoint: POST /api/admin/register
router.post('/register', [
    body('name', 'Name must be at least 3 characters').isLength({ min: 3 }),
    body('email', 'Enter a valid email').isEmail(),
    body('password', 'Password must be at least 5 characters').isLength({ min: 5 }),
], async (req, res) => {
    let success = false;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ success, errors: errors.array() });
    }
    try { 
        let user = await User.findOne({ email: req.body.email });
        if (user) {
            return res.status(400).json({ success, error: 'User already exists' });
        }

        const salt = await bcrypt.genSalt(10);
        const secPass = await bcrypt.hash(req.body.password, salt);
        user = await User.create({
            name: req.body.name,
            password: secPass,
            email: req.body.email,
            isAdmin:true,
        });

        const data = {
            user: {
                id: user.id,
                isAdmin: user.isAdmin,
            },
        };

        const authtoken = jwt.sign(data, JWT_SECRET, { expiresIn: '1h' });

        success = true;
        res.json({ success, authtoken });
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal Server Error");
    }
});

// Admin Login Route
// Endpoint: POST /api/admin/login
router.post('/login', [
    body('email', 'Enter a valid email').isEmail(),
    body('password', 'Password cannot be blank').exists(),
], async (req, res) => {
    let success = false;

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ success, errors: errors.array() });
    }

    const { email, password } = req.body;
    try {
        let user = await User.findOne({ email });
        if (!user || !user.isAdmin) {
            return res.status(400).json({ success, error: "Please try to login with correct credentials" });
        }

        const passwordCompare = await bcrypt.compare(password, user.password);
        if (!passwordCompare) {
            return res.status(400).json({ success, error: "Please try to login with correct credentials" });
        }

        const data = {
            user: {
                id: user.id,
                isAdmin: user.isAdmin,
            }
        };

        const authtoken = jwt.sign(data, JWT_SECRET);

        success = true;
        
        res.json({ success, authtoken });
    } catch (error) {
        console.error(error.message);
        res.status(500).send('Internal server error');
    }
});

module.exports = router;
