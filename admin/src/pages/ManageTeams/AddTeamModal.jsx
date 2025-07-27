import React, { useState, useEffect } from "react";
import upload_area from "../../assets/upload_area.svg";
import { Crown, Upload, X, User, Users, Star } from "lucide-react";

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
  const [imagePreview, setImagePreview] = useState(null);

  // Captain search states
  const [captainSearchTerm, setCaptainSearchTerm] = useState("");
  const [filteredCaptainPlayers, setFilteredCaptainPlayers] = useState([]);
  const [showCaptainList, setShowCaptainList] = useState(false);

  // Vice Captain search states
  const [viceCaptainSearchTerm, setViceCaptainSearchTerm] = useState("");
  const [filteredViceCaptainPlayers, setFilteredViceCaptainPlayers] = useState( []);
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
      setImagePreview(null);
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
    if (file) {
      setFormData((prev) => ({ ...prev, logo: file }));
      
      // Create preview URL
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setFormData((prev) => ({ ...prev, logo: null }));
    setImagePreview(null);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center p-4 z-50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-7xl max-h-[95vh] overflow-y-auto border border-gray-100">
        <div className="flex justify-between items-center mb-8 pb-4 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
              <Users className="w-5 h-5 text-white" />
            </div>
            <h2 className="text-3xl font-bold text-gray-800">Add New Team</h2>
          </div>
          <button
            onClick={onClose}
            className="w-10 h-10 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors"
          >
            <X className="w-5 h-5 text-gray-600" />
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          {/* Team Details Form */}
          <div className="space-y-6">
            <div className="flex items-center gap-2 mb-6">
              <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                <User className="w-4 h-4 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-800">Team Details</h3>
            </div>
            <div className="space-y-6">
              {/* team name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Team Name <span className="text-red-500">*</span>
                </label>
                <input
                  value={formData.teamName}
                  onChange={(e) => handleInputChange("teamName", e.target.value)}
                  className="w-full border border-gray-300 p-4 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-gray-50 hover:bg-white"
                  placeholder="Enter team name"
                  type="text"
                />
              </div>

              {/* team shortname */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Short Name <span className="text-red-500">*</span>
                </label>
                <input
                  value={formData.shortName}
                  onChange={(e) => handleInputChange("shortName", e.target.value)}
                  className="w-full border border-gray-300 p-4 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-gray-50 hover:bg-white"
                  placeholder="Enter short name (e.g., MI, CSK)"
                  type="text"
                />
              </div>

              {/* upload team logo */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Team Logo
                </label>
                <div className="relative">
                  {imagePreview ? (
                    <div className="relative w-32 h-32 mx-auto">
                      <img
                        src={imagePreview}
                        alt="Team logo preview"
                        className="w-full h-full object-cover rounded-xl border-2 border-gray-200 shadow-sm"
                      />
                      <button
                        type="button"
                        onClick={removeImage}
                        className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 transition-colors"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ) : (
                    <label
                      htmlFor="file-inp"
                      className="cursor-pointer block w-full p-8 border-2 border-dashed border-gray-300 rounded-xl hover:border-blue-400 hover:bg-blue-50 transition-all duration-200 text-center"
                    >
                      <Upload className="w-8 h-8 mx-auto text-gray-400 mb-2" />
                      <p className="text-sm text-gray-600">Click to upload team logo</p>
                      <p className="text-xs text-gray-400 mt-1">PNG, JPG up to 5MB</p>
                    </label>
                  )}
                  <input
                    onChange={imageHandler}
                    hidden
                    id="file-inp"
                    accept="image/*"
                    type="file"
                  />
                </div>
              </div>

              {/* select team sport */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Sport
                </label>
                <select
                  value={formData.sport}
                  onChange={(e) => handleInputChange("sport", e.target.value)}
                  className="w-full border border-gray-300 p-4 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-gray-50 hover:bg-white appearance-none cursor-pointer"
                >
                  <option value="cricket">🏏 Cricket</option>
                  <option value="football">⚽ Football</option>
                </select>
              </div>

              {/* Captain Search */}
              <div className="relative">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Team Captain
                </label>
                <div className="relative">
                  <Crown className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-yellow-500" />
                  <input
                    value={captainSearchTerm}
                    onChange={handleCaptainInputChange}
                    className="w-full border border-gray-300 pl-12 pr-4 py-4 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-gray-50 hover:bg-white disabled:bg-gray-100 disabled:cursor-not-allowed"
                    placeholder="Search and select team captain..."
                    type="text"
                    disabled={formData.teamSquad.length === 0}
                  />
                </div>

                {showCaptainList && formData.teamSquad.length > 0 && (
                  <div className="absolute top-full left-0 right-0 bg-white border rounded-b-xl max-h-40 overflow-y-auto z-20 shadow-lg mt-1">
                    {filteredCaptainPlayers.length > 0 ? (
                      filteredCaptainPlayers.map((player) => (
                        <div
                          key={player._id || player.id}
                          className="p-3 hover:bg-blue-50 cursor-pointer border-b last:border-b-0 transition-colors"
                          onClick={() => selectCaptain(player)}
                        >
                          <div className="flex items-center gap-2">
                            <Crown className="w-4 h-4 text-yellow-500" />
                            <div>
                              <div className="font-medium text-gray-800">
                                {player.firstName} {player.lastName}
                              </div>
                              <div className="text-sm text-gray-600">
                                {player.position || player.role}
                              </div>
                            </div>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="p-3 text-center text-gray-500">
                        No matching players in squad
                      </div>
                    )}
                  </div>
                )}

                {formData.teamSquad.length === 0 && (
                  <div className="text-sm text-gray-500 mt-2 flex items-center gap-1">
                    <Users className="w-4 h-4" />
                    Add players to squad first
                  </div>
                )}
              </div>

              {/* Vice Captain Search */}
              <div className="relative">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Vice Captain
                </label>
                <div className="relative">
                  <Star className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-blue-500" />
                  <input
                    value={viceCaptainSearchTerm}
                    onChange={handleViceCaptainInputChange}
                    className="w-full border border-gray-300 pl-12 pr-4 py-4 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-gray-50 hover:bg-white disabled:bg-gray-100 disabled:cursor-not-allowed"
                    placeholder="Search and select vice captain..."
                    type="text"
                    disabled={formData.teamSquad.length === 0}
                  />
                </div>

                {showViceCaptainList && formData.teamSquad.length > 0 && (
                  <div className="absolute top-full left-0 right-0 bg-white border rounded-b-xl max-h-40 overflow-y-auto z-20 shadow-lg mt-1">
                    {filteredViceCaptainPlayers.length > 0 ? (
                      filteredViceCaptainPlayers.map((player) => (
                        <div
                          key={player._id || player.id}
                          className="p-3 hover:bg-blue-50 cursor-pointer border-b last:border-b-0 transition-colors"
                          onClick={() => selectViceCaptain(player)}
                        >
                          <div className="flex items-center gap-2">
                            <Star className="w-4 h-4 text-blue-500" />
                            <div>
                              <div className="font-medium text-gray-800">
                                {player.firstName} {player.lastName}
                              </div>
                              <div className="text-sm text-gray-600">
                                {player.position || player.role}
                              </div>
                            </div>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="p-3 text-center text-gray-500">
                        No matching players available
                      </div>
                    )}
                  </div>
                )}

                {formData.teamSquad.length === 0 && (
                  <div className="text-sm text-gray-500 mt-2 flex items-center gap-1">
                    <Users className="w-4 h-4" />
                    Add players to squad first
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Player Search and Squad Management */}
          <div className="space-y-6">
            <div className="flex items-center gap-2 mb-6">
              <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                <Users className="w-4 h-4 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-800">Build Squad</h3>
            </div>

            {/* Player Search */}
            <div className="relative">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Search Players
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full border border-gray-300 pl-12 pr-4 py-4 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200 bg-gray-50 hover:bg-white"
                  placeholder="Search players by name..."
                  type="text"
                />
              </div>

              {/* Search Results Dropdown */}
              {showPlayerList && (
                <div className="absolute top-full left-0 right-0 bg-white border rounded-b-xl max-h-56 overflow-y-auto z-10 shadow-lg mt-1">
                  {loading ? (
                    <div className="p-4 text-center text-gray-500">
                      <div className="animate-spin w-5 h-5 border-2 border-blue-500 border-t-transparent rounded-full mx-auto mb-2"></div>
                      Loading players...
                    </div>
                  ) : filteredPlayers.length > 0 ? (
                    filteredPlayers.map((player) => (
                      <div
                        key={player._id || player.id}
                        className="p-4 hover:bg-green-50 cursor-pointer border-b last:border-b-0 transition-colors"
                        onClick={() => addPlayerToSquad(player)}
                      >
                        <div className="flex justify-between items-center">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                              <User className="w-5 h-5 text-gray-600" />
                            </div>
                            <div>
                              <div className="font-medium text-gray-800">
                                {player.firstName} {player.lastName}
                              </div>
                              <div className="text-sm text-gray-600">
                                {player.position || player.role} • {player.team || player.currentTeam}
                              </div>
                            </div>
                          </div>
                          <button className="bg-green-500 text-white px-4 py-2 rounded-lg text-sm hover:bg-green-600 transition-colors font-medium">
                            Add
                          </button>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="p-4 text-center text-gray-500">
                      No players found
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Current Squad */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h4 className="text-lg font-semibold text-gray-800">
                  Current Squad
                </h4>
                <div className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                  {formData.teamSquad.length} players
                </div>
              </div>

              {/* Leadership Cards */}
              {(formData.captain || formData.viceCaptain) && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
                  {formData.captain && (
                    <div className="bg-gradient-to-r from-yellow-50 to-yellow-100 p-3 rounded-xl border border-yellow-200">
                      <div className="flex items-center gap-2">
                        <Crown className="w-5 h-5 text-yellow-600" />
                        <div>
                          <div className="text-xs font-medium text-yellow-600 uppercase tracking-wide">Captain</div>
                          <div className="text-sm font-semibold text-yellow-800">{formData.captain}</div>
                        </div>
                      </div>
                    </div>
                  )}

                  {formData.viceCaptain && (
                    <div className="bg-gradient-to-r from-blue-50 to-blue-100 p-3 rounded-xl border border-blue-200">
                      <div className="flex items-center gap-2">
                        <Star className="w-5 h-5 text-blue-600" />
                        <div>
                          <div className="text-xs font-medium text-blue-600 uppercase tracking-wide">Vice Captain</div>
                          <div className="text-sm font-semibold text-blue-800">{formData.viceCaptain}</div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {formData.teamSquad.length === 0 ? (
                <div className="text-center py-12 border-2 border-dashed border-gray-300 rounded-xl bg-gray-50">
                  <Users className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                  <p className="text-gray-500 font-medium">No players added yet</p>
                  <p className="text-sm text-gray-400 mt-1">Search and add players to build your squad</p>
                </div>
              ) : (
                <div className="space-y-3 max-h-72 overflow-y-auto bg-gray-50 rounded-xl p-3">
                  {formData.teamSquad.map((player) => {
                    const playerName = `${player.firstName} ${player.lastName}`;
                    const isCaptain = playerName === formData.captain;
                    const isViceCaptain = playerName === formData.viceCaptain;
                    
                    return (
                      <div
                        key={player._id || player.id}
                        className={`flex justify-between items-center p-4 rounded-xl border transition-all ${
                          isCaptain
                            ? "bg-gradient-to-r from-yellow-50 to-yellow-100 border-yellow-200 shadow-sm"
                            : isViceCaptain
                            ? "bg-gradient-to-r from-blue-50 to-blue-100 border-blue-200 shadow-sm"
                            : "bg-white border-gray-200 hover:shadow-sm"
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                            isCaptain ? "bg-yellow-200" : isViceCaptain ? "bg-blue-200" : "bg-gray-200"
                          }`}>
                            {isCaptain ? (
                              <Crown className="w-5 h-5 text-yellow-600" />
                            ) : isViceCaptain ? (
                              <Star className="w-5 h-5 text-blue-600" />
                            ) : (
                              <User className="w-5 h-5 text-gray-600" />
                            )}
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-medium text-gray-800">{playerName}</span>
                              {isCaptain && (
                                <span className="text-xs bg-yellow-500 text-white px-2 py-1 rounded-full font-medium">
                                  C
                                </span>
                              )}
                              {isViceCaptain && (
                                <span className="text-xs bg-blue-500 text-white px-2 py-1 rounded-full font-medium">
                                  VC
                                </span>
                              )}
                            </div>
                            <div className="text-sm text-gray-600">
                              {player.position || player.role}
                            </div>
                          </div>
                        </div>
                        <button
                          onClick={() => removePlayerFromSquad(player._id || player.id)}
                          className="bg-red-500 text-white p-2 rounded-lg hover:bg-red-600 transition-colors"
                          title="Remove player"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="flex gap-4 mt-8 pt-6 border-t border-gray-200">
          <button
            onClick={onClose}
            className="flex-1 bg-gray-100 text-gray-700 py-4 rounded-xl hover:bg-gray-200 transition-colors font-medium"
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
            className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 text-white py-4 rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all disabled:from-gray-400 disabled:to-gray-400 disabled:cursor-not-allowed font-medium shadow-lg disabled:shadow-none"
          >
            {loading ? (
              <div className="flex items-center justify-center gap-2">
                <div className="animate-spin w-5 h-5 border-2 border-white border-t-transparent rounded-full"></div>
                Creating Team...
              </div>
            ) : (
              "Add Team"
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddTeamModal;