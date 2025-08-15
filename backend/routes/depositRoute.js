const express = require("express");
const { createDeposit, getUserDeposits, getAllDeposits, approveDeposit, rejectDeposit } = require("../controllers/depositController");
const router = express.Router();
const auth = require("../middleware/auth");
const isAdmin = require("../middleware/isAdmin");

// Create new deposit (requires authentication)
router.post("/", auth, createDeposit);

// Get user's deposit history (requires authentication)
router.get("/user/:userId", getUserDeposits);

// Get all deposits (admin only)
router.get("/",  getAllDeposits);

// Admin approve deposit (admin only)
router.patch("/:depositId/approve", approveDeposit);

// Admin reject deposit (admin only)
router.patch("/:depositId/reject", rejectDeposit);

module.exports = router;