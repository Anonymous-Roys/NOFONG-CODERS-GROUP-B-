require('dotenv').config();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('./models/user');
const Otp = require('./models/otp');

// REGISTER (profile create after OTP)
async function handleRegister(req, res) {
  try {
    const { phone, username, password, dateOfBirth, location, gender } = req.body;

    if (!phone) return res.status(400).json({ message: 'Phone is required' });

    // Check if user exists
    const existingUser = await User.findOne({ phone });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create new user
    const newUser = new User({ phone, username, password: hashedPassword, dateOfBirth, location, gender });

    await newUser.save();
    res.status(201).json({ message: 'User created successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

// LOGIN (password optional when using OTP)
async function handleLogin(req, res) {
  try {
    const { phone, username, password } = req.body;

    const query = phone ? { phone } : { username };
    const user = await User.findOne(query);
    if (!user) return res.status(401).json({ message: 'Invalid credentials' });

    // Verify password
    if (password) {
      const validPassword = await bcrypt.compare(password, user.password || '');
      if (!validPassword) return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Generate JWT
    const token = jwt.sign(
      { userId: user._id, username: user.username, phone: user.phone },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    // Set cookie
    res.cookie('auth_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production'
    });

    // ✅ Also return token for Postman / client testing
    res.json({
      message: 'Login successful',
      token
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

// ===== OTP ENDPOINTS =====
async function sendOtp(req, res) {
  const { phone, purpose } = req.body;
  if (!phone) return res.status(400).json({ message: 'Phone required' });
  const code = ('' + Math.floor(100000 + Math.random() * 900000));
  console.log(code);
  const expiresAt = new Date(Date.now() + 5 * 60 * 1000);
  await Otp.deleteMany({ phone, purpose });
  await Otp.create({ phone, code, purpose, expiresAt });
  // TODO: integrate SMS provider here
  res.json({ message: 'OTP sent', devCode: process.env.NODE_ENV !== 'production' ? code : undefined });
}

async function verifyOtp(req, res) {
  const { phone, code, purpose } = req.body;
  const record = await Otp.findOne({ phone, purpose });
  if (!record) return res.status(400).json({ message: 'OTP not found' });
  if (record.expiresAt < new Date()) return res.status(400).json({ message: 'OTP expired' });
  if (record.code !== code) {
    record.attempts += 1; await record.save();
    return res.status(400).json({ message: 'Invalid code' });
  }
  await Otp.deleteMany({ phone, purpose });
  // If login, issue token immediately; if register, just acknowledge success
  if (purpose === 'login') {
    const user = await User.findOne({ phone });
    if (!user) return res.status(404).json({ message: 'User not found' });
    const token = jwt.sign({ userId: user._id, username: user.username, phone: user.phone }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.cookie('auth_token', token, { httpOnly: true, secure: process.env.NODE_ENV === 'production' });
    return res.json({ message: 'Logged in', token });
  }
  res.json({ message: 'OTP verified' });
}

// AUTH MIDDLEWARE
function authenticateToken(req, res, next) {
  // Support both cookie & Postman Bearer Token
  const token =
    req.cookies.auth_token ||
    (req.headers['authorization'] && req.headers['authorization'].split(' ')[1]);

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

// LOGOUT
function handleLogout(req, res) {
  res.clearCookie('auth_token');
  res.json({ message: 'Logged out successfully' });
}

module.exports = {
  handleRegister,
  handleLogin,
  authenticateToken,
  handleLogout,
  sendOtp,
  verifyOtp
};
