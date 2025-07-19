const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const createToken = (user) => {
    return jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, {
        expiresIn: '1d',
    });
};

exports.register = async (req, res) => {
    try {
        const { username, email, password, role } = req.body;

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'Email already registered' });
        }

        if (!username || !email || !password || !role) {
            return res.status(400).json({ message: 'All fields are required' });
        }

        if (role !== 'admin' && role !== 'user') {
            return res.status(400).json({ message: 'Invalid role' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({ username, email, password: hashedPassword, role });
        await newUser.save();

        const token = createToken(newUser);
        res.status(201).json({ token });
    } catch (error) {
        res.status(500).json({ message: 'Registration failed', error: error.message });
    }
};

exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });
        if (!user) return res.status(400).json({ message: 'Invalid credentials' });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

        const token = createToken(user);
        res.status(200).json({ token });
    } catch (error) {
        res.status(500).json({ message: 'Login failed', error: error.message });
    }
};
