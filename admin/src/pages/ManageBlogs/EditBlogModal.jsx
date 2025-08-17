import React, { useState, useContext, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { AppContext } from '../../context/AppContext';
import BlogForm from './BlogForm';

const EditBlogModal = ({ showModal, blog, onClose, onSuccess }) => {
  const { BACKEND_URL } = useContext(AppContext);
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    excerpt: '',
    author: 'Admin',
    category: 'general',
    tags: '',
    featuredImage: '',
    status: 'draft',
    metaTitle: '',
    metaDescription: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loading, setLoading] = useState(false);

  // Fetch full blog details when blog ID changes
  useEffect(() => {
    if (blog && showModal) {
      fetchBlogDetails();
    }
  }, [blog, showModal]);

  const fetchBlogDetails = async () => {
    if (!blog?._id) return;
    
    setLoading(true);
    try {
      const { data } = await axios.get(
        `${BACKEND_URL}/api/blogs/${blog._id}`,
        { withCredentials: true }
      );

      if (data.success) {
        const blogData = data.blog;
        setFormData({
          title: blogData.title || '',
          content: blogData.content || '',
          excerpt: blogData.excerpt || '',
          author: blogData.author || 'Admin',
          category: blogData.category || 'general',
          tags: blogData.tags ? blogData.tags.join(', ') : '',
          featuredImage: blogData.featuredImage || '',
          status: blogData.status || 'draft',
          metaTitle: blogData.metaTitle || '',
          metaDescription: blogData.metaDescription || '',
        });
      }
    } catch (error) {
      console.error('Error fetching blog details:', error);
      toast.error('Failed to fetch blog details');
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      content: '',
      excerpt: '',
      author: 'Admin',
      category: 'general',
      tags: '',
      featuredImage: '',
      status: 'draft',
      metaTitle: '',
      metaDescription: '',
    });
  };

  const handleUpdateBlog = async () => {
    // Remove HTML tags for validation
    const contentText = formData.content.replace(/<[^>]*>/g, '').trim();
    
    if (!formData.title.trim() || !contentText || !formData.excerpt.trim()) {
      toast.error('Please fill in all required fields');
      return;
    }

    if (contentText.length < 50) {
      toast.error('Content must be at least 50 characters long');
      return;
    }

    if (formData.excerpt.trim().length > 200) {
      toast.error('Excerpt must be less than 200 characters');
      return;
    }

    if (!blog?._id) {
      toast.error('Blog ID is missing');
      return;
    }

    setIsSubmitting(true);
    try {
      // Process tags
      const tagsArray = formData.tags
        ? formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag)
        : [];

      const blogData = {
        ...formData,
        title: formData.title.trim(),
        content: formData.content.trim(),
        excerpt: formData.excerpt.trim(),
        author: formData.author.trim(),
        tags: tagsArray,
        metaTitle: formData.metaTitle.trim() || formData.title.trim(),
        metaDescription: formData.metaDescription.trim() || formData.excerpt.trim(),
      };

      const { data } = await axios.put(
        `${BACKEND_URL}/api/blogs/${blog._id}`,
        blogData,
        { withCredentials: true }
      );

      if (data.success) {
        toast.success('Blog updated successfully');
        resetForm();
        onSuccess();
      }
    } catch (error) {
      console.error('Error updating blog:', error);
      toast.error(error.response?.data?.message || 'Failed to update blog');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  if (!showModal) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center p-6 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-900">Edit Blog</h2>
          <button
            onClick={handleClose}
            className="text-gray-500 hover:text-gray-700 p-1"
            disabled={isSubmitting || loading}
          >
            ✕
          </button>
        </div>

        <div className="p-6">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              <span className="ml-2 text-gray-600">Loading blog details...</span>
            </div>
          ) : (
            <BlogForm
              formData={formData}
              setFormData={setFormData}
              onSubmit={handleUpdateBlog}
              onCancel={handleClose}
              mode="edit"
              isSubmitting={isSubmitting}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default EditBlogModal;