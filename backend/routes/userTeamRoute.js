const express = require("express")
const router = express.Router()

const { createUserTeam, getAllTeamOfAMatch, getTeamDetail, updateTeam } = require("../controllers/userTeamController")



router.post("/",createUserTeam)
router.get("/:matchId",getAllTeamOfAMatch)
router.get("/detail/:teamId", getTeamDetail)
router.put("/:teamId", updateTeam)




module.exports = router