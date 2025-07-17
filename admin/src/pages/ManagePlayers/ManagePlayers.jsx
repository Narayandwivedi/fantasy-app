import React, { useState, useContext, useCallback, useEffect } from "react";
import upload_area from "../../assets/upload_area.svg";
import axios from "axios";
import { AppContext } from "../../context/AppContext";
import { toast } from "react-toastify";
import { Plus, Edit3, Trash2, Search } from "lucide-react";
import AddPlayerModal from "./AddPlayerModal";
import EditPlayerModal from "./EditPlayerModal";

// Constants for display
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

const ManagePlayers = () => {
  const [showAddPlayerModal, setShowAddPlayerModal] = useState(false);
  const [showEditPlayerModal, setShowEditPlayerModal] = useState(false);
  const [editingPlayer, setEditingPlayer] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredPlayers, setFilteredPlayers] = useState([]);
  const [searchLoading, setSearchLoading] = useState(false);

  const { BACKEND_URL, allPlayers, setAllPlayers } = useContext(AppContext);


 
  useEffect(() => {
    const searchPlayers = async () => {
      if (searchTerm.trim() === "") {
        setFilteredPlayers(allPlayers || []);
        return;
      }

      try {
        setSearchLoading(true);
        const { data } = await axios.get(
          `${BACKEND_URL}/api/search/players/${encodeURIComponent(searchTerm)}`
        );
        
        if (data.success) {
          setFilteredPlayers(data.data || []);
        } else {
          console.error('Search failed:', data.message);
          setFilteredPlayers(allPlayers || []);
        }
      } catch (err) {
        console.error("Error searching players:", err);
        toast.error("Failed to search players");
        setFilteredPlayers(allPlayers || []);
      } finally {
        setSearchLoading(false);
      }
    };

    const debounceTimer = setTimeout(() => {
      searchPlayers();
    }, 300);

    return () => clearTimeout(debounceTimer);
  }, [searchTerm, allPlayers, BACKEND_URL]);

  // Update filtered players when allPlayers changes
  useEffect(() => {
    if (searchTerm === "") {
      setFilteredPlayers(allPlayers || []);
    }
  }, [allPlayers, searchTerm]);

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
    setShowEditPlayerModal(true);
  }, []);

  const handlePlayerAdded = (newPlayer) => {
    setAllPlayers(prev => [...(prev || []), newPlayer]);
  };

  const handlePlayerUpdated = (updatedPlayer) => {
    setAllPlayers(prev => 
      (prev || []).map(player => 
        player._id === updatedPlayer._id ? updatedPlayer : player
      )
    );
  };

  const handleCloseEditModal = () => {
    setShowEditPlayerModal(false);
    setEditingPlayer(null);
  };

  
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
                Total Players: {(allPlayers || []).length}
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
            {searchLoading && (
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-500"></div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Players Grid */}
      
      <div className="max-w-7xl mx-auto px-4 py-6">
        {!allPlayers || allPlayers.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm p-12 text-center">
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No players found
            </h3>
            <p className="text-gray-600 mb-4">
              Start by adding your first player
            </p>
            <button
              onClick={() => setShowAddPlayerModal(true)}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition flex items-center gap-2 font-medium mx-auto"
            >
              <Plus size={20} />
              Add First Player
            </button>
          </div>
        ) : filteredPlayers.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm p-12 text-center">
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No players found matching your search
            </h3>
            <p className="text-gray-600">
              Try adjusting your search terms
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
      <AddPlayerModal
        showModal={showAddPlayerModal}
        onClose={() => setShowAddPlayerModal(false)}
        onPlayerAdded={handlePlayerAdded}
      />

      {/* Edit Player Modal */}
      <EditPlayerModal
        showModal={showEditPlayerModal}
        onClose={handleCloseEditModal}
        player={editingPlayer}
        onPlayerUpdated={handlePlayerUpdated}
      />
    </div>
  );
};

export default ManagePlayers;