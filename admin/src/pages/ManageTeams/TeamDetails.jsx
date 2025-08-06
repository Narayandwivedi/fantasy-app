import axios from "axios";
import React, { useContext, useEffect, useState, useCallback, memo } from "react";
import { AppContext } from "../../context/AppContext";
import { useParams } from "react-router-dom";
import { Plus, Search, X, UserPlus, Crown, Shield, Star, Users, Trophy, Target } from "lucide-react";
import { toast } from "react-toastify";
import EditPlayerModal from "../ManagePlayers/EditPlayerModal";

// Search Player Modal Component
const SearchPlayerModal = memo(({ 
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
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl w-full max-w-5xl max-h-[90vh] overflow-hidden shadow-2xl border border-gray-200">
        {/* Modal Header */}
        <div className="flex justify-between items-center p-6 border-b bg-gradient-to-r from-blue-50 to-indigo-50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
              <UserPlus className="text-blue-600" size={20} />
            </div>
            <h2 className="text-xl font-bold text-gray-800">Add Player to Squad</h2>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 hover:bg-gray-100 p-2 rounded-xl transition-all duration-200"
          >
            <X size={20} />
          </button>
        </div>

        {/* Search and Filters */}
        <div className="p-6 border-b bg-gradient-to-br from-gray-50 to-blue-50">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Search */}
            <div className="relative md:col-span-2">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Search players by name or country..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white shadow-sm transition-all duration-200"
              />
            </div>

            {/* Position Filter */}
            <select
              value={filterPosition}
              onChange={(e) => setFilterPosition(e.target.value)}
              className="border border-gray-200 p-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white shadow-sm transition-all duration-200"
            >
              <option value="all">All Positions</option>
              <option value="batsman">Batsman</option>
              <option value="bowler">Bowler</option>
              <option value="all-rounder">All-rounder</option>
              <option value="wicket-keeper">Wicket-keeper</option>
            </select>
          </div>
          
          <div className="mt-4 flex items-center gap-2">
            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
            <span className="text-sm text-gray-600 font-medium">
              {filteredPlayers.length} of {availablePlayers.length} players available
            </span>
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
                  className="bg-white border border-gray-100 rounded-xl p-4 hover:shadow-lg hover:border-blue-200 transition-all duration-300 group"
                >
                  <div className="flex items-center space-x-4">
                    <div className="relative">
                      <img
                        src={`${BACKEND_URL}${player.imgLink}`}
                        alt={`${player.firstName} ${player.lastName}`}
                        className="w-14 h-14 rounded-xl object-cover border-2 border-gray-100 group-hover:border-blue-200 transition-all duration-300"
                      />
                      <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-500 rounded-full border-2 border-white"></div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm font-semibold text-gray-900 truncate group-hover:text-blue-900 transition-colors">
                        {player.firstName} {player.lastName}
                      </h4>
                      <p className="text-xs text-gray-600 capitalize font-medium">
                        {player.position}
                      </p>
                      <p className="text-xs text-gray-500 flex items-center gap-1">
                        <span className="w-1 h-1 bg-gray-400 rounded-full"></span>
                        {player.country}
                      </p>
                    </div>
                    <button
                      onClick={() => handleAddPlayer(player)}
                      className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-2.5 rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all duration-200 flex-shrink-0 shadow-md hover:shadow-lg transform hover:scale-105"
                      title="Add to squad"
                    >
                      <UserPlus size={16} />
                    </button>
                  </div>
                  
                  <div className="mt-3 flex flex-wrap gap-1">
                    {player.battingStyle && (
                      <span className="inline-block bg-green-100 text-green-700 px-2 py-1 rounded-lg text-xs font-medium">
                        {player.battingStyle}
                      </span>
                    )}
                    {player.bowlingStyle && player.bowlingStyle !== 'none' && (
                      <span className="inline-block bg-purple-100 text-purple-700 px-2 py-1 rounded-lg text-xs font-medium">
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
});

SearchPlayerModal.displayName = 'SearchPlayerModal';

const TeamDetails = memo(() => {
  const { id } = useParams();
  const [teamDetails, setTeamDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showSearchModal, setShowSearchModal] = useState(false);
  const [showEditPlayerModal, setShowEditPlayerModal] = useState(false);
  const [editingPlayer, setEditingPlayer] = useState(null);

  const { BACKEND_URL, allPlayers, setAllPlayers } = useContext(AppContext);

  const fetchTeamDetails = useCallback(async () => {
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
  }, [id, BACKEND_URL]);

  // Function to add player to team squad
  const handleAddPlayerToSquad = useCallback(async (player) => {
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
  }, [id, BACKEND_URL]);

  // Function to remove player from squad
  const handleRemovePlayerFromSquad = useCallback(async (playerId, playerFirstName, playerLastName) => {
    const fullName = `${playerFirstName} ${playerLastName}`;
    if (window.confirm(`Are you sure you want to remove ${fullName} from the squad?`))
       
      {
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
  }, [id, BACKEND_URL, fetchTeamDetails]);

  // Function to open edit player modal
  const handleEditPlayer = useCallback((player) => {
    setEditingPlayer(player);
    setShowEditPlayerModal(true);
  }, []);

  // Function to close edit player modal
  const handleCloseEditModal = useCallback(() => {
    setShowEditPlayerModal(false);
    setEditingPlayer(null);
    // Refresh team details to show any updates
    fetchTeamDetails();
  }, [fetchTeamDetails]);

  useEffect(() => {
    fetchTeamDetails();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="relative">
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-200 border-t-blue-600 mx-auto mb-6"></div>
            <div className="absolute inset-0 rounded-full h-16 w-16 border-4 border-blue-100 animate-pulse mx-auto"></div>
          </div>
          <h3 className="text-lg font-semibold text-gray-800 mb-2">Loading team details...</h3>
          <p className="text-gray-600">Please wait while we fetch the information</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 flex items-center justify-center">
        <div className="text-center bg-white rounded-2xl shadow-lg p-8 max-w-md mx-4">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <X className="text-red-500" size={32} />
          </div>
          <h3 className="text-lg font-semibold text-gray-800 mb-2">Something went wrong</h3>
          <p className="text-gray-600 mb-4">{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (!teamDetails) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 flex items-center justify-center">
        <div className="text-center bg-white rounded-2xl shadow-lg p-8 max-w-md mx-4">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Search className="text-gray-400" size={32} />
          </div>
          <h3 className="text-lg font-semibold text-gray-800 mb-2">Team not found</h3>
          <p className="text-gray-600">No team details found for this ID</p>
        </div>
      </div>
    );
  }

  // Get current squad player IDs for filtering
  const currentSquadIds = teamDetails.squad ? teamDetails.squad.map(player => player._id) : [];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      {/* Team Header */}
      <div className="bg-white shadow-lg border-b relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/5 to-purple-600/5"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 relative">
          <div className="flex items-center space-x-8">
            {teamDetails.logo && (
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-purple-500 rounded-2xl blur opacity-20"></div>
                <img
                  src={`${BACKEND_URL}${teamDetails.logo}`}
                  alt={`${teamDetails.name} logo`}
                  className="w-20 h-20 object-contain rounded-2xl relative z-10 bg-white p-2 shadow-lg border border-gray-100"
                />
              </div>
            )}
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-900 to-blue-900 bg-clip-text text-transparent">
                  {teamDetails.name}
                </h1>
                <Trophy className="text-yellow-500" size={28} />
              </div>
              <div className="flex items-center gap-4 mb-3">
                <p className="text-xl text-blue-600 font-bold bg-blue-50 px-3 py-1 rounded-lg">
                  {teamDetails.shortName}
                </p>
                <span className="text-sm text-gray-500 capitalize bg-gray-100 px-3 py-1 rounded-full font-medium">
                  {teamDetails.sport}
                </span>
              </div>
              <div className="flex items-center gap-6 text-sm text-gray-600">
                <div className="flex items-center gap-2">
                  <Users size={16} className="text-blue-500" />
                  <span className="font-medium">{teamDetails.squad?.length || 0} Players</span>
                </div>
                <div className="flex items-center gap-2">
                  <Crown size={16} className="text-yellow-500" />
                  <span className="font-medium">{teamDetails.captain ? 'Captain Assigned' : 'No Captain'}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Leadership Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-10 h-10 bg-gradient-to-r from-yellow-400 to-yellow-600 rounded-xl flex items-center justify-center">
            <Crown className="text-white" size={20} />
          </div>
          <h2 className="text-3xl font-bold text-gray-900">Leadership</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          {/* Captain */}
          {teamDetails.captain && (
            <div className="group bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 p-6 border border-gray-100 hover:border-yellow-200 relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-yellow-400 to-yellow-600"></div>
              <div className="flex items-center space-x-6">
                <div className="relative">
                  <img
                    src={`${BACKEND_URL}${teamDetails.captain.imgLink}`}
                    alt={`${teamDetails.captain.firstName} ${teamDetails.captain.lastName}`}
                    className="w-20 h-20 rounded-2xl object-cover border-3 border-yellow-200 shadow-lg group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute -top-2 -right-2 w-8 h-8 bg-gradient-to-r from-yellow-400 to-yellow-600 rounded-full flex items-center justify-center shadow-lg">
                    <Crown className="text-white" size={16} />
                  </div>
                </div>
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <span className="bg-gradient-to-r from-yellow-100 to-yellow-200 text-yellow-800 px-3 py-1 rounded-xl font-bold text-sm border border-yellow-300">
                      Captain
                    </span>
                    <Star className="text-yellow-500" size={16} />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 group-hover:text-yellow-800 transition-colors">
                    {teamDetails.captain.firstName} {teamDetails.captain.lastName}
                  </h3>
                  <p className="text-sm text-gray-600 capitalize font-medium mt-1">
                    {teamDetails.captain.position} • {teamDetails.captain.battingStyle}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Vice Captain */}
          {teamDetails.viceCaptain && (
            <div className="group bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 p-6 border border-gray-100 hover:border-blue-200 relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-400 to-blue-600"></div>
              <div className="flex items-center space-x-6">
                <div className="relative">
                  <img
                    src={`${BACKEND_URL}${teamDetails.viceCaptain.imgLink}`}
                    alt={`${teamDetails.viceCaptain.firstName} ${teamDetails.viceCaptain.lastName}`}
                    className="w-20 h-20 rounded-2xl object-cover border-3 border-blue-200 shadow-lg group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute -top-2 -right-2 w-8 h-8 bg-gradient-to-r from-blue-400 to-blue-600 rounded-full flex items-center justify-center shadow-lg">
                    <Shield className="text-white" size={16} />
                  </div>
                </div>
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <span className="bg-gradient-to-r from-blue-100 to-blue-200 text-blue-800 px-3 py-1 rounded-xl font-bold text-sm border border-blue-300">
                      Vice Captain
                    </span>
                    <Target className="text-blue-500" size={16} />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 group-hover:text-blue-800 transition-colors">
                    {teamDetails.viceCaptain.firstName} {teamDetails.viceCaptain.lastName}
                  </h3>
                  <p className="text-sm text-gray-600 capitalize font-medium mt-1">
                    {teamDetails.viceCaptain.position} • {teamDetails.viceCaptain.battingStyle}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Squad Section */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center">
                <Users className="text-white" size={20} />
              </div>
              <div>
                <h2 className="text-3xl font-bold text-gray-900">
                  Squad
                </h2>
                <p className="text-gray-600 font-medium">
                  {teamDetails.squad?.length || 0} players in the squad
                </p>
              </div>
            </div>
            <button
              onClick={() => setShowSearchModal(true)}
              className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 py-3 rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all duration-200 flex items-center gap-3 font-semibold shadow-lg hover:shadow-xl transform hover:scale-105"
            >
              <Plus size={20} />
              Add Player
            </button>
          </div>

          {teamDetails.squad && teamDetails.squad.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {teamDetails.squad.map((player) => (
                <div
                  key={player._id}
                  className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden border border-gray-100 hover:border-blue-200 transform hover:-translate-y-1"
                >
                  <div className="relative">
                    <img
                      src={`${BACKEND_URL}${player.imgLink}`}
                      alt={`${player.firstName} ${player.lastName}`}
                      className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent group-hover:from-black/30 transition-all duration-300"></div>
                    <div className="absolute top-4 right-4">
                      <div className="bg-white/90 backdrop-blur-sm px-2 py-1 rounded-lg shadow-md">
                        <span className="text-xs font-bold text-gray-700">{player.fantasyPoints} pts</span>
                      </div>
                    </div>
                  </div>
                  <div className="p-5">
                    <h3 className="text-lg font-bold text-gray-900 mb-3 group-hover:text-blue-900 transition-colors">
                      {player.firstName} {player.lastName}
                    </h3>
                    <div className="space-y-2 mb-5">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        <span className="text-sm text-gray-700 capitalize font-medium">{player.position}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                        <span className="text-sm text-gray-700 capitalize font-medium">{player.battingStyle}</span>
                      </div>
                      {player.bowlingStyle && player.bowlingStyle !== 'none' && (
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                          <span className="text-sm text-gray-700 capitalize font-medium">{player.bowlingStyle}</span>
                        </div>
                      )}
                    </div>
                    <div className="flex gap-2">
                      <button 
                        onClick={() => handleEditPlayer(player)}
                        className="flex-1 px-3 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white text-sm rounded-xl hover:from-blue-600 hover:to-blue-700 transition-all duration-200 font-medium shadow-md hover:shadow-lg"
                      >
                        Edit
                      </button>
                      <button 
                        onClick={() => handleRemovePlayerFromSquad(player._id, player.firstName, player.lastName)}
                        className="flex-1 px-3 py-2 bg-gradient-to-r from-red-500 to-red-600 text-white text-sm rounded-xl hover:from-red-600 hover:to-red-700 transition-all duration-200 font-medium shadow-md hover:shadow-lg"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <div className="w-24 h-24 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Users className="text-gray-400" size={48} />
              </div>
              <h3 className="text-xl font-semibold text-gray-700 mb-2">No players in the squad yet</h3>
              <p className="text-gray-500 mb-6 max-w-md mx-auto">Start building your team by adding players to the squad. You can search and filter from all available players.</p>
              <button
                onClick={() => setShowSearchModal(true)}
                className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-8 py-3 rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all duration-200 font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 flex items-center gap-3 mx-auto"
              >
                <Plus size={20} />
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

      {/* Edit Player Modal */}
      <EditPlayerModal
        showModal={showEditPlayerModal}
        onClose={handleCloseEditModal}
        player={editingPlayer}
      />
    </div>
  );
});

TeamDetails.displayName = 'TeamDetails';

export default TeamDetails;