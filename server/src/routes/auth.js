import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';

const router = express.Router();

// Register a new user
router.post('/register', async (req, res) => {
    try{
        const { username, email, password } = req.body;
        console.log('Registering user:', { username, email }); // Log registration attempt

        // Check if required fields are present
        if (!username || !email || !password) {
            return res.status(400).json({ 
                message: 'Username, email, and password are required' 
            });
        } 

        // Check if email is valid
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            return res.status(400).json({ message: 'Invalid email format' });
        }

        // Check if this user already exists
        const existingUser = await User.findOne({ email });
        console.log('Checking for existing user:', { email }); // Log user check
        if (existingUser) {
            console.log('User already exists:', email); // Log user already exists
            return res.status(400).json({ message: 'User already exists' });
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);
        console.log('Hashed password for user:', username); // Log hashed password

        // Check username is less than 12 alphanumeric characters with no special characters
        if (!/^[a-zA-Z0-9]{1,12}$/.test(username)) {
            return res.status(400).json({ message: 'Username must be less than 12 alphanumeric characters' });
        }

        // Check password is valid
        if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&.])[A-Za-z\d@$!%*?&.]{8,}$/.test(password)) {
            return res.status(400).json({ message: 'Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, one number, and one special character' });
        }

        // Create the new user
        const user = new User({
            username,
            email,
            password: hashedPassword
        });

        // Save the user
        await user.save();
        console.log('User registered successfully:', user); // Log successful registration

        // Generate a token
        const token = jwt.sign({ id: user._id, email: user.email }, process.env.JWT_SECRET, { expiresIn: '24h' });

        // Return the token
        res.status(201).json({
            message: 'User registered successfully',
            token: token,
            user: { id: user._id, email: user.email, username: user.username }  
        });
    } catch (error) {
        console.error('Registration failed:', error);
        res.status(500).json({ message: 'Registration failed' });
    }
});

// Login
router.post('/login', async (req, res) => {
    try{
        const { email, password } = req.body;
        console.log('Login attempt:', { email }); // Log login attempt

        // Check if required fields are present
        if (!email || !password) {
            return res.status(400).json({ 
                message: 'Email and password are required' 
            });
        }

        // Check if email is valid
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            return res.status(400).json({ message: 'Invalid email format' });
        }

        // Find the user
        const user = await User.findOne({ email });
        console.log('User found:', user); // Log user found
        if (!user) {
            console.log('No user found registered with this email:', email); // Log no user found
            return res.status(400).json({ message: 'No user found registered with this email' });
        }

        // Check the password
        const isPasswordValid = await bcrypt.compare(password, user.password);
        console.log('Password check:', isPasswordValid); // Log password check
        if (!isPasswordValid) {
            console.log('Invalid password'); // Log invalid password
            return res.status(400).json({ message: 'Invalid password' });
        }

        // Generate a token
        const token = jwt.sign({ id: user._id, email: user.email }, process.env.JWT_SECRET, { expiresIn: '24h' });

        // Return the token
        res.status(200).json({
            message: 'Login successful',
            token,
            user: { id: user._id, email: user.email, username: user.username }
        });
    } catch (error) {
        console.error('Login failed:', error);
        res.status(500).json({ 
            message: 'Login failed'
        });
    }
});

// Logout
router.post('/logout', (req, res) => {
    // Clear the token
    res.clearCookie('token');
    res.status(200).json({ message: 'Logout successful' });
});

export default router;
