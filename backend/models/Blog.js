const mongoose = require("mongoose");

const blogSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
  },
  content: {
    type: String,
    required: true,
  },
  excerpt: {
    type: String,
    required: true,
    maxlength: 200,
  },
  author: {
    type: String,
    required: true,
    default: "Admin",
  },
  category: {
    type: String,
    required: true,
    enum: ["cricket", "fantasy", "tips", "news", "general"],
    default: "general",
  },
  tags: [{
    type: String,
    trim: true,
  }],
  featuredImage: {
    type: String, // URL to the featured image
  },
  slug: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
  },
  status: {
    type: String,
    enum: ["draft", "published", "archived"],
    default: "draft",
  },
  views: {
    type: Number,
    default: 0,
  },
  likes: {
    type: Number,
    default: 0,
  },
  metaTitle: {
    type: String,
    maxlength: 60,
  },
  metaDescription: {
    type: String,
    maxlength: 160,
  },
  publishedAt: {
    type: Date,
  },
  readTime: {
    type: Number, // Reading time in minutes
    default: 5,
  },
}, {
  timestamps: true,
});

// Create slug from title before saving
blogSchema.pre('save', function(next) {
  if (this.isModified('title')) {
    this.slug = this.title
      .toLowerCase()
      .replace(/[^a-z0-9 -]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim('-');
  }
  
  // Set publishedAt when status changes to published
  if (this.isModified('status') && this.status === 'published' && !this.publishedAt) {
    this.publishedAt = new Date();
  }
  
  // Calculate reading time based on content length
  if (this.isModified('content')) {
    const wordsPerMinute = 200;
    const wordCount = this.content.split(/\s+/).length;
    this.readTime = Math.ceil(wordCount / wordsPerMinute);
  }
  
  next();
});

// Index for better performance
blogSchema.index({ status: 1, publishedAt: -1 });
blogSchema.index({ category: 1 });
blogSchema.index({ slug: 1 });
blogSchema.index({ tags: 1 });

const Blog = mongoose.model("Blog", blogSchema);

module.exports = Blog;