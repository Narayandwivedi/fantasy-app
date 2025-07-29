const express = require("express")
const { createContest , getContest } = require("../controllers/contestController")
const router = express.Router()

router.post("/:matchId",createContest)
router.get("/:matchId",getContest)

module.exports = router