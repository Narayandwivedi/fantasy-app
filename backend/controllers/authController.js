const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const userModel = require("../models/User.js");
const transporter = require("../config/Nodemailer.js");
const axios = require("axios");
const { OAuth2Client } = require('google-auth-library');

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// Helper functions for masking sensitive data
function maskUpiId(upiId) {
  if (!upiId) return upiId;

  const atIndex = upiId.indexOf("@");
  if (atIndex === -1) return maskString(upiId, 4);

  const namePart = upiId.substring(0, atIndex);
  const domainPart = upiId.substring(atIndex);

  const maskedName =
    namePart.length > 4
      ? "*".repeat(namePart.length - 4) + namePart.slice(-4)
      : namePart;

  return maskedName + domainPart;
}

function maskString(str, visibleChars = 4) {
  if (!str || str.length <= visibleChars) return str;
  return "*".repeat(str.length - visibleChars) + str.slice(-visibleChars);
}

const handelUserSignup = async (req, res) => {
  try {
    if (!req.body || Object.keys(req.body).length === 0) {
      return res.status(400).json({ success: false, message: "missing data" });
    }

    let { fullName, email, password, referedBy, mobile } = req.body;

    // Trim input fields
    fullName = fullName?.trim();
    email = email?.trim();
    password = password?.trim();
    referedBy = referedBy?.trim();

    if (!fullName || !email || !password || !mobile) {
      return res.status(400).json({ success: false, message: "missing field" });
    }

    // Validate Indian mobile number (now mandatory)
    if (mobile < 6000000000 || mobile > 9999999999) {
      return res.status(400).json({
        success: false,
        message: "Please enter a valid Indian mobile number",
      });
    }

    // Check if user already exists by email or mobile
    const existingUser = await userModel.findOne({
      $or: [{ email }, { mobile }]
    });

    if (existingUser) {
      if (existingUser.email === email) {
        return res.status(400).json({
          success: false,
          message: "Email already exists",
        });
      }
      if (existingUser.mobile === mobile) {
        return res.status(400).json({
          success: false,
          message: "Mobile number already exists",
        });
      }
    }

    // Handle referral
    if (referedBy) {
      const referer = await userModel.findOne({ referralCode: referedBy });
      if (!referer) {
        return res
          .status(400)
          .json({ success: false, message: "Invalid referral code" });
      }
    }

    // Generate unique referral code
    const referralCode = generateReferralCode();

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 8);

    const newUserData = {
      fullName,
      email,
      password: hashedPassword,
      referralCode,
      mobile, // Mobile is now mandatory for normal signup
    };

    if (referedBy) {
      newUserData.referedBy = referedBy;
      newUserData.balance = 20;
    }

    // Create new user
    const newUser = await userModel.create(newUserData);

    // Update referer after user creation (now we have the new user's ID)
    if (referedBy) {
      const referer = await userModel.findOne({ referralCode: referedBy });
      if (referer) {
        referer.totalReferrals += 1;
        referer.referredUsers.push({
          userId: newUser._id,
          referredAt: new Date()
        });
        await referer.save();
      }
    }

    // Generate JWT token (no expiration)
    const token = jwt.sign({ userId: newUser._id }, process.env.JWT_SECRET);

    res.cookie("token", token, {
      httpOnly: true,
      sameSite: process.env.NODE_ENV === "production" ? "None" : "Lax",
      secure: process.env.NODE_ENV === "production",
      maxAge: 365 * 24 * 60 * 60 * 1000, // 1 year - user stays logged in forever
    });

    // Remove password before sending response
    const userObj = newUser.toObject();
    delete userObj.password;

    return res.status(201).json({
      success: true,
      message: "user created successfully",
      userData: userObj,
    });
  } catch (err) {
    console.log(err.message);
    return res.status(500).json({ message: err.message });
  }
};

