
const express = require("express")
const router = express.Router()


const {getAllMatch , createMatch , getMatchByStatus} = require("../controllers/matchController")


router.get("/", getAllMatch);

router.get("/:status", getMatchByStatus);

router.post("/", createMatch);


module.exports = router