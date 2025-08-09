const Blog = require('../models/Blog.js');

const getAllBlogs = async (req, res) => {
    try {
        const { page = 1, limit = 10, category, tag, published = true } = req.query;
        
        const query = {};
        if (published !== 'all') {
            query.published = published === 'true';
        }
        if (category) query.category = category;
        if (tag) query.tags = { $in: [tag] };

        const blogs = await Blog.find(query)
            .select('-content')
            .sort({ publishedDate: -1 })
            .limit(limit * 1)
            .skip((page - 1) * limit)
            .exec();

        const total = await Blog.countDocuments(query);

        res.json({
            success: true,
            blogs,
            totalPages: Math.ceil(total / limit),
            currentPage: page,
            total
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

const getBlogBySlug = async (req, res) => {
    try {
        const blog = await Blog.findOne({ slug: req.params.slug });
        
        if (!blog) {
            return res.status(404).json({ success: false, message: 'Blog not found' });
        }

        if (!blog.published && !req.user?.isAdmin) {
            return res.status(404).json({ success: false, message: 'Blog not found' });
        }

        blog.views += 1;
        await blog.save();

        res.json({ success: true, blog });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

const createBlog = async (req, res) => {
    try {
        const {
            title,
            content,
            excerpt,
            tags,
            category,
            author,
            metaTitle,
            metaDescription,
            published
        } = req.body;

        const blog = new Blog({
            title,
            content,
            excerpt,
            tags: tags ? tags.split(',').map(tag => tag.trim()) : [],
            category,
            author,
            metaTitle,
            metaDescription,
            published: published || false,
            featuredImage: req.file ? req.file.filename : ''
        });

        await blog.save();
        res.status(201).json({ success: true, blog, message: 'Blog created successfully' });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};

const updateBlog = async (req, res) => {
    try {
        const {
            title,
            content,
            excerpt,
            tags,
            category,
            author,
            metaTitle,
            metaDescription,
            published
        } = req.body;

        const updateData = {
            title,
            content,
            excerpt,
            tags: tags ? tags.split(',').map(tag => tag.trim()) : [],
            category,
            author,
            metaTitle,
            metaDescription,
            published
        };

        if (req.file) {
            updateData.featuredImage = req.file.filename;
        }

        const blog = await Blog.findByIdAndUpdate(
            req.params.id,
            updateData,
            { new: true, runValidators: true }
        );

        if (!blog) {
            return res.status(404).json({ success: false, message: 'Blog not found' });
        }

        res.json({ success: true, blog, message: 'Blog updated successfully' });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};

const deleteBlog = async (req, res) => {
    try {
        const blog = await Blog.findByIdAndDelete(req.params.id);
        
        if (!blog) {
            return res.status(404).json({ success: false, message: 'Blog not found' });
        }

        res.json({ success: true, message: 'Blog deleted successfully' });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

const getBlogById = async (req, res) => {
    try {
        const blog = await Blog.findById(req.params.id);
        
        if (!blog) {
            return res.status(404).json({ success: false, message: 'Blog not found' });
        }

        res.json({ success: true, blog });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

const getFeaturedBlogs = async (req, res) => {
    try {
        const blogs = await Blog.find({ published: true })
            .select('-content')
            .sort({ views: -1 })
            .limit(5);

        res.json({ success: true, blogs });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

const getRelatedBlogs = async (req, res) => {
    try {
        const { slug } = req.params;
        const currentBlog = await Blog.findOne({ slug });
        
        if (!currentBlog) {
            return res.status(404).json({ success: false, message: 'Blog not found' });
        }

        const relatedBlogs = await Blog.find({
            _id: { $ne: currentBlog._id },
            published: true,
            $or: [
                { category: currentBlog.category },
                { tags: { $in: currentBlog.tags } }
            ]
        })
        .select('-content')
        .limit(4)
        .sort({ publishedDate: -1 });

        res.json({ success: true, blogs: relatedBlogs });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

module.exports = {
    getAllBlogs,
    getBlogBySlug,
    createBlog,
    updateBlog,
    deleteBlog,
    getBlogById,
    getFeaturedBlogs,
    getRelatedBlogs
};