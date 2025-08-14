const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const isAdmin = require("../middleware/isAdmin");

const {getAllPlayers , createPlayer , updatePlayer } = require("../controllers/playerController")



// get all player (public access)

router.get("/", getAllPlayers)

// create new player (admin only)
router.post("/", auth, isAdmin, createPlayer);

// update player (admin only)
router.put("/:id", auth, isAdmin, updatePlayer);

module.exports = router