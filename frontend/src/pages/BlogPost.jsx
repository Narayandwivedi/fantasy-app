import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Calendar, Tag, Eye, User, Share2, Heart, MessageCircle, Clock, ChevronRight } from 'lucide-react';
import Navbar from '../components/Navbar';

const BlogPost = () => {
  const { slug } = useParams();
  const [blog, setBlog] = useState(null);
  const [relatedBlogs, setRelatedBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:4000';

  useEffect(() => {
    fetchBlog();
    fetchRelatedBlogs();
  }, [slug]);

  const fetchBlog = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch(`${backendUrl}/api/blog/slug/${slug}`);
      
      if (response.ok) {
        const data = await response.json();
        setBlog(data.blog);
      } else {
        setError('Blog post not found');
      }
    } catch (error) {
      console.error('Error fetching blog:', error);
      setError('Failed to load blog post');
    } finally {
      setLoading(false);
    }
  };

  const fetchRelatedBlogs = async () => {
    try {
      const response = await fetch(`${backendUrl}/api/blog/related/${slug}`);
      if (response.ok) {
        const data = await response.json();
        setRelatedBlogs(data.blogs);
      }
    } catch (error) {
      console.error('Error fetching related blogs:', error);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
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

  const handleShare = () => {
    if (navigator.share && blog) {
      navigator.share({
        title: blog.title,
        text: blog.excerpt,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert('Link copied to clipboard!');
    }
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

  if (error || !blog) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="p-4 mt-16">
          <div className="text-center py-12">
            <div className="text-6xl mb-4">😕</div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Oops!</h2>
            <p className="text-gray-600 mb-4">{error || 'Blog post not found'}</p>
            <Link
              to="/blogs"
              className="inline-flex items-center bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Blogs
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      {/* Header with back button */}
      <div className="bg-white border-b sticky top-16 z-10">
        <div className="max-w-4xl mx-auto px-4 lg:px-8 py-3">
          <Link to="/blogs" className="inline-flex items-center text-gray-600 hover:text-yellow-600 transition-colors">
            <ArrowLeft className="w-5 h-5 mr-2" />
            <span className="text-sm lg:text-base">Back to Blogs</span>
          </Link>
        </div>
      </div>

      {/* Featured Image */}
      {blog.featuredImage && (
        <div className="max-w-4xl mx-auto">
          <div className="aspect-video lg:aspect-[2/1]">
            <img
              src={`${backendUrl}/images/blog/${blog.featuredImage}`}
              alt={blog.title}
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      )}

      {/* Article Content */}
      <article className="bg-white">
        <div className="max-w-4xl mx-auto p-4 lg:p-8">
          {/* Category and Meta Info */}
          <div className="flex items-center justify-between mb-4 lg:mb-6">
            <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm lg:text-base font-medium ${getCategoryColor(blog.category)}`}>
              <Tag className="w-4 h-4 lg:w-5 lg:h-5 mr-1" />
              {blog.category.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
            </span>
            <div className="flex items-center text-gray-500 text-sm lg:text-base">
              <Eye className="w-4 h-4 lg:w-5 lg:h-5 mr-1" />
              {blog.views || 0} views
            </div>
          </div>

          {/* Title */}
          <h1 className="text-2xl lg:text-4xl xl:text-5xl font-bold text-gray-900 mb-4 lg:mb-6 leading-tight">
            {blog.title}
          </h1>

          {/* Author and Date */}
          <div className="flex items-center justify-between mb-6 lg:mb-8 pb-4 lg:pb-6 border-b border-gray-200">
            <div className="flex items-center text-sm lg:text-base text-gray-600">
              <User className="w-4 h-4 lg:w-5 lg:h-5 mr-2" />
              <span className="font-medium">{blog.author}</span>
            </div>
            <div className="flex items-center text-sm lg:text-base text-gray-500">
              <Calendar className="w-4 h-4 lg:w-5 lg:h-5 mr-2" />
              {formatDate(blog.publishedDate)}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-between mb-6 lg:mb-8 p-3 lg:p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center space-x-4">
              <button 
                onClick={handleShare}
                className="flex items-center text-gray-600 hover:text-yellow-600 transition-colors"
              >
                <Share2 className="w-5 h-5 mr-1" />
                <span className="text-sm lg:text-base">Share</span>
              </button>
            </div>
            <div className="flex items-center text-sm lg:text-base text-gray-500">
              <Clock className="w-4 h-4 lg:w-5 lg:h-5 mr-1" />
              {Math.max(1, Math.ceil(blog.content.length / 1000))} min read
            </div>
          </div>

          {/* Content */}
          <div 
            className="prose prose-sm lg:prose-lg xl:prose-xl max-w-none text-gray-800 leading-relaxed lg:leading-loose"
            dangerouslySetInnerHTML={{ __html: blog.content.replace(/\n/g, '<br />') }}
          />

          {/* Tags */}
          {blog.tags && blog.tags.length > 0 && (
            <div className="mt-8 lg:mt-12 pt-6 lg:pt-8 border-t border-gray-200">
              <h3 className="text-sm lg:text-base font-semibold text-gray-900 mb-3 lg:mb-4">Tags</h3>
              <div className="flex flex-wrap gap-2 lg:gap-3">
                {blog.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="inline-block bg-yellow-100 text-yellow-800 px-3 lg:px-4 py-1 lg:py-2 rounded-full text-sm lg:text-base font-medium"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </article>

      {/* Related Articles */}
      {relatedBlogs.length > 0 && (
        <div className="bg-white mt-4 lg:mt-8 border-t-8 border-gray-100">
          <div className="max-w-4xl mx-auto p-4 lg:p-8">
            <h2 className="text-lg lg:text-2xl font-bold text-gray-900 mb-4 lg:mb-6">Related Articles</h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 lg:gap-6">
              {relatedBlogs.map((relatedBlog) => (
                <Link
                  key={relatedBlog._id}
                  to={`/blog/${relatedBlog.slug}`}
                  className="block bg-gray-50 rounded-lg p-3 lg:p-4 hover:bg-gray-100 transition-colors"
                >
                  <div className="flex items-start space-x-3 lg:space-x-4">
                    {relatedBlog.featuredImage && (
                      <img
                        src={`${backendUrl}/images/blog/${relatedBlog.featuredImage}`}
                        alt={relatedBlog.title}
                        className="w-16 h-16 lg:w-20 lg:h-20 object-cover rounded-lg flex-shrink-0"
                      />
                    )}
                    <div className="flex-1 min-w-0">
                      <h3 className="text-sm lg:text-base font-semibold text-gray-900 line-clamp-2 mb-1 lg:mb-2">
                        {relatedBlog.title}
                      </h3>
                      <p className="text-xs lg:text-sm text-gray-600 line-clamp-2 mb-2">
                        {relatedBlog.excerpt}
                      </p>
                      <div className="flex items-center justify-between text-xs lg:text-sm text-gray-500">
                        <span className="flex items-center">
                          <Calendar className="w-3 h-3 lg:w-4 lg:h-4 mr-1" />
                          {formatDate(relatedBlog.publishedDate)}
                        </span>
                        <div className="flex items-center">
                          <Eye className="w-3 h-3 lg:w-4 lg:h-4 mr-1" />
                          {relatedBlog.views || 0}
                        </div>
                      </div>
                    </div>
                    <ChevronRight className="w-4 h-4 lg:w-5 lg:h-5 text-gray-400 flex-shrink-0 mt-1" />
                  </div>
                </Link>
              ))}
            </div>
            
            <Link
              to="/blogs"
              className="block w-full mt-4 lg:mt-6 text-center bg-gradient-to-r from-gray-900 via-slate-900 to-black text-white py-3 lg:py-4 rounded-lg font-semibold text-sm lg:text-base hover:from-gray-800 hover:via-slate-800 hover:to-gray-900 transition-all duration-200"
            >
              View All Articles
            </Link>
          </div>
        </div>
      )}

      {/* SEO Meta tags are handled by the blog data */}
      {blog.metaTitle && (
        <div style={{ display: 'none' }}>
          <title>{blog.metaTitle}</title>
          <meta name="description" content={blog.metaDescription} />
          <meta property="og:title" content={blog.metaTitle} />
          <meta property="og:description" content={blog.metaDescription} />
          <meta property="og:type" content="article" />
          {blog.featuredImage && (
            <meta property="og:image" content={`${backendUrl}/images/blog/${blog.featuredImage}`} />
          )}
        </div>
      )}
    </div>
  );
};

export default BlogPost;