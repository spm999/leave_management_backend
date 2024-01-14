const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const secretKey = process.env.JWT_SECRET || 'default-secret-key';

const router = express.Router();
const Employee = require('');

// Sign Up route
router.post('/signup', async (req, res) => {
    const { name, email, organization, password } = req.body;

    try {
        // Check if the user with the provided email already exists
        const existingUser = await Employee.findOne({ email });

        if (existingUser) {
            return res.status(409).json({ message: 'Employee with this email already exists' });
        }

        // Hash the password before saving it to the database
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create a new user
        const newEmployee = new Employee({
            name,
            email,
            organization,
            password
            // Additional fields from your schema
        });

        // Save the user to the database
        await newEmployee.save();

        console.log('Input Password:', password);
        console.log('Stored Hashed Password:', hashedPassword);
        // console.log('Is Password Valid:', isPasswordValid);

        // Generate and send a JWT token for the newly created user
        const token = jwt.sign({ EmployeeId: newEmployee._id }, secretKey, { expiresIn: '9h' });
        res.status(201).json({ token });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

// Login route
router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        // Find the user by email
        const user = await Employee.findOne({ email });

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Check if the password is correct without hashing the input password again
        const isPasswordValid = await bcrypt.compare(password, user.password);

        console.log('Input Password:', password);
        console.log('Stored Hashed Password:', user.password);
        console.log('Is Password Valid:', isPasswordValid);

        if (!isPasswordValid) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        // Generate and send a JWT token
        const token = jwt.sign({ EmployeeId: user._id }, secretKey, { expiresIn: '1h' });
        res.json({ token });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
});


module.exports = router;
