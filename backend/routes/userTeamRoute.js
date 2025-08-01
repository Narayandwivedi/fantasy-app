const express = require("express")
const router = express.Router()

const { createUserTeam } = require("../controllers/userTeamController")



router.post("/",createUserTeam)




module.exports = router