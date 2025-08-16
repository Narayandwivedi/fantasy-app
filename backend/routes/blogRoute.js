const express = require("express");
const router = express.Router();

const {
  createBlog,
  getAllBlogs,
  getPublishedBlogs,
  getBlogById,
  getPublishedBlogBySlug,
  updateBlog,
  deleteBlog,
  toggleBlogLike,
  getBlogStats,
} = require("../controllers/blogController");

const isAdmin = require("../middleware/isAdmin");
const authToken = require("../middleware/auth");

// Public routes (no authentication required)
router.get("/published", getPublishedBlogs); // Get published blogs for frontend
router.get("/published/:slug", getPublishedBlogBySlug); // Get single published blog by slug
router.post("/:id/like", toggleBlogLike); // Like/Unlike blog (can be public or require auth based on your needs)

// Admin routes (require admin authentication)
router.get("/", isAdmin, getAllBlogs); // Get all blogs with admin filters
router.get("/stats", isAdmin, getBlogStats); // Get blog statistics
router.get("/:id", isAdmin, getBlogById); // Get single blog by ID (admin)
router.post("/", isAdmin, createBlog); // Create new blog
router.put("/:id", isAdmin, updateBlog); // Update blog
router.delete("/:id", isAdmin, deleteBlog); // Delete blog

module.exports = router;