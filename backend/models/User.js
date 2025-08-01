const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  fullName: {
    type: String,
    required: true,
  },
  dateOfBirth: {
    type: Date,
    // required: true,
  },
  mobile: {
    type: Number,
    required: true,
    unique: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },

  role: {
    type: String,
    enum: ["user", "admin"],
    default: "user",
  },

  password: {
    type: String,
    required: true,
  },


  balance: {
    type: Number,
    default: 0,
  },
  withdrawableBalance: {
    type: Number,
    default: 0,
  },
  referralCode: {
    type: String,
    unique: true,
  },
  referredBy: {
    type: String,
  },

  isFirstDeposit: {
    type: Boolean,
    default: true,
  },

  bankAccount: {
    accountHolderName: String,
    accountNumber: String,
    ifscCode: String,
    bankName: String,
  },

  upiId: {
    upi: { type: String },
    accountHolderName: { type: String },
  },

  isBankAdded: {
    type: Boolean,
    default: false,
  },
  isVerified: {
    type: Boolean,
    default: false,
  },
  isMobileVerified: {
    type: Boolean,
    default: false,
  },
  isEmailVerified: {
    type: Boolean,
    default: false,
  },
  totalReferrals: {
    type: Number,
    default: 0,
  },

  // Verification Status

  kycStatus: {
    type: String,
    enum: ["pending", "approved", "rejected"],
    default: "pending",
  },

  kycDocuments: {
    panCard: {
      number: String,
      imageUrl: String,
    },
    aadharCard: {
      number: String,
      imageUrl: String,
    },
  },

  // Gaming Statistics
  totalContestsJoined: {
    type: Number,
    default: 0,
  },
  totalContestsWon: {
    type: Number,
    default: 0,
  },

  resetOtp: String,
  otpExpiresAt: Date,
},{timestamps:true});

const User = mongoose.model("User", userSchema);
module.exports = User;
