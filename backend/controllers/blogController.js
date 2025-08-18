const Blog = require("../models/Blog");
const mongoose = require("mongoose");

// Helper function to convert text to title case
function toTitleCase(str) {
  return str.replace(/\w\S*/g, (txt) => {
    return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
  });
}

// Create a new blog post
const createBlog = async (req, res) => {
  try {
    const {
      title,
      content,
      excerpt,
      author,
      category,
      tags,
      featuredImage,
      featuredImageAlt,
      status,
      metaTitle,
      metaDescription,
    } = req.body;

    // Validation
    if (!title || !content || !excerpt) {
      return res.status(400).json({
        success: false,
        message: "Title, content, and excerpt are required",
      });
    }

    if (typeof title !== "string" || title.trim().length === 0) {
      return res.status(400).json({
        success: false,
        message: "Title must be a valid string",
      });
    }

    if (typeof content !== "string" || content.trim().length < 50) {
      return res.status(400).json({
        success: false,
        message: "Content must be at least 50 characters long",
      });
    }

    if (typeof excerpt !== "string" || excerpt.trim().length > 200) {
      return res.status(400).json({
        success: false,
        message: "Excerpt must be less than 200 characters",
      });
    }

    // Check if blog with same title exists
    const existingBlog = await Blog.findOne({ 
      title: { $regex: new RegExp(`^${title.trim()}$`, 'i') }
    });

    if (existingBlog) {
      return res.status(400).json({
        success: false,
        message: "A blog with this title already exists",
      });
    }

    // Generate slug from title
    const generateSlug = (title) => {
      return title
        .toLowerCase()
        .replace(/[^a-z0-9 -]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .trim('-');
    };

    const baseSlug = generateSlug(title.trim());
    
    // Ensure slug is unique
    let slug = baseSlug;
    let counter = 1;
    while (await Blog.findOne({ slug })) {
      slug = `${baseSlug}-${counter}`;
      counter++;
    }

    // Create new blog
    const newBlog = new Blog({
      title: title.trim(),
      slug: slug,
      content: content.trim(),
      excerpt: excerpt.trim(),
      author: author || "Admin",
      category: category || "general",
      tags: tags || [],
      featuredImage: featuredImage || "",
      featuredImageAlt: featuredImageAlt || "",
      status: status || "draft",
      metaTitle: metaTitle || title.trim(),
      metaDescription: metaDescription || excerpt.trim(),
    });

    const savedBlog = await newBlog.save();

    res.status(201).json({
      success: true,
      message: "Blog created successfully",
      blog: savedBlog,
    });
  } catch (error) {
    console.error("Error creating blog:", error);
    res.status(500).json({
      success: false,
      message: "Error creating blog",
      error: error.message,
    });
  }
};

// Get all blogs with pagination and filtering
const getAllBlogs = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      status,
      category,
      author,
      search,
      sortBy = "createdAt",
      sortOrder = "desc",
    } = req.query;

    // Build filter object
    const filter = {};

    if (status) {
      filter.status = status;
    }

    if (category) {
      filter.category = category;
    }

    if (author) {
      filter.author = { $regex: author, $options: "i" };
    }

    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: "i" } },
        { content: { $regex: search, $options: "i" } },
        { excerpt: { $regex: search, $options: "i" } },
        { tags: { $in: [new RegExp(search, "i")] } },
      ];
    }

    // Build sort object
    const sort = {};
    sort[sortBy] = sortOrder === "desc" ? -1 : 1;

    // Calculate pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);

    // Get blogs with pagination
    const blogs = await Blog.find(filter)
      .sort(sort)
      .skip(skip)
      .limit(parseInt(limit))
      .select("-content"); // Exclude content for list view

    // Get total count for pagination
    const totalBlogs = await Blog.countDocuments(filter);
    const totalPages = Math.ceil(totalBlogs / parseInt(limit));

    res.status(200).json({
      success: true,
      blogs,
      pagination: {
        currentPage: parseInt(page),
        totalPages,
        totalBlogs,
        hasNextPage: parseInt(page) < totalPages,
        hasPrevPage: parseInt(page) > 1,
      },
    });
  } catch (error) {
    console.error("Error fetching blogs:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching blogs",
      error: error.message,
    });
  }
};

// Get published blogs for frontend
const getPublishedBlogs = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      category,
      search,
      featured = false,
    } = req.query;

    // Build filter object
    const filter = { status: "published" };

    if (category) {
      filter.category = category;
    }

    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: "i" } },
        { excerpt: { $regex: search, $options: "i" } },
        { tags: { $in: [new RegExp(search, "i")] } },
      ];
    }

    // For featured blogs, limit to 5 most recent
    const actualLimit = featured === "true" ? 5 : parseInt(limit);
    const skip = featured === "true" ? 0 : (parseInt(page) - 1) * parseInt(limit);

    // Get blogs with pagination
    const blogs = await Blog.find(filter)
      .sort({ publishedAt: -1 })
      .skip(skip)
      .limit(actualLimit)
      .select("title excerpt author category tags featuredImage featuredImageAlt slug publishedAt readTime views likes createdAt updatedAt");

    // Get total count for pagination (only for non-featured)
    let pagination = null;
    if (featured !== "true") {
      const totalBlogs = await Blog.countDocuments(filter);
      const totalPages = Math.ceil(totalBlogs / parseInt(limit));
      
      pagination = {
        currentPage: parseInt(page),
        totalPages,
        totalBlogs,
        hasNextPage: parseInt(page) < totalPages,
        hasPrevPage: parseInt(page) > 1,
      };
    }

    res.status(200).json({
      success: true,
      blogs,
      pagination,
    });
  } catch (error) {
    console.error("Error fetching published blogs:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching published blogs",
      error: error.message,
    });
  }
};

