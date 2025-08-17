import React, { useCallback, useState, useContext } from 'react';
import RichTextEditor from '../../components/RichTextEditor';
import BlogContentPreview from '../../components/BlogContentPreview';
import { AppContext } from '../../context/AppContext';
import { toast } from 'react-toastify';
import axios from 'axios';
import upload_area from '../../assets/upload_area.svg';

const BLOG_CATEGORIES = [
  { value: 'general', label: 'General' },
  { value: 'cricket', label: 'Cricket' },
  { value: 'fantasy', label: 'Fantasy' },
  { value: 'tips', label: 'Tips' },
  { value: 'news', label: 'News' },
];

const BLOG_STATUSES = [
  { value: 'draft', label: 'Draft' },
  { value: 'published', label: 'Published' },
  { value: 'archived', label: 'Archived' },
];

const BlogForm = ({
  formData,
  setFormData,
  onSubmit,
  onCancel,
  mode = 'add',
  isSubmitting = false,
}) => {
  const { BACKEND_URL } = useContext(AppContext);
  const [imagePreview, setImagePreview] = useState(null);
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [isDeletingImage, setIsDeletingImage] = useState(false);


  const handleInputChange = useCallback((field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  }, [setFormData]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit();
  };

  // Handle image upload
  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast.error('Please select a valid image file');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image size should be less than 5MB');
      return;
    }

    setIsUploadingImage(true);
    try {
      const formDataUpload = new FormData();
      formDataUpload.append('blog', file);

      const response = await axios.post(
        `${BACKEND_URL}/api/upload/blog`,
        formDataUpload,
        {
          headers: { 'Content-Type': 'multipart/form-data' },
          withCredentials: true
        }
      );

      if (response.data.success) {
        const imageUrl = response.data.image_url;
        setImagePreview(`${BACKEND_URL}${imageUrl}`);
        handleInputChange('featuredImage', imageUrl);
        toast.success('Image uploaded successfully');
      }
    } catch (error) {
      console.error('Error uploading image:', error);
      toast.error(error.response?.data?.message || 'Failed to upload image');
    } finally {
      setIsUploadingImage(false);
    }
  };

  // Handle image deletion
  const handleDeleteImage = async () => {
    if (!window.confirm('Are you sure you want to remove this featured image?')) {
      return;
    }

    setIsDeletingImage(true);
    
    try {
      // If there's an existing featured image URL (not a preview), delete it from server
      if (formData.featuredImage && !imagePreview && !formData.featuredImage.startsWith('http')) {
        const response = await axios.delete(
          `${BACKEND_URL}/api/upload/blog-image`,
          {
            data: { imagePath: formData.featuredImage },
            withCredentials: true
          }
        );

        if (response.data.success) {
          console.log('Image deleted from server successfully');
        }
      }

      // Clear the form data and preview
      setImagePreview(null);
      handleInputChange('featuredImage', '');
      toast.success('Image removed successfully');
    } catch (error) {
      console.error('Error deleting image:', error);
      // Still remove from form even if server deletion fails
      setImagePreview(null);
      handleInputChange('featuredImage', '');
      toast.warning('Image removed from form, but may still exist on server');
    } finally {
      setIsDeletingImage(false);
    }
  };

  // Get image source for display
  const getImageSource = () => {
    if (imagePreview) return imagePreview;
    if (formData.featuredImage) {
      // Check if it's already a full URL or needs backend URL prefix
      if (formData.featuredImage.startsWith('http')) {
        return formData.featuredImage;
      } else {
        return `${BACKEND_URL}${formData.featuredImage}`;
      }
    }
    return upload_area;
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center bg-gray-50 px-4 py-3 rounded-lg border">
        <h2 className="text-lg font-semibold text-gray-900">
          {mode === 'add' ? 'Create New Blog Post' : 'Edit Blog Post'}
        </h2>
      </div>

      {/* Main Layout: 80% Left, 20% Right */}
      <div className="flex gap-6">
        {/* Left Side - 80% - Title and Content */}
        <div className="w-4/5 space-y-6">
          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Title *
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => handleInputChange('title', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter blog title"
              required
              disabled={isSubmitting}
            />
          </div>

          {/* Content */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Content * (Min 50 characters)
            </label>
            <RichTextEditor
              value={formData.content}
              onChange={(content) => handleInputChange('content', content)}
              placeholder="Write your blog content here..."
              disabled={isSubmitting}
            />
            <div className="text-xs text-gray-500 mt-1">
              Content length: {formData.content.replace(/<[^>]*>/g, '').length} characters (minimum 50 required)
            </div>
            
            {/* Content Preview */}
            <BlogContentPreview content={formData.content} title={formData.title} />
          </div>
        </div>

        {/* Right Side - 20% - Metadata */}
        <div className="w-1/5 space-y-6">
          {/* Excerpt */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Excerpt * (Max 200 characters)
            </label>
            <textarea
              value={formData.excerpt}
              onChange={(e) => handleInputChange('excerpt', e.target.value)}
              rows={4}
              maxLength={200}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
              placeholder="Brief description of the blog post"
              required
              disabled={isSubmitting}
            />
            <div className="text-xs text-gray-500 mt-1">
              {formData.excerpt.length}/200
            </div>
          </div>

          {/* Author */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Author
            </label>
            <input
              type="text"
              value={formData.author}
              onChange={(e) => handleInputChange('author', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
              placeholder="Author name"
              disabled={isSubmitting}
            />
          </div>

          {/* Category */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Category
            </label>
            <select
              value={formData.category}
              onChange={(e) => handleInputChange('category', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
              disabled={isSubmitting}
            >
              {BLOG_CATEGORIES.map((category) => (
                <option key={category.value} value={category.value}>
                  {category.label}
                </option>
              ))}
            </select>
          </div>

          {/* Tags */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tags
            </label>
            <textarea
              value={formData.tags}
              onChange={(e) => handleInputChange('tags', e.target.value)}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
              placeholder="cricket, fantasy, tips"
              disabled={isSubmitting}
            />
            <div className="text-xs text-gray-500 mt-1">
              Comma separated
            </div>
          </div>

          {/* Status */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Status
            </label>
            <select
              value={formData.status}
              onChange={(e) => handleInputChange('status', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
              disabled={isSubmitting}
            >
              {BLOG_STATUSES.map((status) => (
                <option key={status.value} value={status.value}>
                  {status.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Featured Image Upload */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Featured Image
        </label>
        <div className="space-y-4">
          {/* Image Upload/Preview Area */}
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
            {getImageSource() !== upload_area ? (
              <div className="relative inline-block">
                <img
                  src={getImageSource()}
                  alt="Featured image preview"
                  className="max-w-full h-56 object-cover rounded-lg border border-gray-200"
                  style={{ aspectRatio: '16/9' }}
                />
                {mode === 'edit' && formData.featuredImage && !imagePreview && (
                  <div className="absolute top-2 left-2 bg-blue-600 text-white text-xs px-2 py-1 rounded">
                    Current Image
                  </div>
                )}
                <div className="mt-3 flex gap-2 justify-center">
                  <label className="cursor-pointer inline-flex items-center px-4 py-2 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700 transition-colors">
                    {isUploadingImage ? 'Uploading...' : 'Change Image'}
                    <input
                      type="file"
                      className="hidden"
                      accept="image/*"
                      onChange={handleImageUpload}
                      disabled={isSubmitting || isUploadingImage}
                    />
                  </label>
                  <button
                    type="button"
                    onClick={handleDeleteImage}
                    disabled={isSubmitting || isDeletingImage}
                    className="px-4 py-2 bg-red-600 text-white text-sm rounded-md hover:bg-red-700 transition-colors disabled:opacity-50"
                  >
                    {isDeletingImage ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2 inline-block"></div>
                        Deleting...
                      </>
                    ) : (
                      'Remove Image'
                    )}
                  </button>
                </div>
                {mode === 'edit' && formData.featuredImage && !imagePreview && (
                  <p className="text-xs text-red-600 mt-2">
                    ⚠️ Clicking "Remove Image" will permanently delete this image from the server
                  </p>
                )}
              </div>
            ) : (
              <div className="py-8">
                <img
                  src={upload_area}
                  alt="Upload placeholder"
                  className="mx-auto h-12 w-12 opacity-40"
                />
                <div className="mt-4">
                  <label className="cursor-pointer inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors">
                    {isUploadingImage ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Uploading...
                      </>
                    ) : (
                      'Upload Featured Image'
                    )}
                    <input
                      type="file"
                      className="hidden"
                      accept="image/*"
                      onChange={handleImageUpload}
                      disabled={isSubmitting || isUploadingImage}
                    />
                  </label>
                </div>
                <p className="mt-2 text-sm text-gray-500">
                  PNG, JPG, WebP up to 5MB (Recommended: 1200x675px for SEO)
                </p>
              </div>
            )}
          </div>

          {/* Manual URL Input (Optional) */}
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">
              Or enter image URL manually (optional)
            </label>
            <input
              type="url"
              value={formData.featuredImage}
              onChange={(e) => {
                handleInputChange('featuredImage', e.target.value);
                setImagePreview(null); // Clear preview to use the URL
              }}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
              placeholder="https://example.com/image.jpg"
              disabled={isSubmitting}
            />
            <p className="mt-1 text-xs text-gray-500">
              This will override any uploaded image
            </p>
          </div>

          {/* Image Alt Tag */}
          {(formData.featuredImage || getImageSource() !== upload_area) && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Image Alt Text (for SEO and accessibility)
              </label>
              <input
                type="text"
                value={formData.featuredImageAlt || ''}
                onChange={(e) => handleInputChange('featuredImageAlt', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Describe what's in the image (e.g., Cricket players in action during IPL match)"
                disabled={isSubmitting}
              />
              <p className="mt-1 text-xs text-gray-500">
                This text will be displayed if the image fails to load and helps with SEO and accessibility
              </p>
            </div>
          )}
        </div>
      </div>

      {/* SEO Section */}
      <div className="border-t pt-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">SEO Settings</h3>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Meta Title (Max 60 characters)
            </label>
            <input
              type="text"
              value={formData.metaTitle}
              onChange={(e) => handleInputChange('metaTitle', e.target.value)}
              maxLength={60}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="SEO title (will use blog title if empty)"
              disabled={isSubmitting}
            />
            <div className="text-xs text-gray-500 mt-1">
              {formData.metaTitle.length}/60 characters
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Meta Description (Max 160 characters)
            </label>
            <textarea
              value={formData.metaDescription}
              onChange={(e) => handleInputChange('metaDescription', e.target.value)}
              rows={3}
              maxLength={160}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="SEO description (will use excerpt if empty)"
              disabled={isSubmitting}
            />
            <div className="text-xs text-gray-500 mt-1">
              {formData.metaDescription.length}/160 characters
            </div>
          </div>
        </div>
      </div>

      {/* Form Buttons */}
      <div className="flex gap-3 pt-6 border-t">
        <button
          type="button"
          onClick={onCancel}
          className="flex-1 bg-gray-500 text-white py-3 rounded-lg hover:bg-gray-600 transition disabled:opacity-50"
          disabled={isSubmitting}
        >
          Cancel
        </button>
        <button
          type="submit"
          className={`flex-1 text-white py-3 rounded-lg transition disabled:opacity-50 ${
            mode === 'add'
              ? 'bg-blue-600 hover:bg-blue-700'
              : 'bg-green-600 hover:bg-green-700'
          }`}
          disabled={isSubmitting}
        >
          {isSubmitting 
            ? 'Processing...' 
            : mode === 'add' 
              ? 'Create Blog' 
              : 'Update Blog'
          }
        </button>
      </div>
    </form>
  );
};

export default BlogForm;