const express = require("express");
const router = express.Router();


const {getAllTeam , getTeamById , addNewPlayerToTeam , removePlayerFromTeam , createTeam , deleteTeam} = require("../controllers/teamController")


router.get("/", getAllTeam);

router.get("/:id", getTeamById);

router.post("/", createTeam);

router.post("/:id/add-player", addNewPlayerToTeam);

router.delete("/:id/remove-player/:playerId", removePlayerFromTeam);

router.delete("/:id",deleteTeam)



module.exports = router