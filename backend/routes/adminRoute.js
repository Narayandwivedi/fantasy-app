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
  addNewPlayerToTeam,
  removePlayerFromTeam,
  updatePlayer
  
} = require("../controllers/adminController");

// router.get("/stats")

router.get("/match", getAllMatch);
router.get("/players", getAllPlayers);

// manage teams

router.get("/teams", getAllTeam);
router.get("/teams/:id", getTeamById);
router.post("/teams/:id/add-player", addNewPlayerToTeam);
router.delete("/teams/:id/remove-player", removePlayerFromTeam);
router.post("/teams", createTeam);

router.post("/create-match", createMatch);

// players
router.post("/create-player", createPlayer);
router.put("/update-player/:id",updatePlayer);

module.exports = router;
