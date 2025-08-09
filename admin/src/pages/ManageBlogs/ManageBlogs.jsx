import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Eye, Search, Filter, BookOpen, Calendar, Tag, TrendingUp } from 'lucide-react';
import AddBlogModal from './AddBlogModal';
import EditBlogModal from './EditBlogModal';

const ManageBlogs = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingBlog, setEditingBlog] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const categories = ['match-preview', 'player-analysis', 'fantasy-tips', 'news', 'strategy'];
  const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:4000';

  useEffect(() => {
    fetchBlogs();
  }, [currentPage, filterCategory]);

  const fetchBlogs = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page: currentPage,
        limit: 10,
        published: 'all'
      });
      
      if (filterCategory) params.append('category', filterCategory);
      
      const response = await fetch(`${backendUrl}/api/blogs?${params}`, {
        credentials: 'include'
      });
      
      if (response.ok) {
        const data = await response.json();
        setBlogs(data.blogs);
        setTotalPages(data.totalPages);
      }
    } catch (error) {
      console.error('Error fetching blogs:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (blogId) => {
    if (!confirm('Are you sure you want to delete this blog?')) return;
    
    try {
      const response = await fetch(`${backendUrl}/api/blog/${blogId}`, {
        method: 'DELETE',
        credentials: 'include'
      });
      
      if (response.ok) {
        await fetchBlogs();
      } else {
        alert('Failed to delete blog');
      }
    } catch (error) {
      console.error('Error deleting blog:', error);
      alert('Error deleting blog');
    }
  };

  const handleEdit = (blog) => {
    setEditingBlog(blog);
    setShowEditModal(true);
  };

  const filteredBlogs = blogs.filter(blog =>
    blog.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    blog.excerpt.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-400"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">Manage Blogs</h1>
            <p className="text-purple-300">Create and manage blog posts for better SEO</p>
          </div>
          <button
            onClick={() => setShowAddModal(true)}
            className="mt-4 lg:mt-0 bg-gradient-to-r from-purple-500 to-blue-500 text-white px-6 py-3 rounded-xl font-semibold hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-xl flex items-center space-x-2"
          >
            <Plus className="w-5 h-5" />
            <span>Add New Blog</span>
          </button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white/60 text-sm">Total Blogs</p>
                <p className="text-2xl font-bold text-white">{blogs.length}</p>
              </div>
              <BookOpen className="w-8 h-8 text-purple-400" />
            </div>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white/60 text-sm">Published</p>
                <p className="text-2xl font-bold text-white">{blogs.filter(b => b.published).length}</p>
              </div>
              <Eye className="w-8 h-8 text-green-400" />
            </div>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white/60 text-sm">Drafts</p>
                <p className="text-2xl font-bold text-white">{blogs.filter(b => !b.published).length}</p>
              </div>
              <Edit className="w-8 h-8 text-yellow-400" />
            </div>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white/60 text-sm">Total Views</p>
                <p className="text-2xl font-bold text-white">{blogs.reduce((sum, b) => sum + (b.views || 0), 0)}</p>
              </div>
              <TrendingUp className="w-8 h-8 text-blue-400" />
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 mb-8">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/60 w-5 h-5" />
              <input
                type="text"
                placeholder="Search blogs..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-white/20 border border-white/30 rounded-xl px-10 py-3 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/60 w-5 h-5" />
              <select
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
                className="bg-white/20 border border-white/30 rounded-xl px-10 py-3 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                <option value="">All Categories</option>
                {categories.map(category => (
                  <option key={category} value={category} className="bg-slate-800">
                    {category.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Blogs List */}
        <div className="bg-white/10 backdrop-blur-sm rounded-2xl border border-white/20 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-white/20 border-b border-white/20">
                <tr>
                  <th className="text-left px-6 py-4 text-white font-semibold">Title</th>
                  <th className="text-left px-6 py-4 text-white font-semibold">Category</th>
                  <th className="text-left px-6 py-4 text-white font-semibold">Status</th>
                  <th className="text-left px-6 py-4 text-white font-semibold">Views</th>
                  <th className="text-left px-6 py-4 text-white font-semibold">Date</th>
                  <th className="text-left px-6 py-4 text-white font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredBlogs.map((blog) => (
                  <tr key={blog._id} className="border-b border-white/10 hover:bg-white/5 transition-colors">
                    <td className="px-6 py-4">
                      <div>
                        <h3 className="text-white font-medium">{blog.title}</h3>
                        <p className="text-white/60 text-sm mt-1">{blog.excerpt.substring(0, 80)}...</p>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-purple-500/20 text-purple-300 border border-purple-500/30">
                        <Tag className="w-3 h-3 mr-1" />
                        {blog.category.replace('-', ' ')}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                        blog.published 
                          ? 'bg-green-500/20 text-green-300 border border-green-500/30'
                          : 'bg-yellow-500/20 text-yellow-300 border border-yellow-500/30'
                      }`}>
                        {blog.published ? 'Published' : 'Draft'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-white/80">{blog.views || 0}</span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-white/80 text-sm">
                        <div className="flex items-center">
                          <Calendar className="w-4 h-4 mr-2 text-white/60" />
                          {formatDate(blog.publishedDate)}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => handleEdit(blog)}
                          className="bg-blue-500/20 text-blue-300 p-2 rounded-lg hover:bg-blue-500/30 transition-colors border border-blue-500/30"
                          title="Edit"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(blog._id)}
                          className="bg-red-500/20 text-red-300 p-2 rounded-lg hover:bg-red-500/30 transition-colors border border-red-500/30"
                          title="Delete"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="bg-white/20 border-t border-white/20 px-6 py-4">
              <div className="flex items-center justify-between">
                <div className="text-white/60 text-sm">
                  Page {currentPage} of {totalPages}
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                    className="bg-white/20 text-white px-4 py-2 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-white/30 transition-colors"
                  >
                    Previous
                  </button>
                  <button
                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                    disabled={currentPage === totalPages}
                    className="bg-white/20 text-white px-4 py-2 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-white/30 transition-colors"
                  >
                    Next
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Modals */}
      {showAddModal && (
        <AddBlogModal 
          onClose={() => setShowAddModal(false)}
          onBlogAdded={() => {
            fetchBlogs();
            setShowAddModal(false);
          }}
        />
      )}
      
      {showEditModal && editingBlog && (
        <EditBlogModal 
          blog={editingBlog}
          onClose={() => {
            setShowEditModal(false);
            setEditingBlog(null);
          }}
          onBlogUpdated={() => {
            fetchBlogs();
            setShowEditModal(false);
            setEditingBlog(null);
          }}
        />
      )}
    </div>
  );
};

export default ManageBlogs;