const handelUserLogin = async (req, res) => {
  try {
    const { emailOrMobile, password } = req.body;

    if (!emailOrMobile || !password) {
      return res.status(400).json({
        success: false,
        message: "Email/Mobile and password are required",
      });
    }

    // Check if input is email or mobile number
    const isEmail = emailOrMobile.includes("@");
    const isMobile = /^[6-9]\d{9}$/.test(emailOrMobile);

    if (!isEmail && !isMobile) {
      return res.status(400).json({
        success: false,
        message: "Please enter a valid email or mobile number",
      });
    }

    // Find user by email or mobile
    const query = isEmail
      ? { email: emailOrMobile }
      : { mobile: parseInt(emailOrMobile) };

    const user = await userModel.findOne(query).lean();

    if (!user) {
      return res.status(401).json({
        success: false,
        message: isEmail ? "Invalid email" : "Invalid mobile number",
      });
    }

    const isPassMatch = await bcrypt.compare(password, user.password);
    if (!isPassMatch) {
      return res
        .status(401)
        .json({ success: false, message: "Invalid password" });
    }

    // Convert to object for manipulation
    const userObj = user.toObject();
    
    // Mask sensitive banking information and keep only necessary fields
    if (userObj.bankAccount) {
      userObj.bankAccount = {
        accountNumber: maskString(userObj.bankAccount.accountNumber, 4)
      };
    }

    if (userObj.upiId) {
      userObj.upiId = {
        upi: maskUpiId(userObj.upiId.upi)
      };
    }

    // Remove unnecessary/sensitive fields
    delete userObj.password;
    delete userObj.resetOtp;
    delete userObj.otpExpiresAt;
    delete userObj.kycDocuments;
    delete userObj.isBankAdded;
    delete userObj.isUpiAdded;
    delete userObj.googleId;
    delete userObj.authProvider;
    delete userObj.createdAt;
    delete userObj.updatedAt;
    delete userObj.lastActive;
    delete userObj.referedBy;
    delete userObj.dateOfBirth;
    delete userObj.mobile;
    delete userObj.__v;

    const token = jwt.sign(
      { userId: user._id, role: user.role },
      process.env.JWT_SECRET
      // No expiration
    );

    res.cookie("token", token, {
      httpOnly: true,
      sameSite: process.env.NODE_ENV === "production" ? "None" : "Lax",
      secure: process.env.NODE_ENV === "production",
      maxAge: 365 * 24 * 60 * 60 * 1000, // 1 year - user stays logged in forever
    });

    sendLoginAlert(user.fullName).catch((err) =>
      console.error("Telegram Error:", err.message)
    );

    return res.status(200).json({
      success: true,
      message: "user logged in successfully",
      userData: userObj,
    });
  } catch (err) {
    console.error("Login Error:", err.message);
    return res
      .status(500)
      .json({ success: false, message: "Something went wrong" });
  }
};

// Admin login moved to separate adminController.js

const handleUserLogout = async (req, res) => {
  try {
    res.clearCookie("token", {
      httpOnly: true,
      sameSite: process.env.NODE_ENV === "production" ? "None" : "Lax",
      secure: process.env.NODE_ENV === "production",
    });
    return res.status(200).json({ success: true, message: "User logged out" });
  } catch (error) {
    console.error("Logout Error:", error.message);
    return res.status(500).json({ success: false, message: "Logout failed" });
  }
};

const generateResetPassOTP = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res
        .status(400)
        .json({ success: false, message: "please provide email address" });
    }

    const getUser = await userModel.findOne({ email });

    if (!getUser) {
      return res.status(400).json({
        success: false,
        message: `user with this email doesn't exist`,
      });
    }

    const otp = Math.floor(100000 + Math.random() * 900000);
    getUser.resetOtp = otp;
    getUser.otpExpiresAt = Date.now() + 10 * 60 * 1000; // 10 mins
    await getUser.save();

    const mailOptions = {
      from: "winnersclubsofficial@gmail.com",
      to: email,
      subject: "Account password reset OTP",
      text: `Your OTP for password reset is: ${otp}. It will expire in 10 minutes.`,
    };

    await transporter.sendMail(mailOptions);
    return res.json({ success: true, message: "otp sent successfully" });
  } catch (err) {
    console.error("Generate OTP Error:", err);
    return res
      .status(500)
      .json({ success: false, message: "internal server error" });
  }
};

const submitResetPassOTP = async (req, res) => {
  try {
    const { otp, newPass, email } = req.body;

    if (!otp || !newPass || !email) {
      return res.status(400).json({ success: false, message: "missing data" });
    }

    const getUser = await userModel.findOne({ email });
    if (!getUser) {
      return res
        .status(400)
        .json({ success: false, message: "user not found try again" });
    }

    // Check if OTP exists
    if (!getUser.resetOtp) {
      return res
        .status(400)
        .json({ success: false, message: "no otp found for this user" });
    }

    // Check if OTP is expired
    if (getUser.otpExpiresAt < Date.now()) {
      // Clear expired OTP
      getUser.resetOtp = undefined;
      getUser.otpExpiresAt = undefined;
      await getUser.save();
      return res.status(400).json({ success: false, message: "otp expired" });
    }

    // Convert both OTP values to numbers for comparison
    if (Number(otp) === Number(getUser.resetOtp)) {
      const newHashedPass = await bcrypt.hash(newPass, 10);
      getUser.password = newHashedPass;

      // Clear OTP fields after successful password reset
      getUser.resetOtp = undefined;
      getUser.otpExpiresAt = undefined;

      await getUser.save();

      return res.json({
        success: true,
        message: "password reset successfully",
      });
    } else {
      return res.status(400).json({ success: false, message: "invalid otp" });
    }
  } catch (err) {
    console.error("Submit OTP Error:", err);
    return res.status(500).json({ success: false, message: "server error" });
  }
};

