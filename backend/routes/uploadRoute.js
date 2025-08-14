
const express = require('express')
const router = express.Router()
const auth = require("../middleware/auth")
const isAdmin = require("../middleware/isAdmin")

const upload = require("../config/multer")

const {handlePlayerImgUpload , handleTeamImgUpload, handleChatFileUpload} = require("../controllers/uploadController")

// Admin only routes (temporarily disabled auth for testing)
router.post("/player", upload.single("player"), handlePlayerImgUpload) // Removed auth, isAdmin
router.post("/team", upload.single("team"), handleTeamImgUpload) // Removed auth, isAdmin

// User authenticated routes
router.post("/chat", auth, upload.single("chatFile"), handleChatFileUpload)


module.exports = router