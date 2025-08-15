import React, { useState, useContext, useEffect } from "react";
import axios from "axios";
import { AppContext } from "../../context/AppContext";
import { toast } from "react-toastify";
import { X, Upload, Camera, Save, AlertCircle } from "lucide-react";
import upload_area from "../../assets/upload_area.svg";

// Helper function to convert text to title case
const toTitleCase = (str) => {
  return str.replace(/\w\S*/g, (txt) => {
    return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
  });
};

const EditTeamModal = ({ showModal, onClose, team, onTeamUpdated }) => {
  const [formData, setFormData] = useState({
    name: "",
    shortName: "",
    sport: "cricket",
    image: null,
    logo: "",
  });
  const [imagePreview, setImagePreview] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { BACKEND_URL } = useContext(AppContext);

  // Set form data when team changes
  useEffect(() => {
    if (team) {
      setFormData({
        name: team.name || "",
        shortName: team.shortName || "",
        sport: team.sport || "cricket",
        image: null,
        logo: team.logo || "",
      });
      setImagePreview(team.logo ? `${BACKEND_URL}${team.logo}` : "");
    }
  }, [team, BACKEND_URL]);

  const resetForm = () => {
    setFormData({
      name: "",
      shortName: "",
      sport: "cricket",
      image: null,
      logo: "",
    });
    setImagePreview("");
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        toast.error("Please select a valid image file");
        return;
      }

      // Validate file size (5MB limit)
      if (file.size > 5 * 1024 * 1024) {
        toast.error("Image size should be less than 5MB");
        return;
      }

      setFormData(prev => ({ ...prev, image: file }));
      
      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUpdateTeam = async () => {
    if (!formData.name.trim() || !formData.shortName.trim()) {
      toast.error("Please fill in all required fields");
      return;
    }

    if (formData.shortName.trim().length > 4) {
      toast.error("Short name must be 4 characters or less");
      return;
    }

    if (!team?._id) {
      toast.error("Team ID is missing");
      return;
    }

    setIsSubmitting(true);
    try {
      let logoUrl = formData.logo;
      
      // Upload new image if provided
      if (formData.image) {
        const form = new FormData();
        form.append("team", formData.image);
        const res = await axios.post(`${BACKEND_URL}/api/upload/team`, form, {
          headers: { "Content-Type": "multipart/form-data" },
          withCredentials: true
        });
        
        logoUrl = res.data.image_url;
      }

      // Update team
      const { data } = await axios.put(
        `${BACKEND_URL}/api/teams/${team._id}`,
        {
          name: formData.name.trim(),
          shortName: formData.shortName.trim(),
          sport: formData.sport,
          logo: logoUrl,
        },
        {
          withCredentials: true
        }
      );

      if (data.success) {
        toast.success("Team updated successfully");
        resetForm();
        onClose();
        // Call the callback to refresh team data
        if (onTeamUpdated) {
          onTeamUpdated(data.data);
        }
      }
    } catch (err) {
      console.error('Error updating team:', err);
      toast.error(err.response?.data?.message || "Failed to update team");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const removeImage = () => {
    setFormData(prev => ({ ...prev, image: null }));
    setImagePreview(team?.logo ? `${BACKEND_URL}${team.logo}` : "");
  };

  if (!showModal) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden shadow-2xl border border-gray-200">
        {/* Modal Header */}
        <div className="flex justify-between items-center p-6 border-b bg-gradient-to-r from-blue-50 to-indigo-50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
              <Camera className="text-blue-600" size={20} />
            </div>
            <h2 className="text-xl font-bold text-gray-800">Edit Team</h2>
          </div>
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-gray-600 hover:bg-gray-100 p-2 rounded-xl transition-all duration-200 cursor-pointer"
            disabled={isSubmitting}
            title="Close"
            style={{ cursor: isSubmitting ? 'not-allowed' : 'pointer' }}
          >
            <X size={20} />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-140px)]">
          <div className="space-y-6">
            {/* Team Logo Upload */}
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-3">
                Team Logo
              </label>
              <div className="flex items-center gap-6">
                <div className="relative">
                  <div className="w-24 h-24 rounded-xl border-2 border-dashed border-gray-300 flex items-center justify-center overflow-hidden bg-gray-50">
                    {imagePreview ? (
                      <img
                        src={imagePreview}
                        alt="Team logo preview"
                        className="w-full h-full object-cover rounded-lg"
                      />
                    ) : (
                      <div className="text-center">
                        <Upload className="mx-auto text-gray-400" size={24} />
                        <p className="text-xs text-gray-500 mt-1">Logo</p>
                      </div>
                    )}
                  </div>
                  {imagePreview && formData.image && (
                    <button
                      type="button"
                      onClick={removeImage}
                      className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center text-xs hover:bg-red-600 transition-colors cursor-pointer"
                      title="Remove image"
                    >
                      ×
                    </button>
                  )}
                </div>
                <div className="flex-1">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                    id="team-image-upload"
                    disabled={isSubmitting}
                  />
                  <label
                    htmlFor="team-image-upload"
                    className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors cursor-pointer disabled:opacity-50"
                    style={{ cursor: isSubmitting ? 'not-allowed' : 'pointer' }}
                  >
                    <Upload size={16} />
                    {imagePreview ? "Change Logo" : "Upload Logo"}
                  </label>
                  <p className="text-xs text-gray-500 mt-2">
                    Recommended: PNG or JPG, max 5MB
                  </p>
                </div>
              </div>
            </div>

            {/* Team Name */}
            <div>
              <label htmlFor="teamName" className="block text-sm font-bold text-gray-700 mb-2">
                Team Name *
              </label>
              <input
                type="text"
                id="teamName"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: toTitleCase(e.target.value) }))}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                placeholder="Enter team name"
                disabled={isSubmitting}
                maxLength={50}
              />
            </div>

            {/* Short Name */}
            <div>
              <label htmlFor="shortName" className="block text-sm font-bold text-gray-700 mb-2">
                Short Name * <span className="text-xs text-gray-500">(Max 4 characters)</span>
              </label>
              <input
                type="text"
                id="shortName"
                value={formData.shortName}
                onChange={(e) => setFormData(prev => ({ ...prev, shortName: e.target.value.slice(0, 4).toUpperCase() }))}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                placeholder="e.g., MI, CSK"
                disabled={isSubmitting}
                maxLength={4}
                style={{ textTransform: 'uppercase' }}
              />
            </div>

            {/* Sport */}
            <div>
              <label htmlFor="sport" className="block text-sm font-bold text-gray-700 mb-2">
                Sport *
              </label>
              <select
                id="sport"
                value={formData.sport}
                onChange={(e) => setFormData(prev => ({ ...prev, sport: e.target.value }))}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                disabled={isSubmitting}
              >
                <option value="cricket">Cricket</option>
                <option value="football">Football</option>
                <option value="basketball">Basketball</option>
                <option value="kabaddi">Kabaddi</option>
              </select>
            </div>

            {/* Info Box */}
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
              <div className="flex items-start gap-3">
                <AlertCircle className="text-blue-500 mt-0.5" size={16} />
                <div className="text-sm text-blue-700">
                  <p className="font-medium mb-1">Note:</p>
                  <ul className="space-y-1 text-xs">
                    <li>• Team name and short name must be unique</li>
                    <li>• Short name will be automatically converted to uppercase</li>
                    <li>• Logo changes will be visible immediately after saving</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="flex items-center justify-end gap-3 p-6 border-t bg-gray-50">
          <button
            type="button"
            onClick={handleClose}
            className="px-6 py-2 text-gray-600 border border-gray-300 rounded-xl hover:bg-gray-100 transition-colors font-medium cursor-pointer"
            disabled={isSubmitting}
            style={{ cursor: isSubmitting ? 'not-allowed' : 'pointer' }}
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleUpdateTeam}
            disabled={isSubmitting || !formData.name.trim() || !formData.shortName.trim()}
            className="flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 font-medium cursor-pointer"
            style={{ cursor: (isSubmitting || !formData.name.trim() || !formData.shortName.trim()) ? 'not-allowed' : 'pointer' }}
          >
            {isSubmitting ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                Updating...
              </>
            ) : (
              <>
                <Save size={16} />
                Update Team
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditTeamModal;