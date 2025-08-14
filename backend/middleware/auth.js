const jwt = require("jsonwebtoken");
const userModel = require("../models/User.js");

const auth = async (req, res, next) => {
  try {
    const token = req.cookies.token;

    if (!token) {
      return res.status(401).json({ message: "Unauthorized - No token provided" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await userModel.findById(decoded.userId);

    if (!user) {
      return res.status(401).json({ message: "Unauthorized - User not found" });
    }

    // Set req.user with both the full user object and userId for consistency
    req.user = user;
    req.user.userId = user._id;
    next();
  } catch (error) {
    console.error("Auth middleware error:", error);
    return res.status(401).json({ message: "Unauthorized - Invalid token" });
  }
};

module.exports = auth;