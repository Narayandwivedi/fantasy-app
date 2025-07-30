import React, { useState, useCallback } from "react";
import upload_area from "../../assets/upload_area.svg";
import { toast } from "react-toastify";

// Constants
const PLAYER_POSITIONS = [
  { value: "batsman", label: "Batsman" },
  { value: "bowler", label: "Bowler" },
  { value: "all-rounder", label: "All-rounder" },
  { value: "wicket-keeper", label: "Wicket-keeper" },
];

const BATTING_STYLES = [
  { value: "right-handed", label: "Right-handed" },
  { value: "left-handed", label: "Left-handed" },
];

const BOWLING_STYLES = [
  { value: "right-arm-fast", label: "Right-arm-Fast" },
  { value: "right-arm-medium", label: "Right-arm-medium" },
  { value: "right-arm-medium-fast", label: "Right-arm-Medium-Fast" },
  { value: "left-arm-fast", label: "Left-arm-Fast" },
  { value: "left-arm-medium", label: "Left-arm-medium" },
  { value: "left-arm-medium-fast", label: "Left-arm-Medium-Fast" },
  { value: "right-arm-spin", label: "Right-arm-Spin" },
  { value: "left-arm-spin", label: "Left-arm-Spin" },
  { value: "none", label: "None" },
];

const PlayerForm = ({
  formData,
  setFormData,
  onSubmit,
  onCancel,
  mode = "add",
  existingImageUrl = "",
  backendUrl = "",
  isSubmitting = false,
}) => {
  const [imagePreview, setImagePreview] = useState(null);

  const handleInputChange = useCallback((field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  }, [setFormData]);

  const imageHandler = useCallback((e) => {
    const file = e.target.files[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        toast.error('Please select a valid image file');
        return;
      }
      
      if (file.size > 5 * 1024 * 1024) {
        toast.error('Image size should be less than 5MB');
        return;
      }

      setImagePreview(URL.createObjectURL(file));
      setFormData((prev) => ({ ...prev, image: file }));
    }
  }, [setFormData]);

  const getImageSource = () => {
    if (imagePreview) return imagePreview;
    if (mode === "edit" && existingImageUrl) {
      return `${backendUrl}${existingImageUrl}`;
    }
    return upload_area;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.firstName.trim() || !formData.position || !formData.country.trim()) {
      toast.error("Please fill in all required fields");
      return;
    }
    onSubmit();
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      {/* Player first name */}
      <input
        value={formData.firstName}
        onChange={(e) => handleInputChange("firstName", e.target.value)}
        className="border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        placeholder="Player first name *"
        type="text"
        required
        disabled={isSubmitting}
      />

      {/* Player last name */}
      <input
        value={formData.lastName}
        onChange={(e) => handleInputChange("lastName", e.target.value)}
        className="border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        placeholder="Player last name *"
        type="text"
        required
        disabled={isSubmitting}
      />

      {/* Player position */}
      <select
        value={formData.position}
        onChange={(e) => handleInputChange("position", e.target.value)}
        className="border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        required
        disabled={isSubmitting}
      >
        <option value="">Select player role *</option>
        {PLAYER_POSITIONS.map((position) => (
          <option key={position.value} value={position.value}>
            {position.label}
          </option>
        ))}
      </select>

      {/* Player batting style */}
      <select
        value={formData.battingStyle}
        onChange={(e) => handleInputChange("battingStyle", e.target.value)}
        className="border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        disabled={isSubmitting}
      >
        <option value="">Select batting style</option>
        {BATTING_STYLES.map((style) => (
          <option key={style.value} value={style.value}>
            {style.label}
          </option>
        ))}
      </select>
      
      {/* Player bowling style */}
      <select
        value={formData.bowlingStyle}
        onChange={(e) => handleInputChange("bowlingStyle", e.target.value)}
        className="border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        disabled={isSubmitting}
      >
        <option value="">Select bowling style</option>
        {BOWLING_STYLES.map((style) => (
          <option key={style.value} value={style.value}>
            {style.label}
          </option>
        ))}
      </select>

      {/* Player country */}
      <input
        value={formData.country}
        onChange={(e) => handleInputChange("country", e.target.value)}
        className="border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        placeholder="Player country *"
        type="text"
        required
        disabled={isSubmitting}
      />

      {/* Fantasy Price */}
      <div className="relative">
        <input
          value={formData.fantasyPrice}
          onChange={(e) => handleInputChange("fantasyPrice", e.target.value)}
          className="border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 w-full"
          placeholder="Fantasy Price (7.0 - 12.0)"
          type="number"
          min="7.0"
          max="12.0"
          step="0.5"
          disabled={isSubmitting}
        />
        <div className="text-xs text-gray-500 mt-1">
          Current: {formData.fantasyPrice || 'Not set'} | Range: 7.0 - 12.0
        </div>
      </div>

      {/* File upload */}
      <div className="w-full text-[#7b7b7b]">
        <p className="mb-2 text-sm font-medium">
          {mode === "edit" ? "Current Image / Upload New Image" : "Upload Player Image"}
        </p>
        <label className="cursor-pointer block" htmlFor="file-input">
          <img
            className="h-[80px] w-[80px] object-cover rounded-lg border-2 border-dashed border-gray-300 hover:border-gray-400 transition-colors mx-auto"
            src={getImageSource()}
            alt="Player preview"
          />
          <p className="text-xs text-gray-500 mt-1 text-center">
            {mode === "edit" && existingImageUrl && !imagePreview
              ? "Click to change image"
              : "Click to upload image"}
          </p>
        </label>
        <input
          onChange={imageHandler}
          className="hidden"
          type="file"
          name="image"
          id="file-input"
          accept="image/*"
          disabled={isSubmitting}
        />
      </div>

      {/* Form buttons */}
      <div className="flex gap-3 mt-4">
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
            mode === "add"
              ? "bg-blue-600 hover:bg-blue-700"
              : "bg-green-600 hover:bg-green-700"
          }`}
          disabled={isSubmitting}
        >
          {isSubmitting 
            ? "Processing..." 
            : mode === "add" 
              ? "Add Player" 
              : "Update Player"
          }
        </button>
      </div>
    </form>
  );
};

export default PlayerForm;