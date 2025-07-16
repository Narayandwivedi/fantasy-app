import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { AppContext } from "../../context/AppContext";
import { toast } from "react-toastify";
import { Plus, Search, Edit3, Trash2, Filter, Users, Crown } from "lucide-react";
import { useNavigate } from "react-router-dom";
import AddTeamModal from "./AddTeamModal";

const ManageTeams = () => {
  const [allTeams, setAllTeams] = useState([]);
  const [allPlayers, setAllPlayers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterSport, setFilterSport] = useState("all");
  const [showAddTeamModal, setShowAddTeamModal] = useState(false);
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
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading teams...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Manage Teams</h1>
              <p className="text-gray-600 mt-1">
                Total Teams: {allTeams.length}
              </p>
            </div>
            <button
              onClick={() => setShowAddTeamModal(true)}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition flex items-center gap-2 font-medium"
            >
              <Plus size={20} />
              Add Team
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
              <Search
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                size={20}
              />
              <input
                type="text"
                placeholder="Search teams by name or short name..."
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

            {/* Clear Filters */}
            <button
              onClick={() => {
                setSearchTerm("");
                setFilterSport("all");
              }}
              className="bg-gray-100 text-gray-700 px-4 py-3 rounded-lg hover:bg-gray-200 transition flex items-center justify-center gap-2"
            >
              <Filter size={18} />
              Clear Filters
            </button>
          </div>
        </div>

        {/* Teams Grid */}
        {filteredTeams.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm p-12 text-center">
            <div className="text-gray-400 mb-4">
              <Users size={48} className="mx-auto" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No teams found
            </h3>
            <p className="text-gray-600">
              Try adjusting your search or filters
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredTeams.map((team) => (
              <div
                key={team._id}
                className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow border border-gray-200"
              >
                <div className="relative">
                  <img
                    src={`${BACKEND_URL}${team.logo}`}
                    alt={team.name}
                    className="w-full h-48 object-cover rounded-t-lg"
                  />

                  {/* Edit and Delete buttons */}
                  <div className="absolute top-3 right-3 flex gap-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        // Handle edit functionality
                      }}
                      className="bg-white bg-opacity-90 p-2 rounded-full hover:bg-opacity-100 transition"
                    >
                      <Edit3 size={16} className="text-gray-600" />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteTeam(team._id);
                      }}
                      className="bg-white bg-opacity-90 p-2 rounded-full hover:bg-opacity-100 transition"
                    >
                      <Trash2 size={16} className="text-red-600" />
                    </button>
                  </div>
                </div>

                {/* Team name and short name */}
                <div
                  className="p-4 cursor-pointer"
                  onClick={() => navigate(`/team-detail/${team._id}`)}
                >
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-lg font-bold text-gray-900">
                      {team.name}
                    </h3>
                    <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2 py-1 rounded">
                      {team.shortName}
                    </span>
                  </div>

                  <div className="space-y-2 text-sm text-gray-600">
                    <p>
                      <span className="font-medium text-gray-800">Sport:</span>{" "}
                      {team.sport}
                    </p>
                    <p>
                      <span className="font-medium text-gray-800">
                        Squad Size:
                      </span>{" "}
                      {team.squad ? team.squad.length : 0} players
                    </p>

                    {team.captain && (
                      <div className="flex items-center gap-1">
                        <Crown size={14} className="text-yellow-500" />
                        <span className="font-medium text-gray-800">
                          Captain:
                        </span>
                        <span>
                          {team.captain.firstName} {team.captain.lastName}
                        </span>
                      </div>
                    )}

                    {team.viceCaptain && (
                      <div className="flex items-center gap-1">
                        <Crown size={14} className="text-blue-500" />
                        <span className="font-medium text-gray-800">
                          Vice Captain:
                        </span>
                        <span>
                          {team.viceCaptain.firstName}{" "}
                          {team.viceCaptain.lastName}
                        </span>
                      </div>
                    )}
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
    </div>
  );
};

export default ManageTeams;