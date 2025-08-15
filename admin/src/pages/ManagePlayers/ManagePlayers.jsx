import React, { useState, useContext, useCallback, useEffect } from "react";
import upload_area from "../../assets/upload_area.svg";
import axios from "axios";
import { AppContext } from "../../context/AppContext";
import { toast } from "react-toastify";
import { Plus, Edit3, Trash2, Search, ChevronLeft, ChevronRight } from "lucide-react";
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
  const [searchResults, setSearchResults] = useState([]);
  const [searchLoading, setSearchLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);

  const { 
    BACKEND_URL, 
    allPlayers, 
    fetchPlayersWithPagination, 
    playersPagination 
  } = useContext(AppContext);

  // Load initial paginated data (only when not searching)
  useEffect(() => {
    if (!searchTerm.trim()) {
      const loadPlayers = async () => {
        try {
          setLoading(true);
          await fetchPlayersWithPagination(currentPage, 'all');
        } catch (error) {
          console.error("Error loading players:", error);
          toast.error("Failed to load players");
        } finally {
          setLoading(false);
        }
      };

      loadPlayers();
    }
  }, [currentPage, fetchPlayersWithPagination, searchTerm]);

  // Handle search functionality (for both names and countries)
  useEffect(() => {
    const searchPlayers = async () => {
      if (searchTerm.trim() === "") {
        setSearchResults([]);
        return;
      }

      try {
        setSearchLoading(true);
        const { data } = await axios.get(
          `${BACKEND_URL}/api/search/players/${encodeURIComponent(searchTerm.trim())}`
        );
        
        if (data.success) {
          setSearchResults(data.data || []);
        } else {
          console.error('Search failed:', data.message);
          setSearchResults([]);
        }
      } catch (err) {
        console.error("Error searching players:", err);
        toast.error("Failed to search players");
        setSearchResults([]);
      } finally {
        setSearchLoading(false);
      }
    };

    const debounceTimer = setTimeout(() => {
      searchPlayers();
    }, 300);

    return () => clearTimeout(debounceTimer);
  }, [searchTerm, BACKEND_URL]);

  const handleDeletePlayer = async (playerId) => {
    if (!window.confirm("Are you sure you want to delete this player?")) {
      return;
    }

    try {
      const { data } = await axios.delete(
        `${BACKEND_URL}/api/admin/delete-player/${playerId}`,
        { withCredentials: true }
      );

      if (data.success) {
        toast.success("Player deleted successfully");
        
        // Refresh the appropriate data
        if (searchTerm.trim()) {
          // If searching, update search results
          setSearchResults(prev => prev.filter(player => player._id !== playerId));
        } else {
          // If browsing paginated data, refresh current page
          await fetchPlayersWithPagination(currentPage, 'all');
        }
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

  const handleCloseEditModal = () => {
    setShowEditPlayerModal(false);
    setEditingPlayer(null);
  };

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  // Determine what players to display
  const displayedPlayers = searchTerm.trim() ? searchResults : allPlayers;
  const isSearching = searchTerm.trim().length > 0;

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-3 lg:px-4 py-4 lg:py-6">
          <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center mb-4 lg:mb-6 space-y-4 lg:space-y-0">
            <div>
              <h1 className="text-xl lg:text-3xl font-bold text-gray-900">
                Manage Players
              </h1>
              <div className="flex flex-wrap items-center gap-2 lg:gap-4 mt-2">
                <div className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-semibold">
                  {isSearching 
                    ? `Found: ${searchResults.length} Players` 
                    : `Total: ${playersPagination?.totalPlayers || 0} Players`
                  }
                </div>
                {isSearching && (
                  <div className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-semibold">
                    🔍 Searching: "{searchTerm}"
                  </div>
                )}
              </div>
            </div>

            <button
              onClick={() => setShowAddPlayerModal(true)}
              className="bg-blue-600 text-white px-4 lg:px-6 py-2 lg:py-3 rounded-lg hover:bg-blue-700 transition flex items-center gap-2 font-medium text-sm lg:text-base"
            >
              <Plus size={16} className="lg:w-5 lg:h-5" />
              Add Player
            </button>
          </div>

          {/* Search Bar */}
          <div className="flex flex-col gap-4 items-start">
            <div className="relative flex-1 max-w-md">
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
            
            {searchTerm && (
              <button
                onClick={() => setSearchTerm("")}
                className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
              >
                ✕ Clear Search
              </button>
            )}
          </div>

          {/* Pagination - Top (only show when not searching) */}
          {!isSearching && playersPagination?.totalPages > 1 && (
            <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-200">
              <div className="text-sm text-gray-600">
                Page {playersPagination?.currentPage || 1} of {playersPagination?.totalPages || 1}
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={!playersPagination?.hasPrev || loading}
                  className="flex items-center gap-1 px-3 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ChevronLeft size={16} />
                  Previous
                </button>
                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={!playersPagination?.hasNext || loading}
                  className="flex items-center gap-1 px-3 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next
                  <ChevronRight size={16} />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Players Grid */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        {loading ? (
          <div className="bg-white rounded-lg shadow-sm p-12 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading players...</p>
          </div>
        ) : !displayedPlayers || displayedPlayers.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm p-12 text-center">
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {isSearching ? `No players found for "${searchTerm}"` : "No players found"}
            </h3>
            <p className="text-gray-600 mb-4">
              {isSearching 
                ? "Try different search terms (name, country, or position)" 
                : "Start by adding your first player"
              }
            </p>
            {!isSearching && (
              <button
                onClick={() => setShowAddPlayerModal(true)}
                className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition flex items-center gap-2 font-medium mx-auto"
              >
                <Plus size={20} />
                Add First Player
              </button>
            )}
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {displayedPlayers.map((player) => (
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

            {/* Pagination - Bottom (only show when not searching) */}
            {!isSearching && playersPagination?.totalPages > 1 && (
              <div className="flex items-center justify-center mt-8 pt-6 border-t border-gray-200">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handlePageChange(1)}
                    disabled={playersPagination?.currentPage === 1 || loading}
                    className="px-3 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    First
                  </button>
                  <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={!playersPagination?.hasPrev || loading}
                    className="flex items-center gap-1 px-3 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <ChevronLeft size={16} />
                    Previous
                  </button>
                  
                  <span className="px-4 py-2 text-sm text-gray-600">
                    Page {playersPagination?.currentPage || 1} of {playersPagination?.totalPages || 1}
                  </span>
                  
                  <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={!playersPagination?.hasNext || loading}
                    className="flex items-center gap-1 px-3 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Next
                    <ChevronRight size={16} />
                  </button>
                  <button
                    onClick={() => handlePageChange(playersPagination?.totalPages || 1)}
                    disabled={playersPagination?.currentPage === playersPagination?.totalPages || loading}
                    className="px-3 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Last
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* Add Player Modal */}
      <AddPlayerModal
        showModal={showAddPlayerModal}
        onClose={() => setShowAddPlayerModal(false)}
      />

      {/* Edit Player Modal */}
      <EditPlayerModal
        showModal={showEditPlayerModal}
        onClose={handleCloseEditModal}
        player={editingPlayer}
      />
    </div>
  );
};

export default ManagePlayers;