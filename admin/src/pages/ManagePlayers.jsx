import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { AppContext } from "../context/AppContext";
import { toast } from "react-toastify";
import { Plus, Search, Edit3, Trash2, Filter } from "lucide-react";

// Move AddPlayerModal outside the main component
const AddPlayerModal = ({ 
  showModal, 
  onClose, 
  formData, 
  setFormData, 
  onSubmit 
}) => {
  if (!showModal) return null;

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Add New Player</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            ✕
          </button>
        </div>
        
        <div className="flex flex-col gap-4">
          <input
            value={formData.name}
            onChange={(e) => handleInputChange('name', e.target.value)}
            className="border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Player name *"
            type="text"
          />

          <select
            value={formData.position}
            onChange={(e) => handleInputChange('position', e.target.value)}
            className="border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Select player role *</option>
            <option value="batsman">Batsman</option>
            <option value="bowler">Bowler</option>
            <option value="all-rounder">All-rounder</option>
            <option value="wicket-keeper">Wicket-keeper</option>
          </select>

          <select
            value={formData.battingStyle}
            onChange={(e) => handleInputChange('battingStyle', e.target.value)}
            className="border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Select batting style</option>
            <option value="right-handed">Right-handed</option>
            <option value="left-handed">Left-handed</option>
          </select>

          <select
            value={formData.bowlingStyle}
            onChange={(e) => handleInputChange('bowlingStyle', e.target.value)}
            className="border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Select bowling style</option>
            <option value="right-arm fast">Right-arm Fast</option>
            <option value="right-arm-medium-fast">Right-arm Medium Fast</option>
            <option value="left-arm fast">Left-arm Fast</option>
            <option value="left-arm-medium-fast">Left-arm Medium Fast</option>
            <option value="right-arm-spin">Right-arm Spin</option>
            <option value="left-arm-spin">Left-arm Spin</option>
            <option value="none">None</option>
          </select>

          <input
            value={formData.country}
            onChange={(e) => handleInputChange('country', e.target.value)}
            className="border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Player country *"
            type="text"
          />
          
          <input
            value={formData.imgLink}
            onChange={(e) => handleInputChange('imgLink', e.target.value)}
            className="border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Player image URL"
            type="text"
          />
          
          <div className="flex gap-3 mt-4">
            <button
              onClick={onClose}
              className="flex-1 bg-gray-500 text-white py-3 rounded-lg hover:bg-gray-600 transition"
            >
              Cancel
            </button>
            <button
              onClick={onSubmit}
              className="flex-1 bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition"
            >
              Add Player
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const ManagePlayers = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterSport, setFilterSport] = useState("all");
  const [filterPosition, setFilterPosition] = useState("all");
  const [showAddPlayerModal, setShowAddPlayerModal] = useState(false);
  const { BACKEND_URL , allPlayers } = useContext(AppContext);


  // Combine all form data into one object
  const [formData, setFormData] = useState({
    name: "",
    position: "",
    sport: "cricket",
    battingStyle: "",
    bowlingStyle: "",
    country: "",
    imgLink: ""
  });



  const handleAddPlayer = async () => {
    if (!formData.name || !formData.position || !formData.country) {
      toast.error("Please fill in all required fields");
      return;
    }

    try {
      const { data } = await axios.post(`${BACKEND_URL}/api/admin/create-player`, {
        name: formData.name,
        sport: formData.sport,
        position: formData.position,
        battingStyle: formData.battingStyle,
        bowlingStyle: formData.bowlingStyle,
        country: formData.country,
        image: formData.imgLink,
      });
      
      if (data.success) {
        toast.success("Player added successfully");
      
        // Reset form
        setFormData({
          name: "",
          position: "",
          sport: "cricket",
          battingStyle: "",
          bowlingStyle: "",
          country: "",
          imgLink: ""
        });
        setShowAddPlayerModal(false);
      }
    } catch (err) {
      console.log(err);
      toast.error("Failed to add player");
    }
  };

  const handleCloseModal = () => {
    setShowAddPlayerModal(false);
    // Optionally reset form when closing
    // setFormData({ name: "", position: "", sport: "cricket", battingStyle: "", bowlingStyle: "", country: "", imgLink: "" });
  };

  // Filter players based on search and filters
  const filteredPlayers = allPlayers.filter(player => {
    const matchesSearch = player.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         player.country.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSport = filterSport === "all" || player.sport === filterSport;
    const matchesPosition = filterPosition === "all" || player.position === filterPosition;
    
    return matchesSearch && matchesSport && matchesPosition;
  });



  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Manage Players</h1>
              <p className="text-gray-600 mt-1">Total Players: {allPlayers.length}</p>
            </div>
            <button
              onClick={() => setShowAddPlayerModal(true)}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition flex items-center gap-2 font-medium"
            >
              <Plus size={20} />
              Add Player
            </button>
          </div>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="bg-white p-6 rounded-lg shadow-sm mb-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Search players..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Sport Filter */}
            <select
              value={filterSport}
              onChange={(e) => setFilterSport(e.target.value)}
              className="border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Sports</option>
              <option value="cricket">Cricket</option>
              <option value="football">Football</option>
            </select>

            {/* Position Filter */}
            <select
              value={filterPosition}
              onChange={(e) => setFilterPosition(e.target.value)}
              className="border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Positions</option>
              <option value="batsman">Batsman</option>
              <option value="bowler">Bowler</option>
              <option value="all-rounder">All-rounder</option>
              <option value="wicket-keeper">Wicket-keeper</option>
            </select>

            {/* Clear Filters */}
            <button
              onClick={() => {
                setSearchTerm("");
                setFilterSport("all");
                setFilterPosition("all");
              }}
              className="bg-gray-100 text-gray-700 px-4 py-3 rounded-lg hover:bg-gray-200 transition flex items-center justify-center gap-2"
            >
              <Filter size={18} />
              Clear Filters
            </button>
          </div>
        </div>

        {/* Players Grid */}
        {filteredPlayers.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm p-12 text-center">
            <div className="text-gray-400 mb-4">
              <Search size={48} className="mx-auto" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No players found</h3>
            <p className="text-gray-600">Try adjusting your search or filters</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredPlayers.map((player) => (
              <div
                key={player._id}
                className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow border border-gray-200"
              >
                <div className="relative">
                  <img
                    src={player.image}
                    alt={player.name}
                    className="w-full h-48 object-cover rounded-t-lg"
                    onError={(e) => {
                      e.target.src = "https://via.placeholder.com/300x200?text=No+Image";
                    }}
                  />
                  <div className="absolute top-3 right-3 flex gap-2">
                    <button className="bg-white bg-opacity-90 p-2 rounded-full hover:bg-opacity-100 transition">
                      <Edit3 size={16} className="text-gray-600" />
                    </button>
                    <button className="bg-white bg-opacity-90 p-2 rounded-full hover:bg-opacity-100 transition">
                      <Trash2 size={16} className="text-red-600" />
                    </button>
                  </div>
                </div>
                
                <div className="p-4">
                  <h3 className="text-lg font-bold text-gray-900 mb-2">{player.name}</h3>
                  
                  <div className="space-y-1 text-sm text-gray-600">
                    <p><span className="font-medium text-gray-800">ID:</span> {player._id}</p>
                    <p><span className="font-medium text-gray-800">Position:</span> {player.position}</p>
                    <p><span className="font-medium text-gray-800">Country:</span> {player.country}</p>
                    {player.battingStyle && (
                      <p><span className="font-medium text-gray-800">Batting:</span> {player.battingStyle}</p>
                    )}
                    {player.bowlingStyle && player.bowlingStyle !== "none" && (
                      <p><span className="font-medium text-gray-800">Bowling:</span> {player.bowlingStyle}</p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Add Player Modal */}
      <AddPlayerModal
        showModal={showAddPlayerModal}
        onClose={handleCloseModal}
        formData={formData}
        setFormData={setFormData}
        onSubmit={handleAddPlayer}
      />
    </div>
  );
};

export default ManagePlayers;