import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, Tag, Eye, ArrowLeft, Search, Filter, BookOpen, TrendingUp } from 'lucide-react';
import Navbar from '../components/Navbar';

const BlogList = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const categories = [
    { value: '', label: 'All Categories' },
    { value: 'match-preview', label: 'Match Preview' },
    { value: 'player-analysis', label: 'Player Analysis' },
    { value: 'fantasy-tips', label: 'Fantasy Tips' },
    { value: 'news', label: 'News' },
    { value: 'strategy', label: 'Strategy' }
  ];

  const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:4000';

  useEffect(() => {
    fetchBlogs();
  }, [currentPage, filterCategory]);

  useEffect(() => {
    // Update meta tags for Blog List page
    document.title = 'Fantasy Cricket Blog - Tips, Analysis & News | Winners11';
    
    // Update meta description
    let metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', 'Read expert fantasy cricket tips, match analysis, and latest news on Winners11 blog. Get winning strategies, player insights, and IPL fantasy tips to improve your game.');
    }

    // Update Open Graph tags
    let ogTitle = document.querySelector('meta[property="og:title"]');
    if (ogTitle) {
      ogTitle.setAttribute('content', 'Fantasy Cricket Blog - Tips & Analysis | Winners11');
    }

    let ogDescription = document.querySelector('meta[property="og:description"]');
    if (ogDescription) {
      ogDescription.setAttribute('content', 'Expert fantasy cricket tips, match analysis, and winning strategies. Stay updated with the latest cricket news and fantasy gaming insights.');
    }

    let ogUrl = document.querySelector('meta[property="og:url"]');
    if (ogUrl) {
      ogUrl.setAttribute('content', 'https://winners11.in/blogs');
    }

    // Update canonical URL
    let canonical = document.querySelector('link[rel="canonical"]');
    if (canonical) {
      canonical.setAttribute('href', 'https://winners11.in/blogs');
    }

    return () => {
      document.title = 'Winners11 - Skill Based Fantasy Cricket Gaming Platform | Play & Win Cash';
    };
  }, []);

  const fetchBlogs = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page: currentPage,
        limit: 10,
        published: true
      });
      
      if (filterCategory) params.append('category', filterCategory);
      
      const response = await fetch(`${backendUrl}/api/blogs?${params}`);
      
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

  const getCategoryColor = (category) => {
    const colors = {
      'match-preview': 'bg-blue-100 text-blue-800',
      'player-analysis': 'bg-green-100 text-green-800',
      'fantasy-tips': 'bg-purple-100 text-purple-800',
      'news': 'bg-red-100 text-red-800',
      'strategy': 'bg-yellow-100 text-yellow-800'
    };
    return colors[category] || 'bg-gray-100 text-gray-800';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="flex items-center justify-center mt-20">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      {/* Header */}
      <div className="bg-gradient-to-r from-gray-900 via-slate-900 to-black text-white shadow-xl">
        <div className="max-w-7xl mx-auto px-4 lg:px-6 py-8 lg:py-12">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center">
              <Link to="/" className="mr-4">
                <ArrowLeft className="w-6 h-6 text-white hover:text-yellow-300 transition-colors" />
              </Link>
              <div>
                <h1 className="text-2xl lg:text-4xl font-bold text-white tracking-wide">Fantasy Cricket Blog</h1>
                <p className="text-gray-300 text-sm lg:text-lg mt-1">Tips, Analysis & Latest News</p>
              </div>
            </div>
            <div className="bg-white bg-opacity-20 p-3 rounded-lg">
              <BookOpen className="w-8 h-8 text-yellow-300" />
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4 lg:gap-8 mt-6 lg:mt-8">
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3 lg:p-6 text-center border border-white/20">
              <BookOpen className="w-6 h-6 lg:w-8 lg:h-8 mx-auto mb-1 lg:mb-2 text-yellow-300" />
              <div className="text-lg lg:text-2xl font-bold text-white">{blogs.length}</div>
              <div className="text-xs lg:text-sm text-gray-300">Articles</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3 lg:p-6 text-center border border-white/20">
              <TrendingUp className="w-6 h-6 lg:w-8 lg:h-8 mx-auto mb-1 lg:mb-2 text-yellow-300" />
              <div className="text-lg lg:text-2xl font-bold text-white">{blogs.reduce((sum, b) => sum + (b.views || 0), 0)}</div>
              <div className="text-xs lg:text-sm text-gray-300">Total Views</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3 lg:p-6 text-center border border-white/20">
              <Tag className="w-6 h-6 lg:w-8 lg:h-8 mx-auto mb-1 lg:mb-2 text-yellow-300" />
              <div className="text-lg lg:text-2xl font-bold text-white">5</div>
              <div className="text-xs lg:text-sm text-gray-300">Categories</div>
            </div>
          </div>
        </div>
      </div>

      {/* Search and Filter */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto p-4">
          <div className="space-y-3 lg:space-y-0 lg:grid lg:grid-cols-2 lg:gap-4">
            {/* Search */}
            <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search articles..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-gray-50 border border-gray-200 rounded-lg pl-10 pr-4 py-2 lg:py-3 text-sm lg:text-base focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
            />
          </div>

          {/* Category Filter */}
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="w-full bg-gray-50 border border-gray-200 rounded-lg pl-10 pr-8 py-2 lg:py-3 text-sm lg:text-base focus:outline-none focus:ring-2 focus:ring-yellow-500 appearance-none"
            >
              {categories.map(category => (
                <option key={category.value} value={category.value}>
                  {category.label}
                </option>
              ))}
            </select>
          </div>
          </div>
        </div>
      </div>

      {/* Blog List */}
      <div className="max-w-7xl mx-auto p-4 lg:p-8">
        {filteredBlogs.length === 0 ? (
          <div className="text-center py-12">
            <BookOpen className="w-16 h-16 mx-auto text-gray-300 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No articles found</h3>
            <p className="text-gray-500 text-sm">Try adjusting your search or filters</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4 lg:gap-6 xl:gap-8">
            {filteredBlogs.map((blog) => (
              <Link
                key={blog._id}
                to={`/blog/${blog.slug}`}
                className="block bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow h-full flex flex-col"
              >
                {blog.featuredImage && (
                  <div className="aspect-video">
                    <img
                      src={`${backendUrl}/images/blog/${blog.featuredImage}`}
                      alt={blog.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
                
                <div className="p-4 lg:p-6 flex-1 flex flex-col">
                  <div className="flex items-center justify-between mb-2">
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(blog.category)}`}>
                      <Tag className="w-3 h-3 mr-1" />
                      {blog.category.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                    </span>
                    <div className="flex items-center text-gray-500 text-xs">
                      <Eye className="w-3 h-3 mr-1" />
                      {blog.views || 0}
                    </div>
                  </div>

                  <h2 className="text-lg lg:text-xl font-bold text-gray-900 mb-2 line-clamp-2 flex-grow">
                    {blog.title}
                  </h2>

                  <p className="text-gray-600 text-sm lg:text-base mb-3 line-clamp-3 flex-grow">
                    {blog.excerpt}
                  </p>

                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <span className="flex items-center">
                      <Calendar className="w-3 h-3 mr-1" />
                      {formatDate(blog.publishedDate)}
                    </span>
                    <span>{blog.author}</span>
                  </div>

                  {blog.tags && blog.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-3">
                      {blog.tags.slice(0, 3).map((tag, index) => (
                        <span
                          key={index}
                          className="inline-block bg-gray-100 text-gray-600 px-2 py-1 rounded text-xs"
                        >
                          #{tag}
                        </span>
                      ))}
                      {blog.tags.length > 3 && (
                        <span className="text-gray-400 text-xs">+{blog.tags.length - 3} more</span>
                      )}
                    </div>
                  )}
                </div>
              </Link>
            ))}
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between mt-8 px-4 lg:px-6 py-3 lg:py-4 bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="text-sm lg:text-base text-gray-700">
              Page {currentPage} of {totalPages}
            </div>
            <div className="flex items-center space-x-2 lg:space-x-4">
              <button
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="bg-gray-100 text-gray-700 px-3 lg:px-4 py-1 lg:py-2 rounded text-sm lg:text-base disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-200 transition-colors"
              >
                Previous
              </button>
              <button
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="bg-yellow-500 text-black font-semibold px-3 lg:px-4 py-1 lg:py-2 rounded text-sm lg:text-base disabled:opacity-50 disabled:cursor-not-allowed hover:bg-yellow-600 transition-colors"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default BlogList;