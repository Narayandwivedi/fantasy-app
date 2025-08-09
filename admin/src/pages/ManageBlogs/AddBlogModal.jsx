import React, { useState } from 'react';
import { X, Save, Image as ImageIcon, Tag, FileText, Type, AlignLeft } from 'lucide-react';

const AddBlogModal = ({ onClose, onBlogAdded }) => {
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    excerpt: '',
    category: 'fantasy-tips',
    tags: '',
    author: 'Winners11 Team',
    metaTitle: '',
    metaDescription: '',
    published: false
  });
  
  const [featuredImage, setFeaturedImage] = useState(null);
  const [loading, setLoading] = useState(false);

  const categories = [
    { value: 'match-preview', label: 'Match Preview' },
    { value: 'player-analysis', label: 'Player Analysis' },
    { value: 'fantasy-tips', label: 'Fantasy Tips' },
    { value: 'news', label: 'News' },
    { value: 'strategy', label: 'Strategy' }
  ];

  const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:4000';

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));

    if (name === 'title' && !formData.metaTitle) {
      setFormData(prev => ({
        ...prev,
        metaTitle: value.substring(0, 60)
      }));
    }

    if (name === 'excerpt' && !formData.metaDescription) {
      setFormData(prev => ({
        ...prev,
        metaDescription: value.substring(0, 160)
      }));
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith('image/')) {
      setFeaturedImage(file);
    } else {
      alert('Please select a valid image file');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.title || !formData.content || !formData.excerpt) {
      alert('Please fill in all required fields');
      return;
    }

    setLoading(true);

    try {
      const submitFormData = new FormData();
      Object.keys(formData).forEach(key => {
        submitFormData.append(key, formData[key]);
      });
      
      if (featuredImage) {
        submitFormData.append('featuredImage', featuredImage);
      }

      const response = await fetch(`${backendUrl}/api/blog`, {
        method: 'POST',
        credentials: 'include',
        body: submitFormData
      });

      if (response.ok) {
        onBlogAdded();
      } else {
        const error = await response.json();
        alert(`Error: ${error.message}`);
      }
    } catch (error) {
      console.error('Error creating blog:', error);
      alert('Error creating blog');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-gradient-to-br from-slate-900 to-purple-900 rounded-2xl border border-purple-500/30 shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-purple-500/30">
          <div>
            <h2 className="text-2xl font-bold text-white">Add New Blog</h2>
            <p className="text-purple-300 mt-1">Create engaging content for your audience</p>
          </div>
          <button
            onClick={onClose}
            className="text-white/60 hover:text-white p-2 rounded-lg hover:bg-white/10 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto max-h-[calc(90vh-140px)]">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Left Column */}
            <div className="space-y-6">
              {/* Title */}
              <div>
                <label className="flex items-center text-white font-semibold mb-2">
                  <Type className="w-4 h-4 mr-2" />
                  Title *
                </label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  required
                  className="w-full bg-white/20 border border-white/30 rounded-xl px-4 py-3 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="Enter blog title..."
                />
              </div>

              {/* Excerpt */}
              <div>
                <label className="flex items-center text-white font-semibold mb-2">
                  <AlignLeft className="w-4 h-4 mr-2" />
                  Excerpt * ({formData.excerpt.length}/200)
                </label>
                <textarea
                  name="excerpt"
                  value={formData.excerpt}
                  onChange={handleInputChange}
                  required
                  maxLength={200}
                  rows={3}
                  className="w-full bg-white/20 border border-white/30 rounded-xl px-4 py-3 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="Brief description of the blog post..."
                />
              </div>

              {/* Category */}
              <div>
                <label className="flex items-center text-white font-semibold mb-2">
                  <Tag className="w-4 h-4 mr-2" />
                  Category
                </label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  className="w-full bg-white/20 border border-white/30 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                >
                  {categories.map(cat => (
                    <option key={cat.value} value={cat.value} className="bg-slate-800">
                      {cat.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Tags */}
              <div>
                <label className="flex items-center text-white font-semibold mb-2">
                  <Tag className="w-4 h-4 mr-2" />
                  Tags
                </label>
                <input
                  type="text"
                  name="tags"
                  value={formData.tags}
                  onChange={handleInputChange}
                  className="w-full bg-white/20 border border-white/30 rounded-xl px-4 py-3 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="fantasy cricket, IPL, tips (comma separated)"
                />
              </div>

              {/* Featured Image */}
              <div>
                <label className="flex items-center text-white font-semibold mb-2">
                  <ImageIcon className="w-4 h-4 mr-2" />
                  Featured Image
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="w-full bg-white/20 border border-white/30 rounded-xl px-4 py-3 text-white file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-purple-500 file:text-white hover:file:bg-purple-600"
                />
                {featuredImage && (
                  <p className="text-green-300 text-sm mt-2">
                    Selected: {featuredImage.name}
                  </p>
                )}
              </div>
            </div>

            {/* Right Column */}
            <div className="space-y-6">
              {/* Content */}
              <div>
                <label className="flex items-center text-white font-semibold mb-2">
                  <FileText className="w-4 h-4 mr-2" />
                  Content *
                </label>
                <textarea
                  name="content"
                  value={formData.content}
                  onChange={handleInputChange}
                  required
                  rows={10}
                  className="w-full bg-white/20 border border-white/30 rounded-xl px-4 py-3 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="Write your blog content here... You can use HTML tags for formatting."
                />
              </div>

              {/* SEO Fields */}
              <div className="bg-white/10 rounded-xl p-4 border border-white/20">
                <h3 className="text-white font-semibold mb-4">SEO Settings</h3>
                
                <div className="space-y-4">
                  <div>
                    <label className="text-white/80 text-sm mb-2 block">
                      Meta Title ({formData.metaTitle.length}/60)
                    </label>
                    <input
                      type="text"
                      name="metaTitle"
                      value={formData.metaTitle}
                      onChange={handleInputChange}
                      maxLength={60}
                      className="w-full bg-white/20 border border-white/30 rounded-lg px-3 py-2 text-white text-sm placeholder-white/60 focus:outline-none focus:ring-1 focus:ring-purple-500"
                      placeholder="SEO title for search engines"
                    />
                  </div>
                  
                  <div>
                    <label className="text-white/80 text-sm mb-2 block">
                      Meta Description ({formData.metaDescription.length}/160)
                    </label>
                    <textarea
                      name="metaDescription"
                      value={formData.metaDescription}
                      onChange={handleInputChange}
                      maxLength={160}
                      rows={3}
                      className="w-full bg-white/20 border border-white/30 rounded-lg px-3 py-2 text-white text-sm placeholder-white/60 focus:outline-none focus:ring-1 focus:ring-purple-500"
                      placeholder="Description for search results"
                    />
                  </div>
                </div>
              </div>

              {/* Author & Status */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-white font-semibold mb-2 block">Author</label>
                  <input
                    type="text"
                    name="author"
                    value={formData.author}
                    onChange={handleInputChange}
                    className="w-full bg-white/20 border border-white/30 rounded-xl px-4 py-3 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>
                
                <div className="flex items-center">
                  <label className="flex items-center text-white font-semibold cursor-pointer">
                    <input
                      type="checkbox"
                      name="published"
                      checked={formData.published}
                      onChange={handleInputChange}
                      className="mr-3 w-5 h-5 text-purple-600 bg-white/20 border-white/30 rounded focus:ring-purple-500"
                    />
                    Publish immediately
                  </label>
                </div>
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex justify-end space-x-4 mt-8 pt-6 border-t border-white/20">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-3 text-white/80 hover:text-white transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="bg-gradient-to-r from-purple-500 to-blue-500 text-white px-8 py-3 rounded-xl font-semibold hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-xl flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Save className="w-5 h-5" />
              <span>{loading ? 'Creating...' : 'Create Blog'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddBlogModal;