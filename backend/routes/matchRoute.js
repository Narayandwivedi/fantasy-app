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
router.get("/live-match", getLiveMatch);
router.get("/upcoming-match", getUpcomingMatch);
router.get("/completed-match", getCompletedMatch);

router.post("/", createMatch);

// router.put("/change-status")


module.exports = router;
