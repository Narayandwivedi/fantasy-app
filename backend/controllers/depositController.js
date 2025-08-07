const mongoose = require("mongoose");
const Deposit = require("../models/Deposit");
const User = require("../models/User");

async function createDeposit(req, res) {
  try {
    const { userId, amount, UTR } = req.body;

    // Validate required fields
    if (!userId || !amount || !UTR) {
      return res
        .status(400)
        .json({ success: false, message: "Missing required fields: userId, amount, UTR" });
    }

    // Validate mongoose object id
    if (!mongoose.isValidObjectId(userId)) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid user ID format" });
    }

    // Validate amount (fixed logic)
    if (amount < 1 || amount > 500000) {
      return res.status(400).json({
        success: false,
        message: "Amount must be between ₹1 and ₹5,00,000",
      });
    }

    // Validate amount is a number
    if (isNaN(amount)) {
      return res.status(400).json({
        success: false,
        message: "Amount must be a valid number",
      });
    }

    // Validate UTR format
    if (typeof UTR !== 'string' || UTR.trim().length < 10 || UTR.trim().length > 20) {
      return res.status(400).json({ 
        success: false, 
        message: "UTR must be between 10-20 characters" 
      });
    }

   // Check if user exists
    const userExists = await User.findById(userId);
    if (!userExists) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    // if(depos)


    // Check if UTR already exists (prevent duplicate submissions)
    const existingDeposit = await Deposit.findOne({ UTR: UTR.trim() });
    if (existingDeposit) {
      return res.status(409).json({
        success: false,
        message: "UTR already exists. Duplicate deposit not allowed.",
      });
    }

    // Create deposit
    const newDeposit = await Deposit.create({
      userId,
      amount: parseFloat(amount),
      UTR: UTR.trim(),
    });

    return res.status(201).json({ 
      success: true, 
      message: "Deposit request submitted successfully",
      data: {
        depositId: newDeposit._id,
        amount: newDeposit.amount,
        status: newDeposit.status,
        UTR: newDeposit.UTR,
      }
    });
  } catch (err) {
    console.error("Error creating deposit:", err);
    
    // Handle duplicate key error (if UTR unique constraint fails)
    if (err.code === 11000) {
      return res.status(409).json({
        success: false,
        message: "UTR already exists. Duplicate deposit not allowed.",
      });
    }
    
    return res.status(500).json({ 
      success: false, 
      message: "Internal server error. Please try again." 
    });
  }
}

// Get user's deposit history
async function getUserDeposits(req, res) {
  try {
    const { userId } = req.params;
    const { page = 1, limit = 10 } = req.query;

    if (!mongoose.isValidObjectId(userId)) {
      return res.status(400).json({ success: false, message: "Invalid user ID" });
    }

    const deposits = await Deposit.find({ userId })
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .select('-__v');

    const totalDeposits = await Deposit.countDocuments({ userId });

    return res.json({
      success: true,
      data: {
        deposits,
        pagination: {
          currentPage: page,
          totalPages: Math.ceil(totalDeposits / limit),
          totalDeposits,
        }
      }
    });
  } catch (err) {
    console.error("Error fetching deposits:", err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
}

// Get all deposits (admin only)
async function getAllDeposits(req, res) {
  try {
    const { page = 1, limit = 20, status } = req.query;
    
    const filter = status ? { status } : {};
    
    const deposits = await Deposit.find(filter)
      .populate('userId', 'firstName lastName email')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const totalDeposits = await Deposit.countDocuments(filter);

    return res.json({
      success: true,
      data: {
        deposits,
        pagination: {
          currentPage: page,
          totalPages: Math.ceil(totalDeposits / limit),
          totalDeposits,
        }
      }
    });
  } catch (err) {
    console.error("Error fetching all deposits:", err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
}

module.exports = { createDeposit, getUserDeposits, getAllDeposits };
