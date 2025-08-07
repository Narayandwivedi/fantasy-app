const express = require("express");
const { createDeposit, getUserDeposits, getAllDeposits } = require("../controllers/depositController");
const router = express.Router();
const auth = require("../middleware/auth")

// Create new deposit
router.post("/", createDeposit);

// Get user's deposit history
router.get("/user/:userId", getUserDeposits);

// Get all deposits (admin only - add auth middleware later)
router.get("/", getAllDeposits);

module.exports = router;