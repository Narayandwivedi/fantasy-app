const express = require("express");
const {
  createContest,
  getContestsByMatch,
  getUserJoinedContests,
  joinContest,
  getUserMatches,
  getUserContestsByMatch
} = require("../controllers/contestController");
const router = express.Router();


router.post("/join", joinContest);
router.post("/:matchId", createContest);
router.get("/:matchId", getContestsByMatch);
router.get("/user/:userId", getUserJoinedContests);
router.get("/matches/:userId", getUserMatches);
router.get("/user/:userId/match/:matchId", getUserContestsByMatch);


module.exports = router;
