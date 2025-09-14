require("dotenv").config();
const express = require("express");
const cookieParser = require("cookie-parser");
const mongoose = require("mongoose");
const cors = require("cors");

const { handleLogin, handleRegister, authenticateToken, handleLogout, sendOtp, verifyOtp } = require("./auth");

// Import routes
const homeRoutes = require("./routes/home");
const plantRoutes = require("./routes/plant");
const taskRoutes = require("./routes/task");
const gardenRoutes = require("./routes/garden");
const plantLibraryRoutes = require("./routes/plantLibrary");

const app = express();

// ===== Middleware =====
app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: "https://nofong-coders-group-b.vercel.app", // 👈 your frontend domain
    credentials: true, // 👈 allow cookies/headers
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"]
  })
);

// Handle preflight
app.options("*", cors());


// ===== MongoDB Connection =====
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));

// ===== Auth Routes =====
app.post("/register", handleRegister);
app.post("/login", handleLogin);
app.post("/logout", handleLogout);
app.post("/otp/send", sendOtp); // { phone, purpose: 'login'|'register' }
app.post("/otp/verify", verifyOtp); // { phone, code, purpose }

app.get("/protected", authenticateToken, (req, res) => {
  res.json({
    message: `Welcome ${req.user.username || req.user.userId}, this is a protected route`,
    user: req.user
  });
});

// Debug middleware
app.use('/api/gardens', (req, res, next) => {
  console.log('Garden API called:', req.method, req.path);
  console.log('Headers:', req.headers.authorization ? 'Has auth header' : 'No auth header');
  console.log('Cookies:', req.cookies.auth_token ? 'Has auth cookie' : 'No auth cookie');
  next();
});

// ===== Feature Routes =====
app.use("/api/home", authenticateToken, homeRoutes);
app.use("/api/plants", plantRoutes); 
app.use("/api/tasks", taskRoutes);
app.use("/api/gardens", gardenRoutes);
app.use("/api/plant-library", plantLibraryRoutes);

// ===== Error Handling =====
app.use((err, req, res, next) => {
  console.error("⚠️ Error:", err.message);
  
  // Don't leak error details in production
  const isDev = process.env.NODE_ENV !== 'production';
  
  res.status(err.status || 500).json({
    message: err.message || "Internal Server Error",
    ...(isDev && { stack: err.stack })
  });
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
});

// Handle uncaught exceptions
process.on('uncaughtException', (error) => {
  console.error('Uncaught Exception:', error);
  process.exit(1);
});
// Root route
app.get('/', (req, res) => {
  res.send('🌱 Server is running! Use /api for endpoints.');
});

// ===== Start Server =====
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});


