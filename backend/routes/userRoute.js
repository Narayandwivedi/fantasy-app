const express = require("express");
const router = express.Router();

const {
  handleAddBank,
  handleAddUpi,
} = require("../controllers/userController.js");

// User Profile Management Routes
router.post("/addbank", handleAddBank);
router.post("/addupi", handleAddUpi);

module.exports = router;
