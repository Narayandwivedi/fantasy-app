const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const userModel = require("../models/User.js");
const Player = require("../models/Player.js");
const axios = require("axios");

// Helper function to mask sensitive data
function maskString(str, visibleChars = 4) {
  if (!str || str.length <= visibleChars) return str;
  return "*".repeat(str.length - visibleChars) + str.slice(-visibleChars);
}


// Admin Login Controller
const adminLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required"
      });
    }

    // Find user by email
    const user = await userModel.findOne({ email }).lean();
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid admin credentials"
      });
    }

    // Critical: Check if user is admin
    if (user.role !== "admin") {
      // Log potential security breach attempt
      console.warn(`Non-admin user attempted admin login: ${email} from IP: ${req.ip}`);
      
      return res.status(403).json({
        success: false,
        message: "Admin access denied. This incident will be logged."
      });
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: "Invalid admin credentials"
      });
    }

    // Generate JWT token with admin role
    const token = jwt.sign(
      { 
        userId: user._id, 
        role: user.role,
        isAdmin: true // Extra flag for admin sessions
      },
      process.env.JWT_SECRET
      // No expiration for admin sessions
    );

    // Set secure admin cookie
    const cookieOptions = {
      httpOnly: true,
      sameSite: process.env.NODE_ENV === "production" ? "None" : "Lax",
      secure: process.env.NODE_ENV === "production",
      maxAge: 365 * 24 * 60 * 60 * 1000, // 1 year for admin convenience
    };
    
    console.log("Setting admin cookie with options:", cookieOptions);
    console.log("Environment:", process.env.NODE_ENV);
    
    res.cookie("token", token, cookieOptions);

    // Prepare admin response data
    const adminData = {
      _id: user._id,
      fullName: user.fullName,
      email: user.email,
      role: user.role,
      isEmailVerified: user.isEmailVerified,
      totalReferrals: user.totalReferrals || 0,
      createdAt: user.createdAt
    };

    // Log successful admin login
    console.log(`Admin login successful: ${user.fullName} (${user.email}) at ${new Date().toISOString()}`);
    
    // Send admin login alert
    sendAdminLoginAlert(user.fullName, req.ip).catch(err => 
      console.error("Admin login alert failed:", err.message)
    );

    return res.status(200).json({
      success: true,
      message: "Admin login successful",
      userData: adminData
    });

  } catch (error) {
    console.error("Admin login error:", error.message);
    return res.status(500).json({
      success: false,
      message: "Admin login failed. Please try again."
    });
  }
};

// Admin Logout Controller
const adminLogout = async (req, res) => {
  try {
    // Log admin logout
    const adminId = req.user?.userId;
    if (adminId) {
      console.log(`Admin logout: ${req.user.userId} at ${new Date().toISOString()}`);
    }

    // Clear admin cookie
    res.clearCookie("token", {
      httpOnly: true,
      sameSite: process.env.NODE_ENV === "production" ? "None" : "Lax",
      secure: process.env.NODE_ENV === "production",
    });

    return res.status(200).json({
      success: true,
      message: "Admin logged out successfully"
    });

  } catch (error) {
    console.error("Admin logout error:", error.message);
    return res.status(500).json({
      success: false,
      message: "Logout failed"
    });
  }
};

