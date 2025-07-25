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
  getMatchScore,
  matchDetailsByID
} = require("../controllers/matchController");


router.get("/status/live", getLiveMatch);
router.get("/status/upcoming", getUpcomingMatch);
router.get("/status/completed", getCompletedMatch);

router.get("/", getAllMatch);
router.get("/:matchId", matchDetailsByID);

router.put("/:matchId/status", changeMatchStatus);

router.put("/:matchId/playing11", changeMatchPlaying11);


router.get("/:matchId/scores",getMatchScore)
router.post("/:matchId/scores", createMatchScore);
router.put("/:matchId/players/scores", updateMatchScore);

router.post("/", createMatch);


// router.put("/change-status")

module.exports = router;
