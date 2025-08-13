const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");

const {
  handleAddBank,
  handleAddUpi,
  handleUpdateBank,
  handleUpdateUpi,
} = require("../controllers/userController.js");

// User Profile Management Routes (require authentication)
router.post("/addbank", auth, handleAddBank);
router.post("/addupi", auth, handleAddUpi);
router.put("/updatebank", auth, handleUpdateBank);
router.put("/updateupi", auth, handleUpdateUpi);

module.exports = router;
