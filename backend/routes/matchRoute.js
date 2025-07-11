
const express = require("express")
const router = express.Router()


const {getAllMatch , createMatch} = require("../controllers/matchController")


router.get("/", getAllMatch);

router.post("/", createMatch);


module.exports = router