const express = require('express');
const multer = require('multer');
const path = require('path');
const {
    getAllBlogs,
    getBlogBySlug,
    createBlog,
    updateBlog,
    deleteBlog,
    getBlogById,
    getFeaturedBlogs,
    getRelatedBlogs
} = require('../controllers/blogController.js');
const authToken = require('../middleware/auth.js');
const isAdmin = require('../middleware/isAdmin.js');

const blogRouter = express.Router();

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'upload/images/blog');
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + '-' + Math.round(Math.random() * 1E9) + path.extname(file.originalname));
    }
});

const upload = multer({ 
    storage: storage,
    fileFilter: (req, file, cb) => {
        if (file.mimetype.startsWith('image/')) {
            cb(null, true);
        } else {
            cb(new Error('Only image files are allowed'), false);
        }
    },
    limits: {
        fileSize: 5 * 1024 * 1024
    }
});

blogRouter.get('/blogs', getAllBlogs);
blogRouter.get('/blogs/featured', getFeaturedBlogs);
blogRouter.get('/blog/slug/:slug', getBlogBySlug);
blogRouter.get('/blog/related/:slug', getRelatedBlogs);

blogRouter.post('/blog', authToken, isAdmin, upload.single('featuredImage'), createBlog);
blogRouter.get('/blog/:id', authToken, isAdmin, getBlogById);
blogRouter.put('/blog/:id', authToken, isAdmin, upload.single('featuredImage'), updateBlog);
blogRouter.delete('/blog/:id', authToken, isAdmin, deleteBlog);

module.exports = blogRouter;