const express = require("express");
const {
  createContest,
  getContest,
  joinContest
} = require("../controllers/contestController");
const router = express.Router();


router.post("/join",joinContest)
router.post("/:matchId", createContest);
router.get("/:matchId", getContest);


module.exports = router;
