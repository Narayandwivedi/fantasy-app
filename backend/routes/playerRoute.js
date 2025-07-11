const express = require("express");
const router = express.Router();


const {getAllPlayers , createPlayer , updatePlayer } = require("../controllers/playerController")



// get all player

router.get("/", getAllPlayers)

// create new player
router.post("/", createPlayer);

// update player
router.put("/:id",updatePlayer);

module.exports = router