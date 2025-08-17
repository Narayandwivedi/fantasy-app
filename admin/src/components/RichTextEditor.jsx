import React, { useRef, useCallback, useEffect, useState, useContext } from 'react';
import { AppContext } from '../context/AppContext';
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
  MoreHorizontal
} from 'lucide-react';

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

  // Close color pickers when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest('.color-picker-container')) {
        setShowColorPicker(false);
        setShowBgColorPicker(false);
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

  // Handle content change
  const handleInput = useCallback(() => {
    if (editorRef.current && onChange) {
      const content = editorRef.current.innerHTML;
      onChange(content);
      saveToHistory(content);
    }
  }, [onChange, saveToHistory]);

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
  }, [disabled, onChange, historyIndex, isUpdatingFromHistory]);

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
        executeCommand('formatBlock', `h${level}`);
      } else {
        const heading = document.createElement(`h${level}`);
        heading.textContent = `Heading ${level}`;
        range.insertNode(heading);
        
        // Place cursor after the heading
        const newRange = document.createRange();
        newRange.setStartAfter(heading);
        newRange.collapse(true);
        selection.removeAllRanges();
        selection.addRange(newRange);
        
        handleInput();
      }
    }
  }, [disabled, executeCommand, handleInput]);

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

  // Insert image with upload option and resize controls
  const insertImage = useCallback(() => {
    if (disabled || isUploadingImage) return;
    
    const choice = confirm('Do you want to upload an image from your computer? Click "OK" to upload, or "Cancel" to enter a URL.');
    
    if (choice) {
      // File upload option
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
        
        if (file.size > 5 * 1024 * 1024) {
          alert('Image size should be less than 5MB');
          return;
        }
        
        setIsUploadingImage(true);
        
        try {
          const formData = new FormData();
          formData.append('blogContent', file);
          
          const response = await fetch(`${BACKEND_URL}/api/upload/blog-content`, {
            method: 'POST',
            body: formData,
            credentials: 'include'
          });
          
          const data = await response.json();
          
          if (data.success) {
            // Get image configuration from user
            const alt = prompt('Enter alt text (optional):', '') || '';
            
            // Image size options
            const sizeChoice = prompt(
              'Choose image size:\n' +
              '1 - Small (300px width)\n' +
              '2 - Medium (600px width)\n' +
              '3 - Large (900px width)\n' +
              '4 - Full width (100%)\n' +
              '5 - Custom size\n' +
              'Enter number (1-5):', '2'
            );
            
            let imageWidth = '600px';
            let maxWidth = '100%';
            
            switch(sizeChoice) {
              case '1':
                imageWidth = '300px';
                break;
              case '2':
                imageWidth = '600px';
                break;
              case '3':
                imageWidth = '900px';
                break;
              case '4':
                imageWidth = '100%';
                maxWidth = '100%';
                break;
              case '5':
                const customWidth = prompt('Enter custom width (e.g., 400px, 50%, 800px):', '400px');
                if (customWidth) {
                  imageWidth = customWidth;
                }
                break;
              default:
                imageWidth = '600px';
            }
            
            // Alignment options
            const alignChoice = prompt(
              'Choose alignment:\n' +
              '1 - Left\n' +
              '2 - Center\n' +
              '3 - Right\n' +
              'Enter number (1-3):', '2'
            );
            
            let alignment = 'center';
            let marginStyle = '15px auto';
            
            switch(alignChoice) {
              case '1':
                alignment = 'left';
                marginStyle = '15px 20px 15px 0';
                break;
              case '2':
                alignment = 'center';
                marginStyle = '15px auto';
                break;
              case '3':
                alignment = 'right';
                marginStyle = '15px 0 15px 20px';
                break;
            }
            
            const fullImageUrl = `${BACKEND_URL}${data.image_url}`;
            const img = `<div style="text-align: ${alignment}; margin: 20px 0;"><img src="${fullImageUrl}" alt="${alt}" style="width: ${imageWidth}; max-width: ${maxWidth}; height: auto; margin: ${marginStyle}; border-radius: 8px; box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1); display: ${alignment === 'center' ? 'block' : 'inline-block'};" /></div>`;
            executeCommand('insertHTML', img);
            alert('Image uploaded and inserted successfully!');
          } else {
            alert(data.message || 'Failed to upload image');
          }
        } catch (error) {
          console.error('Error uploading image:', error);
          alert('Failed to upload image. Please try again.');
        } finally {
          setIsUploadingImage(false);
        }
        
        // Clean up
        document.body.removeChild(input);
      };
      
      document.body.appendChild(input);
      input.click();
    } else {
      // URL input option with resize controls
      const url = prompt('Enter image URL:', 'https://');
      if (url && url !== 'https://') {
        const alt = prompt('Enter alt text (optional):', '') || '';
        
        // Size options for URL images
        const sizeChoice = prompt(
          'Choose image size:\n' +
          '1 - Small (300px width)\n' +
          '2 - Medium (600px width)\n' +
          '3 - Large (900px width)\n' +
          '4 - Full width (100%)\n' +
          '5 - Custom size\n' +
          'Enter number (1-5):', '2'
        );
        
        let imageWidth = '600px';
        let maxWidth = '100%';
        
        switch(sizeChoice) {
          case '1':
            imageWidth = '300px';
            break;
          case '2':
            imageWidth = '600px';
            break;
          case '3':
            imageWidth = '900px';
            break;
          case '4':
            imageWidth = '100%';
            maxWidth = '100%';
            break;
          case '5':
            const customWidth = prompt('Enter custom width (e.g., 400px, 50%, 800px):', '400px');
            if (customWidth) {
              imageWidth = customWidth;
            }
            break;
          default:
            imageWidth = '600px';
        }
        
        // Alignment options
        const alignChoice = prompt(
          'Choose alignment:\n' +
          '1 - Left\n' +
          '2 - Center\n' +
          '3 - Right\n' +
          'Enter number (1-3):', '2'
        );
        
        let alignment = 'center';
        let marginStyle = '15px auto';
        
        switch(alignChoice) {
          case '1':
            alignment = 'left';
            marginStyle = '15px 20px 15px 0';
            break;
          case '2':
            alignment = 'center';
            marginStyle = '15px auto';
            break;
          case '3':
            alignment = 'right';
            marginStyle = '15px 0 15px 20px';
            break;
        }
        
        const img = `<div style="text-align: ${alignment}; margin: 20px 0;"><img src="${url}" alt="${alt}" style="width: ${imageWidth}; max-width: ${maxWidth}; height: auto; margin: ${marginStyle}; border-radius: 8px; box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1); display: ${alignment === 'center' ? 'block' : 'inline-block'};" /></div>`;
        executeCommand('insertHTML', img);
      }
    }
  }, [disabled, executeCommand, BACKEND_URL, isUploadingImage]);

  // Insert horizontal rule
  const insertHR = useCallback(() => {
    if (disabled) return;
    executeCommand('insertHTML', '<hr style="margin: 20px 0; border: none; border-top: 1px solid #e5e7eb;" />');
  }, [disabled, executeCommand]);

  // Insert code block
  const insertCodeBlock = useCallback(() => {
    if (disabled) return;
    const code = prompt('Enter code:');
    if (code) {
      const codeBlock = `<pre style="background-color: #f3f4f6; padding: 15px; border-radius: 5px; margin: 10px 0; overflow-x: auto; font-family: monospace;"><code>${code}</code></pre>`;
      executeCommand('insertHTML', codeBlock);
    }
  }, [disabled, executeCommand]);

  // Convert hex to RGB
  const hexToRgb = useCallback((hex) => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    } : null;
  }, []);

  // Convert RGB to hex
  const rgbToHex = useCallback((r, g, b) => {
    return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
  }, []);

  // Convert HSL to RGB
  const hslToRgb = useCallback((h, s, l) => {
    h /= 360;
    s /= 100;
    l /= 100;
    const a = s * Math.min(l, 1 - l);
    const f = n => {
      const k = (n + h / (1/12)) % 12;
      return l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
    };
    return {
      r: Math.round(f(0) * 255),
      g: Math.round(f(8) * 255),
      b: Math.round(f(4) * 255)
    };
  }, []);

  // Convert RGB to HSL
  const rgbToHsl = useCallback((r, g, b) => {
    r /= 255;
    g /= 255;
    b /= 255;
    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    let h, s, l = (max + min) / 2;

    if (max === min) {
      h = s = 0; // achromatic
    } else {
      const d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
      switch (max) {
        case r: h = (g - b) / d + (g < b ? 6 : 0); break;
        case g: h = (b - r) / d + 2; break;
        case b: h = (r - g) / d + 4; break;
      }
      h /= 6;
    }

    return {
      h: Math.round(h * 360),
      s: Math.round(s * 100),
      l: Math.round(l * 100)
    };
  }, []);

  // Change text color with color picker
  const changeTextColor = useCallback((color) => {
    if (disabled) return;
    setCurrentColor(color);
    executeCommand('foreColor', color);
    editorRef.current?.focus();
  }, [disabled, executeCommand]);

  // Change background color with color picker
  const changeBackgroundColor = useCallback((color) => {
    if (disabled) return;
    setCurrentBgColor(color);
    executeCommand('backColor', color);
    editorRef.current?.focus();
  }, [disabled, executeCommand]);

  // Color palette
  const colorPalette = [
    '#000000', '#333333', '#666666', '#999999', '#CCCCCC', '#FFFFFF',
    '#FF0000', '#FF6600', '#FFCC00', '#FFFF00', '#99FF00', '#00FF00',
    '#00FFCC', '#00CCFF', '#0066FF', '#0000FF', '#6600FF', '#CC00FF',
    '#FF0099', '#FF6666', '#FFCC99', '#FFFF99', '#CCFF99', '#99FFCC',
    '#99CCFF', '#CC99FF', '#FF99CC', '#8B4513', '#A0522D', '#D2691E',
    '#CD853F', '#DEB887', '#F5DEB3', '#FFF8DC', '#FFFACD', '#FFEFD5'
  ];

  // Advanced Color Picker Component
  const AdvancedColorPicker = ({ color, onChange, onClose, title }) => {
    const [selectedColor, setSelectedColor] = useState(color);
    const [rgbValues, setRgbValues] = useState(() => hexToRgb(color) || { r: 0, g: 0, b: 0 });
    const [hslValues, setHslValues] = useState(() => rgbToHsl(rgbValues.r, rgbValues.g, rgbValues.b));

    const updateColor = useCallback((newColor) => {
      setSelectedColor(newColor);
      const rgb = hexToRgb(newColor);
      if (rgb) {
        setRgbValues(rgb);
        setHslValues(rgbToHsl(rgb.r, rgb.g, rgb.b));
      }
    }, [hexToRgb, rgbToHsl]);

    const updateFromRgb = useCallback((r, g, b) => {
      const newRgb = { r: Math.max(0, Math.min(255, r)), g: Math.max(0, Math.min(255, g)), b: Math.max(0, Math.min(255, b)) };
      setRgbValues(newRgb);
      const hex = rgbToHex(newRgb.r, newRgb.g, newRgb.b);
      setSelectedColor(hex);
      setHslValues(rgbToHsl(newRgb.r, newRgb.g, newRgb.b));
    }, [rgbToHex, rgbToHsl]);

    const updateFromHsl = useCallback((h, s, l) => {
      const newHsl = { h: Math.max(0, Math.min(360, h)), s: Math.max(0, Math.min(100, s)), l: Math.max(0, Math.min(100, l)) };
      setHslValues(newHsl);
      const rgb = hslToRgb(newHsl.h, newHsl.s, newHsl.l);
      setRgbValues(rgb);
      const hex = rgbToHex(rgb.r, rgb.g, rgb.b);
      setSelectedColor(hex);
    }, [hslToRgb, rgbToHex]);

    const applyColor = useCallback(() => {
      onChange(selectedColor);
      onClose();
    }, [selectedColor, onChange, onClose]);

    return (
      <div className="w-80 bg-white border border-gray-300 rounded-md shadow-lg p-4">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-sm font-medium text-gray-900">{title}</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 text-lg"
          >
            ✕
          </button>
        </div>

        {/* Color Preview */}
        <div className="mb-4">
          <div className="w-full h-12 rounded border border-gray-300 mb-2" style={{ backgroundColor: selectedColor }}></div>
          <div className="text-center text-sm font-mono text-gray-600">{selectedColor}</div>
        </div>

        {/* HTML5 Color Picker */}
        <div className="mb-4">
          <label className="block text-xs font-medium text-gray-700 mb-1">Color Picker</label>
          <input
            type="color"
            value={selectedColor}
            onChange={(e) => updateColor(e.target.value)}
            className="w-full h-10 rounded border border-gray-300 cursor-pointer"
          />
        </div>

        {/* Hex Input */}
        <div className="mb-4">
          <label className="block text-xs font-medium text-gray-700 mb-1">Hex</label>
          <input
            type="text"
            value={selectedColor}
            onChange={(e) => {
              const hex = e.target.value;
              if (/^#[0-9A-Fa-f]{0,6}$/.test(hex)) {
                setSelectedColor(hex);
                if (hex.length === 7) {
                  updateColor(hex);
                }
              }
            }}
            className="w-full px-3 py-2 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
            placeholder="#000000"
          />
        </div>

        {/* RGB Inputs */}
        <div className="mb-4">
          <label className="block text-xs font-medium text-gray-700 mb-2">RGB</label>
          <div className="grid grid-cols-3 gap-2">
            <div>
              <label className="block text-xs text-gray-500 mb-1">R</label>
              <input
                type="number"
                min="0"
                max="255"
                value={rgbValues.r}
                onChange={(e) => updateFromRgb(parseInt(e.target.value) || 0, rgbValues.g, rgbValues.b)}
                className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-xs text-gray-500 mb-1">G</label>
              <input
                type="number"
                min="0"
                max="255"
                value={rgbValues.g}
                onChange={(e) => updateFromRgb(rgbValues.r, parseInt(e.target.value) || 0, rgbValues.b)}
                className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-xs text-gray-500 mb-1">B</label>
              <input
                type="number"
                min="0"
                max="255"
                value={rgbValues.b}
                onChange={(e) => updateFromRgb(rgbValues.r, rgbValues.g, parseInt(e.target.value) || 0)}
                className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>

        {/* HSL Inputs */}
        <div className="mb-4">
          <label className="block text-xs font-medium text-gray-700 mb-2">HSL</label>
          <div className="grid grid-cols-3 gap-2">
            <div>
              <label className="block text-xs text-gray-500 mb-1">H</label>
              <input
                type="number"
                min="0"
                max="360"
                value={hslValues.h}
                onChange={(e) => updateFromHsl(parseInt(e.target.value) || 0, hslValues.s, hslValues.l)}
                className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-xs text-gray-500 mb-1">S</label>
              <input
                type="number"
                min="0"
                max="100"
                value={hslValues.s}
                onChange={(e) => updateFromHsl(hslValues.h, parseInt(e.target.value) || 0, hslValues.l)}
                className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-xs text-gray-500 mb-1">L</label>
              <input
                type="number"
                min="0"
                max="100"
                value={hslValues.l}
                onChange={(e) => updateFromHsl(hslValues.h, hslValues.s, parseInt(e.target.value) || 0)}
                className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>

        {/* RGB Sliders */}
        <div className="mb-4">
          <label className="block text-xs font-medium text-gray-700 mb-2">RGB Sliders</label>
          <div className="space-y-2">
            <div>
              <div className="flex justify-between text-xs text-gray-500 mb-1">
                <span>Red</span>
                <span>{rgbValues.r}</span>
              </div>
              <input
                type="range"
                min="0"
                max="255"
                value={rgbValues.r}
                onChange={(e) => updateFromRgb(parseInt(e.target.value), rgbValues.g, rgbValues.b)}
                className="w-full h-2 bg-red-200 rounded-lg appearance-none cursor-pointer slider-red"
              />
            </div>
            <div>
              <div className="flex justify-between text-xs text-gray-500 mb-1">
                <span>Green</span>
                <span>{rgbValues.g}</span>
              </div>
              <input
                type="range"
                min="0"
                max="255"
                value={rgbValues.g}
                onChange={(e) => updateFromRgb(rgbValues.r, parseInt(e.target.value), rgbValues.b)}
                className="w-full h-2 bg-green-200 rounded-lg appearance-none cursor-pointer slider-green"
              />
            </div>
            <div>
              <div className="flex justify-between text-xs text-gray-500 mb-1">
                <span>Blue</span>
                <span>{rgbValues.b}</span>
              </div>
              <input
                type="range"
                min="0"
                max="255"
                value={rgbValues.b}
                onChange={(e) => updateFromRgb(rgbValues.r, rgbValues.g, parseInt(e.target.value))}
                className="w-full h-2 bg-blue-200 rounded-lg appearance-none cursor-pointer slider-blue"
              />
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2">
          <button
            onClick={applyColor}
            className="flex-1 bg-blue-600 text-white py-2 px-4 rounded text-sm hover:bg-blue-700 transition-colors"
          >
            Apply Color
          </button>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-100 text-gray-700 rounded text-sm hover:bg-gray-200 transition-colors"
          >
            Cancel
          </button>
        </div>
      </div>
    );
  };

  // Clear formatting
  const clearFormatting = useCallback(() => {
    if (disabled) return;
    executeCommand('removeFormat');
  }, [disabled, executeCommand]);

  // Get text content for character count
  const getTextContent = () => {
    if (editorRef.current) {
      return editorRef.current.textContent || editorRef.current.innerText || '';
    }
    return '';
  };

  const formatButtons = [
    {
      icon: Bold,
      title: 'Bold',
      command: () => executeCommand('bold'),
      shortcut: 'Ctrl+B'
    },
    {
      icon: Italic,
      title: 'Italic',
      command: () => executeCommand('italic'),
      shortcut: 'Ctrl+I'
    },
    {
      icon: Underline,
      title: 'Underline',
      command: () => executeCommand('underline'),
      shortcut: 'Ctrl+U'
    },
    {
      icon: Strikethrough,
      title: 'Strikethrough',
      command: () => executeCommand('strikethrough')
    }
  ];

  const alignButtons = [
    {
      icon: AlignLeft,
      title: 'Align Left',
      command: () => executeCommand('justifyLeft')
    },
    {
      icon: AlignCenter,
      title: 'Align Center',
      command: () => executeCommand('justifyCenter')
    },
    {
      icon: AlignRight,
      title: 'Align Right',
      command: () => executeCommand('justifyRight')
    },
    {
      icon: AlignJustify,
      title: 'Justify',
      command: () => executeCommand('justifyFull')
    }
  ];

  const listButtons = [
    {
      icon: List,
      title: 'Bullet List',
      command: () => executeCommand('insertUnorderedList')
    },
    {
      icon: ListOrdered,
      title: 'Numbered List',
      command: () => executeCommand('insertOrderedList')
    }
  ];

  const insertButtons = [
    {
      icon: Link,
      title: 'Insert Link',
      command: insertLink
    },
    {
      icon: Image,
      title: 'Insert Image',
      command: insertImage
    },
    {
      icon: Code,
      title: 'Insert Code Block',
      command: insertCodeBlock
    },
    {
      icon: Quote,
      title: 'Quote',
      command: () => executeCommand('formatBlock', 'blockquote')
    },
    {
      icon: Minus,
      title: 'Horizontal Rule',
      command: insertHR
    }
  ];

  const scriptButtons = [
    {
      icon: Superscript,
      title: 'Superscript',
      command: () => executeCommand('superscript')
    },
    {
      icon: Subscript,
      title: 'Subscript',
      command: () => executeCommand('subscript')
    }
  ];

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
    <div className={`border border-gray-300 rounded-md focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-blue-500 ${disabled ? 'opacity-50 pointer-events-none' : ''}`}>
      {/* Toolbar */}
      <div className="border-b border-gray-200 bg-gray-50 p-3 flex flex-wrap gap-2">
        {/* Row 1 - Main formatting */}
        <div className="flex items-center gap-1 flex-wrap">
          {/* Headings Dropdown */}
          <div className="relative group">
            <button
              type="button"
              className="flex items-center px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 min-w-[120px]"
              disabled={disabled}
            >
              <Type size={16} className="mr-2" />
              Paragraph
              <svg className="ml-auto w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </button>
            
            <div className="absolute left-0 top-full mt-1 w-48 bg-white border border-gray-300 rounded-md shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-20">
              <div className="py-2">
                <button
                  type="button"
                  onClick={() => executeCommand('formatBlock', 'div')}
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
          </div>

          <div className="w-px h-8 bg-gray-300 mx-1"></div>

          {/* Format Buttons */}
          {formatButtons.map((button, index) => {
            const IconComponent = button.icon;
            return (
              <button
                key={index}
                type="button"
                onClick={button.command}
                title={button.shortcut ? `${button.title} (${button.shortcut})` : button.title}
                className="p-2 text-gray-600 hover:text-gray-900 hover:bg-white rounded border border-transparent hover:border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
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
                    
                    {/* Quick Custom Color */}
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
              title="Highlight Color"
            >
              <div className="w-4 h-4 bg-yellow-300 rounded border border-gray-400"></div>
            </button>
            
            {/* Background Color Picker */}
            {showBgColorPicker && (
              <div className="absolute left-0 top-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg z-20">
                {bgColorPickerMode === 'palette' ? (
                  <div className="w-64 p-3">
                    <div className="flex justify-between items-center mb-2">
                      <div className="text-xs font-medium text-gray-700">Highlight Color</div>
                      <button
                        onClick={() => setBgColorPickerMode('advanced')}
                        className="text-xs text-blue-600 hover:text-blue-800"
                      >
                        Advanced
                      </button>
                    </div>
                    <div className="grid grid-cols-6 gap-1 mb-3">
                      {/* Highlight colors */}
                      {['transparent', '#FFFF00', '#00FF00', '#00FFFF', '#FF00FF', '#FFA500', 
                        '#FFB6C1', '#98FB98', '#87CEEB', '#DDA0DD', '#F0E68C', '#FFDAB9',
                        '#FF69B4', '#32CD32', '#1E90FF', '#9370DB', '#FFD700', '#FFA07A',
                        '#FF1493', '#228B22', '#4169E1', '#8A2BE2', '#DAA520', '#CD853F'].map((color, index) => (
                        <button
                          key={index}
                          type="button"
                          onClick={() => changeBackgroundColor(color)}
                          className={`w-8 h-8 rounded border border-gray-300 hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all hover:scale-110 ${
                            color === 'transparent' ? 'bg-white relative' : ''
                          }`}
                          style={{ backgroundColor: color === 'transparent' ? 'white' : color }}
                          title={color === 'transparent' ? 'Remove highlight' : color}
                          disabled={disabled}
                        >
                          {color === 'transparent' && (
                            <div className="absolute inset-0 flex items-center justify-center text-red-500 text-xs font-bold">✕</div>
                          )}
                        </button>
                      ))}
                    </div>
                    
                    {/* Quick Custom Background Color */}
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
                    title="Advanced Highlight Color"
                  />
                )}
              </div>
            )}
          </div>

          <div className="w-px h-8 bg-gray-300 mx-1"></div>

          {/* Alignment Buttons */}
          {alignButtons.map((button, index) => {
            const IconComponent = button.icon;
            return (
              <button
                key={index}
                type="button"
                onClick={button.command}
                title={button.title}
                className="p-2 text-gray-600 hover:text-gray-900 hover:bg-white rounded border border-transparent hover:border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                disabled={disabled}
              >
                <IconComponent size={16} />
              </button>
            );
          })}
        </div>

        {/* Row 2 - Lists, Media, and Tools */}
        <div className="flex items-center gap-1 flex-wrap pt-2 border-t border-gray-200 w-full">
          {/* List Buttons */}
          {listButtons.map((button, index) => {
            const IconComponent = button.icon;
            return (
              <button
                key={index}
                type="button"
                onClick={button.command}
                title={button.title}
                className="p-2 text-gray-600 hover:text-gray-900 hover:bg-white rounded border border-transparent hover:border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                disabled={disabled}
              >
                <IconComponent size={16} />
              </button>
            );
          })}

          <div className="w-px h-8 bg-gray-300 mx-1"></div>

          {/* Insert Buttons */}
          {insertButtons.map((button, index) => {
            const IconComponent = button.icon;
            const isImageButton = button.title === 'Insert Image';
            const isImageUploading = isImageButton && isUploadingImage;
            
            return (
              <button
                key={index}
                type="button"
                onClick={button.command}
                title={isImageUploading ? 'Uploading image...' : button.title}
                className={`p-2 text-gray-600 hover:text-gray-900 hover:bg-white rounded border border-transparent hover:border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all ${
                  isImageUploading ? 'opacity-50 cursor-not-allowed' : ''
                }`}
                disabled={disabled || isImageUploading}
              >
                {isImageUploading ? (
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-600"></div>
                ) : (
                  <IconComponent size={16} />
                )}
              </button>
            );
          })}

          <div className="w-px h-8 bg-gray-300 mx-1"></div>

          {/* Script Buttons */}
          {scriptButtons.map((button, index) => {
            const IconComponent = button.icon;
            return (
              <button
                key={index}
                type="button"
                onClick={button.command}
                title={button.title}
                className="p-2 text-gray-600 hover:text-gray-900 hover:bg-white rounded border border-transparent hover:border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                disabled={disabled}
              >
                <IconComponent size={16} />
              </button>
            );
          })}

          <div className="w-px h-8 bg-gray-300 mx-1"></div>

          {/* History Buttons */}
          {historyButtons.map((button, index) => {
            const IconComponent = button.icon;
            const isButtonDisabled = disabled || button.disabled;
            return (
              <button
                key={index}
                type="button"
                onClick={button.command}
                title={button.shortcut ? `${button.title} (${button.shortcut})` : button.title}
                className={`p-2 rounded border border-transparent focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all ${
                  isButtonDisabled 
                    ? 'text-gray-300 cursor-not-allowed' 
                    : 'text-gray-600 hover:text-gray-900 hover:bg-white hover:border-gray-300'
                }`}
                disabled={isButtonDisabled}
              >
                <IconComponent size={16} />
              </button>
            );
          })}

          <div className="w-px h-8 bg-gray-300 mx-1"></div>

          {/* Clear Formatting */}
          <button
            type="button"
            onClick={clearFormatting}
            title="Clear Formatting"
            className="px-3 py-2 text-xs font-medium text-gray-600 hover:text-gray-900 hover:bg-white rounded border border-transparent hover:border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
            disabled={disabled}
          >
            Clear
          </button>
        </div>
      </div>

      {/* Editor */}
      <div className="relative">
        <div
          ref={editorRef}
          contentEditable={!disabled}
          onInput={handleInput}
          onFocus={() => setIsEditorFocused(true)}
          onBlur={() => setIsEditorFocused(false)}
          className={`min-h-[400px] p-6 text-base leading-relaxed focus:outline-none ${
            disabled ? 'cursor-not-allowed bg-gray-50' : 'cursor-text bg-white'
          }`}
          style={{
            wordBreak: 'break-word',
            overflowWrap: 'break-word',
            fontFamily: '"Segoe UI", Tahoma, Geneva, Verdana, sans-serif'
          }}
          suppressContentEditableWarning={true}
        />
        
        {/* Placeholder */}
        {!value && !isEditorFocused && (
          <div className="absolute top-6 left-6 text-gray-400 pointer-events-none text-base">
            {placeholder}
          </div>
        )}
      </div>

      {/* Status Bar */}
      <div className="px-6 py-3 border-t border-gray-200 bg-gray-50 text-sm text-gray-600 flex justify-between items-center">
        <div className="flex gap-4">
          <span>Words: {getTextContent().trim() ? getTextContent().trim().split(/\s+/).length : 0}</span>
          <span>Characters: {getTextContent().length}</span>
          {history.length > 0 && (
            <span className="text-xs">
              History: {historyIndex + 1}/{history.length}
            </span>
          )}
        </div>
        <div className="text-xs text-gray-500">
          <span>Ctrl+Z: Undo • Ctrl+Y: Redo</span>
        </div>
      </div>

      {/* Editor Styles */}
      <style jsx>{`
        div[contenteditable] {
          line-height: 1.8;
        }
        div[contenteditable] h1 {
          font-size: 2.5em;
          font-weight: 700;
          margin: 1em 0 0.5em 0;
          color: #1f2937;
          line-height: 1.2;
        }
        div[contenteditable] h2 {
          font-size: 2em;
          font-weight: 600;
          margin: 0.8em 0 0.4em 0;
          color: #1f2937;
          line-height: 1.3;
        }
        div[contenteditable] h3 {
          font-size: 1.5em;
          font-weight: 600;
          margin: 0.7em 0 0.3em 0;
          color: #374151;
          line-height: 1.4;
        }
        div[contenteditable] h4 {
          font-size: 1.25em;
          font-weight: 500;
          margin: 0.6em 0 0.3em 0;
          color: #374151;
          line-height: 1.4;
        }
        div[contenteditable] h5 {
          font-size: 1.1em;
          font-weight: 500;
          margin: 0.5em 0 0.2em 0;
          color: #4b5563;
          line-height: 1.5;
        }
        div[contenteditable] h6 {
          font-size: 1em;
          font-weight: 500;
          margin: 0.5em 0 0.2em 0;
          color: #4b5563;
          line-height: 1.5;
        }
        div[contenteditable] p {
          margin: 1.2em 0;
          color: #374151;
        }
        div[contenteditable] blockquote {
          margin: 1.5em 0;
          padding: 1em 1.5em;
          border-left: 4px solid #3b82f6;
          background-color: #f8fafc;
          color: #475569;
          font-style: italic;
          border-radius: 0 4px 4px 0;
        }
        div[contenteditable] ul, div[contenteditable] ol {
          margin: 1.2em 0;
          padding-left: 2.5em;
        }
        div[contenteditable] li {
          margin: 0.8em 0;
          color: #374151;
        }
        div[contenteditable] a {
          color: #2563eb;
          text-decoration: underline;
          text-decoration-color: #93c5fd;
          text-underline-offset: 2px;
        }
        div[contenteditable] a:hover {
          color: #1d4ed8;
          text-decoration-color: #2563eb;
        }
        div[contenteditable] strong, div[contenteditable] b {
          font-weight: 600;
          color: #1f2937;
        }
        div[contenteditable] em, div[contenteditable] i {
          font-style: italic;
          color: #4b5563;
        }
        div[contenteditable] u {
          text-decoration: underline;
          text-decoration-color: #6b7280;
          text-underline-offset: 2px;
        }
        div[contenteditable] del, div[contenteditable] s {
          text-decoration: line-through;
          color: #6b7280;
        }
        div[contenteditable] code {
          background-color: #f1f5f9;
          color: #dc2626;
          padding: 0.2em 0.4em;
          border-radius: 3px;
          font-size: 0.9em;
          font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
        }
        div[contenteditable] pre {
          background-color: #1e293b;
          color: #e2e8f0;
          padding: 1.5em;
          border-radius: 8px;
          overflow-x: auto;
          margin: 1.5em 0;
          font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
          line-height: 1.6;
        }
        div[contenteditable] pre code {
          background: transparent;
          color: inherit;
          padding: 0;
          border-radius: 0;
          font-size: inherit;
        }
        div[contenteditable] hr {
          margin: 2em 0;
          border: none;
          border-top: 2px solid #e5e7eb;
          opacity: 0.6;
        }
        div[contenteditable] img {
          max-width: 100%;
          height: auto;
          border-radius: 8px;
          margin: 1.5em 0;
          box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1);
        }
        div[contenteditable] sup {
          vertical-align: super;
          font-size: 0.75em;
        }
        div[contenteditable] sub {
          vertical-align: sub;
          font-size: 0.75em;
        }
        div[contenteditable]:focus {
          outline: none;
        }
        
        /* Custom slider styles */
        .slider-red::-webkit-slider-thumb {
          appearance: none;
          width: 20px;
          height: 20px;
          border-radius: 50%;
          background: #ef4444;
          cursor: pointer;
          border: 2px solid #fff;
          box-shadow: 0 2px 4px rgba(0,0,0,0.2);
        }
        
        .slider-green::-webkit-slider-thumb {
          appearance: none;
          width: 20px;
          height: 20px;
          border-radius: 50%;
          background: #22c55e;
          cursor: pointer;
          border: 2px solid #fff;
          box-shadow: 0 2px 4px rgba(0,0,0,0.2);
        }
        
        .slider-blue::-webkit-slider-thumb {
          appearance: none;
          width: 20px;
          height: 20px;
          border-radius: 50%;
          background: #3b82f6;
          cursor: pointer;
          border: 2px solid #fff;
          box-shadow: 0 2px 4px rgba(0,0,0,0.2);
        }
        
        .slider-red::-moz-range-thumb,
        .slider-green::-moz-range-thumb,
        .slider-blue::-moz-range-thumb {
          width: 20px;
          height: 20px;
          border-radius: 50%;
          cursor: pointer;
          border: 2px solid #fff;
          box-shadow: 0 2px 4px rgba(0,0,0,0.2);
        }
        
        .slider-red::-moz-range-thumb {
          background: #ef4444;
        }
        
        .slider-green::-moz-range-thumb {
          background: #22c55e;
        }
        
        .slider-blue::-moz-range-thumb {
          background: #3b82f6;
        }
      `}</style>
    </div>
  );
};

export default RichTextEditor;