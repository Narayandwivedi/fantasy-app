const express = require("express");
const router = express.Router();

const {
  getAllMatch,
  createMatch,
  getLiveMatch,
  getUpcomingMatch,
  getCompletedMatch,
} = require("../controllers/matchController");

router.get("/", getAllMatch);
router.get("/live", getLiveMatch);
router.get("/upcoming", getUpcomingMatch);
router.get("/completed", getCompletedMatch);

router.post("/", createMatch);

// router.put("/change-status")


module.exports = router;
