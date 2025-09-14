require('dotenv').config();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('./models/user');
const Otp = require('./models/otp');

// REGISTER (profile create after OTP)
async function handleRegister(req, res) {
  try {
    const { phone, username, password, dateOfBirth, location, gender } = req.body;

    // Validation
    if (!phone) return res.status(400).json({ message: 'Phone number is required', field: 'phone' });
    if (!username) return res.status(400).json({ message: 'Username is required', field: 'username' });
    if (!password) return res.status(400).json({ message: 'Password is required', field: 'password' });
    
    // Phone format validation
    if (!/^\+?[1-9]\d{1,14}$/.test(phone)) {
      return res.status(400).json({ message: 'Please enter a valid phone number', field: 'phone' });
    }

    // Check if user exists
    const existingUser = await User.findOne({ phone });
    if (existingUser) {
      return res.status(409).json({ message: 'An account with this phone number already exists', field: 'phone' });
    }

    // Check username availability
    const existingUsername = await User.findOne({ username });
    if (existingUsername) {
      return res.status(409).json({ message: 'This username is already taken', field: 'username' });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create new user
    const newUser = new User({ phone, username, password: hashedPassword, dateOfBirth, location, gender });

    await newUser.save();
    res.status(201).json({ message: 'Account created successfully! Welcome to Nofong!' });
  } catch (err) {
    console.error('Registration error:', err);
    if (err.code === 11000) {
      const field = Object.keys(err.keyPattern)[0];
      return res.status(409).json({ message: `This ${field} is already registered`, field });
    }
    res.status(500).json({ message: 'Something went wrong. Please try again later.' });
  }
}

// LOGIN (password optional when using OTP)
async function handleLogin(req, res) {
  try {
    const { phone, username, password } = req.body;

    if (!phone && !username) {
      return res.status(400).json({ message: 'Phone number or username is required', field: 'phone' });
    }

    const query = phone ? { phone } : { username };
    const user = await User.findOne(query);
    if (!user) {
      const field = phone ? 'phone' : 'username';
      return res.status(404).json({ 
        message: phone ? 'No account found with this phone number' : 'No account found with this username',
        field 
      });
    }

    // Verify password if provided
    if (password) {
      const validPassword = await bcrypt.compare(password, user.password || '');
      if (!validPassword) {
        return res.status(401).json({ message: 'Incorrect password', field: 'password' });
      }
    }

    // Generate JWT
    const token = jwt.sign(
      { userId: user._id, username: user.username, phone: user.phone },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    // Set cookie
    res.cookie('auth_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 24 * 60 * 60 * 1000 // 24 hours
    });

    res.json({
      message: 'Welcome back!',
      token,
      user: { id: user._id, username: user.username, phone: user.phone }
    });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ message: 'Something went wrong. Please try again later.' });
  }
}

// ===== OTP ENDPOINTS =====
async function sendOtp(req, res) {
  try {
    const { phone, purpose } = req.body;
    
    if (!phone) {
      return res.status(400).json({ message: 'Phone number is required', field: 'phone' });
    }
    
    if (!/^\+?[1-9]\d{1,14}$/.test(phone)) {
      return res.status(400).json({ message: 'Please enter a valid phone number', field: 'phone' });
    }

    // Check rate limiting
    const recentOtp = await Otp.findOne({ 
      phone, 
      purpose, 
      createdAt: { $gte: new Date(Date.now() - 60 * 1000) } 
    });
    
    if (recentOtp) {
      return res.status(429).json({ 
        message: 'Please wait 60 seconds before requesting another code',
        retryAfter: 60
      });
    }

    // For login, check if user exists
    if (purpose === 'login') {
      const user = await User.findOne({ phone });
      if (!user) {
        return res.status(404).json({ 
          message: 'No account found with this phone number. Please sign up first.',
          field: 'phone'
        });
      }
    }

    // Use fixed OTP for development, random for production
    const code = process.env.NODE_ENV === 'production' 
      ? ('' + Math.floor(100000 + Math.random() * 900000))
      : '123456';
    
    console.log(`OTP for ${phone}: ${code}`);
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000);
    
    await Otp.deleteMany({ phone, purpose });
    await Otp.create({ phone, code, purpose, expiresAt });
    
    // TODO: integrate WhatsApp API here
    // await sendWhatsAppOTP(phone, code);
    
    res.json({ 
      message: 'Verification code sent to your phone',
      devCode: process.env.NODE_ENV !== 'production' ? code : undefined 
    });
  } catch (err) {
    console.error('Send OTP error:', err);
    res.status(500).json({ message: 'Failed to send verification code. Please try again.' });
  }
}

