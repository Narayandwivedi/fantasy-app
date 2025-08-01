const express = require("express");
const rateLimit = require("express-rate-limit");
const {
  handelUserSignup,
  handelUserLogin,
  handelAdminLogin,
  handleUserLogout,
  generateResetPassOTP,
  submitResetPassOTP,
  isloggedin,
} = require("../controllers/authController.js");

const router = express.Router();

// Rate limiting for authentication endpoints
const authLimiter = rateLimit({
  windowMs: 30 * 60 * 1000, // 30 minutes
  limit: 20,
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res) => {
    res.status(429).json({
      success: false,
      message: "Too many requests, try again later",
    });
  },
});

// Rate limiting for OTP endpoints
const otpLimiter = rateLimit({
  windowMs: 30 * 60 * 1000, // 30 minutes
  limit: 8,
  handler: (req, res) => {
    res.status(429).json({
      success: false,
      message: "Too many OTP requests. Try again later.",
    });
  },
});

// User Authentication Routes
router.post("/signup", handelUserSignup);
router.post("/login", authLimiter, handelUserLogin);
router.post("/logout", handleUserLogout);

// Admin Authentication Routes
router.post("/admin/login", authLimiter, handelAdminLogin);

// Password Reset Routes
router.post("/forgot-password", otpLimiter, generateResetPassOTP);
router.post("/reset-password", otpLimiter, submitResetPassOTP);

// Check Authentication Status
router.get("/status", isloggedin);

module.exports = router;