const express = require("express");
const { createDeposit, getUserDeposits, getAllDeposits, approveDeposit, rejectDeposit } = require("../controllers/depositController");
const router = express.Router();
const auth = require("../middleware/auth")

// Create new deposit
router.post("/", createDeposit);

// Get user's deposit history
router.get("/user/:userId", getUserDeposits);

// Get all deposits (admin only - add auth middleware later)
router.get("/", getAllDeposits);

// Admin approve deposit
router.patch("/:depositId/approve", approveDeposit);

// Admin reject deposit
router.patch("/:depositId/reject", rejectDeposit);

module.exports = router;