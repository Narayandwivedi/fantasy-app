import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import { AppContext } from "../context/AppContext";
import { useParams } from "react-router-dom";
import { Plus, Search, X, UserPlus } from "lucide-react";
import { toast } from "react-toastify";

// Search Player Modal Component
const SearchPlayerModal = ({ 
  BACKEND_URL,
  showModal, 
  onClose, 
  allPlayers,
  onAddPlayer,
  currentSquadIds = []
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterPosition, setFilterPosition] = useState("all");

  if (!showModal) return null;

  // Filter available players (exclude already added players)
  const availablePlayers = allPlayers.filter(player => 
    !currentSquadIds.includes(player._id)
  );

  // Filter players based on search and filters
  const filteredPlayers = availablePlayers.filter(player => {
    const matchesSearch = player.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         player.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         player.country.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesPosition = filterPosition === "all" || player.position === filterPosition;
    
    return matchesSearch && matchesPosition;
  });

  const handleAddPlayer = (player) => {
    onAddPlayer(player);
    setSearchTerm("");
    setFilterPosition("all");
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg w-full max-w-4xl max-h-[90vh] overflow-hidden">
        {/* Modal Header */}
        <div className="flex justify-between items-center p-6 border-b">
          <h2 className="text-xl font-bold">Add Player to Squad</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 p-2"
          >
            <X size={20} />
          </button>
        </div>

        {/* Search and Filters */}
        <div className="p-6 border-b bg-gray-50">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Search */}
            <div className="relative md:col-span-2">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Search players by name or country..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

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
          </div>
          
          <div className="mt-4 text-sm text-gray-600">
            Available players: {filteredPlayers.length} of {availablePlayers.length}
          </div>
        </div>

        {/* Players List */}
        <div className="overflow-y-auto max-h-96 p-6">
          {filteredPlayers.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-gray-400 mb-4">
                <Search size={48} className="mx-auto" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No players found</h3>
              <p className="text-gray-600">
                {availablePlayers.length === 0 
                  ? "All available players are already in the squad" 
                  : "Try adjusting your search or filters"
                }
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredPlayers.map((player) => (
                <div
                  key={player._id}
                  className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-center space-x-4">
                    <img
                      src={`${BACKEND_URL}${player.imgLink}`}
                      alt={`${player.firstName} ${player.lastName}`}
                      className="w-12 h-12 rounded-full object-cover"
                    />
                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm font-semibold text-gray-900 truncate">
                        {player.firstName} {player.lastName}
                      </h4>
                      <p className="text-xs text-gray-600 capitalize">
                        {player.position}
                      </p>
                      <p className="text-xs text-gray-500">
                        {player.country}
                      </p>
                    </div>
                    <button
                      onClick={() => handleAddPlayer(player)}
                      className="bg-blue-600 text-white p-2 rounded-lg hover:bg-blue-700 transition flex-shrink-0"
                      title="Add to squad"
                    >
                      <UserPlus size={16} />
                    </button>
                  </div>
                  
                  <div className="mt-3 text-xs text-gray-600">
                    {player.battingStyle && (
                      <span className="inline-block bg-green-100 text-green-800 px-2 py-1 rounded mr-2">
                        {player.battingStyle}
                      </span>
                    )}
                    {player.bowlingStyle && player.bowlingStyle !== 'none' && (
                      <span className="inline-block bg-purple-100 text-purple-800 px-2 py-1 rounded">
                        {player.bowlingStyle}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const TeamDetails = () => {
  const { id } = useParams();
  const [teamDetails, setTeamDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showSearchModal, setShowSearchModal] = useState(false);

  const { BACKEND_URL, allPlayers } = useContext(AppContext);

  async function fetchTeamDetails() {
    try {
      setLoading(true);
      const { data } = await axios.get(`${BACKEND_URL}/api/teams/${id}`);
      if (data.success) {
        setTeamDetails(data.getTeam);
      } else {
        setError("Failed to fetch team details");
      }
    } catch (err) {
      console.error(err);
      setError("An error occurred while fetching team details");
    } finally {
      setLoading(false);
    }
  }

  // Function to add player to team squad
  const handleAddPlayerToSquad = async (player) => {
    try {
      const { data } = await axios.post(`${BACKEND_URL}/api/teams/${id}/add-player`, {
        playerId: player._id
      });
      
      if (data.success) {
        toast.success(`${player.firstName} ${player.lastName} added to squad successfully`);
      } else {
        toast.error(data.message || "Failed to add player to squad");
      }
    } catch (err) {
      console.error(err);
      toast.error("An error occurred while adding player to squad");
    }
  };

  // Function to remove player from squad
  const handleRemovePlayerFromSquad = async (playerId, playerFirstName, playerLastName) => {
    const fullName = `${playerFirstName} ${playerLastName}`;
    if (window.confirm(`Are you sure you want to remove ${fullName} from the squad?`)) {
      try {
        const { data } = await axios.delete(`${BACKEND_URL}/api/teams/${id}/remove-player/${playerId}`);
        
        if (data.success) {
          toast.success(`${fullName} removed from squad successfully`);
          // Refresh team details to show updated squad
          fetchTeamDetails();
        } else {
          toast.error(data.message || "Failed to remove player from squad");
        }
      } catch (err) {
        console.error(err);
        toast.error("An error occurred while removing player from squad");
      }
    }
  };

  useEffect(() => {
    fetchTeamDetails();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading team details...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 text-xl mb-2">⚠️</div>
          <p className="text-gray-600">{error}</p>
        </div>
      </div>
    );
  }

  if (!teamDetails) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-gray-600">No team details found</p>
      </div>
    );
  }

  // Get current squad player IDs for filtering
  const currentSquadIds = teamDetails.squad ? teamDetails.squad.map(player => player._id) : [];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Team Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center space-x-6">
            {teamDetails.logo && (
              <img
                src={teamDetails.logo}
                alt={`${teamDetails.name} logo`}
                className="w-16 h-16 object-contain rounded-lg"
              />
            )}
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                {teamDetails.name}
              </h1>
              <p className="text-lg text-blue-600 font-semibold">
                {teamDetails.shortName}
              </p>
              <p className="text-sm text-gray-500 capitalize">
                {teamDetails.sport}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Leadership Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Leadership</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          {/* Captain */}
          {teamDetails.captain && (
            <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-yellow-500">
              <div className="flex items-center space-x-4">
                <img
                  src={`${BACKEND_URL}${teamDetails.captain.imgLink}`}
                  alt={`${teamDetails.captain.firstName} ${teamDetails.captain.lastName}`}
                  className="w-16 h-16 rounded-full object-cover"
                />
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="text-sm bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full font-medium">
                      Captain
                    </span>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    {teamDetails.captain.firstName} {teamDetails.captain.lastName}
                  </h3>
                  <p className="text-sm text-gray-600 capitalize">
                    {teamDetails.captain.position} • {teamDetails.captain.battingStyle}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Vice Captain */}
          {teamDetails.viceCaptain && (
            <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-blue-500">
              <div className="flex items-center space-x-4">
                <img
                  src={`${BACKEND_URL}${teamDetails.viceCaptain.imgLink}`}
                  alt={`${teamDetails.viceCaptain.firstName} ${teamDetails.viceCaptain.lastName}`}
                  className="w-16 h-16 rounded-full object-cover"
                />
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="text-sm bg-blue-100 text-blue-800 px-2 py-1 rounded-full font-medium">
                      Vice Captain
                    </span>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    {teamDetails.viceCaptain.firstName} {teamDetails.viceCaptain.lastName}
                  </h3>
                  <p className="text-sm text-gray-600 capitalize">
                    {teamDetails.viceCaptain.position} • {teamDetails.viceCaptain.battingStyle}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Squad Section */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">
              Squad ({teamDetails.squad?.length || 0} players)
            </h2>
            <button
              onClick={() => setShowSearchModal(true)}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition flex items-center gap-2 font-medium"
            >
              <Plus size={18} />
              Add Player
            </button>
          </div>

          {teamDetails.squad && teamDetails.squad.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {teamDetails.squad.map((player) => (
                <div
                  key={player._id}
                  className="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden"
                >
                  <div className="aspect-w-4 aspect-h-3">
                    <img
                      src={`${BACKEND_URL}${player.imgLink}`}
                      alt={`${player.firstName} ${player.lastName}`}
                      className="w-full h-48 object-cover"
                    />
                  </div>
                  <div className="p-4">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      {player.firstName} {player.lastName}
                    </h3>
                    <div className="space-y-1 mb-4">
                      <p className="text-sm text-gray-600">
                        <span className="inline-block w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                        <span className="capitalize">{player.position}</span>
                      </p>
                      <p className="text-sm text-gray-600">
                        <span className="inline-block w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
                        <span className="capitalize">{player.battingStyle}</span>
                      </p>
                      {player.bowlingStyle && player.bowlingStyle !== 'none' && (
                        <p className="text-sm text-gray-600">
                          <span className="inline-block w-2 h-2 bg-purple-500 rounded-full mr-2"></span>
                          <span className="capitalize">{player.bowlingStyle}</span>
                        </p>
                      )}
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full">
                        {player.fantasyPoints} pts
                      </span>
                      <div className="flex space-x-2">
                        <button className="px-3 py-1 bg-blue-500 text-white text-xs rounded-md hover:bg-blue-600 transition-colors">
                          Edit
                        </button>
                        <button 
                          onClick={() => handleRemovePlayerFromSquad(player._id, player.firstName, player.lastName)}
                          className="px-3 py-1 bg-red-500 text-white text-xs rounded-md hover:bg-red-600 transition-colors"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="text-gray-400 text-4xl mb-4">👥</div>
              <p className="text-gray-500 mb-4">No players in the squad yet</p>
              <button
                onClick={() => setShowSearchModal(true)}
                className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition"
              >
                Add First Player
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Search Player Modal */}
      <SearchPlayerModal
        BACKEND_URL={BACKEND_URL}
        showModal={showSearchModal}
        onClose={() => setShowSearchModal(false)}
        allPlayers={allPlayers || []}
        onAddPlayer={handleAddPlayerToSquad}
        currentSquadIds={currentSquadIds}
      />
    </div>
  );
};

export default TeamDetails;