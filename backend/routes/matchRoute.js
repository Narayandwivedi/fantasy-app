const express = require("express");
const router = express.Router();

const {
  getAllMatch,
  createMatch,
  getLiveMatch,
  getUpcomingMatch,
  getCompletedMatch,
  changeMatchStatus,
  changeMatchPlaying11,
  createMatchScore,
  updateMatchScore,
} = require("../controllers/matchController");

router.get("/", getAllMatch);
router.get("/live", getLiveMatch);
router.get("/upcoming", getUpcomingMatch);
router.get("/completed", getCompletedMatch);

router.put("/:matchId/status", changeMatchStatus);
router.put("/matchId/playing11", changeMatchPlaying11);
router.put("/:matchId/update-score", updateMatchScore);

router.post("/", createMatch);
router.post("/:matchId/create-Score", createMatchScore);

// router.put("/change-status")

module.exports = router;
