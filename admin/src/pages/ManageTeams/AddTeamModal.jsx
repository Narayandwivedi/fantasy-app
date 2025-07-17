import React, { useState, useEffect } from "react";
import upload_area from "../../assets/upload_area.svg";
import { Crown } from "lucide-react";

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

export default AddTeamModal;