// Get Admin Status Controller
const getAdminStatus = async (req, res) => {
  const token = req.cookies.token;

  console.log("Admin status check:");
  console.log("- Token present:", !!token);
  console.log("- All cookies:", req.cookies);
  console.log("- User agent:", req.get('User-Agent'));

  if (!token) {
    console.log("No token found, returning unauthorized");
    return res.status(401).json({
      isLoggedIn: false,
      isAdmin: false,
      message: "No admin session found"
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Find admin user
    const user = await userModel.findById(decoded.userId).lean();
    
    if (!user || user.role !== "admin") {
      return res.status(403).json({
        isLoggedIn: false,
        isAdmin: false,
        message: "Admin access required"
      });
    }

    // Prepare clean admin data
    const adminData = {
      _id: user._id,
      fullName: user.fullName,
      email: user.email,
      role: user.role,
      isEmailVerified: user.isEmailVerified,
      totalReferrals: user.totalReferrals || 0,
      createdAt: user.createdAt
    };

    return res.status(200).json({
      isLoggedIn: true,
      isAdmin: true,
      user: adminData
    });

  } catch (error) {
    console.error("Admin status check error:", error.message);
    return res.status(401).json({
      isLoggedIn: false,
      isAdmin: false,
      message: "Invalid admin session"
    });
  }
};

// Get Admin Dashboard Stats
const getAdminStats = async (req, res) => {
  try {
    // Get total users
    const totalUsers = await userModel.countDocuments({});
    
    // Get total admins
    const totalAdmins = await userModel.countDocuments({ role: "admin" });
    
    // Get users registered today
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const usersToday = await userModel.countDocuments({
      createdAt: { $gte: today }
    });

    // Get total referrals
    const referralStats = await userModel.aggregate([
      {
        $group: {
          _id: null,
          totalReferrals: { $sum: "$totalReferrals" }
        }
      }
    ]);

    const stats = {
      totalUsers: totalUsers,
      totalAdmins: totalAdmins,
      usersToday: usersToday,
      totalReferrals: referralStats[0]?.totalReferrals || 0,
      lastUpdated: new Date().toISOString()
    };

    return res.status(200).json({
      success: true,
      stats: stats
    });

  } catch (error) {
    console.error("Admin stats error:", error.message);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch admin statistics"
    });
  }
};


// Delete Player Controller (Admin Only)
const deletePlayer = async (req, res) => {
  try {
    const { playerId } = req.params;
    const adminId = req.user?.userId;

    console.log("Delete player request:");
    console.log("- req.user:", req.user);
    console.log("- adminId:", adminId);
    console.log("- playerId:", playerId);
    console.log("- req.cookies.token:", req.cookies.token ? "Present" : "Missing");
    
    if (!playerId) {
      return res.status(400).json({
        success: false,
        message: "Player ID is required"
      });
    }

    // Check if admin user is authenticated
    if (!adminId || req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: "Admin access required"
      });
    }

    // Check if player exists
    const player = await Player.findById(playerId);
    if (!player) {
      return res.status(404).json({
        success: false,
        message: "Player not found"
      });
    }

    // Delete the player
    await Player.findByIdAndDelete(playerId);

    // Log the deletion for security
    console.log(`Admin ${req.user.userId} deleted player: ${player.firstName} ${player.lastName} (${playerId}) at ${new Date().toISOString()}`);

    // Send admin deletion alert
    sendAdminDeletionAlert(req.user.fullName || 'Unknown Admin', `${player.firstName} ${player.lastName}`, req.ip).catch(err => 
      console.error("Admin deletion alert failed:", err.message)
    );

    return res.status(200).json({
      success: true,
      message: "Player deleted successfully"
    });

  } catch (error) {
    console.error("Delete player error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to delete player"
    });
  }
};

// Send admin login alert to Telegram
const sendAdminLoginAlert = async (adminName, ipAddress) => {
  const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
  const CHAT_ID = process.env.TELEGRAM_GROUP_ID;

  if (!BOT_TOKEN || !CHAT_ID) {
    console.log("Telegram credentials not configured for admin alerts");
    return;
  }

  const message = `🚨 ADMIN LOGIN ALERT 🚨\n\nAdmin: ${adminName}\nIP: ${ipAddress}\nTime: ${new Date().toLocaleString()}\n\n⚠️ Monitor admin activities closely`;
  const url = `https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`;

  try {
    await axios.post(url, {
      chat_id: CHAT_ID,
      text: message,
    });
  } catch (err) {
    console.error("Telegram admin alert error:", err.message);
  }
};

// Send admin deletion alert to Telegram
const sendAdminDeletionAlert = async (adminName, playerName, ipAddress) => {
  const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
  const CHAT_ID = process.env.TELEGRAM_GROUP_ID;

  if (!BOT_TOKEN || !CHAT_ID) {
    console.log("Telegram credentials not configured for admin alerts");
    return;
  }

  const message = `🗑️ PLAYER DELETION ALERT 🗑️\n\nAdmin: ${adminName}\nDeleted Player: ${playerName}\nIP: ${ipAddress}\nTime: ${new Date().toLocaleString()}\n\n⚠️ Player permanently removed from database`;
  const url = `https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`;

  try {
    await axios.post(url, {
      chat_id: CHAT_ID,
      text: message,
    });
  } catch (err) {
    console.error("Telegram admin deletion alert error:", err.message);
  }
};

module.exports = {
  adminLogin,
  adminLogout,
  getAdminStatus,
  getAdminStats,
  deletePlayer
};