async function verifyOtp(req, res) {
  try {
    const { phone, code, purpose } = req.body;
    
    if (!phone || !code || !purpose) {
      return res.status(400).json({ message: 'Phone, code, and purpose are required' });
    }

    const record = await Otp.findOne({ phone, purpose });
    if (!record) {
      return res.status(404).json({ 
        message: 'No verification code found. Please request a new one.',
        action: 'resend'
      });
    }

    if (record.expiresAt < new Date()) {
      await Otp.deleteMany({ phone, purpose });
      return res.status(410).json({ 
        message: 'Verification code has expired. Please request a new one.',
        action: 'resend'
      });
    }

    // Check attempts limit
    if (record.attempts >= 3) {
      await Otp.deleteMany({ phone, purpose });
      return res.status(429).json({ 
        message: 'Too many incorrect attempts. Please request a new code.',
        action: 'resend'
      });
    }

    if (record.code !== code) {
      record.attempts += 1;
      await record.save();
      const remaining = 3 - record.attempts;
      return res.status(400).json({ 
        message: `Incorrect code. ${remaining} attempt${remaining !== 1 ? 's' : ''} remaining.`,
        field: 'code',
        attemptsRemaining: remaining
      });
    }

    await Otp.deleteMany({ phone, purpose });
    
    // If login, issue token immediately
    if (purpose === 'login') {
      const user = await User.findOne({ phone });
      if (!user) {
        return res.status(404).json({ message: 'Account not found. Please sign up first.' });
      }
      
      const token = jwt.sign(
        { userId: user._id, username: user.username, phone: user.phone }, 
        process.env.JWT_SECRET, 
        { expiresIn: '24h' }
      );
      
      res.cookie('auth_token', token, { 
        httpOnly: true, 
        secure: process.env.NODE_ENV === 'production',
        maxAge: 24 * 60 * 60 * 1000
      });
      
      return res.json({ 
        message: 'Welcome back!', 
        token,
        user: { id: user._id, username: user.username, phone: user.phone }
      });
    }
    
    res.json({ message: 'Phone number verified successfully!' });
  } catch (err) {
    console.error('Verify OTP error:', err);
    res.status(500).json({ message: 'Verification failed. Please try again.' });
  }
}

// AUTH MIDDLEWARE
function authenticateToken(req, res, next) {
  // Support both cookie & Postman Bearer Token
  const token =
    req.cookies.auth_token ||
    (req.headers['authorization'] && req.headers['authorization'].split(' ')[1]);

  if (!token) {
    return res.status(401).json({ 
      message: 'Please log in to access this feature',
      action: 'login'
    });
  }

  try {
    const verified = jwt.verify(token, process.env.JWT_SECRET);
    req.user = verified; 
    next();
  } catch (err) {
    console.error('Token verification error:', err.message);
    
    if (err.name === 'TokenExpiredError') {
      return res.status(401).json({ 
        message: 'Your session has expired. Please log in again.',
        action: 'login',
        expired: true
      });
    }
    
    res.status(401).json({ 
      message: 'Invalid session. Please log in again.',
      action: 'login'
    });
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