const isloggedin = async (req, res) => {
  const token = req.cookies.token;

  if (!token) {
    return res
      .status(401)
      .json({ isLoggedIn: false, message: "No token found" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await userModel
      .findById(decoded.userId)
      .select("-password");

    // Convert to object for manipulation
    const userObj = user.toObject();
    
    // Mask sensitive banking information and keep only necessary fields
    if (userObj.bankAccount) {
      userObj.bankAccount = {
        accountNumber: maskString(userObj.bankAccount.accountNumber, 4)
      };
    }

    if (userObj.upiId) {
      userObj.upiId = {
        upi: maskUpiId(userObj.upiId.upi)
      };
    }

    // Remove unnecessary/sensitive fields
    delete userObj.password;
    delete userObj.resetOtp;
    delete userObj.otpExpiresAt;
    delete userObj.kycDocuments;
    delete userObj.isBankAdded;
    delete userObj.isUpiAdded;
    delete userObj.googleId;
    delete userObj.authProvider;
    delete userObj.createdAt;
    delete userObj.updatedAt;
    delete userObj.lastActive;
    delete userObj.referedBy;
    delete userObj.dateOfBirth;
    delete userObj.mobile;
    delete userObj.__v;

    // Check if user is returning after being away (more than 1 hour)
    const now = new Date();
    const oneHourAgo = new Date(now.getTime() - 60 * 60 * 1000);
    
    if (!user.lastActive || user.lastActive < oneHourAgo) {
      // User is returning after being away
      sendReturnAlert(user.fullName).catch((err) =>
        console.error("Telegram Error:", err.message)
      );
    }

    // Update last active time (need to update on original user object)
    user.lastActive = now;
    await user.save();

    return res.status(200).json({ isLoggedIn: true, user: userObj });
  } catch (err) {
    return res
      .status(401)
      .json({ isLoggedIn: false, message: "Invalid or expired token" });
  }
};

// Helper functions
function generateReferralCode() {
  const chars = "abcdefghijklmnopqrstuvwxyz0123456789";
  let code = "";
  for (let i = 0; i < 7; i++) {
    const randomIndex = Math.floor(Math.random() * chars.length);
    code += chars[randomIndex];
  }
  return code;
}

// Send login alert function
const sendLoginAlert = async (userName) => {
  const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
  const CHAT_ID = process.env.TELEGRAM_GROUP_ID;

  const message = `🔐 NEW LOGIN: ${userName} just logged in!`;
  const url = `https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`;

  try {
    await axios.post(url, {
      chat_id: CHAT_ID,
      text: message,
    });
  } catch (err) {
    console.error("Telegram error:", err.message);
  }
};

// Send return alert function
const sendReturnAlert = async (userName) => {
  const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
  const CHAT_ID = process.env.TELEGRAM_GROUP_ID;

  const message = `👋 RETURN VISIT: ${userName} is back on the app!`;
  const url = `https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`;

  try {
    await axios.post(url, {
      chat_id: CHAT_ID,
      text: message,
    });
  } catch (err) {
    console.error("Telegram error:", err.message);
  }
};

// Function to mask upi id
function maskUpiId(upiId) {
  if (!upiId) return upiId;

  const atIndex = upiId.indexOf("@");
  if (atIndex === -1) return maskString(upiId, 4);

  const namePart = upiId.substring(0, atIndex);
  const domainPart = upiId.substring(atIndex);

  const maskedName =
    namePart.length > 4
      ? "*".repeat(namePart.length - 4) + namePart.slice(-4)
      : namePart;

  return maskedName + domainPart;
}

// Function to mask string
function maskString(str, visibleChars = 4) {
  if (!str || str.length <= visibleChars) return str;
  return "*".repeat(str.length - visibleChars) + str.slice(-visibleChars);
}

// Google OAuth Handler
const handleGoogleAuth = async (req, res) => {
  try {
   
    const { credential, referedBy } = req.body;

    if (!credential) {
      return res.status(400).json({
        success: false,
        message: "Google credential is required"
      });
    }

    // Verify Google token
    const ticket = await client.verifyIdToken({
      idToken: credential,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();

    const {
      sub: googleId,
      email,
      name: fullName,
      picture: profilePicture,
      email_verified
    } = payload;

    if (!email_verified) {
      return res.status(400).json({
        success: false,
        message: "Google email not verified"
      });
    }
    // Check if user exists
    let user = await userModel.findOne({ 
      $or: [
        { email: email },
        { googleId: googleId }
      ]
    });

    if (user) {
      // User exists, update Google info if needed
      if (!user.googleId) {
        user.googleId = googleId;
        user.profilePicture = profilePicture;
        user.authProvider = 'google';
        user.isEmailVerified = true;
        await user.save();
      }
    } else {
      // Handle referral validation (don't update referer yet, do it after user creation)
      let validReferer = null;
      if (referedBy) {
        validReferer = await userModel.findOne({ referralCode: referedBy });
        // Don't block user creation for invalid referral codes
      }
      
      // Create new user
      const referralCode = generateReferralCode();
      
      const newUserData = {
        fullName,
        email,
        googleId,
        profilePicture,
        isEmailVerified: email_verified,
        referralCode,
        authProvider: 'google',
        // Don't set password for Google users
        // Don't set mobile for Google users (will be null)
      };

      // Add referral data if valid referral code was provided
      if (referedBy && validReferer) {
        newUserData.referedBy = referedBy;
      }

      user = new userModel(newUserData);
      await user.save();

      // Update referer after user creation (now we have the new user's ID)
      if (referedBy && validReferer) {
        validReferer.totalReferrals += 1;
        validReferer.referredUsers.push({
          userId: user._id,
          referredAt: new Date()
        });
        await validReferer.save();
      }

      // Send new user alert
      sendGoogleSignupAlert(user.fullName).catch((err) =>
        console.error("Telegram Error:", err.message)
      );
    }

    // Generate JWT token (no expiration)
    const token = jwt.sign(
      { userId: user._id, role: user.role },
      process.env.JWT_SECRET
      // No expiration
    );

    // Set cookie (no expiration)
    res.cookie('token', token, {
      httpOnly: true,
      sameSite: process.env.NODE_ENV === "production" ? "None" : "Lax",
      secure: process.env.NODE_ENV === "production",
      maxAge: 365 * 24 * 60 * 60 * 1000, // 1 year - user stays logged in forever
    });

    // Prepare user data for response
    const userObj = user.toObject();
    delete userObj.password;

    // Mask sensitive banking information and keep only necessary fields
    if (userObj.bankAccount) {
      userObj.bankAccount = {
        accountNumber: maskString(userObj.bankAccount.accountNumber, 4)
      };
    }

    if (userObj.upiId) {
      userObj.upiId = {
        upi: maskUpiId(userObj.upiId.upi)
      };
    }

    // Remove unnecessary/sensitive fields
    delete userObj.resetOtp;
    delete userObj.otpExpiresAt;
    delete userObj.kycDocuments;
    delete userObj.isBankAdded;
    delete userObj.isUpiAdded;
    delete userObj.googleId;
    delete userObj.authProvider;
    delete userObj.createdAt;
    delete userObj.updatedAt;
    delete userObj.lastActive;
    delete userObj.referedBy;
    delete userObj.dateOfBirth;
    delete userObj.mobile;
    delete userObj.__v;

    return res.status(200).json({
      success: true,
      message: 'Google authentication successful',
      userData: userObj
    });

  } catch (error) {
    console.error('Google authentication error:', error.message);
    
    return res.status(400).json({
      success: false,
      message: 'Google authentication failed',
      error: error.message
    });
  }
};

// Send Google signup alert function
const sendGoogleSignupAlert = async (userName) => {
  const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
  const CHAT_ID = process.env.TELEGRAM_GROUP_ID;

  const message = `🔐 NEW GOOGLE SIGNUP: ${userName} signed up with Google!`;
  const url = `https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`;

  try {
    await axios.post(url, {
      chat_id: CHAT_ID,
      text: message,
    });
  } catch (err) {
    console.error("Telegram error:", err.message);
  }
};


module.exports = {
  handelUserSignup,
  handelUserLogin,
  handleUserLogout,
  generateResetPassOTP,
  submitResetPassOTP,
  isloggedin,
  handleGoogleAuth,
};