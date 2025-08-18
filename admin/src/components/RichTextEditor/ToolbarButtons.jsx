import React from 'react';
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
  Minus
} from 'lucide-react';
import { ColorPalette, AdvancedColorPicker, colorPalette } from './ColorPicker';

// Headings Dropdown Component
export const HeadingsDropdown = ({ onInsertHeading, executeCommand, disabled }) => {
  return (
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
              onClick={() => onInsertHeading(level)}
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
  );
};

// Format Buttons Component
export const FormatButtons = ({ buttons, activeFormats, disabled }) => {
  return (
    <>
      {buttons.map((button, index) => {
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
    </>
  );
};

// Color Picker Section
export const ColorPickerSection = ({ 
  showColorPicker, 
  setShowColorPicker,
  showBgColorPicker,
  setShowBgColorPicker,
  colorPickerMode,
  setColorPickerMode,
  bgColorPickerMode,
  setBgColorPickerMode,
  currentColor,
  currentBgColor,
  changeTextColor,
  changeBackgroundColor,
  disabled 
}) => {
  return (
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
          <div className="p-3">
            <div className="flex justify-between items-center mb-3">
              <h4 className="text-sm font-medium text-gray-900">Text Color</h4>
              <div className="flex gap-1">
                <button
                  type="button"
                  onClick={() => setColorPickerMode('palette')}
                  className={`px-2 py-1 text-xs rounded ${colorPickerMode === 'palette' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
                >
                  Palette
                </button>
                <button
                  type="button"
                  onClick={() => setColorPickerMode('advanced')}
                  className={`px-2 py-1 text-xs rounded ${colorPickerMode === 'advanced' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
                >
                  Advanced
                </button>
              </div>
            </div>
            
            {colorPickerMode === 'palette' ? (
              <ColorPalette 
                colors={colorPalette}
                onColorSelect={changeTextColor}
                selectedColor={currentColor}
              />
            ) : (
              <AdvancedColorPicker
                color={currentColor}
                onChange={changeTextColor}
                onClose={() => setShowColorPicker(false)}
                title="Select Text Color"
              />
            )}
          </div>
        </div>
      )}
    </div>
  );
};

// Alignment Buttons Component
export const AlignmentButtons = ({ buttons, activeFormats, disabled }) => {
  return (
    <>
      {buttons.map((button, index) => {
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
    </>
  );
};

// List Buttons Component
export const ListButtons = ({ buttons, activeFormats, disabled }) => {
  return (
    <>
      {buttons.map((button, index) => {
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
    </>
  );
};

// Image Upload Button Component
export const ImageUploadButton = ({ onImageUpload, isUploadingImage, disabled }) => {
  return (
    <div className="relative">
      <input
        type="file"
        accept="image/*"
        onChange={onImageUpload}
        className="hidden"
        id="image-upload"
        disabled={disabled || isUploadingImage}
      />
      <label
        htmlFor="image-upload"
        className={`inline-flex items-center p-2 rounded border focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all cursor-pointer ${
          disabled || isUploadingImage
            ? 'opacity-50 cursor-not-allowed'
            : 'text-gray-600 hover:text-gray-900 hover:bg-white border-transparent hover:border-gray-300'
        }`}
        title={isUploadingImage ? 'Uploading image...' : 'Insert Image'}
      >
        <Image size={16} />
        {isUploadingImage && (
          <div className="ml-2 flex items-center">
            <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-blue-600"></div>
          </div>
        )}
      </label>
    </div>
  );
};

// Action Buttons Component (Undo/Redo)
export const ActionButtons = ({ buttons, disabled }) => {
  return (
    <>
      {buttons.map((button, index) => {
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
    </>
  );
};

// Divider Component
export const Divider = () => (
  <div className="w-px h-8 bg-gray-300 mx-1"></div>
);

// Get format button configurations
export const getFormatButtons = (handlers) => [
  {
    icon: Bold,
    title: 'Bold',
    shortcut: 'Ctrl+B',
    command: handlers.bold,
    commandName: 'bold'
  },
  {
    icon: Italic,
    title: 'Italic',
    shortcut: 'Ctrl+I',
    command: handlers.italic,
    commandName: 'italic'
  },
  {
    icon: Underline,
    title: 'Underline',
    shortcut: 'Ctrl+U',
    command: handlers.underline,
    commandName: 'underline'
  },
  {
    icon: Strikethrough,
    title: 'Strikethrough',
    command: handlers.strikethrough,
    commandName: 'strikethrough'
  },
  {
    icon: Code,
    title: 'Code',
    command: handlers.code,
    commandName: 'code'
  },
  {
    icon: Superscript,
    title: 'Superscript',
    command: handlers.superscript,
    commandName: 'superscript'
  },
  {
    icon: Subscript,
    title: 'Subscript',
    command: handlers.subscript,
    commandName: 'subscript'
  }
];

// Get alignment button configurations
export const getAlignmentButtons = (handlers) => [
  {
    icon: AlignLeft,
    title: 'Align Left',
    command: handlers.alignLeft,
    commandName: 'justifyLeft'
  },
  {
    icon: AlignCenter,
    title: 'Align Center',
    command: handlers.alignCenter,
    commandName: 'justifyCenter'
  },
  {
    icon: AlignRight,
    title: 'Align Right',
    command: handlers.alignRight,
    commandName: 'justifyRight'
  },
  {
    icon: AlignJustify,
    title: 'Justify',
    command: handlers.justify,
    commandName: 'justifyFull'
  }
];

// Get list button configurations
export const getListButtons = (handlers) => [
  {
    icon: List,
    title: 'Bullet List',
    command: handlers.bulletList,
    commandName: 'insertUnorderedList'
  },
  {
    icon: ListOrdered,
    title: 'Numbered List',
    command: handlers.numberedList,
    commandName: 'insertOrderedList'
  }
];

// Get action button configurations
export const getActionButtons = (handlers, historyState) => [
  {
    icon: Undo,
    title: 'Undo',
    shortcut: 'Ctrl+Z',
    command: handlers.undo,
    disabled: historyState.historyIndex <= 0
  },
  {
    icon: Redo,
    title: 'Redo',
    shortcut: 'Ctrl+Y',
    command: handlers.redo,
    disabled: historyState.historyIndex >= historyState.history.length - 1
  }
];