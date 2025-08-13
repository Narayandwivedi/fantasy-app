const express = require("express");
const { createDeposit, getUserDeposits, getAllDeposits, approveDeposit, rejectDeposit } = require("../controllers/depositController");
const router = express.Router();
const auth = require("../middleware/auth");
const isAdmin = require("../middleware/isAdmin");

// Create new deposit (requires authentication)
router.post("/", auth, createDeposit);

// Get user's deposit history (requires authentication)
router.get("/user/:userId", auth, getUserDeposits);

// Get all deposits (admin only)
router.get("/", auth, isAdmin, getAllDeposits);

// Admin approve deposit (admin only)
router.patch("/:depositId/approve", auth, isAdmin, approveDeposit);

// Admin reject deposit (admin only)
router.patch("/:depositId/reject", auth, isAdmin, rejectDeposit);

module.exports = router;