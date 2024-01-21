const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require('dotenv').config();
const cors = require('cors');
// Enable CORS

const secretKey = process.env.JWT_SECRET
const router = express.Router();
const Admin = require('../models/Admin');
router.use(cors());

// Sign Up route
router.post('/signup', async (req, res) => {
    const { name, email, password } = req.body;

    try {
        // Check if the user with the provided email already exists
        const existingUser = await Admin.findOne({ email });

        if (existingUser) {
            return res.status(409).json({ message: 'Admin with this email already exists' });
        }

        // Hash the password before saving it to the database
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create a new user
        const newAdmin = new Admin({
            name,
            email,
            password
            // Additional fields from my schema
        });

        // Save the user to the database
        await newAdmin.save();

        // Generate and send a JWT token for the newly created user
        const token = jwt.sign({ AdminId: newAdmin._id }, secretKey, { expiresIn: '9h' });
        res.status(201).json({ token: token });
    } catch (error) {
        console.error(error);

        // Check if the error is due to validation (e.g., unique constraint violation)
        if (error.code === 11000 && error.keyPattern && error.keyPattern.email === 1) {
            return res.status(409).json({ message: 'Admin with this email already exists' });
        }

        res.status(500).json({ message: 'Internal server error' });
    }
});



// Login route
router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        // Find the user by email
        const user = await Admin.findOne({ email });

        if (!user) {
            return res.status(404).json({ message: 'User not foundyyyy' });
        }
        // Check if the password is correct without hashing the input password again
        const isPasswordValid = await bcrypt.compare(password, user.password);

        // console.log('Input Password:', password);
        // console.log('Stored Hashed Password:', user.password);
        // console.log('Is Password Valid:', isPasswordValid);

        if (!isPasswordValid) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        // Generate and send a JWT token
        const token = jwt.sign({ AdminId: user._id }, secretKey);
        res.json({
            login: true,
            token: token,
            admid: user.admid, // assuming you have an 'admid' field in your Admin schema

        });

    } catch (error) {
        console.error(error);
        res.json({
            login: false,
            error: "Please check email and password"
        }

        );
    }
});


module.exports = router;
