import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import LandingNavbar from '../components/LandingNavbar';
import Footer from '../components/Footer';

const BlogDetailPage = () => {
  const { slug } = useParams();
  const [blog, setBlog] = useState(null);
  const [relatedBlogs, setRelatedBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3000';

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${BACKEND_URL}/api/blogs/published/${slug}`);
        const data = await response.json();

        if (data.success) {
          setBlog(data.blog);
          setRelatedBlogs(data.relatedBlogs || []);
        } else {
          setError(data.message || 'Blog not found');
        }
      } catch (err) {
        setError('Failed to fetch blog');
        console.error('Error fetching blog:', err);
      } finally {
        setLoading(false);
      }
    };

    if (slug) {
      fetchBlog();
    }
  }, [slug, BACKEND_URL]);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const estimateReadTime = (content) => {
    const wordsPerMinute = 200;
    const words = content.replace(/<[^>]*>/g, '').split(/\s+/).length;
    return Math.ceil(words / wordsPerMinute);
  };

  const getImageUrl = (imagePath) => {
    if (!imagePath) return null;
    if (imagePath.startsWith('http')) return imagePath;
    return `${BACKEND_URL}${imagePath}`;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <LandingNavbar />
        <div className="flex justify-center items-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
        <Footer />
      </div>
    );
  }

  if (error || !blog) {
    return (
      <div className="min-h-screen bg-gray-50">
        <LandingNavbar />
        <div className="container mx-auto px-4 py-20 text-center">
          <div className="text-gray-400 text-6xl mb-4">😞</div>
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            {error || 'Blog not found'}
          </h1>
          <p className="text-gray-600 mb-8">
            The blog post you're looking for doesn't exist or has been removed.
          </p>
          <Link to="/blog" className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors">
            Back to Blogs
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <LandingNavbar />

      {/* Hero Section */}
      <div className="bg-gradient-to-br from-white via-gray-50 to-blue-50">
        <div className="container mx-auto px-4 py-8 lg:py-16">
          <div className="max-w-4xl mx-auto">
            <nav className="mb-8">
              <div className="flex items-center space-x-2 text-sm text-gray-500">
                <Link to="/" className="hover:text-blue-600 transition-colors">Home</Link>
                <span>/</span>
                <Link to="/blog" className="hover:text-blue-600 transition-colors">Blog</Link>
                <span>/</span>
                <span className="text-gray-900 font-medium truncate max-w-xs lg:max-w-md">{blog.title}</span>
              </div>
            </nav>

            <div className="text-center lg:text-left">
              <div className="mb-6">
                <span className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-semibold capitalize shadow-sm ${
                  blog.category === 'cricket' ? 'bg-blue-100 text-blue-800 border border-blue-200' :
                  blog.category === 'fantasy' ? 'bg-purple-100 text-purple-800 border border-purple-200' :
                  blog.category === 'tips' ? 'bg-orange-100 text-orange-800 border border-orange-200' :
                  blog.category === 'news' ? 'bg-red-100 text-red-800 border border-red-200' :
                  'bg-gray-100 text-gray-800 border border-gray-200'
                }`}>
                  {blog.category}
                </span>
              </div>
              
              <h1 className="text-3xl md:text-4xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight lg:leading-[1.1] tracking-tight">
                {blog.title}
              </h1>
              
              <p className="text-lg lg:text-xl text-gray-600 mb-8 leading-relaxed max-w-3xl mx-auto lg:mx-0">
                {blog.excerpt}
              </p>
              
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 p-6 bg-white rounded-xl shadow-sm border border-gray-100">
                <div className="flex items-center justify-center lg:justify-start space-x-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-lg">
                    {blog.author.charAt(0)}
                  </div>
                  <div className="text-left">
                    <div className="font-semibold text-gray-900">By {blog.author}</div>
                    <div className="text-sm text-gray-500">Cricket Expert</div>
                  </div>
                </div>
                
                <div className="grid grid-cols-3 gap-4 lg:gap-6 text-center lg:text-left">
                  <div>
                    <div className="text-sm font-medium text-gray-900">{formatDate(blog.publishedAt || blog.createdAt)}</div>
                    <div className="text-xs text-gray-500">Published</div>
                  </div>
                  <div>
                    <div className="text-sm font-medium text-gray-900">{estimateReadTime(blog.content)} min</div>
                    <div className="text-xs text-gray-500">Read time</div>
                  </div>
                  <div>
                    <div className="text-sm font-medium text-gray-900">{blog.views || 0}</div>
                    <div className="text-xs text-gray-500">Views</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Featured Image or Alt Text */}
      {blog.featuredImage ? (
        <div className="relative">
          <div className="w-full h-64 md:h-96 lg:h-[32rem] bg-gray-200 overflow-hidden">
            <img
              src={getImageUrl(blog.featuredImage)}
              alt={blog.featuredImageAlt || blog.title}
              className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
            />
          </div>
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent"></div>
        </div>
      ) : blog.featuredImageAlt ? (
        <div className="w-full h-32 md:h-40 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 flex items-center justify-center">
          <div className="text-center px-4">
            <svg className="w-12 h-12 text-blue-400 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <p className="text-blue-700 font-medium text-sm">{blog.featuredImageAlt}</p>
          </div>
        </div>
      ) : null}

      {/* Blog Content */}
      <div className="bg-white">
        <div className="container mx-auto px-4 py-12 lg:py-20">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col xl:flex-row gap-12 lg:gap-16">
              <article className="xl:w-2/3">
                <div className="hidden lg:block mb-12 p-6 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl border border-blue-100">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">In This Article</h3>
                  <div className="text-sm text-gray-600">
                    <p>This comprehensive guide covers fantasy cricket strategies, tips, and best practices to help you dominate your leagues.</p>
                  </div>
                </div>

                <div 
                  className="prose prose-lg lg:prose-xl max-w-none"
                  dangerouslySetInnerHTML={{ __html: blog.content }}
                  style={{ lineHeight: '1.8' }}
                ></div>

                {blog.tags && blog.tags.length > 0 && (
                  <div className="mt-16 p-6 bg-gray-50 rounded-xl border border-gray-100">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Topics Covered</h3>
                    <div className="flex flex-wrap gap-3">
                      {blog.tags.map((tag, index) => (
                        <span key={index} className="px-4 py-2 bg-white text-gray-700 text-sm rounded-full border border-gray-200">
                          #{tag}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </article>

              <aside className="xl:w-1/3">
                <div className="sticky top-8 space-y-8">
                  <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Author</h3>
                    <div className="text-center">
                      <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-xl mx-auto mb-4">
                        {blog.author.charAt(0)}
                      </div>
                      <h4 className="font-semibold text-gray-900">{blog.author}</h4>
                      <p className="text-sm text-gray-500">Cricket Expert</p>
                    </div>
                  </div>

                  {relatedBlogs.length > 0 && (
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                      <h3 className="text-lg font-semibold text-gray-900 mb-6">Related Articles</h3>
                      <div className="space-y-4">
                        {relatedBlogs.map((relatedBlog) => (
                          <div key={relatedBlog._id}>
                            <Link to={`/blog/${relatedBlog.slug}`} className="block hover:text-blue-600">
                              <h4 className="font-medium text-sm">{relatedBlog.title}</h4>
                              <p className="text-xs text-gray-500 mt-1">{formatDate(relatedBlog.publishedAt || relatedBlog.createdAt)}</p>
                            </Link>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </aside>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default BlogDetailPage;