// Editor utility functions
export const executeCommand = (command, value = null) => {
  document.execCommand(command, false, value);
};

// Check active formatting states
export const checkActiveFormats = () => {
  try {
    return {
      bold: document.queryCommandState('bold'),
      italic: document.queryCommandState('italic'),
      underline: document.queryCommandState('underline'),
      strikethrough: document.queryCommandState('strikethrough'),
      justifyLeft: document.queryCommandState('justifyLeft'),
      justifyCenter: document.queryCommandState('justifyCenter'),
      justifyRight: document.queryCommandState('justifyRight'),
      justifyFull: document.queryCommandState('justifyFull'),
      insertUnorderedList: document.queryCommandState('insertUnorderedList'),
      insertOrderedList: document.queryCommandState('insertOrderedList'),
      superscript: document.queryCommandState('superscript'),
      subscript: document.queryCommandState('subscript')
    };
  } catch (error) {
    console.warn('Error checking format states:', error);
    return {};
  }
};

// Image upload handler
export const handleImageUpload = async (file, BACKEND_URL, onProgress = null) => {
  if (!file) return null;

  // Validate file type
  if (!file.type.startsWith('image/')) {
    throw new Error('Please select a valid image file');
  }

  // Validate file size (10MB max)
  if (file.size > 10 * 1024 * 1024) {
    throw new Error('Image size must be less than 10MB');
  }

  const formData = new FormData();
  formData.append('image', file);
  formData.append('category', 'blog');

  try {
    const response = await fetch(`${BACKEND_URL}/api/upload/image`, {
      method: 'POST',
      body: formData,
      credentials: 'include'
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to upload image');
    }

    const data = await response.json();
    
    if (!data.success) {
      throw new Error(data.message || 'Failed to upload image');
    }

    return data;
  } catch (error) {
    console.error('Image upload error:', error);
    throw error;
  }
};

// Insert image into editor
export const insertImageIntoEditor = (editorRef, imageData, alignment = 'center', imageWidth = '80%') => {
  if (!editorRef.current || !imageData) return;

  const { imagePath } = imageData;
  const fullImageUrl = imagePath.startsWith('http') ? imagePath : `${window.location.origin}${imagePath}`;
  
  // Determine max width and margin based on alignment
  const maxWidth = imageWidth === 'small' ? '300px' : 
                   imageWidth === 'medium' ? '500px' : 
                   imageWidth === 'large' ? '100%' : imageWidth;
  
  const marginStyle = alignment === 'left' ? '0 20px 20px 0' :
                      alignment === 'right' ? '0 0 20px 20px' : '0 auto';

  const alt = `Image uploaded to blog`;
  
  // Create image HTML with responsive styling
  const img = `<div style="text-align: ${alignment}; margin: 20px 0;"><img src="${fullImageUrl}" alt="${alt}" style="width: ${imageWidth}; max-width: ${maxWidth}; height: auto; margin: ${marginStyle}; border-radius: 8px; box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1); display: ${alignment === 'center' ? 'block' : 'inline-block'};" /></div>`;
  
  // Insert at cursor position
  executeCommand('insertHTML', img);
  
  // Focus back to editor
  editorRef.current.focus();
};

// Insert link
export const insertLink = (editorRef) => {
  const url = prompt('Enter URL:');
  if (url) {
    const selection = window.getSelection();
    if (selection.toString()) {
      executeCommand('createLink', url);
    } else {
      const linkText = prompt('Enter link text:') || url;
      const linkHtml = `<a href="${url}" target="_blank" rel="noopener noreferrer">${linkText}</a>`;
      executeCommand('insertHTML', linkHtml);
    }
    editorRef.current?.focus();
  }
};

// Insert horizontal rule
export const insertHorizontalRule = (editorRef) => {
  executeCommand('insertHTML', '<hr style="margin: 20px 0; border: none; border-top: 2px solid #e5e7eb;">');
  editorRef.current?.focus();
};

// Format text
export const formatText = (command, editorRef) => {
  executeCommand(command);
  editorRef.current?.focus();
};

// History management
export const saveToHistory = (content, history, historyIndex, setHistory, setHistoryIndex, isUpdatingFromHistory) => {
  if (isUpdatingFromHistory) return;
  
  const newHistory = history.slice(0, historyIndex + 1);
  
  // Don't save if content is the same as last entry
  if (newHistory.length > 0 && newHistory[newHistory.length - 1] === content) {
    return { history, historyIndex };
  }
  
  newHistory.push(content);
  
  // Limit history to 50 entries
  if (newHistory.length > 50) {
    newHistory.shift();
    const newIndex = newHistory.length - 1;
    setHistory(newHistory);
    setHistoryIndex(newIndex);
    return { history: newHistory, historyIndex: newIndex };
  }
  
  const newIndex = newHistory.length - 1;
  setHistory(newHistory);
  setHistoryIndex(newIndex);
  return { history: newHistory, historyIndex: newIndex };
};

// Handle undo
export const handleUndo = (history, historyIndex, setHistoryIndex, setIsUpdatingFromHistory, editorRef, onChange) => {
  if (historyIndex > 0) {
    const prevContent = history[historyIndex - 1];
    setHistoryIndex(historyIndex - 1);
    setIsUpdatingFromHistory(true);
    
    if (editorRef.current) {
      editorRef.current.innerHTML = prevContent;
    }
    
    if (onChange) {
      onChange(prevContent);
    }
    
    setTimeout(() => setIsUpdatingFromHistory(false), 100);
  }
};

// Handle redo
export const handleRedo = (history, historyIndex, setHistoryIndex, setIsUpdatingFromHistory, editorRef, onChange) => {
  if (historyIndex < history.length - 1) {
    const nextContent = history[historyIndex + 1];
    setHistoryIndex(historyIndex + 1);
    setIsUpdatingFromHistory(true);
    
    if (editorRef.current) {
      editorRef.current.innerHTML = nextContent;
    }
    
    if (onChange) {
      onChange(nextContent);
    }
    
    setTimeout(() => setIsUpdatingFromHistory(false), 100);
  }
};

// Keyboard shortcuts handler
export const handleKeyboardShortcuts = (e, handlers) => {
  if (e.ctrlKey || e.metaKey) {
    switch (e.key) {
      case 'b':
        e.preventDefault();
        handlers.bold?.();
        break;
      case 'i':
        e.preventDefault();
        handlers.italic?.();
        break;
      case 'u':
        e.preventDefault();
        handlers.underline?.();
        break;
      case 'z':
        if (e.shiftKey) {
          e.preventDefault();
          handlers.redo?.();
        } else {
          e.preventDefault();
          handlers.undo?.();
        }
        break;
      case 'y':
        e.preventDefault();
        handlers.redo?.();
        break;
      case 'k':
        e.preventDefault();
        handlers.link?.();
        break;
      default:
        break;
    }
  }
};