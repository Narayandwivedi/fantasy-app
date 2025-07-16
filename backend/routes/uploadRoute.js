
const express = require('express')
const router = express.Router()

const upload = require("../config/multer")


const {handlePlayerImgUpload , handleTeamImgUpload} = require("../controllers/uploadController")


router.post("/player",upload.single("player"),handlePlayerImgUpload)
router.post("/team", upload.single("team"), handleTeamImgUpload)


module.exports = router