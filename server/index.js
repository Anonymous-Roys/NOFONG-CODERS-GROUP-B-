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

const app = express();

// ===== Middleware =====
app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: "*", 
    credentials: true, // allow cookies (JWT in cookies)
  })
);

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
    message: `Welcome ${req.user.userId}, this is a protected route`,
  });
});

// ===== Feature Routes =====
app.use("/api/home", authenticateToken, homeRoutes);
app.use("/api/plant", plantRoutes); 
app.use("/api/tasks", taskRoutes);
app.use("/api/gardens", authenticateToken, gardenRoutes);

// ===== Error Handling =====
app.use((err, req, res, next) => {
  console.error("⚠️ Error:", err.message);
  res.status(err.status || 500).json({
    error: err.message || "Internal Server Error",
  });
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
