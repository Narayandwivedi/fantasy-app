import React, { useState, useCallback } from 'react';

// Color utility functions
export const hexToRgb = (hex) => {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : null;
};

export const rgbToHex = (r, g, b) => {
  return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
};

export const hslToRgb = (h, s, l) => {
  h /= 360;
  s /= 100;
  l /= 100;
  const a = s * Math.min(l, 1 - l);
  const f = (n) => {
    const k = (n + h / 30) % 12;
    return l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
  };
  return {
    r: Math.round(f(0) * 255),
    g: Math.round(f(8) * 255),
    b: Math.round(f(4) * 255)
  };
};

export const rgbToHsl = (r, g, b) => {
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
};

// Color palette
export const colorPalette = [
  '#000000', '#333333', '#666666', '#999999', '#CCCCCC', '#FFFFFF',
  '#FF0000', '#FF6600', '#FFCC00', '#FFFF00', '#99FF00', '#00FF00',
  '#00FFCC', '#00CCFF', '#0066FF', '#0000FF', '#6600FF', '#CC00FF',
  '#FF0099', '#FF6666', '#FFCC99', '#FFFF99', '#CCFF99', '#99FFCC',
  '#99CCFF', '#CC99FF', '#FF99CC', '#8B4513', '#A0522D', '#D2691E',
  '#CD853F', '#DEB887', '#F5DEB3', '#FFF8DC', '#FFFACD', '#FFEFD5'
];

// Advanced Color Picker Component
export const AdvancedColorPicker = ({ color, onChange, onClose, title }) => {
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
  }, []);

  const updateFromRgb = useCallback((r, g, b) => {
    const newRgb = { r: Math.max(0, Math.min(255, r)), g: Math.max(0, Math.min(255, g)), b: Math.max(0, Math.min(255, b)) };
    setRgbValues(newRgb);
    const hex = rgbToHex(newRgb.r, newRgb.g, newRgb.b);
    setSelectedColor(hex);
    setHslValues(rgbToHsl(newRgb.r, newRgb.g, newRgb.b));
  }, []);

  const updateFromHsl = useCallback((h, s, l) => {
    const newHsl = { h: Math.max(0, Math.min(360, h)), s: Math.max(0, Math.min(100, s)), l: Math.max(0, Math.min(100, l)) };
    setHslValues(newHsl);
    const rgb = hslToRgb(newHsl.h, newHsl.s, newHsl.l);
    setRgbValues(rgb);
    const hex = rgbToHex(rgb.r, rgb.g, rgb.b);
    setSelectedColor(hex);
  }, []);

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

      {/* Apply Button */}
      <div className="flex gap-2">
        <button
          onClick={applyColor}
          className="flex-1 bg-blue-500 text-white px-4 py-2 rounded text-sm hover:bg-blue-600 transition-colors"
        >
          Apply
        </button>
        <button
          onClick={onClose}
          className="px-4 py-2 border border-gray-300 rounded text-sm hover:bg-gray-50 transition-colors"
        >
          Cancel
        </button>
      </div>
    </div>
  );
};

// Simple Color Palette Component
export const ColorPalette = ({ colors, onColorSelect, selectedColor }) => {
  return (
    <div className="grid grid-cols-6 gap-1 p-2">
      {colors.map((color, index) => (
        <button
          key={index}
          type="button"
          onClick={() => onColorSelect(color)}
          className={`w-8 h-8 rounded border-2 transition-all hover:scale-110 ${
            selectedColor === color ? 'border-blue-500 shadow-md' : 'border-gray-300'
          }`}
          style={{ backgroundColor: color }}
          title={color}
        />
      ))}
    </div>
  );
};