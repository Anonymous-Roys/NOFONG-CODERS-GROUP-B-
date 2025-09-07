require('dotenv').config();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('./models/user'); 

// Login handler
async function handleLogin(req, res) {
  try {
    const { username, password } = req.body;

    // Find user in MongoDB
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Verify password
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Generate JWT token
    const token = jwt.sign(
      {
        userId: user._id,
        username: user.username,
        dateOfBirth: user.dateOfBirth,
        location: user.location,
        gender: user.gender
      },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    // Set token in cookie
    res.cookie('auth_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production'
    });

    res.json({ message: 'Login successful' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

// Register handler
async function handleRegister(req, res) {
  try {
    const { username, password, dateOfBirth, location, gender } = req.body;

    // Check if user exists
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create new user
    const newUser = new User({
      username,
      password: hashedPassword,
      dateOfBirth,
      location,
      gender
    });

    await newUser.save();

    res.status(201).json({ message: 'User created successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

// Authentication middleware
function authenticateToken(req, res, next) {
  const token = req.cookies.auth_token;

  if (!token) {
    return res.status(401).json({ message: 'Authentication required' });
  }

  try {
    const verified = jwt.verify(token, process.env.JWT_SECRET);
    req.user = verified;
    next();
  } catch (err) {
    res.status(401).json({ message: 'Invalid token' });
  }
}

// Logout handler
function handleLogout(req, res) {
  res.clearCookie('auth_token');
  res.json({ message: 'Logged out successfully' });
}

module.exports = {
  handleLogin,
  handleRegister,
  authenticateToken,
  handleLogout
};
