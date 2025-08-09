const mongoose = require('mongoose');

const blogSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },
    slug: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true
    },
    content: {
        type: String,
        required: true
    },
    excerpt: {
        type: String,
        required: true,
        maxlength: 200
    },
    featuredImage: {
        type: String,
        default: ''
    },
    tags: [{
        type: String,
        trim: true
    }],
    category: {
        type: String,
        enum: ['match-preview', 'player-analysis', 'fantasy-tips', 'news', 'strategy'],
        default: 'fantasy-tips'
    },
    author: {
        type: String,
        required: true,
        default: 'Winners11 Team'
    },
    metaTitle: {
        type: String,
        maxlength: 60
    },
    metaDescription: {
        type: String,
        maxlength: 160
    },
    published: {
        type: Boolean,
        default: false
    },
    publishedDate: {
        type: Date,
        default: Date.now
    },
    views: {
        type: Number,
        default: 0
    }
}, {
    timestamps: true
});

blogSchema.index({ slug: 1 });
blogSchema.index({ published: 1, publishedDate: -1 });
blogSchema.index({ tags: 1 });
blogSchema.index({ category: 1 });

blogSchema.pre('save', function(next) {
    if (this.isModified('title') && !this.isModified('slug')) {
        this.slug = this.title.toLowerCase()
            .replace(/[^a-z0-9 -]/g, '')
            .replace(/\s+/g, '-')
            .replace(/-+/g, '-')
            .trim('-');
    }
    
    if (!this.metaTitle) {
        this.metaTitle = this.title.substring(0, 60);
    }
    
    if (!this.metaDescription) {
        this.metaDescription = this.excerpt.substring(0, 160);
    }
    
    next();
});

const Blog = mongoose.model('Blog', blogSchema);

module.exports = Blog;