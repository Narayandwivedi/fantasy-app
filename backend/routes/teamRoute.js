const express = require("express");
const router = express.Router();


const {getAllTeam , getTeamById , addNewPlayerToTeam , removePlayerFromTeam , createTeam} = require("../controllers/teamController")


router.get("/", getAllTeam);

router.get("/:id", getTeamById);

router.post("/", createTeam);

router.post("/:id/add-player", addNewPlayerToTeam);

router.delete("/:id/remove-player/:playerId", removePlayerFromTeam);



module.exports = router