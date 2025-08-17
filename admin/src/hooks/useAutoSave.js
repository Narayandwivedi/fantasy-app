import { useEffect, useCallback, useState, useRef, useContext } from 'react';
import { AppContext } from '../context/AppContext';
import axios from 'axios';

const useAutoSave = (formData, options = {}) => {
  const { BACKEND_URL } = useContext(AppContext);
  const {
    interval = 30000, // 30 seconds default
    enabled = true,
    onSaveSuccess,
    onSaveError,
  } = options;

  const [lastSaved, setLastSaved] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const [blogId, setBlogId] = useState(formData.id || null);
  const [saveCount, setSaveCount] = useState(0);
  const [autoSaveEnabled, setAutoSaveEnabled] = useState(enabled);
  
  const intervalRef = useRef(null);
  const lastFormDataRef = useRef(null);

  // Check if form data has actually changed
  const hasDataChanged = useCallback(() => {
    if (!lastFormDataRef.current) return true;
    
    const currentData = {
      title: formData.title?.trim() || '',
      content: formData.content?.trim() || '',
      excerpt: formData.excerpt?.trim() || '',
      author: formData.author?.trim() || '',
      category: formData.category || '',
      tags: formData.tags || '',
      featuredImage: formData.featuredImage || '',
      metaTitle: formData.metaTitle?.trim() || '',
      metaDescription: formData.metaDescription?.trim() || '',
    };

    const lastData = lastFormDataRef.current;

    return JSON.stringify(currentData) !== JSON.stringify(lastData);
  }, [formData]);

  // Save current state for comparison
  const updateLastFormData = useCallback(() => {
    lastFormDataRef.current = {
      title: formData.title?.trim() || '',
      content: formData.content?.trim() || '',
      excerpt: formData.excerpt?.trim() || '',
      author: formData.author?.trim() || '',
      category: formData.category || '',
      tags: formData.tags || '',
      featuredImage: formData.featuredImage || '',
      metaTitle: formData.metaTitle?.trim() || '',
      metaDescription: formData.metaDescription?.trim() || '',
    };
  }, [formData]);

  // Auto-save function
  const autoSave = useCallback(async () => {
    // Don't auto-save if disabled
    if (!autoSaveEnabled) return;

    // Don't auto-save if already saving
    if (isSaving) return;

    // Don't auto-save if no meaningful content
    const hasContent = formData.title?.trim() || formData.content?.trim();
    if (!hasContent) return;

    // Don't auto-save if no changes
    if (!hasDataChanged()) return;

    setIsSaving(true);
    
    try {
      // Prepare tags array
      let tagsArray = [];
      if (formData.tags) {
        if (Array.isArray(formData.tags)) {
          tagsArray = formData.tags;
        } else {
          tagsArray = formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag);
        }
      }

      const saveData = {
        blogId,
        title: formData.title?.trim() || 'Untitled Draft',
        content: formData.content?.trim() || '',
        excerpt: formData.excerpt?.trim() || '',
        author: formData.author?.trim() || 'Admin',
        category: formData.category || 'general',
        tags: tagsArray,
        featuredImage: formData.featuredImage || '',
        metaTitle: formData.metaTitle?.trim() || '',
        metaDescription: formData.metaDescription?.trim() || '',
      };

      const response = await axios.post(
        `${BACKEND_URL}/api/blogs/auto-save`,
        saveData,
        {
          headers: { 'Content-Type': 'application/json' },
          withCredentials: true
        }
      );

      if (response.data.success) {
        setBlogId(response.data.blogId);
        setLastSaved(new Date(response.data.lastSaved));
        setSaveCount(prev => prev + 1);
        updateLastFormData();
        
        // ✅ SUCCESS: Database save worked - Remove any localStorage backups
        localStorage.removeItem(`blog-draft-${response.data.blogId}`);
        cleanupOldBackups(response.data.blogId);

        if (onSaveSuccess) {
          onSaveSuccess(response.data);
        }
      }
    } catch (error) {
      console.error('Auto-save failed:', error);
      
      // Save to localStorage as fallback
      const fallbackData = {
        ...formData,
        timestamp: Date.now(),
        blogId
      };
      localStorage.setItem(`blog-draft-fallback-${Date.now()}`, JSON.stringify(fallbackData));
      
      if (onSaveError) {
        onSaveError(error);
      }
    } finally {
      setIsSaving(false);
    }
  }, [
    formData, 
    blogId, 
    autoSaveEnabled, 
    isSaving, 
    hasDataChanged, 
    updateLastFormData, 
    BACKEND_URL, 
    onSaveSuccess, 
    onSaveError
  ]);

  // Manual save function
  const manualSave = useCallback(() => {
    autoSave();
  }, [autoSave]);

  // Toggle auto-save
  const toggleAutoSave = useCallback(() => {
    setAutoSaveEnabled(prev => !prev);
  }, []);

  // Format time ago
  const formatTimeAgo = useCallback((date) => {
    if (!date) return '';
    
    const now = new Date();
    const diffInSeconds = Math.floor((now - date) / 1000);
    
    if (diffInSeconds < 60) return 'just now';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
    return `${Math.floor(diffInSeconds / 86400)}d ago`;
  }, []);

  // Cleanup utility functions
  const cleanupOldBackups = useCallback((currentBlogId) => {
    Object.keys(localStorage).forEach(key => {
      if (key.startsWith(`blog-draft-${currentBlogId}`) && 
          key !== `blog-draft-${currentBlogId}`) {
        localStorage.removeItem(key);
      }
    });
  }, []);

  const cleanupExpiredBackups = useCallback(() => {
    const oneDayAgo = Date.now() - (24 * 60 * 60 * 1000);
    let cleanedCount = 0;
    
    Object.keys(localStorage).forEach(key => {
      if (key.startsWith('blog-draft-') || key.startsWith('blog-draft-fallback-')) {
        try {
          const data = JSON.parse(localStorage.getItem(key));
          if (data.timestamp && data.timestamp < oneDayAgo) {
            localStorage.removeItem(key);
            cleanedCount++;
          }
        } catch (error) {
          // Invalid JSON, remove it
          localStorage.removeItem(key);
          cleanedCount++;
        }
      }
    });
    
    if (cleanedCount > 0) {
      console.log(`Cleaned up ${cleanedCount} expired blog draft backups`);
    }
  }, []);

  const clearAllDraftBackups = useCallback(() => {
    let clearedCount = 0;
    Object.keys(localStorage).forEach(key => {
      if (key.startsWith('blog-draft-') || key.startsWith('blog-draft-fallback-')) {
        localStorage.removeItem(key);
        clearedCount++;
      }
    });
    console.log(`Cleared ${clearedCount} blog draft backups`);
    return clearedCount;
  }, []);

  const getDraftBackupCount = useCallback(() => {
    return Object.keys(localStorage).filter(key => 
      key.startsWith('blog-draft-') || key.startsWith('blog-draft-fallback-')
    ).length;
  }, []);

  // Set up auto-save interval
  useEffect(() => {
    if (autoSaveEnabled && interval > 0) {
      intervalRef.current = setInterval(autoSave, interval);
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [autoSave, autoSaveEnabled, interval]);

  // Update blogId when formData.id changes
  useEffect(() => {
    if (formData.id && formData.id !== blogId) {
      setBlogId(formData.id);
    }
  }, [formData.id, blogId]);

  // Check for local storage backup on mount and cleanup expired ones
  useEffect(() => {
    const checkForBackup = () => {
      // First, cleanup expired backups (older than 24 hours)
      cleanupExpiredBackups();
      
      // Then check for remaining backups
      const keys = Object.keys(localStorage).filter(key => 
        key.startsWith('blog-draft-') || key.startsWith('blog-draft-fallback-')
      );
      
      if (keys.length > 0) {
        console.log('Found local backup drafts:', keys);
        // You could implement a recovery dialog here
      }
    };

    checkForBackup();
  }, [cleanupExpiredBackups]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  return {
    lastSaved,
    isSaving,
    autoSaveEnabled,
    saveCount,
    blogId,
    autoSave: manualSave,
    toggleAutoSave,
    formatTimeAgo,
    hasUnsavedChanges: hasDataChanged(),
    // Cleanup functions
    clearAllDraftBackups,
    cleanupExpiredBackups,
    getDraftBackupCount,
  };
};

export default useAutoSave;