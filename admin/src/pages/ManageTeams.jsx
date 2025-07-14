import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { AppContext } from "../context/AppContext";
import { toast } from "react-toastify";
import upload_area from "../assets/upload_area.svg";
import {
  Plus,
  Search,
  Edit3,
  Trash2,
  Filter,
  Users,
  Crown,
} from "lucide-react";
import { Form, useNavigate } from "react-router-dom";

// Add Team Modal Component
const AddTeamModal = ({
  showModal,
  onClose,
  formData,
  setFormData,
  onSubmit,
  allPlayers,
  loading,
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredPlayers, setFilteredPlayers] = useState([]);
  const [showPlayerList, setShowPlayerList] = useState(false);

  // Captain search states
  const [captainSearchTerm, setCaptainSearchTerm] = useState("");
  const [filteredCaptainPlayers, setFilteredCaptainPlayers] = useState([]);
  const [showCaptainList, setShowCaptainList] = useState(false);

  // Vice Captain search states
  const [viceCaptainSearchTerm, setViceCaptainSearchTerm] = useState("");
  const [filteredViceCaptainPlayers, setFilteredViceCaptainPlayers] = useState(
    []
  );
  const [showViceCaptainList, setShowViceCaptainList] = useState(false);

  // Reset search terms when modal closes
  useEffect(() => {
    if (!showModal) {
      setSearchTerm("");
      setCaptainSearchTerm("");
      setViceCaptainSearchTerm("");
      setShowPlayerList(false);
      setShowCaptainList(false);
      setShowViceCaptainList(false);
    }
  }, [showModal]);

  // Sync captain search term with selected captain
  useEffect(() => {
    if (formData.captain && captainSearchTerm !== formData.captain) {
      setCaptainSearchTerm(formData.captain);
    }
  }, [formData.captain]);

  // Sync vice captain search term with selected vice captain
  useEffect(() => {
    if (
      formData.viceCaptain &&
      viceCaptainSearchTerm !== formData.viceCaptain
    ) {
      setViceCaptainSearchTerm(formData.viceCaptain);
    }
  }, [formData.viceCaptain]);

  // Filter players based on search term
  useEffect(() => {
    if (searchTerm.trim() === "") {
      setFilteredPlayers([]);
      setShowPlayerList(false);
    } else {
      const filtered = allPlayers.filter(
        (player) =>
          `${player.firstName} ${player.lastName}`
            .toLowerCase()
            .includes(searchTerm.toLowerCase()) &&
          !formData.teamSquad.some(
            (squadPlayer) =>
              (squadPlayer._id || squadPlayer.id) === (player._id || player.id)
          )
      );
      setFilteredPlayers(filtered);
      setShowPlayerList(true);
    }
  }, [searchTerm, allPlayers, formData.teamSquad]);

  // Filter captain players based on search term (only from current squad)
  useEffect(() => {
    if (captainSearchTerm.trim() === "") {
      setFilteredCaptainPlayers([]);
      setShowCaptainList(false);
    } else {
      const filtered = formData.teamSquad.filter((player) =>
        `${player.firstName} ${player.lastName}`
          .toLowerCase()
          .includes(captainSearchTerm.toLowerCase())
      );
      setFilteredCaptainPlayers(filtered);
      setShowCaptainList(true);
    }
  }, [captainSearchTerm, formData.teamSquad]);

  // Filter vice captain players based on search term (only from current squad, excluding captain)
  useEffect(() => {
    if (viceCaptainSearchTerm.trim() === "") {
      setFilteredViceCaptainPlayers([]);
      setShowViceCaptainList(false);
    } else {
      const filtered = formData.teamSquad.filter(
        (player) =>
          `${player.firstName} ${player.lastName}`
            .toLowerCase()
            .includes(viceCaptainSearchTerm.toLowerCase()) &&
          `${player.firstName} ${player.lastName}` !== formData.captain
      );
      setFilteredViceCaptainPlayers(filtered);
      setShowViceCaptainList(true);
    }
  }, [viceCaptainSearchTerm, formData.teamSquad, formData.captain]);

  if (!showModal) return null;

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const addPlayerToSquad = (player) => {
    const playerId = player._id || player.id;
    if (!formData.teamSquad.some((p) => (p._id || p.id) === playerId)) {
      setFormData((prev) => ({
        ...prev,
        teamSquad: [...prev.teamSquad, player],
      }));
      setSearchTerm("");
      setShowPlayerList(false);
    }
  };

  const removePlayerFromSquad = (playerId) => {
    const playerToRemove = formData.teamSquad.find(
      (player) => (player._id || player.id) === playerId
    );

    // Clear captain and vice captain if the removed player was selected
    if (
      playerToRemove &&
      `${playerToRemove.firstName} ${playerToRemove.lastName}` ===
        formData.captain
    ) {
      setFormData((prev) => ({ ...prev, captain: "" }));
      setCaptainSearchTerm("");
    }
    if (
      playerToRemove &&
      `${playerToRemove.firstName} ${playerToRemove.lastName}` ===
        formData.viceCaptain
    ) {
      setFormData((prev) => ({ ...prev, viceCaptain: "" }));
      setViceCaptainSearchTerm("");
    }

    setFormData((prev) => ({
      ...prev,
      teamSquad: prev.teamSquad.filter(
        (player) => (player._id || player.id) !== playerId
      ),
    }));
  };

  const selectCaptain = (player) => {
    setFormData((prev) => ({
      ...prev,
      captain: `${player.firstName} ${player.lastName}`,
    }));
    setCaptainSearchTerm(`${player.firstName} ${player.lastName}`);
    setShowCaptainList(false);

    // If this player was vice captain, clear vice captain
    if (`${player.firstName} ${player.lastName}` === formData.viceCaptain) {
      setFormData((prev) => ({ ...prev, viceCaptain: "" }));
      setViceCaptainSearchTerm("");
    }
  };

  const selectViceCaptain = (player) => {
    setFormData((prev) => ({
      ...prev,
      viceCaptain: `${player.firstName} ${player.lastName}`,
    }));
    setViceCaptainSearchTerm(`${player.firstName} ${player.lastName}`);
    setShowViceCaptainList(false);
  };

  const handleCaptainInputChange = (e) => {
    const value = e.target.value;
    setCaptainSearchTerm(value);

    // If the input is cleared, clear the captain
    if (value === "") {
      setFormData((prev) => ({ ...prev, captain: "" }));
    }
  };

  const handleViceCaptainInputChange = (e) => {
    const value = e.target.value;
    setViceCaptainSearchTerm(value);

    // If the input is cleared, clear the vice captain
    if (value === "") {
      setFormData((prev) => ({ ...prev, viceCaptain: "" }));
    }
  };

  const imageHandler = (e) => {
    const file = e.target.files[0];
    setFormData((prev) => ({ ...prev, logo: file }));
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-6xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Add New Team</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-2xl"
          >
            ✕
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Team Details Form */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Team Details</h3>
            <div className="flex flex-col gap-4">
              {/* team name */}
              <input
                value={formData.teamName}
                onChange={(e) => handleInputChange("teamName", e.target.value)}
                className="border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Team name *"
                type="text"
              />

              {/* team shortname */}

              <input
                value={formData.shortName}
                onChange={(e) => handleInputChange("shortName", e.target.value)}
                className="border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Team short name *"
                type="text"
              />

              {/* upload team logo */}
              <label htmlFor="file-inp">
                <img src={upload_area} alt="" />
              </label>
              <input
                onChange={imageHandler}
                hidden
                id="file-inp"
                className="border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                type="file"
              />

              {/* select team sport */}
              <select
                value={formData.sport}
                onChange={(e) => handleInputChange("sport", e.target.value)}
                className="border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="cricket">Cricket</option>
                <option value="football">Football</option>
              </select>

              {/* Captain Search */}
              <div className="relative">
                <input
                  value={captainSearchTerm}
                  onChange={handleCaptainInputChange}
                  className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Search and select team captain..."
                  type="text"
                  disabled={formData.teamSquad.length === 0}
                />

                {showCaptainList && formData.teamSquad.length > 0 && (
                  <div className="absolute top-full left-0 right-0 bg-white border border-t-0 rounded-b-lg max-h-32 overflow-y-auto z-20 shadow-lg">
                    {filteredCaptainPlayers.length > 0 ? (
                      filteredCaptainPlayers.map((player) => (
                        <div
                          key={player._id || player.id}
                          className="p-2 hover:bg-gray-100 cursor-pointer border-b last:border-b-0"
                          onClick={() => selectCaptain(player)}
                        >
                          <div className="font-medium">
                            {player.firstName} {player.lastName}
                          </div>
                          <div className="text-sm text-gray-600">
                            {player.position || player.role}
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="p-2 text-center text-gray-500">
                        No matching players in squad
                      </div>
                    )}
                  </div>
                )}

                {formData.teamSquad.length === 0 && (
                  <div className="text-sm text-gray-500 mt-1">
                    Add players to squad first
                  </div>
                )}
              </div>

              {/* Vice Captain Search */}
              <div className="relative">
                <input
                  value={viceCaptainSearchTerm}
                  onChange={handleViceCaptainInputChange}
                  className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Search and select team vice captain..."
                  type="text"
                  disabled={formData.teamSquad.length === 0}
                />

                {showViceCaptainList && formData.teamSquad.length > 0 && (
                  <div className="absolute top-full left-0 right-0 bg-white border border-t-0 rounded-b-lg max-h-32 overflow-y-auto z-20 shadow-lg">
                    {filteredViceCaptainPlayers.length > 0 ? (
                      filteredViceCaptainPlayers.map((player) => (
                        <div
                          key={player._id || player.id}
                          className="p-2 hover:bg-gray-100 cursor-pointer border-b last:border-b-0"
                          onClick={() => selectViceCaptain(player)}
                        >
                          <div className="font-medium">
                            {player.firstName} {player.lastName}
                          </div>
                          <div className="text-sm text-gray-600">
                            {player.position || player.role}
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="p-2 text-center text-gray-500">
                        No matching players available
                      </div>
                    )}
                  </div>
                )}

                {formData.teamSquad.length === 0 && (
                  <div className="text-sm text-gray-500 mt-1">
                    Add players to squad first
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Player Search and Squad Management */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Build Squad</h3>

            {/* Player Search */}
            <div className="relative mb-4">
              <input
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Search players by name..."
                type="text"
              />

              {/* Search Results Dropdown */}
              {showPlayerList && (
                <div className="absolute top-full left-0 right-0 bg-white border border-t-0 rounded-b-lg max-h-48 overflow-y-auto z-10 shadow-lg">
                  {loading ? (
                    <div className="p-3 text-center text-gray-500">
                      Loading players...
                    </div>
                  ) : filteredPlayers.length > 0 ? (
                    filteredPlayers.map((player) => (
                      <div
                        key={player._id || player.id}
                        className="p-3 hover:bg-gray-100 cursor-pointer border-b last:border-b-0"
                        onClick={() => addPlayerToSquad(player)}
                      >
                        <div className="flex justify-between items-center">
                          <div>
                            <div className="font-medium">
                              {player.firstName} {player.lastName}
                            </div>
                            <div className="text-sm text-gray-600">
                              {player.position || player.role} •{" "}
                              {player.team || player.currentTeam}
                            </div>
                          </div>
                          <button className="bg-green-500 text-white px-3 py-1 rounded text-sm hover:bg-green-600">
                            Add
                          </button>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="p-3 text-center text-gray-500">
                      No players found
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Current Squad */}
            <div>
              <h4 className="text-md font-medium mb-3">
                Current Squad ({formData.teamSquad.length})
              </h4>

              {formData.captain && (
                <div className="mb-2 p-2 bg-yellow-100 rounded-md border-l-4 border-yellow-500">
                  <span className="text-sm font-medium text-yellow-800">
                    Captain: {formData.captain}
                  </span>
                </div>
              )}

              {formData.viceCaptain && (
                <div className="mb-3 p-2 bg-blue-100 rounded-md border-l-4 border-blue-500">
                  <span className="text-sm font-medium text-blue-800">
                    Vice Captain: {formData.viceCaptain}
                  </span>
                </div>
              )}

              {formData.teamSquad.length === 0 ? (
                <div className="text-gray-500 text-center py-8 border-2 border-dashed border-gray-300 rounded-lg">
                  No players added yet
                </div>
              ) : (
                <div className="space-y-2 max-h-64 overflow-y-auto">
                  {formData.teamSquad.map((player) => (
                    <div
                      key={player._id || player.id}
                      className={`flex justify-between items-center p-3 rounded-lg ${
                        `${player.firstName} ${player.lastName}` ===
                        formData.captain
                          ? "bg-yellow-50 border border-yellow-300"
                          : `${player.firstName} ${player.lastName}` ===
                            formData.viceCaptain
                          ? "bg-blue-50 border border-blue-300"
                          : "bg-gray-50"
                      }`}
                    >
                      <div>
                        <div className="font-medium">
                          {player.firstName} {player.lastName}
                          {`${player.firstName} ${player.lastName}` ===
                            formData.captain && (
                            <span className="ml-2 text-xs bg-yellow-500 text-white px-2 py-1 rounded">
                              C
                            </span>
                          )}
                          {`${player.firstName} ${player.lastName}` ===
                            formData.viceCaptain && (
                            <span className="ml-2 text-xs bg-blue-500 text-white px-2 py-1 rounded">
                              VC
                            </span>
                          )}
                        </div>
                        <div className="text-sm text-gray-600">
                          {player.position || player.role}
                        </div>
                      </div>
                      <button
                        onClick={() =>
                          removePlayerFromSquad(player._id || player.id)
                        }
                        className="bg-red-500 text-white px-3 py-1 rounded text-sm hover:bg-red-600"
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="flex gap-3 mt-6">
          <button
            onClick={onClose}
            className="flex-1 bg-gray-500 text-white py-3 rounded-lg hover:bg-gray-600 transition"
          >
            Cancel
          </button>
          <button
            onClick={onSubmit}
            disabled={
              !formData.teamName ||
              !formData.shortName ||
              formData.teamSquad.length === 0
            }
            className="flex-1 bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition disabled:bg-gray-400"
          >
            Add Team
          </button>
        </div>
      </div>
    </div>
  );
};

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
      let imageUrl = ''
      if (formData.logo) {
        const form = new FormData();
        form.append("team", formData.logo);
      const res =   await axios.post(`${BACKEND_URL}/upload/team`, form, {
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
                    src={team.logo}
                    alt={team.name}
                    className="w-full h-48 object-cover rounded-t-lg"
                    onError={(e) => {
                      e.target.src = "/api/placeholder/400/200";
                    }}
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
