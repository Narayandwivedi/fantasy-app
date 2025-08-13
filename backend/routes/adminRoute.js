const express = require("express");
const rateLimit = require("express-rate-limit");
const {
  adminLogin,
  adminLogout,
  getAdminStatus,
  getAdminStats,
  changeAdminPassword
} = require("../controllers/adminController.js");
const auth = require("../middleware/auth");
const isAdmin = require("../middleware/isAdmin");

const router = express.Router();

// Rate limiting for admin authentication (stricter than regular users)
const adminAuthLimiter = rateLimit({
  windowMs: 30 * 60 * 1000, // 30 minutes
  limit: 10, // Only 10 attempts per 30 minutes for admin login
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res) => {
    console.warn(`Admin rate limit exceeded from IP: ${req.ip}`);
    res.status(429).json({
      success: false,
      message: "Too many admin login attempts. Try again later.",
    });
  },
});

// Rate limiting for admin operations
const adminOperationLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  limit: 100, // 100 requests per 15 minutes
  handler: (req, res) => {
    res.status(429).json({
      success: false,
      message: "Too many admin requests. Please slow down.",
    });
  },
});

// Admin Authentication Routes
router.post("/login", adminAuthLimiter, adminLogin);
router.post("/logout", auth, isAdmin, adminLogout);
router.get("/status", getAdminStatus);

// Admin Dashboard Routes
router.get("/stats", auth, isAdmin, adminOperationLimiter, getAdminStats);

// Admin Profile Routes
router.put("/change-password", auth, isAdmin, adminOperationLimiter, changeAdminPassword);

module.exports = router;