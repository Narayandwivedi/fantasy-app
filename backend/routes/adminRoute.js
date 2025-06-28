const express = require("express");
const router = express.Router();

const {
  createTeam,
  createPlayer,
  createMatch,
  getAllMatch,
  getAllPlayers,
  getAllTeam,
  getTeamById,
  addNewPlayerToTeam
} = require("../controllers/adminController");

// router.get("/stats")

router.get("/match", getAllMatch);
router.get("/players", getAllPlayers);


// manage teams

router.get("/teams", getAllTeam);
router.get("/teams/:id", getTeamById);
router.post("/teams/:id/add-player",addNewPlayerToTeam)
router.post("/teams", createTeam);
router.post("/create-match", createMatch);
router.post("/create-player", createPlayer);

module.exports = router;
