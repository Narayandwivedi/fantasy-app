import React, { useState, useContext, useCallback } from "react";
import upload_area from "../assets/upload_area.svg";
import axios from "axios";
import { AppContext } from "../context/AppContext";
import { toast } from "react-toastify";
import { Plus, Edit3, Trash2, Search } from "lucide-react";

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

const INITIAL_FORM_DATA = {
  firstName: "",
  lastName: "",
  position: "",
  sport: "cricket",
  battingStyle: "",
  bowlingStyle: "",
  country: "",
  image: null,
};

// PlayerModal Component
const PlayerModal = ({
  showModal,
  onClose,
  formData,
  setFormData,
  onSubmit,
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

  if (!showModal) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">
            {mode === "add" ? "Add New Player" : "Edit Player"}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 p-1"
            disabled={isSubmitting}
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">


          {/* player first name */}

          <input
            value={formData.firstName}
            onChange={(e) => handleInputChange("firstName", e.target.value)}
            className="border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Player first name *"
            type="text"
            required
            disabled={isSubmitting}
          />

          {/* player lastname */}

          <input
            value={formData.lastName}
            onChange={(e) => handleInputChange("lastName", e.target.value)}
            className="border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Player last name *"
            type="text"
            required
            disabled={isSubmitting}
          />


          {/* player position */}

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



          {/* player batting style */}

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
          
          {/* player bowling style */}

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


          {/* player country */}

          <input
            value={formData.country}
            onChange={(e) => handleInputChange("country", e.target.value)}
            className="border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Player country *"
            type="text"
            required
            disabled={isSubmitting}
          />

          {/*  file upload */}

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

          <div className="flex gap-3 mt-4">
            <button
              type="button"
              onClick={onClose}
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
      </div>
    </div>
  );
};

