
const express = require('express')
const router = express.Router()
const auth = require("../middleware/auth")
const isAdmin = require("../middleware/isAdmin")

const upload = require("../config/multer")

const {handlePlayerImgUpload , handleTeamImgUpload, handleChatFileUpload, handleBlogImgUpload, handleBlogContentImgUpload, deleteBlogImage} = require("../controllers/uploadController")

// Admin only routes (temporarily disabled auth for testing)
router.post("/player", upload.single("player"), handlePlayerImgUpload) // Removed auth, isAdmin
router.post("/team", upload.single("team"), handleTeamImgUpload) // Removed auth, isAdmin
router.post("/blog", upload.single("blog"), handleBlogImgUpload) // Blog featured image upload
router.post("/blog-content", upload.single("blogContent"), handleBlogContentImgUpload) // Blog content image upload
router.delete("/blog-image", deleteBlogImage) // Delete blog image

// User authenticated routes
router.post("/chat", auth, upload.single("chatFile"), handleChatFileUpload)


module.exports = router