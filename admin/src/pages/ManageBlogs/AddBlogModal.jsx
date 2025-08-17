import React, { useState, useContext } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { AppContext } from '../../context/AppContext';
import BlogForm from './BlogForm';

const AddBlogModal = ({ showModal, onClose, onSuccess }) => {
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

  const handleCreateBlog = async () => {
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

      const { data } = await axios.post(
        `${BACKEND_URL}/api/blogs`,
        blogData,
        { withCredentials: true }
      );

      if (data.success) {
        toast.success('Blog created successfully');
        resetForm();
        onSuccess();
      }
    } catch (error) {
      console.error('Error creating blog:', error);
      toast.error(error.response?.data?.message || 'Failed to create blog');
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
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white w-full h-full overflow-y-auto">
        <div className="flex justify-between items-center p-6 border-b border-gray-200 sticky top-0 bg-white z-10">
          <h2 className="text-xl font-bold text-gray-900">Create New Blog</h2>
          <button
            onClick={handleClose}
            className="text-gray-500 hover:text-gray-700 p-1 text-2xl"
            disabled={isSubmitting}
          >
            ✕
          </button>
        </div>

        <div className="p-6">
          <BlogForm
            formData={formData}
            setFormData={setFormData}
            onSubmit={handleCreateBlog}
            onCancel={handleClose}
            mode="add"
            isSubmitting={isSubmitting}
          />
        </div>
      </div>
    </div>
  );
};

export default AddBlogModal;