// Get single blog by ID or slug
const getBlogById = async (req, res) => {
  try {
    const { id } = req.params;
    let blog;

    // Check if id is a valid MongoDB ObjectId
    if (mongoose.Types.ObjectId.isValid(id)) {
      blog = await Blog.findById(id);
    } else {
      // Treat as slug
      blog = await Blog.findOne({ slug: id });
    }

    if (!blog) {
      return res.status(404).json({
        success: false,
        message: "Blog not found",
      });
    }

    res.status(200).json({
      success: true,
      blog,
    });
  } catch (error) {
    console.error("Error fetching blog:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching blog",
      error: error.message,
    });
  }
};

// Get single published blog by slug (for frontend)
const getPublishedBlogBySlug = async (req, res) => {
  try {
    const { slug } = req.params;

    const blog = await Blog.findOne({ slug, status: "published" });

    if (!blog) {
      return res.status(404).json({
        success: false,
        message: "Blog not found",
      });
    }

    // Increment view count
    await Blog.findByIdAndUpdate(blog._id, { $inc: { views: 1 } });

    res.status(200).json({
      success: true,
      blog,
    });
  } catch (error) {
    console.error("Error fetching published blog:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching blog",
      error: error.message,
    });
  }
};

// Update blog
const updateBlog = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    // Validate ID
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid blog ID",
      });
    }

    // Check if blog exists
    const existingBlog = await Blog.findById(id);
    if (!existingBlog) {
      return res.status(404).json({
        success: false,
        message: "Blog not found",
      });
    }

    // Validate update data
    if (updateData.title && typeof updateData.title !== "string") {
      return res.status(400).json({
        success: false,
        message: "Title must be a valid string",
      });
    }

    if (updateData.content && typeof updateData.content !== "string") {
      return res.status(400).json({
        success: false,
        message: "Content must be a valid string",
      });
    }

    if (updateData.excerpt && updateData.excerpt.length > 200) {
      return res.status(400).json({
        success: false,
        message: "Excerpt must be less than 200 characters",
      });
    }

    // Check for duplicate title (excluding current blog)
    if (updateData.title) {
      const duplicateBlog = await Blog.findOne({
        title: { $regex: new RegExp(`^${updateData.title.trim()}$`, 'i') },
        _id: { $ne: id }
      });

      if (duplicateBlog) {
        return res.status(400).json({
          success: false,
          message: "A blog with this title already exists",
        });
      }

      // Generate new slug if title is being updated
      const generateSlug = (title) => {
        return title
          .toLowerCase()
          .replace(/[^a-z0-9 -]/g, '')
          .replace(/\s+/g, '-')
          .replace(/-+/g, '-')
          .trim('-');
      };

      const baseSlug = generateSlug(updateData.title.trim());
      
      // Ensure slug is unique (excluding current blog)
      let slug = baseSlug;
      let counter = 1;
      while (await Blog.findOne({ slug, _id: { $ne: id } })) {
        slug = `${baseSlug}-${counter}`;
        counter++;
      }
      
      updateData.slug = slug;
    }

    // Update blog
    const updatedBlog = await Blog.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    );

    res.status(200).json({
      success: true,
      message: "Blog updated successfully",
      blog: updatedBlog,
    });
  } catch (error) {
    console.error("Error updating blog:", error);
    res.status(500).json({
      success: false,
      message: "Error updating blog",
      error: error.message,
    });
  }
};

// Delete blog
const deleteBlog = async (req, res) => {
  try {
    const { id } = req.params;

    // Validate ID
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid blog ID",
      });
    }

    // Check if blog exists
    const blog = await Blog.findById(id);
    if (!blog) {
      return res.status(404).json({
        success: false,
        message: "Blog not found",
      });
    }

    // Delete blog
    await Blog.findByIdAndDelete(id);

    res.status(200).json({
      success: true,
      message: "Blog deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting blog:", error);
    res.status(500).json({
      success: false,
      message: "Error deleting blog",
      error: error.message,
    });
  }
};

