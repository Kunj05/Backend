const User = require('../models/User.model');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt'); 
const axios=require('axios');
require('dotenv').config();

const validateInput = (email, password, name) => {
    const errors = [];
    const passwordPattern = /^(?=.*[A-Z])(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/;

    if (!email || !email.includes('@')) {
      errors.push('Invalid email.');
    }
    if (!password || !passwordPattern.test(password)) {
      errors.push('Password must be at least 6 characters long, include at least one uppercase letter and one special character.');
    }
    if (!name || name.trim() === '') {
      errors.push('Name is required.');
    }
    return errors;
};
  

const signup = async (req, res) => {
    const { name, email, password, confirmpassword, captcha } = req.body;

    const errors = validateInput(email, password, name);
    if (errors.length > 0) {
        return res.status(400).json({ error: errors });
    }

    try {
        const captchaResponse = await axios.post(`https://www.google.com/recaptcha/api/siteverify`, null, {
            params: {
                secret: process.env.RECAPTCHA_SECRET_KEY,
                response: captcha,
            },
        });

        if (!captchaResponse.data.success) {
            return res.status(400).json({ message: 'CAPTCHA verification failed' });
        }

        if (password !== confirmpassword) {
            return res.status(400).json({ message: 'Passwords do not match' });
        }

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'Email already exists.' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = await User.create({ email, password: hashedPassword, name });

        res.status(201).json({ message: 'User registered successfully!' });
    } catch (error) {
        res.status(500).json({ message: 'Internal Server Error.', error });
    }
};

const login = async (req, res) => {
    const { email, password, captcha } = req.body;
    // console.log(email, password, captcha);

    if (!email || !password) {
        return res.status(400).json({ message: 'Email and password are required.' });
    }

    try {
        const captchaResponse = await axios.post(`https://www.google.com/recaptcha/api/siteverify`, null, {
            params: {
                secret: process.env.RECAPTCHA_SECRET_KEY,
                response: captcha
            }
        });

        console.log("CAPTCHA response:", captchaResponse.data);

        if (!captchaResponse.data.success) {
            return res.status(400).json({ message: 'CAPTCHA verification failed' });
        }

        const user = await User.findOne({ email });
        if (!user || !await bcrypt.compare(password, user.password)) {
            return res.status(401).json({ message: 'Invalid credentials: Authentication failed' });
        }

        const token = jwt.sign({ id: user._id, email: user.email }, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.json({ message: "User Login Successfully", token });
    } catch (error) {
        console.error('Login Error:', error);  // Log the error for debugging
        res.status(500).json({ message: 'Internal Server Error', error: error.message });
    }
};


const OauthFailure = (req, res) => {
    res.status(401).json({ 
        msg: "OAuth login failed" 
    });
};

module.exports={
    signup,
    login,
    OauthFailure
}