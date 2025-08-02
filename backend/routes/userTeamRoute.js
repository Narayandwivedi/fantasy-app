const express = require("express")
const router = express.Router()

const { createUserTeam  , getAllTeamOfAMatch} = require("../controllers/userTeamController")



router.post("/",createUserTeam)
router.get("/:matchId",getAllTeamOfAMatch)




module.exports = router