// Main ManagePlayers Component
const ManagePlayers = () => {
  const [showAddPlayerModal, setShowAddPlayerModal] = useState(false);
  const [showEditPlayerModal, setShowEditPlayerModal] = useState(false);
  const [editingPlayer, setEditingPlayer] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState(INITIAL_FORM_DATA);
  const [searchTerm, setSearchTerm] = useState("");

  const { BACKEND_URL, allPlayers, setAllPlayers } = useContext(AppContext);

  // Filter players based on search term
  const filteredPlayers = allPlayers.filter(player => {
    const fullName = `${player.firstName} ${player.lastName}`.toLowerCase();
    const search = searchTerm.toLowerCase();
    return fullName.includes(search) || 
           player.country.toLowerCase().includes(search) ||
           player.position.toLowerCase().includes(search);
  });

  const resetFormData = useCallback(() => {
    setFormData(INITIAL_FORM_DATA);
  }, []);

  const handleAddPlayer = async () => {
    
    if (!formData.firstName.trim() || !formData.position || !formData.country.trim()) {
      toast.error("Please fill in all required fields");
      return;
    }

    setIsSubmitting(true);
    try {
      let imageUrl = "";
      
      if (formData.image) {
        const form = new FormData();
        form.append("player", formData.image);
        const res = await axios.post(`${BACKEND_URL}/upload/player`, form, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        imageUrl = res.data.image_url;
      }

      const { data } = await axios.post(`${BACKEND_URL}/api/players`, {
        firstName: formData.firstName.trim(),
        lastName: formData.lastName.trim(),
        sport: formData.sport,
        position: formData.position,
        battingStyle: formData.battingStyle,
        bowlingStyle: formData.bowlingStyle,
        country: formData.country.trim(),
        imgLink: imageUrl,
      });

      if (data.success) {
        toast.success("Player added successfully");
        resetFormData();
        setShowAddPlayerModal(false);
        setAllPlayers(prev => [...prev, data.player]);
      }
    } catch (err) {
      console.error('Error adding player:', err);
      toast.error(err.response?.data?.message || "Failed to add player");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEditPlayer = async () => {
    if (!formData.firstName.trim() || !formData.position || !formData.country.trim()) {
      toast.error("Please fill in all required fields");
      return;
    }

    setIsSubmitting(true);
    try {
      let imageUrl = formData.imgLink;
      
      if (formData.image) {
        const form = new FormData();
        form.append("player", formData.image);
        const res = await axios.post(`${BACKEND_URL}/upload/player`, form, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        imageUrl = res.data.image_url;
      }

      const { data } = await axios.put(
        `${BACKEND_URL}/api/players/${editingPlayer._id}`,
        {
          firstName: formData.firstName.trim(),
          lastName: formData.lastName.trim(),
          sport: formData.sport,
          position: formData.position,
          battingStyle: formData.battingStyle,
          bowlingStyle: formData.bowlingStyle,
          country: formData.country.trim(),
          imgLink: imageUrl,
        }
      );

      if (data.success) {
        toast.success("Player updated successfully");
        resetFormData();
        setShowEditPlayerModal(false);
        setEditingPlayer(null);
        setAllPlayers(prev => 
          prev.map(player => 
            player._id === editingPlayer._id ? data.player : player
          )
        );
      }
    } catch (err) {
      console.error('Error updating player:', err);
      toast.error(err.response?.data?.message || "Failed to update player");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeletePlayer = async (playerId) => {
    if (!window.confirm("Are you sure you want to delete this player?")) {
      return;
    }

    try {
      const { data } = await axios.delete(
        `${BACKEND_URL}/api/admin/delete-player/${playerId}`
      );

      if (data.success) {
        toast.success("Player deleted successfully");
        setAllPlayers((prev) =>
          prev.filter((player) => player._id !== playerId)
        );
      }
    } catch (err) {
      console.error('Error deleting player:', err);
      toast.error(err.response?.data?.message || "Failed to delete player");
    }
  };

  const openEditModal = useCallback((player) => {
    setEditingPlayer(player);
    setFormData({
      firstName: player.firstName,
      lastName: player.lastName,
      position: player.position,
      sport: player.sport || "cricket",
      battingStyle: player.battingStyle || "",
      bowlingStyle: player.bowlingStyle || "",
      country: player.country,
      imgLink: player.imgLink,
    });
    setShowEditPlayerModal(true);
  }, []);

  const handleCloseAddModal = useCallback(() => {
    setShowAddPlayerModal(false);
    resetFormData();
  }, [resetFormData]);

  const handleCloseEditModal = useCallback(() => {
    setShowEditPlayerModal(false);
    setEditingPlayer(null);
    resetFormData();
  }, [resetFormData]);

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex justify-between items-center mb-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Manage Players
              </h1>
              <p className="text-gray-600 mt-1">
                Total Players: {allPlayers.length}
              </p>
            </div>

            <button
              onClick={() => setShowAddPlayerModal(true)}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition flex items-center gap-2 font-medium"
            >
              <Plus size={20} />
              Add Player
            </button>
          </div>

          {/* Search Bar */}
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search players by name, country, or position..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
      </div>

      {/* Players Grid */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        {filteredPlayers.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm p-12 text-center">
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {searchTerm ? "No players found matching your search" : "No players found"}
            </h3>
            <p className="text-gray-600">
              {searchTerm ? "Try adjusting your search terms" : "Start by adding your first player"}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredPlayers.map((player) => (
              <div
                key={player._id}
                className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow border border-gray-200"
              >
                <div className="relative">
                  <div className="flex justify-center items-center h-24 bg-gray-50 rounded-t-lg">
                    <img
                      src={player.imgLink ? `${BACKEND_URL}${player.imgLink}` : upload_area}
                      alt={`${player.firstName} ${player.lastName}`}
                      className="w-20 h-20 object-cover rounded-lg border border-gray-200"
                      onError={(e) => {
                        e.target.src = upload_area;
                      }}
                    />
                  </div>
                  <div className="absolute top-2 right-2 flex gap-2">
                    <button
                      onClick={() => openEditModal(player)}
                      className="bg-white bg-opacity-90 p-2 rounded-full hover:bg-opacity-100 transition"
                    >
                      <Edit3 size={16} className="text-gray-600" />
                    </button>
                    <button
                      onClick={() => handleDeletePlayer(player._id)}
                      className="bg-white bg-opacity-90 p-2 rounded-full hover:bg-opacity-100 transition"
                    >
                      <Trash2 size={16} className="text-red-600" />
                    </button>
                  </div>
                </div>

                <div className="p-4">
                  <h3 className="text-lg font-bold text-gray-900 mb-2">
                    {player.firstName} {player.lastName}
                  </h3>

                  <div className="space-y-1 text-sm text-gray-600">
                    <p>
                      <span className="font-medium text-gray-800">Position:</span>{" "}
                      {PLAYER_POSITIONS.find(p => p.value === player.position)?.label || player.position}
                    </p>
                    <p>
                      <span className="font-medium text-gray-800">Country:</span>{" "}
                      {player.country}
                    </p>
                    {player.battingStyle && (
                      <p>
                        <span className="font-medium text-gray-800">Batting:</span>{" "}
                        {BATTING_STYLES.find(s => s.value === player.battingStyle)?.label || player.battingStyle}
                      </p>
                    )}
                    {player.bowlingStyle && player.bowlingStyle !== "none" && (
                      <p>
                        <span className="font-medium text-gray-800">Bowling:</span>{" "}
                        {BOWLING_STYLES.find(s => s.value === player.bowlingStyle)?.label || player.bowlingStyle}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Add Player Modal */}
      <PlayerModal
        showModal={showAddPlayerModal}
        onClose={handleCloseAddModal}
        formData={formData}
        setFormData={setFormData}
        onSubmit={handleAddPlayer}
        mode="add"
        backendUrl={BACKEND_URL}
        isSubmitting={isSubmitting}
      />

      {/* Edit Player Modal */}
      <PlayerModal
        showModal={showEditPlayerModal}
        onClose={handleCloseEditModal}
        formData={formData}
        setFormData={setFormData}
        onSubmit={handleEditPlayer}
        mode="edit"
        existingImageUrl={editingPlayer?.imgLink || ""}
        backendUrl={BACKEND_URL}
        isSubmitting={isSubmitting}
      />
    </div>
  );
};

export default ManagePlayers;