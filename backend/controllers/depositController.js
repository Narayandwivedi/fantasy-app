const mongoose = require("mongoose");
const Deposit = require("../models/Deposit");
const User = require("../models/User");

async function createDeposit(req, res) {
  const session = await mongoose.startSession();
  
  try {
    session.startTransaction();
    
    const { userId, amount, UTR } = req.body;

    // Validate required fields
    if (!userId || !amount || !UTR) {
      return res
        .status(400)
        .json({
          success: false,
          message: "Missing required fields: userId, amount, UTR",
        });
    }

    // Parse and validate amount once
    const parsedAmount = parseInt(amount);

    if (isNaN(parsedAmount) || parsedAmount !== Number(amount)) {
      return res.status(400).json({
        success: false,
        message: "Amount must be a whole number (no decimals allowed)",
      });
    }

    // Validate mongoose object id
    if (!mongoose.isValidObjectId(userId)) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid user ID format" });
    }

    // Validate amount range
    if (parsedAmount < 1 || parsedAmount > 500000) {
      return res.status(400).json({
        success: false,
        message: "Amount must be between ₹1 and ₹5,00,000",
      });
    }

    // Validate UTR format
    if (
      typeof UTR !== "string" ||
      UTR.trim().length < 10 ||
      UTR.trim().length > 20
    ) {
      return res.status(400).json({
        success: false,
        message: "UTR must be between 10-20 characters",
      });
    }

    // Check if user exists
    const getUser = await User.findById(userId).session(session);
    if (!getUser) {
      await session.abortTransaction();
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    // Check if UTR already exists (prevent duplicate submissions)
    const existingDeposit = await Deposit.findOne({ UTR: UTR.trim() }).session(session);
    if (existingDeposit) {
      await session.abortTransaction();
      return res.status(409).json({
        success: false,
        message: "UTR already exists. Duplicate deposit not allowed.",
      });
    }

    const depositData = {
      userId,
      amount: parsedAmount,
      UTR: UTR.trim(),
    };

    // Auto-approve for deposits <= 300 and add balance immediately
    if (parsedAmount <= 300) {
      getUser.balance += parsedAmount;
      await getUser.save({ session });
      depositData.status = "auto-approved";
    }

    // Create deposit
    const newDeposit = await Deposit.create([depositData], { session });

    // Commit transaction
    await session.commitTransaction();

    return res.status(201).json({
      success: true,
      message: "Deposit request submitted successfully",
      data: {
        depositId: newDeposit[0]._id,
        amount: newDeposit[0].amount,
        status: newDeposit[0].status,
        UTR: newDeposit[0].UTR,
      },
    });
  } catch (err) {
    // Abort transaction on error
    await session.abortTransaction();
    console.error("Error creating deposit:", err);

    // Handle duplicate key error (if UTR unique constraint fails)
    if (err.code === 11000) {
      return res.status(409).json({
        success: false,
        message: "UTR already exists. Duplicate deposit not allowed.",
      });
    } 

    console.log(err.message);
    

    return res.status(500).json({
      success: false,
      message: "Internal server error. Please try again.",
    });
  } finally {
    session.endSession();
  }
}

// Get user's deposit history
async function getUserDeposits(req, res) {
  try {
    const { userId } = req.params;
    const { page = 1, limit = 10 } = req.query;

    if (!mongoose.isValidObjectId(userId)) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid user ID" });
    }

    const deposits = await Deposit.find({ userId })
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .select("-__v");

    const totalDeposits = await Deposit.countDocuments({ userId });

    return res.json({
      success: true,
      data: {
        deposits,
        pagination: {
          currentPage: page,
          totalPages: Math.ceil(totalDeposits / limit),
          totalDeposits,
        },
      },
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
      .populate("userId", "firstName lastName email")
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
        },
      },
    });
  } catch (err) {
    console.error("Error fetching all deposits:", err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
}

// Admin approve deposit (for both auto-approved and pending)
async function approveDeposit(req, res) {
  const session = await mongoose.startSession();
  
  try {
    session.startTransaction();
    
    const { depositId } = req.params;
    const { adminId } = req.body;

    if (!mongoose.isValidObjectId(depositId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid deposit ID format",
      });
    }

    // Find deposit
    const deposit = await Deposit.findById(depositId).session(session);
    if (!deposit) {
      await session.abortTransaction();
      return res.status(404).json({
        success: false,
        message: "Deposit not found",
      });
    }

    // Check if already approved or rejected
    if (deposit.status === "approved") {
      await session.abortTransaction();
      return res.status(400).json({
        success: false,
        message: "Deposit already approved",
      });
    }

    if (deposit.status === "rejected") {
      await session.abortTransaction();
      return res.status(400).json({
        success: false,
        message: "Cannot approve a rejected deposit",
      });
    }

    // Find user
    const user = await User.findById(deposit.userId).session(session);
    if (!user) {
      await session.abortTransaction();
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Only add balance for pending deposits (auto-approved already have balance added)
    if (deposit.status === "pending") {
      user.balance += deposit.amount;
      await user.save({ session });
    }
    
    deposit.status = "approved";
    deposit.processedBy = adminId;
    await deposit.save({ session });

    await session.commitTransaction();

    return res.json({
      success: true,
      message: "Deposit approved successfully",
      data: {
        depositId: deposit._id,
        amount: deposit.amount,
        status: deposit.status,
        newBalance: user.balance,
      },
    });

  } catch (err) {
    await session.abortTransaction();
    console.error("Error approving deposit:", err);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  } finally {
    session.endSession();
  }
}

// Admin reject deposit
async function rejectDeposit(req, res) {
  const session = await mongoose.startSession();
  
  try {
    session.startTransaction();
    
    const { depositId } = req.params;
    const { adminId, rejectionReason } = req.body;

    if (!mongoose.isValidObjectId(depositId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid deposit ID format",
      });
    }

    const deposit = await Deposit.findById(depositId).session(session);
    if (!deposit) {
      await session.abortTransaction();
      return res.status(404).json({
        success: false,
        message: "Deposit not found",
      });
    }

    if (deposit.status === "approved") {
      await session.abortTransaction();
      return res.status(400).json({
        success: false,
        message: "Cannot reject an approved deposit",
      });
    }

    if (deposit.status === "rejected") {
      await session.abortTransaction();
      return res.status(400).json({
        success: false,
        message: "Deposit already rejected",
      });
    }

    // If deposit was auto-approved, revert the balance from user account
    if (deposit.status === "auto-approved") {
      const user = await User.findById(deposit.userId).session(session);
      if (!user) {
        await session.abortTransaction();
        return res.status(404).json({
          success: false,
          message: "User not found",
        });
      }

      // Revert the balance (allow negative balance)
      const previousBalance = user.balance;
      user.balance -= deposit.amount;
      await user.save({ session });
      
      console.log(`Balance reverted: User ${user._id} balance changed from ₹${previousBalance} to ₹${user.balance} due to fake UTR rejection`);
    }

    deposit.status = "rejected";
    deposit.processedBy = adminId;
    deposit.rejectionReason = rejectionReason || "Not specified";
    await deposit.save({ session });

    await session.commitTransaction();

    return res.json({
      success: true,
      message: deposit.status === "auto-approved" ? 
        `Deposit rejected and ₹${deposit.amount} deducted from user balance (negative balance allowed)` : 
        "Deposit rejected successfully",
      data: {
        depositId: deposit._id,
        status: deposit.status,
        rejectionReason: deposit.rejectionReason,
        amountReverted: deposit.status === "auto-approved" ? deposit.amount : 0,
      },
    });

  } catch (err) {
    await session.abortTransaction();
    console.error("Error rejecting deposit:", err);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  } finally {
    session.endSession();
  }
}

module.exports = { 
  createDeposit, 
  getUserDeposits, 
  getAllDeposits, 
  approveDeposit, 
  rejectDeposit 
};
