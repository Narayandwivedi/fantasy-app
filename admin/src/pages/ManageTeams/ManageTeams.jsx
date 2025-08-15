import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { AppContext } from "../../context/AppContext";
import { toast } from "react-toastify";
import { Plus, Search, Edit3, Trash2, Filter, Users, Crown, Star, TrendingUp, Award, Shield } from "lucide-react";
import { useNavigate } from "react-router-dom";
import AddTeamModal from "./AddTeamModal";
import EditTeamModal from "./EditTeamModal";

const ManageTeams = () => {
  const [allTeams, setAllTeams] = useState([]);
  const [allPlayers, setAllPlayers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterSport, setFilterSport] = useState("all");
  const [showAddTeamModal, setShowAddTeamModal] = useState(false);
  const [showEditTeamModal, setShowEditTeamModal] = useState(false);
  const [editingTeam, setEditingTeam] = useState(null);
  const [loading, setLoading] = useState(false);
  const [playersLoading, setPlayersLoading] = useState(false);
  const { BACKEND_URL } = useContext(AppContext);

  const navigate = useNavigate();

  // Combine all form data into one object
  const [formData, setFormData] = useState({
    teamName: "",
    shortName: "",
    logo: null,
    sport: "cricket",
    captain: "",
    viceCaptain: "",
    teamSquad: [],
  });

  // Fetch all teams
  const fetchAllTeams = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get(`${BACKEND_URL}/api/teams`);
      if (data.success) {
        setAllTeams(data.allTeams);
      }
    } catch (err) {
      console.error("Error fetching teams:", err);
      toast.error("Failed to fetch teams");
    } finally {
      setLoading(false);
    }
  };

  const fetchAllPlayers = async () => {
    try {
      setPlayersLoading(true);
      const { data } = await axios.get(`${BACKEND_URL}/api/players`);
      if (data.success) {
        setAllPlayers(data.allPlayers);
      }
    } catch (err) {
      console.error("Error fetching players:", err);
      toast.error("Failed to fetch players");
    } finally {
      setPlayersLoading(false);
    }
  };

  const handleAddTeam = async () => {
    if (
      !formData.teamName ||
      !formData.shortName ||
      formData.teamSquad.length === 0
    ) {
      toast.error(
        "Please fill in all required fields and add at least one player"
      );
      return;
    }

    try {
      setLoading(true);

      // Find captain and vice captain ObjectIds
      const captainPlayer = formData.teamSquad.find(
        (player) =>
          `${player.firstName} ${player.lastName}` === formData.captain
      );
      const viceCaptainPlayer = formData.teamSquad.find(
        (player) =>
          `${player.firstName} ${player.lastName}` === formData.viceCaptain
      );

      // upload team image
      let imageUrl = '';
      if (formData.logo) {
        const form = new FormData();
        form.append("team", formData.logo);
        const res = await axios.post(`${BACKEND_URL}/api/upload/team`, form, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        imageUrl = res.data.image_url;
      }

      const teamData = {
        name: formData.teamName,
        shortName: formData.shortName,
        logo: imageUrl,
        sport: formData.sport,
        captain: captainPlayer ? captainPlayer._id || captainPlayer.id : null,
        viceCaptain: viceCaptainPlayer
          ? viceCaptainPlayer._id || viceCaptainPlayer.id
          : null,
        squad: formData.teamSquad.map((player) => player._id || player.id),
      };

      const { data } = await axios.post(`${BACKEND_URL}/api/teams`, teamData);
      if (data.success) {
        toast.success("Team added successfully!");
        fetchAllTeams();
        // Reset form
        setFormData({
          teamName: "",
          shortName: "",
          logo: "",
          sport: "cricket",
          captain: "",
          viceCaptain: "",
          teamSquad: [],
        });
        setShowAddTeamModal(false);
      }
    } catch (error) {
      console.error("Error adding team:", error);
      toast.error(
        error.response?.data?.message || "Error adding team. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleCloseModal = () => {
    setShowAddTeamModal(false);
    // Reset form when closing
    setFormData({
      teamName: "",
      shortName: "",
      logo: "",
      sport: "cricket",
      captain: "",
      viceCaptain: "",
      teamSquad: [],
    });
  };

  const handleDeleteTeam = async (teamId) => {
    if (window.confirm("Are you sure you want to delete this team?")) {
      try {
        const { data } = await axios.delete(
          `${BACKEND_URL}/api/admin/teams/${teamId}`
        );
        if (data.success) {
          toast.success("Team deleted successfully!");
          fetchAllTeams();
        }
      } catch (error) {
        console.error("Error deleting team:", error);
        toast.error("Error deleting team. Please try again.");
      }
    }
  };

  // Handle edit team
  const handleEditTeam = (team) => {
    setEditingTeam(team);
    setShowEditTeamModal(true);
  };

  // Handle close edit team modal
  const handleCloseEditTeamModal = () => {
    setShowEditTeamModal(false);
    setEditingTeam(null);
  };

  // Handle team updated callback
  const handleTeamUpdated = (updatedTeam) => {
    setAllTeams(prevTeams => 
      prevTeams.map(team => 
        team._id === updatedTeam._id ? updatedTeam : team
      )
    );
    setShowEditTeamModal(false);
    setEditingTeam(null);
  };

  // Filter teams based on search and filters
  const filteredTeams = allTeams.filter((team) => {
    const matchesSearch =
      team.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      team.shortName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSport = filterSport === "all" || team.sport === filterSport;

    return matchesSearch && matchesSport;
  });

  useEffect(() => {
    fetchAllTeams();
    fetchAllPlayers();
  }, []);

  if (loading && allTeams.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/20 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-200 border-t-blue-600 mx-auto"></div>
          <p className="mt-6 text-slate-600 font-medium">Loading teams...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/20">
      {/* Header */}
      <div className="relative bg-white shadow-xl border-b border-slate-200/60 backdrop-blur-sm">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-purple-500/5"></div>
        <div className="relative max-w-7xl mx-auto px-6 py-8">
          <div className="flex justify-between items-center">
            <div>
              <div className="flex items-center space-x-3 mb-2">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
                  <Users size={24} className="text-white" />
                </div>
                <div>
                  <h1 className="text-4xl font-bold text-slate-800 tracking-tight">Team Management</h1>
                  <p className="text-slate-600 font-medium mt-1">
                    Manage your sports teams and squads
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-6 mt-4">
                <div className="flex items-center space-x-2 bg-blue-50 px-3 py-1.5 rounded-full border border-blue-200">
                  <TrendingUp size={14} className="text-blue-600" />
                  <span className="text-blue-700 text-sm font-semibold">{allTeams.length} Teams</span>
                </div>
                <div className="flex items-center space-x-2 bg-emerald-50 px-3 py-1.5 rounded-full border border-emerald-200">
                  <Award size={14} className="text-emerald-600" />
                  <span className="text-emerald-700 text-sm font-semibold">
                    {filteredTeams.length} Active
                  </span>
                </div>
              </div>
            </div>
            <button
              onClick={() => setShowAddTeamModal(true)}
              className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-2xl hover:from-blue-700 hover:to-purple-700 transition-all duration-200 flex items-center gap-3 font-semibold shadow-xl hover:shadow-2xl hover:scale-105"
            >
              <Plus size={20} />
              Create New Team
            </button>
          </div>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="bg-white/80 backdrop-blur-sm p-6 rounded-2xl shadow-lg border border-white/20 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            {/* Search */}
            <div className="relative md:col-span-2">
              <Search
                className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400"
                size={18}
              />
              <input
                type="text"
                placeholder="Search teams by name or short name..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-3.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white/70 backdrop-blur-sm font-medium"
              />
            </div>

            {/* Sport Filter */}
            <select
              value={filterSport}
              onChange={(e) => setFilterSport(e.target.value)}
              className="border border-slate-200 px-4 py-3.5 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white/70 backdrop-blur-sm font-medium"
            >
              <option value="all">All Sports</option>
              <option value="cricket">Cricket</option>
              <option value="football">Football</option>
            </select>

            {/* Clear Filters */}
            <button
              onClick={() => {
                setSearchTerm("");
                setFilterSport("all");
              }}
              className="bg-slate-100 hover:bg-slate-200 text-slate-700 px-6 py-3.5 rounded-xl transition-all duration-200 flex items-center justify-center gap-2 font-medium hover:scale-105"
            >
              <Filter size={16} />
              Clear
            </button>

            {/* Results count */}
            <div className="flex items-center justify-center bg-gradient-to-r from-emerald-50 to-green-50 border border-emerald-200 rounded-xl px-4">
              <span className="text-emerald-700 font-semibold text-sm">
                {filteredTeams.length} Results
              </span>
            </div>
          </div>
        </div>

        {/* Teams Grid */}
        {filteredTeams.length === 0 ? (
          <div className="bg-white/60 backdrop-blur-sm rounded-2xl shadow-lg p-16 text-center border border-white/20">
            <div className="w-20 h-20 bg-gradient-to-br from-slate-200 to-slate-300 rounded-full flex items-center justify-center mx-auto mb-6">
              <Users size={32} className="text-slate-500" />
            </div>
            <h3 className="text-2xl font-bold text-slate-800 mb-3">
              No teams found
            </h3>
            <p className="text-slate-600 font-medium">
              Try adjusting your search or filters, or create a new team
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredTeams.map((team) => (
              <div
                key={team._id}
                className="group bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 border border-white/20 hover:scale-105 overflow-hidden relative"
              >
                {/* Team Header with Logo */}
                <div className="relative bg-gradient-to-br from-slate-100 to-slate-200 p-6">
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-purple-500/10"></div>
                  
                  {/* Action Buttons */}
                  <div className="action-buttons absolute top-3 right-3 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-20">
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        handleEditTeam(team);
                      }}
                      className="bg-white/95 backdrop-blur-sm p-2.5 rounded-xl hover:bg-white transition-all duration-200 shadow-lg hover:shadow-xl hover:scale-110 cursor-pointer relative z-30"
                      title="Edit team"
                      style={{ pointerEvents: 'auto' }}
                    >
                      <Edit3 size={14} className="text-slate-600" />
                    </button>
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        handleDeleteTeam(team._id);
                      }}
                      className="bg-white/95 backdrop-blur-sm p-2.5 rounded-xl hover:bg-red-50 transition-all duration-200 shadow-lg hover:shadow-xl hover:scale-110 cursor-pointer relative z-30"
                      title="Delete team"
                      style={{ pointerEvents: 'auto' }}
                    >
                      <Trash2 size={14} className="text-red-500" />
                    </button>
                  </div>

                  {/* Team Logo */}
                  <div className="relative flex justify-center mb-4">
                    <div className="w-20 h-20 bg-white rounded-2xl shadow-lg p-3 flex items-center justify-center">
                      {team.logo ? (
                        <img
                          src={`${BACKEND_URL}${team.logo}`}
                          alt={team.name}
                          className="w-full h-full object-contain rounded-xl"
                        />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-slate-300 to-slate-400 rounded-xl flex items-center justify-center text-slate-600 font-bold text-lg">
                          {team.name[0]}
                        </div>
                      )}
                    </div>
                    <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-full flex items-center justify-center">
                      <Star size={12} className="text-white" />
                    </div>
                  </div>

                  {/* Team Name and Short Name */}
                  <div className="text-center relative z-10">
                    <h3 className="text-xl font-bold text-slate-800 mb-1 group-hover:text-blue-600 transition-colors">
                      {team.name}
                    </h3>
                    <div className="inline-flex items-center bg-gradient-to-r from-blue-100 to-purple-100 text-blue-800 text-xs font-bold px-3 py-1.5 rounded-full border border-blue-200">
                      {team.shortName}
                    </div>
                  </div>
                </div>

                {/* Team Details */}
                <div
                  className="p-6 cursor-pointer relative z-10"
                  onClick={(e) => {
                    // Only navigate if the click didn't come from action buttons
                    if (!e.target.closest('.action-buttons')) {
                      navigate(`/team-detail/${team._id}`);
                    }
                  }}
                >
                  <div className="space-y-4">
                    {/* Sport and Squad Size */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <div className={`w-8 h-8 rounded-xl flex items-center justify-center ${
                          team.sport === 'cricket' ? 'bg-green-100 text-green-600' :
                          team.sport === 'football' ? 'bg-orange-100 text-orange-600' :
                          'bg-blue-100 text-blue-600'
                        }`}>
                          {team.sport === 'cricket' ? <Shield size={14} /> : <Award size={14} />}
                        </div>
                        <span className="text-slate-700 font-semibold capitalize">{team.sport}</span>
                      </div>
                      <div className="flex items-center space-x-2 bg-slate-100 px-3 py-1.5 rounded-lg">
                        <Users size={12} className="text-slate-600" />
                        <span className="text-slate-700 font-semibold text-sm">
                          {team.squad ? team.squad.length : 0} players
                        </span>
                      </div>
                    </div>

                    {/* Captain and Vice Captain */}
                    <div className="space-y-2">
                      {team.captain && (
                        <div className="flex items-center space-x-2 bg-gradient-to-r from-yellow-50 to-amber-50 px-3 py-2 rounded-lg border border-yellow-200">
                          <Crown size={14} className="text-yellow-600" />
                          <span className="text-yellow-800 font-medium text-sm">Captain:</span>
                          <span className="text-yellow-900 font-semibold text-sm">
                            {team.captain.firstName} {team.captain.lastName}
                          </span>
                        </div>
                      )}

                      {team.viceCaptain && (
                        <div className="flex items-center space-x-2 bg-gradient-to-r from-blue-50 to-indigo-50 px-3 py-2 rounded-lg border border-blue-200">
                          <Crown size={14} className="text-blue-600" />
                          <span className="text-blue-800 font-medium text-sm">Vice Captain:</span>
                          <span className="text-blue-900 font-semibold text-sm">
                            {team.viceCaptain.firstName} {team.viceCaptain.lastName}
                          </span>
                        </div>
                      )}
                    </div>

                    {/* View Details Button */}
                    <div className="pt-2 border-t border-slate-200">
                      <div className="flex items-center justify-center text-blue-600 font-medium text-sm group-hover:text-blue-700 transition-colors">
                        <span>View Team Details</span>
                        <TrendingUp size={14} className="ml-2 group-hover:translate-x-1 transition-transform" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Add Team Modal */}
      <AddTeamModal
        showModal={showAddTeamModal}
        onClose={handleCloseModal}
        formData={formData}
        setFormData={setFormData}
        onSubmit={handleAddTeam}
        allPlayers={allPlayers}
        loading={loading}
      />

      {/* Edit Team Modal */}
      <EditTeamModal
        showModal={showEditTeamModal}
        onClose={handleCloseEditTeamModal}
        team={editingTeam}
        onTeamUpdated={handleTeamUpdated}
      />
    </div>
  );
};

export default ManageTeams;