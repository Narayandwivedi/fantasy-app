
const express = require('express')
const router = express.Router()
const auth = require("../middleware/auth")
const isAdmin = require("../middleware/isAdmin")

const upload = require("../config/multer")

const {handlePlayerImgUpload , handleTeamImgUpload, handleChatFileUpload} = require("../controllers/uploadController")

// Admin only routes (for managing game assets)
router.post("/player", auth, isAdmin, upload.single("player"), handlePlayerImgUpload)
router.post("/team", auth, isAdmin, upload.single("team"), handleTeamImgUpload)

// User authenticated routes
router.post("/chat", auth, upload.single("chatFile"), handleChatFileUpload)


module.exports = router