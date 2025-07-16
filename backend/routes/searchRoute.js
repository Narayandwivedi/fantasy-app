const express = require("express");
const router = express.Router()


const {searchPlayers , searchTeams} = require("../controllers/searchController")


router.get("/players/:keyword",searchPlayers)
router.get("/teams/:keyword",searchTeams)


module.exports = router