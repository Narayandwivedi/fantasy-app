const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const isAdmin = require("../middleware/isAdmin");

const {getAllPlayers , createPlayer , updatePlayer, deletePlayerImage } = require("../controllers/playerController")



// get all player (public access)

router.get("/", getAllPlayers)

// create new player (admin only)
router.post("/", createPlayer);

// update player (admin only)
router.put("/:id", updatePlayer);

// delete player image (admin only)
router.delete("/:id/image", deletePlayerImage);

module.exports = router