const express = require("express");
const router = express.Router();

const {
  getAllMatch,
  createMatch,

  getLiveMatch,
  getUpcomingMatch,
  getCompletedMatch,

  getAllPlayerOfAMatch,

  changeMatchStatus,
  matchDetailsByID
} = require("../controllers/matchController");

const {
  setMatchPlaying11AndCreateScores,
  getMatchPlaying11,
  updateMatchScore,
  getMatchScore,
  updateUserTeamPoints,
  resetMatchPointsToZero
} = require("../controllers/scoreController");


//  match by status
router.get("/status/live", getLiveMatch);
router.get("/status/upcoming", getUpcomingMatch);
router.get("/status/completed", getCompletedMatch);
router.put("/:matchId/status", changeMatchStatus);

// get match by id , get all player and get player list of a match
router.get("/", getAllMatch);
router.get("/:matchId", matchDetailsByID);
router.get("/:matchId/players",getAllPlayerOfAMatch)



// set and get playing 11 and score updates
router.put("/:matchId/playing11", setMatchPlaying11AndCreateScores);
router.get("/:matchId/playing11", getMatchPlaying11);
router.get("/:matchId/scores",getMatchScore)
router.put("/:matchId/players/scores", updateMatchScore);
router.put("/:matchId/update-user-team-points", updateUserTeamPoints);
router.delete("/:matchId/reset-points", resetMatchPointsToZero);

router.post("/", createMatch);


// router.put("/change-status")

module.exports = router;
