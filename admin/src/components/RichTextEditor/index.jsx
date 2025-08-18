import React, { useRef, useCallback, useEffect, useState, useContext } from 'react';
import { AppContext } from '../../context/AppContext';
import { 
  Bold, 
  Italic, 
  Underline, 
  List, 
  ListOrdered, 
  Link, 
  Quote,
  Undo,
  Redo,
  Type,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  Strikethrough,
  Code,
  Image,
  Palette,
  Superscript,
  Subscript,
  Minus,
  MoreHorizontal,
  Highlighter,
  Table,
  Youtube,
  FileText,
  RemoveFormatting
} from 'lucide-react';
import { ColorPalette, AdvancedColorPicker, colorPalette } from './ColorPicker';

const RichTextEditor = ({ value, onChange, placeholder = "Start writing...", disabled = false }) => {
  const { BACKEND_URL } = useContext(AppContext);
  const editorRef = useRef(null);
  const [isEditorFocused, setIsEditorFocused] = useState(false);
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [showBgColorPicker, setShowBgColorPicker] = useState(false);
  const [currentColor, setCurrentColor] = useState('#000000');
  const [currentBgColor, setCurrentBgColor] = useState('#FFFF00');
  const [colorPickerMode, setColorPickerMode] = useState('palette'); // 'palette' or 'advanced'
  const [bgColorPickerMode, setBgColorPickerMode] = useState('palette');
  const [showHeadingDropdown, setShowHeadingDropdown] = useState(false);
  const [showListDropdown, setShowListDropdown] = useState(false);
  
  // Track active formatting states
  const [activeFormats, setActiveFormats] = useState({
    bold: false,
    italic: false,
    underline: false,
    strikethrough: false,
    justifyLeft: false,
    justifyCenter: false,
    justifyRight: false,
    justifyFull: false,
    insertUnorderedList: false,
    insertOrderedList: false,
    superscript: false,
    subscript: false
  });
  
  // Undo/Redo state management
  const [history, setHistory] = useState([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [isUpdatingFromHistory, setIsUpdatingFromHistory] = useState(false);
  const historyTimerRef = useRef(null);

  // Initialize editor with content
  useEffect(() => {
    if (editorRef.current && value !== editorRef.current.innerHTML) {
      editorRef.current.innerHTML = value || '';
    }
  }, [value]);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest('.color-picker-container')) {
        setShowColorPicker(false);
        setShowBgColorPicker(false);
      }
      if (!event.target.closest('.heading-dropdown-container')) {
        setShowHeadingDropdown(false);
      }
      if (!event.target.closest('.list-dropdown-container')) {
        setShowListDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Save to history with debouncing
  const saveToHistory = useCallback((content) => {
    if (isUpdatingFromHistory) return;
    
    // Clear existing timer
    if (historyTimerRef.current) {
      clearTimeout(historyTimerRef.current);
    }
    
    // Debounce history saves to avoid too many entries while typing
    historyTimerRef.current = setTimeout(() => {
      setHistory(prev => {
        const newHistory = prev.slice(0, historyIndex + 1);
        // Don't save if content is the same as last entry
        if (newHistory.length > 0 && newHistory[newHistory.length - 1] === content) {
          return prev;
        }
        newHistory.push(content);
        // Limit history to 50 entries
        if (newHistory.length > 50) {
          newHistory.shift();
          setHistoryIndex(prev => prev - 1);
          return newHistory;
        }
        setHistoryIndex(newHistory.length - 1);
        return newHistory;
      });
    }, 500); // Wait 500ms after user stops typing
  }, [historyIndex, isUpdatingFromHistory]);

  // Check active formatting states
  const checkActiveFormats = useCallback(() => {
    if (!editorRef.current || disabled) return;
    
    try {
      const newActiveFormats = {
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
      
      setActiveFormats(newActiveFormats);
    } catch (error) {
      // queryCommandState can sometimes throw errors, ignore them
      console.warn('Error checking format states:', error);
    }
  }, [disabled]);

  // Handle content change
  const handleInput = useCallback(() => {
    if (editorRef.current && onChange) {
      const content = editorRef.current.innerHTML;
      onChange(content);
      saveToHistory(content);
      checkActiveFormats();
    }
  }, [onChange, saveToHistory, checkActiveFormats]);

  // Initialize history with initial value
  useEffect(() => {
    if (value && history.length === 0) {
      setHistory([value]);
      setHistoryIndex(0);
    }
  }, [value, history.length]);

  // Undo function
  const handleUndo = useCallback(() => {
    if (historyIndex > 0) {
      setIsUpdatingFromHistory(true);
      const prevContent = history[historyIndex - 1];
      setHistoryIndex(historyIndex - 1);
      
      if (editorRef.current) {
        editorRef.current.innerHTML = prevContent;
        onChange(prevContent);
        editorRef.current.focus();
      }
      
      setTimeout(() => setIsUpdatingFromHistory(false), 100);
    }
  }, [history, historyIndex, onChange]);

  // Redo function
  const handleRedo = useCallback(() => {
    if (historyIndex < history.length - 1) {
      setIsUpdatingFromHistory(true);
      const nextContent = history[historyIndex + 1];
      setHistoryIndex(historyIndex + 1);
      
      if (editorRef.current) {
        editorRef.current.innerHTML = nextContent;
        onChange(nextContent);
        editorRef.current.focus();
      }
      
      setTimeout(() => setIsUpdatingFromHistory(false), 100);
    }
  }, [history, historyIndex, onChange]);

  // Execute formatting command
  const executeCommand = useCallback((command, value = null) => {
    if (disabled) return;
    
    document.execCommand(command, false, value);
    editorRef.current?.focus();
    
    // Check active formats after command execution
    setTimeout(checkActiveFormats, 10);
    
    // Save current state for undo/redo after formatting commands
    if (editorRef.current) {
      const content = editorRef.current.innerHTML;
      onChange(content);
      // Save immediately for formatting commands (no debounce)
      if (!isUpdatingFromHistory) {
        setHistory(prev => {
          const newHistory = prev.slice(0, historyIndex + 1);
          if (newHistory.length > 0 && newHistory[newHistory.length - 1] === content) {
            return prev;
          }
          newHistory.push(content);
          if (newHistory.length > 50) {
            newHistory.shift();
            setHistoryIndex(prev => prev - 1);
            return newHistory;
          }
          setHistoryIndex(newHistory.length - 1);
          return newHistory;
        });
      }
    }
  }, [disabled, onChange, historyIndex, isUpdatingFromHistory, checkActiveFormats]);

  // Handle selection changes to update active format states
  useEffect(() => {
    const handleSelectionChange = () => {
      if (isEditorFocused) {
        checkActiveFormats();
      }
    };

    document.addEventListener('selectionchange', handleSelectionChange);
    return () => {
      document.removeEventListener('selectionchange', handleSelectionChange);
    };
  }, [isEditorFocused, checkActiveFormats]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!isEditorFocused) return;
      
      // Ctrl+Z for undo
      if (e.ctrlKey && e.key === 'z' && !e.shiftKey) {
        e.preventDefault();
        handleUndo();
      }
      
      // Ctrl+Y or Ctrl+Shift+Z for redo
      if ((e.ctrlKey && e.key === 'y') || (e.ctrlKey && e.shiftKey && e.key === 'Z')) {
        e.preventDefault();
        handleRedo();
      }
      
      // Other useful shortcuts
      if (e.ctrlKey && e.key === 'b') {
        e.preventDefault();
        executeCommand('bold');
      }
      
      if (e.ctrlKey && e.key === 'i') {
        e.preventDefault();
        executeCommand('italic');
      }
      
      if (e.ctrlKey && e.key === 'u') {
        e.preventDefault();
        executeCommand('underline');
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      if (historyTimerRef.current) {
        clearTimeout(historyTimerRef.current);
      }
    };
  }, [isEditorFocused, handleUndo, handleRedo, executeCommand]);

  // Insert heading
  const insertHeading = useCallback((level) => {
    if (disabled) return;
    
    const selection = window.getSelection();
    if (selection.rangeCount > 0) {
      const range = selection.getRangeAt(0);
      const selectedText = range.toString();
      
      if (selectedText) {
        // If text is selected, format it as heading
        executeCommand('formatBlock', `h${level}`);
      } else {
        // If no text selected, insert heading with placeholder text and place cursor inside
        const headingHtml = `<h${level}>Heading ${level}</h${level}>`;
        executeCommand('insertHTML', headingHtml);
        
        // Find the inserted heading and select its text so user can type over it
        setTimeout(() => {
          const headings = editorRef.current.querySelectorAll(`h${level}`);
          const lastHeading = headings[headings.length - 1];
          if (lastHeading && lastHeading.textContent === `Heading ${level}`) {
            const range = document.createRange();
            const selection = window.getSelection();
            range.selectNodeContents(lastHeading);
            selection.removeAllRanges();
            selection.addRange(range);
            editorRef.current.focus();
          }
        }, 10);
      }
    }
    
    // Close the dropdown after selection
    setShowHeadingDropdown(false);
  }, [disabled, executeCommand]);

  // Insert link
  const insertLink = useCallback(() => {
    if (disabled) return;
    
    const selection = window.getSelection();
    const selectedText = selection.toString();
    
    const url = prompt('Enter URL:', 'https://');
    if (url && url !== 'https://') {
      if (selectedText) {
        executeCommand('createLink', url);
      } else {
        const linkText = prompt('Enter link text:', url);
        if (linkText) {
          const link = `<a href="${url}" target="_blank">${linkText}</a>`;
          executeCommand('insertHTML', link);
        }
      }
    }
  }, [disabled, executeCommand]);

  // Color functions
  const changeTextColor = useCallback((color) => {
    setCurrentColor(color);
    executeCommand('foreColor', color);
  }, [executeCommand]);

  const changeBackgroundColor = useCallback((color) => {
    setCurrentBgColor(color);
    executeCommand('hiliteColor', color);
  }, [executeCommand]);

  // List functions
  const insertPlainList = useCallback(() => {
    // First create a regular unordered list
    executeCommand('insertUnorderedList');
    
    // Then add the plain-list class to remove bullets
    setTimeout(() => {
      const selection = window.getSelection();
      if (selection.rangeCount > 0) {
        let node = selection.anchorNode;
        // Find the UL element
        while (node && node.nodeName !== 'UL') {
          node = node.parentNode;
          if (node === editorRef.current) break;
        }
        if (node && node.nodeName === 'UL') {
          node.classList.add('plain-list');
        }
      }
    }, 10);
    
    setShowListDropdown(false);
  }, [executeCommand]);

  const insertBulletList = useCallback(() => {
    executeCommand('insertUnorderedList');
    setShowListDropdown(false);
  }, [executeCommand]);

  const insertNumberedList = useCallback(() => {
    executeCommand('insertOrderedList');
    setShowListDropdown(false);
  }, [executeCommand]);

  // Advanced formatting functions
  const insertTable = useCallback(() => {
    const rows = prompt('Enter number of rows:', '3');
    const cols = prompt('Enter number of columns:', '3');
    if (rows && cols) {
      let tableHTML = '<table style="border-collapse: collapse; width: 100%; margin: 20px 0;">';
      for (let i = 0; i < parseInt(rows); i++) {
        tableHTML += '<tr>';
        for (let j = 0; j < parseInt(cols); j++) {
          tableHTML += '<td style="border: 1px solid #ccc; padding: 8px; min-width: 100px;">&nbsp;</td>';
        }
        tableHTML += '</tr>';
      }
      tableHTML += '</table>';
      executeCommand('insertHTML', tableHTML);
    }
  }, [executeCommand]);

  const insertYouTubeVideo = useCallback(() => {
    const url = prompt('Enter YouTube URL or embed code:');
    if (url) {
      let embedCode;
      // Extract video ID from different YouTube URL formats
      const videoIdMatch = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/);
      if (videoIdMatch) {
        const videoId = videoIdMatch[1];
        embedCode = `<div style="width: 320px; height: 180px; margin: 20px auto; max-width: 100%; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.15); background: #000;">
          <iframe src="https://www.youtube.com/embed/${videoId}" 
                  style="width: 100%; height: 100%; border: 0; display: block;" 
                  allowfullscreen></iframe>
        </div>`;
      } else if (url.includes('iframe')) {
        embedCode = `<div style="margin: 20px 0;">${url}</div>`;
      } else {
        alert('Please enter a valid YouTube URL or embed code');
        return;
      }
      executeCommand('insertHTML', embedCode);
    }
  }, [executeCommand]);

  const insertBlockQuote = useCallback(() => {
    const quoteHTML = '<blockquote style="border-left: 4px solid #e5e7eb; margin: 20px 0; padding: 10px 20px; background-color: #f9fafb; font-style: italic;">Quote text here...</blockquote>';
    executeCommand('insertHTML', quoteHTML);
  }, [executeCommand]);

  const removeFormatting = useCallback(() => {
    executeCommand('removeFormat');
    executeCommand('unlink');
  }, [executeCommand]);

  // Image upload
  const insertImage = useCallback(() => {
    if (disabled || isUploadingImage) return;
    
    const choice = confirm('Do you want to upload an image from your computer? Click "OK" to upload, or "Cancel" to enter a URL.');
    
    if (choice) {
      const input = document.createElement('input');
      input.type = 'file';
      input.accept = 'image/*';
      input.style.display = 'none';
      
      input.onchange = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        if (!file.type.startsWith('image/')) {
          alert('Please select a valid image file');
          return;
        }

        if (file.size > 10 * 1024 * 1024) {
          alert('Image size must be less than 10MB');
          return;
        }

        setIsUploadingImage(true);
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

          const { imagePath } = data;
          const fullImageUrl = imagePath.startsWith('http') ? imagePath : `${window.location.origin}${imagePath}`;
          
          const img = `<div style="text-align: center; margin: 20px 0;"><img src="${fullImageUrl}" alt="Uploaded image" style="width: 80%; max-width: 500px; height: auto; margin: 0 auto; border-radius: 8px; box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1); display: block;" /></div>`;
          
          executeCommand('insertHTML', img);
        } catch (error) {
          console.error('Image upload error:', error);
          alert(error.message || 'Failed to upload image');
        } finally {
          setIsUploadingImage(false);
        }
      };
      
      document.body.appendChild(input);
      input.click();
      document.body.removeChild(input);
    } else {
      const imageUrl = prompt('Enter image URL:', 'https://');
      if (imageUrl && imageUrl !== 'https://') {
        const img = `<div style="text-align: center; margin: 20px 0;"><img src="${imageUrl}" alt="Image" style="width: 80%; max-width: 500px; height: auto; margin: 0 auto; border-radius: 8px; box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1); display: block;" /></div>`;
        executeCommand('insertHTML', img);
      }
    }
  }, [disabled, isUploadingImage, BACKEND_URL, executeCommand]);

  // Format buttons configuration
  const formatButtons = [
    {
      icon: Bold,
      title: 'Bold',
      command: () => executeCommand('bold'),
      commandName: 'bold',
      shortcut: 'Ctrl+B'
    },
    {
      icon: Italic,
      title: 'Italic',
      command: () => executeCommand('italic'),
      commandName: 'italic',
      shortcut: 'Ctrl+I'
    },
    {
      icon: Underline,
      title: 'Underline',
      command: () => executeCommand('underline'),
      commandName: 'underline',
      shortcut: 'Ctrl+U'
    },
    {
      icon: Strikethrough,
      title: 'Strikethrough',
      command: () => executeCommand('strikeThrough'),
      commandName: 'strikethrough'
    },
    {
      icon: Code,
      title: 'Code',
      command: () => executeCommand('formatBlock', 'pre'),
      commandName: 'code'
    },
    {
      icon: Superscript,
      title: 'Superscript',
      command: () => executeCommand('superscript'),
      commandName: 'superscript'
    },
    {
      icon: Subscript,
      title: 'Subscript',
      command: () => executeCommand('subscript'),
      commandName: 'subscript'
    }
  ];

  const alignButtons = [
    {
      icon: AlignLeft,
      title: 'Align Left',
      command: () => executeCommand('justifyLeft'),
      commandName: 'justifyLeft'
    },
    {
      icon: AlignCenter,
      title: 'Align Center',
      command: () => executeCommand('justifyCenter'),
      commandName: 'justifyCenter'
    },
    {
      icon: AlignRight,
      title: 'Align Right',
      command: () => executeCommand('justifyRight'),
      commandName: 'justifyRight'
    },
    {
      icon: AlignJustify,
      title: 'Justify',
      command: () => executeCommand('justifyFull'),
      commandName: 'justifyFull'
    }
  ];

  // Removed old listButtons - now using dropdown

  const historyButtons = [
    {
      icon: Undo,
      title: 'Undo',
      command: handleUndo,
      shortcut: 'Ctrl+Z',
      disabled: historyIndex <= 0
    },
    {
      icon: Redo,
      title: 'Redo',
      command: handleRedo,
      shortcut: 'Ctrl+Y',
      disabled: historyIndex >= history.length - 1
    }
  ];

  return (
    <div className={`border border-gray-300 rounded-md ${disabled ? 'opacity-50 pointer-events-none' : ''}`}>
      {/* Toolbar */}
      <div className="border-b border-gray-200 bg-gray-50 p-3 flex flex-wrap gap-2">
        {/* Row 1 - Main formatting */}
        <div className="flex items-center gap-1 flex-wrap">
          {/* Headings Dropdown */}
          <div className="relative heading-dropdown-container">
            <button
              type="button"
              onClick={() => setShowHeadingDropdown(!showHeadingDropdown)}
              className="flex items-center px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 min-w-[120px]"
              disabled={disabled}
            >
              <Type size={16} className="mr-2" />
              Paragraph
              <svg className={`ml-auto w-4 h-4 transition-transform ${showHeadingDropdown ? 'rotate-180' : ''}`} fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </button>
            
            {showHeadingDropdown && (
              <div className="absolute left-0 top-full mt-1 w-48 bg-white border border-gray-300 rounded-md shadow-lg z-20">
                <div className="py-2">
                  <button
                    type="button"
                    onClick={() => {
                      executeCommand('formatBlock', 'div');
                      setShowHeadingDropdown(false);
                    }}
                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-700"
                    disabled={disabled}
                  >
                    <span className="text-base">Paragraph</span>
                  </button>
                  {[1, 2, 3, 4, 5, 6].map(level => (
                    <button
                      key={level}
                      type="button"
                      onClick={() => insertHeading(level)}
                      className={`block w-full text-left px-4 py-2 text-gray-700 hover:bg-blue-50 hover:text-blue-700 ${
                        level === 1 ? 'text-2xl font-bold' :
                        level === 2 ? 'text-xl font-bold' :
                        level === 3 ? 'text-lg font-semibold' :
                        level === 4 ? 'text-base font-semibold' :
                        level === 5 ? 'text-sm font-semibold' :
                        'text-xs font-semibold'
                      }`}
                      disabled={disabled}
                    >
                      Heading {level}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="w-px h-8 bg-gray-300 mx-1"></div>

          {/* Format Buttons */}
          {formatButtons.map((button, index) => {
            const IconComponent = button.icon;
            const isActive = activeFormats[button.commandName];
            return (
              <button
                key={index}
                type="button"
                onClick={button.command}
                title={button.shortcut ? `${button.title} (${button.shortcut})` : button.title}
                className={`p-2 rounded border focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all ${
                  isActive 
                    ? 'bg-blue-600 text-white border-blue-600 shadow-md' 
                    : 'text-gray-600 hover:text-gray-900 hover:bg-white border-transparent hover:border-gray-300'
                }`}
                disabled={disabled}
              >
                <IconComponent size={16} />
              </button>
            );
          })}

          <div className="w-px h-8 bg-gray-300 mx-1"></div>

          {/* Colors */}
          <div className="relative color-picker-container">
            <button
              type="button"
              onClick={() => {
                setShowColorPicker(!showColorPicker);
                setShowBgColorPicker(false);
              }}
              className="p-2 text-gray-600 hover:text-gray-900 hover:bg-white rounded border border-transparent hover:border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
              disabled={disabled}
              title="Text Color"
            >
              <Palette size={16} />
            </button>
            
            {/* Text Color Picker */}
            {showColorPicker && (
              <div className="absolute left-0 top-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg z-20">
                {colorPickerMode === 'palette' ? (
                  <div className="w-64 p-3">
                    <div className="flex justify-between items-center mb-2">
                      <div className="text-xs font-medium text-gray-700">Text Color</div>
                      <button
                        onClick={() => setColorPickerMode('advanced')}
                        className="text-xs text-blue-600 hover:text-blue-800"
                      >
                        Advanced
                      </button>
                    </div>
                    <div className="grid grid-cols-6 gap-1 mb-3">
                      {colorPalette.map((color, index) => (
                        <button
                          key={index}
                          type="button"
                          onClick={() => changeTextColor(color)}
                          className="w-8 h-8 rounded border border-gray-300 hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all hover:scale-110"
                          style={{ backgroundColor: color }}
                          title={color}
                          disabled={disabled}
                        />
                      ))}
                    </div>
                    
                    <div className="border-t pt-2">
                      <label className="block text-xs font-medium text-gray-700 mb-1">Quick Pick</label>
                      <div className="flex gap-2">
                        <input
                          type="color"
                          value={currentColor}
                          onChange={(e) => changeTextColor(e.target.value)}
                          className="w-12 h-8 rounded border border-gray-300 cursor-pointer"
                          disabled={disabled}
                        />
                        <input
                          type="text"
                          value={currentColor}
                          onChange={(e) => {
                            const hex = e.target.value;
                            if (/^#[0-9A-Fa-f]{0,6}$/.test(hex)) {
                              setCurrentColor(hex);
                              if (hex.length === 7) {
                                changeTextColor(hex);
                              }
                            }
                          }}
                          className="flex-1 px-2 py-1 text-xs border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                          placeholder="#000000"
                          disabled={disabled}
                        />
                      </div>
                    </div>
                    
                    <button
                      type="button"
                      onClick={() => setShowColorPicker(false)}
                      className="mt-2 w-full px-3 py-1 text-xs bg-gray-100 hover:bg-gray-200 rounded transition-colors"
                    >
                      Close
                    </button>
                  </div>
                ) : (
                  <AdvancedColorPicker
                    color={currentColor}
                    onChange={changeTextColor}
                    onClose={() => {
                      setColorPickerMode('palette');
                      setShowColorPicker(false);
                    }}
                    title="Advanced Text Color"
                  />
                )}
              </div>
            )}
          </div>

          {/* Background/Highlight Color */}
          <div className="relative color-picker-container">
            <button
              type="button"
              onClick={() => {
                setShowBgColorPicker(!showBgColorPicker);
                setShowColorPicker(false);
              }}
              className="p-2 text-gray-600 hover:text-gray-900 hover:bg-white rounded border border-transparent hover:border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
              disabled={disabled}
              title="Background/Highlight Color"
            >
              <Highlighter size={16} />
            </button>
            
            {/* Background Color Picker */}
            {showBgColorPicker && (
              <div className="absolute left-0 top-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg z-20">
                {bgColorPickerMode === 'palette' ? (
                  <div className="w-64 p-3">
                    <div className="flex justify-between items-center mb-2">
                      <div className="text-xs font-medium text-gray-700">Background Color</div>
                      <button
                        onClick={() => setBgColorPickerMode('advanced')}
                        className="text-xs text-blue-600 hover:text-blue-800"
                      >
                        Advanced
                      </button>
                    </div>
                    <div className="grid grid-cols-6 gap-1 mb-3">
                      {colorPalette.map((color, index) => (
                        <button
                          key={index}
                          type="button"
                          onClick={() => changeBackgroundColor(color)}
                          className="w-8 h-8 rounded border border-gray-300 hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all hover:scale-110"
                          style={{ backgroundColor: color }}
                          title={color}
                          disabled={disabled}
                        />
                      ))}
                    </div>
                    
                    <div className="border-t pt-2">
                      <label className="block text-xs font-medium text-gray-700 mb-1">Quick Pick</label>
                      <div className="flex gap-2">
                        <input
                          type="color"
                          value={currentBgColor}
                          onChange={(e) => changeBackgroundColor(e.target.value)}
                          className="w-12 h-8 rounded border border-gray-300 cursor-pointer"
                          disabled={disabled}
                        />
                        <input
                          type="text"
                          value={currentBgColor}
                          onChange={(e) => {
                            const hex = e.target.value;
                            if (/^#[0-9A-Fa-f]{0,6}$/.test(hex)) {
                              setCurrentBgColor(hex);
                              if (hex.length === 7) {
                                changeBackgroundColor(hex);
                              }
                            }
                          }}
                          className="flex-1 px-2 py-1 text-xs border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                          placeholder="#FFFF00"
                          disabled={disabled}
                        />
                      </div>
                    </div>
                    
                    <button
                      type="button"
                      onClick={() => setShowBgColorPicker(false)}
                      className="mt-2 w-full px-3 py-1 text-xs bg-gray-100 hover:bg-gray-200 rounded transition-colors"
                    >
                      Close
                    </button>
                  </div>
                ) : (
                  <AdvancedColorPicker
                    color={currentBgColor}
                    onChange={changeBackgroundColor}
                    onClose={() => {
                      setBgColorPickerMode('palette');
                      setShowBgColorPicker(false);
                    }}
                    title="Advanced Background Color"
                  />
                )}
              </div>
            )}
          </div>

          <div className="w-px h-8 bg-gray-300 mx-1"></div>

          {/* Alignment */}
          {alignButtons.map((button, index) => {
            const IconComponent = button.icon;
            const isActive = activeFormats[button.commandName];
            return (
              <button
                key={index}
                type="button"
                onClick={button.command}
                title={button.title}
                className={`p-2 rounded border focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all ${
                  isActive 
                    ? 'bg-blue-600 text-white border-blue-600 shadow-md' 
                    : 'text-gray-600 hover:text-gray-900 hover:bg-white border-transparent hover:border-gray-300'
                }`}
                disabled={disabled}
              >
                <IconComponent size={16} />
              </button>
            );
          })}

          <div className="w-px h-8 bg-gray-300 mx-1"></div>

          {/* Lists Dropdown */}
          <div className="relative list-dropdown-container">
            <button
              type="button"
              onClick={() => setShowListDropdown(!showListDropdown)}
              className="flex items-center px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 min-w-[100px]"
              disabled={disabled}
            >
              <List size={16} className="mr-2" />
              Lists
              <svg className={`ml-auto w-4 h-4 transition-transform ${showListDropdown ? 'rotate-180' : ''}`} fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </button>
            
            {showListDropdown && (
              <div className="absolute left-0 top-full mt-1 w-48 bg-white border border-gray-300 rounded-md shadow-lg z-20">
                <div className="py-2">
                  <button
                    type="button"
                    onClick={insertPlainList}
                    className="flex items-center w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-700"
                    disabled={disabled}
                  >
                    <div className="mr-3">
                      <div className="w-2 h-2 bg-transparent border border-gray-400 rounded-full"></div>
                    </div>
                    Plain List
                  </button>
                  <button
                    type="button"
                    onClick={insertBulletList}
                    className="flex items-center w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-700"
                    disabled={disabled}
                  >
                    <div className="mr-3">
                      <div className="w-2 h-2 bg-gray-600 rounded-full"></div>
                    </div>
                    Bullet List
                  </button>
                  <button
                    type="button"
                    onClick={insertNumberedList}
                    className="flex items-center w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-700"
                    disabled={disabled}
                  >
                    <div className="mr-3 text-xs font-semibold text-gray-600">
                      1.
                    </div>
                    Numbered List
                  </button>
                </div>
              </div>
            )}
          </div>

          <div className="w-px h-8 bg-gray-300 mx-1"></div>

          {/* Insert Tools */}
          <button
            type="button"
            onClick={insertLink}
            className="p-2 text-gray-600 hover:text-gray-900 hover:bg-white rounded border border-transparent hover:border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
            disabled={disabled}
            title="Insert Link"
          >
            <Link size={16} />
          </button>

          <button
            type="button"
            onClick={insertImage}
            className="p-2 text-gray-600 hover:text-gray-900 hover:bg-white rounded border border-transparent hover:border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
            disabled={disabled || isUploadingImage}
            title={isUploadingImage ? 'Uploading...' : 'Insert Image'}
          >
            <Image size={16} />
            {isUploadingImage && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
              </div>
            )}
          </button>

          <button
            type="button"
            onClick={() => executeCommand('insertHorizontalRule')}
            className="p-2 text-gray-600 hover:text-gray-900 hover:bg-white rounded border border-transparent hover:border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
            disabled={disabled}
            title="Insert Horizontal Rule"
          >
            <Minus size={16} />
          </button>

          <button
            type="button"
            onClick={insertTable}
            className="p-2 text-gray-600 hover:text-gray-900 hover:bg-white rounded border border-transparent hover:border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
            disabled={disabled}
            title="Insert Table"
          >
            <Table size={16} />
          </button>

          <button
            type="button"
            onClick={insertYouTubeVideo}
            className="p-2 text-gray-600 hover:text-gray-900 hover:bg-white rounded border border-transparent hover:border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
            disabled={disabled}
            title="Insert YouTube Video"
          >
            <Youtube size={16} />
          </button>

          <button
            type="button"
            onClick={insertBlockQuote}
            className="p-2 text-gray-600 hover:text-gray-900 hover:bg-white rounded border border-transparent hover:border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
            disabled={disabled}
            title="Insert Quote"
          >
            <Quote size={16} />
          </button>

          <div className="w-px h-8 bg-gray-300 mx-1"></div>

          {/* Advanced Tools */}
          <button
            type="button"
            onClick={removeFormatting}
            className="p-2 text-gray-600 hover:text-gray-900 hover:bg-white rounded border border-transparent hover:border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
            disabled={disabled}
            title="Remove Formatting"
          >
            <RemoveFormatting size={16} />
          </button>

          <div className="w-px h-8 bg-gray-300 mx-1"></div>

          {/* History */}
          {historyButtons.map((button, index) => {
            const IconComponent = button.icon;
            return (
              <button
                key={index}
                type="button"
                onClick={button.command}
                title={button.shortcut ? `${button.title} (${button.shortcut})` : button.title}
                className={`p-2 rounded border focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all ${
                  button.disabled
                    ? 'opacity-50 cursor-not-allowed text-gray-400'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-white border-transparent hover:border-gray-300'
                }`}
                disabled={disabled || button.disabled}
              >
                <IconComponent size={16} />
              </button>
            );
          })}
        </div>
      </div>
      
      {/* Editor */}
      <div className="relative">
        <div
          ref={editorRef}
          contentEditable={!disabled}
          className={`rich-text-editor-content p-4 min-h-[400px] max-h-[600px] overflow-y-auto focus:outline-none ${disabled ? 'bg-gray-100' : 'bg-white'}`}
          onInput={handleInput}
          onFocus={() => {
            setIsEditorFocused(true);
            checkActiveFormats();
          }}
          onBlur={() => setIsEditorFocused(false)}
          style={{
            fontSize: '16px',
            lineHeight: '1.6',
            fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif'
          }}
          suppressContentEditableWarning={true}
        />
        
        {/* Placeholder */}
        {!value && (
          <div className="absolute top-4 left-4 text-gray-400 pointer-events-none">
            {placeholder}
          </div>
        )}
      </div>
    </div>
  );
};

export default RichTextEditor;