// Like/Unlike blog
const toggleBlogLike = async (req, res) => {
  try {
    const { id } = req.params;
    const { action } = req.body; // 'like' or 'unlike'

    // Validate ID
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid blog ID",
      });
    }

    const blog = await Blog.findById(id);
    if (!blog) {
      return res.status(404).json({
        success: false,
        message: "Blog not found",
      });
    }

    let updateOperation;
    if (action === "like") {
      updateOperation = { $inc: { likes: 1 } };
    } else if (action === "unlike") {
      updateOperation = { $inc: { likes: -1 } };
    } else {
      return res.status(400).json({
        success: false,
        message: "Invalid action. Use 'like' or 'unlike'",
      });
    }

    const updatedBlog = await Blog.findByIdAndUpdate(
      id,
      updateOperation,
      { new: true }
    );

    res.status(200).json({
      success: true,
      message: `Blog ${action}d successfully`,
      likes: updatedBlog.likes,
    });
  } catch (error) {
    console.error("Error toggling blog like:", error);
    res.status(500).json({
      success: false,
      message: "Error updating blog likes",
      error: error.message,
    });
  }
};

// Get blog statistics
const getBlogStats = async (req, res) => {
  try {
    const stats = await Blog.aggregate([
      {
        $group: {
          _id: null,
          totalBlogs: { $sum: 1 },
          publishedBlogs: {
            $sum: { $cond: [{ $eq: ["$status", "published"] }, 1, 0] }
          },
          draftBlogs: {
            $sum: { $cond: [{ $eq: ["$status", "draft"] }, 1, 0] }
          },
          totalViews: { $sum: "$views" },
          totalLikes: { $sum: "$likes" },
        }
      }
    ]);

    const categoryStats = await Blog.aggregate([
      { $match: { status: "published" } },
      {
        $group: {
          _id: "$category",
          count: { $sum: 1 }
        }
      },
      { $sort: { count: -1 } }
    ]);

    res.status(200).json({
      success: true,
      stats: stats[0] || {
        totalBlogs: 0,
        publishedBlogs: 0,
        draftBlogs: 0,
        totalViews: 0,
        totalLikes: 0,
      },
      categoryStats,
    });
  } catch (error) {
    console.error("Error fetching blog stats:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching blog statistics",
      error: error.message,
    });
  }
};

// Auto-save blog draft
const autoSaveBlog = async (req, res) => {
  try {
    const {
      blogId,
      title,
      content,
      excerpt,
      author,
      category,
      tags,
      featuredImage,
      featuredImageAlt,
      metaTitle,
      metaDescription,
    } = req.body;

    // If blogId exists, update existing draft
    if (blogId && mongoose.isValidObjectId(blogId)) {
      const updatedBlog = await Blog.findByIdAndUpdate(
        blogId,
        {
          title: title || 'Untitled Draft',
          content: content || '',
          excerpt: excerpt || '',
          author: author || 'Admin',
          category: category || 'general',
          tags: Array.isArray(tags) ? tags : (tags ? tags.split(',').map(tag => tag.trim()) : []),
          featuredImage: featuredImage || '',
          featuredImageAlt: featuredImageAlt || '',
          metaTitle: metaTitle || '',
          metaDescription: metaDescription || '',
          status: 'draft', // Always save as draft for auto-save
          autoSaved: true,
          lastSaved: new Date(),
          isDraft: true,
        },
        { new: true, runValidators: false } // Skip validation for auto-save
      );

      if (!updatedBlog) {
        return res.status(404).json({
          success: false,
          message: "Blog not found",
        });
      }

      return res.status(200).json({
        success: true,
        message: "Blog auto-saved successfully",
        blogId: updatedBlog._id,
        lastSaved: updatedBlog.lastSaved,
      });
    } else {
      // Create new draft blog
      const blogTitle = title || 'Untitled Draft';
      const newBlog = new Blog({
        title: blogTitle,
        content: content || '',
        excerpt: excerpt || '',
        author: author || 'Admin',
        category: category || 'general',
        tags: Array.isArray(tags) ? tags : (tags ? tags.split(',').map(tag => tag.trim()) : []),
        featuredImage: featuredImage || '',
        featuredImageAlt: featuredImageAlt || '',
        metaTitle: metaTitle || '',
        metaDescription: metaDescription || '',
        slug: blogTitle
          .toLowerCase()
          .replace(/[^a-z0-9 -]/g, '')
          .replace(/\s+/g, '-')
          .replace(/-+/g, '-')
          .trim('-') + '-' + Date.now(),
        status: 'draft',
        autoSaved: true,
        lastSaved: new Date(),
        isDraft: true,
      });

      const savedBlog = await newBlog.save();

      return res.status(201).json({
        success: true,
        message: "New blog draft created and auto-saved",
        blogId: savedBlog._id,
        lastSaved: savedBlog.lastSaved,
      });
    }
  } catch (error) {
    console.error("Error auto-saving blog:", error);
    res.status(500).json({
      success: false,
      message: "Error auto-saving blog",
      error: error.message,
    });
  }
};

module.exports = {
  createBlog,
  getAllBlogs,
  getPublishedBlogs,
  getBlogById,
  getPublishedBlogBySlug,
  updateBlog,
  deleteBlog,
  toggleBlogLike,
  getBlogStats,
  autoSaveBlog,
};