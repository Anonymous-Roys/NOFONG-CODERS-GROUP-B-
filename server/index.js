require('dotenv').config();
const express = require('express');
const cookieParser = require('cookie-parser');
const mongoose = require('mongoose');

const { handleLogin, handleRegister, authenticateToken, handleLogout } = require('./auth');

// Import routes
const homeRoutes = require('./routes/home');
const plantRoutes = require('./routes/plants');
const taskRoutes = require('./routes/tasks');

const app = express();
app.use(express.json());
app.use(cookieParser());

// Connect to MongoDB

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log("✅ MongoDB connected"))
.catch(err => console.error("❌ MongoDB connection error:", err));

// Auth Routes

app.post('/register', handleRegister);
app.post('/login', handleLogin);
app.post('/logout', handleLogout);
app.get('/protected', authenticateToken, (req, res) => {
  res.json({ message: `Welcome ${req.user.userId}, this is a protected route` });
});

// App Feature Routes
app.use('/api/home', authenticateToken, homeRoutes);
app.use('/api/plants', plantRoutes); 
app.use('/api/tasks', authenticateToken, taskRoutes);

// Start Server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
