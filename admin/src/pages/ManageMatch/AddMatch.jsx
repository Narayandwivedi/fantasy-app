import React, { useState, useEffect } from "react";
import axios from "axios";
import { useContext } from "react";
import { AppContext } from "../../context/AppContext";

const AddMatch = ({ onClose }) => {
  const [formData, setFormData] = useState({
    team1: "",
    team2: "",
    matchType: "",
    series: "",
    startTime: "",
    sport: "cricket"
  });
  const [team1Search, setTeam1Search] = useState("");
  const [team2Search, setTeam2Search] = useState("");
  const [team1Results, setTeam1Results] = useState([]);
  const [team2Results, setTeam2Results] = useState([]);
  const [showTeam1Results, setShowTeam1Results] = useState(false);
  const [showTeam2Results, setShowTeam2Results] = useState(false);
  const [loading, setLoading] = useState(false);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [error, setError] = useState("");

  const { BACKEND_URL } = useContext(AppContext);

  const handleSearchTeams = async (keyword, setResults) => {
    if (keyword.length < 2) {
      setResults([]);
      return;
    }

    try {
      setLoading(true);
      const response = await axios.get(
        `${BACKEND_URL}/api/search/teams/${keyword}`
      );
      setResults(response.data.data);
      setLoading(false);
    } catch (error) {
      console.error("Error searching teams:", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (team1Search) {
        handleSearchTeams(team1Search, setTeam1Results);
      } else {
        setTeam1Results([]);
      }
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [team1Search]);

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (team2Search) {
        handleSearchTeams(team2Search, setTeam2Results);
      } else {
        setTeam2Results([]);
      }
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [team2Search]);

  const handleTeamSelect = (team, isTeam1) => {
    if (isTeam1) {
      setFormData({ ...formData, team1: team._id });
      setTeam1Search(team.name);
      setShowTeam1Results(false);
    } else {
      setFormData({ ...formData, team2: team._id });
      setTeam2Search(team.name);
      setShowTeam2Results(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    
    // Validate form data
    if (!formData.team1 || !formData.team2) {
      setError("Please select both teams");
      return;
    }
    
    if (formData.team1 === formData.team2) {
      setError("Team 1 and Team 2 cannot be the same");
      return;
    }
    
    if (!formData.matchType) {
      setError("Please select a match type");
      return;
    }
    
    if (!formData.startTime) {
      setError("Please select a start time");
      return;
    }

    try {
      setSubmitLoading(true);
      const response = await axios.post(
        `${BACKEND_URL}/api/matches`,
        formData
      );
      
      // Reset form and close modal on success
      setFormData({
        team1: "",
        team2: "",
        matchType: "",
        series: "",
        startTime: "",
        sport: "cricket"
      });
      setTeam1Search("");
      setTeam2Search("");
      onClose();
    } catch (error) {
      console.error("Error creating match:", error);
      setError(error.response?.data?.message || "Failed to create match");
    } finally {
      setSubmitLoading(false);
    }
  };

  return (
    <div>
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
        <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Add New Match</h2>
            <button
              onClick={() => onClose()}
              className="text-gray-500 hover:text-gray-700"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="text-red-500 text-sm p-2 bg-red-50 rounded-md">
                {error}
              </div>
            )}

            <div className="relative">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Team 1
              </label>
              <input
                className="w-full border border-gray-300 px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-violet-500"
                placeholder="Search team 1"
                type="text"
                value={team1Search}
                onChange={(e) => {
                  setTeam1Search(e.target.value);
                  setShowTeam1Results(true);
                }}
                onFocus={() => setShowTeam1Results(true)}
              />
              {showTeam1Results && team1Results.length > 0 && (
                <ul className="absolute z-10 mt-1 w-full bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-auto">
                  {team1Results.map((team) => (
                    <li
                      key={team._id}
                      className="px-4 py-2 hover:bg-gray-100 cursor-pointer flex items-center"
                      onClick={() => handleTeamSelect(team, true)}
                    >
                      {team.logo ? (
                        <img
                          src={`${BACKEND_URL}${team.logo}`}
                          alt={`${team.name} logo`}
                          className="w-6 h-6 mr-2 object-contain"
                        />
                      ) : (
                        <div className="w-6 h-6 mr-2 bg-gray-200 rounded-full flex items-center justify-center text-xs">
                          {team.name.charAt(0)}
                        </div>
                      )}
                      <span>{team.name}</span>
                    </li>
                  ))}
                </ul>
              )}
              {loading && team1Search && (
                <div className="absolute inset-y-0 right-0 flex items-center pr-3 mt-6">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-violet-500"></div>
                </div>
              )}
            </div>

            <div className="relative">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Team 2
              </label>
              <input
                className="w-full border border-gray-300 px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-violet-500"
                placeholder="Search team 2"
                type="text"
                value={team2Search}
                onChange={(e) => {
                  setTeam2Search(e.target.value);
                  setShowTeam2Results(true);
                }}
                onFocus={() => setShowTeam2Results(true)}
              />
              {showTeam2Results && team2Results.length > 0 && (
                <ul className="absolute z-10 mt-1 w-full bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-auto">
                  {team2Results.map((team) => (
                    <li
                      key={team._id}
                      className="px-4 py-2 hover:bg-gray-100 cursor-pointer flex items-center"
                      onClick={() => handleTeamSelect(team, false)}
                    >
                      {team.logo ? (
                        <img
                          src={`${BACKEND_URL}${team.logo}`}
                          alt={`${team.name} logo`}
                          className="w-6 h-6 mr-2 object-contain"
                        />
                      ) : (
                        <div className="w-6 h-6 mr-2 bg-gray-200 rounded-full flex items-center justify-center text-xs">
                          {team.name.charAt(0)}
                        </div>
                      )}
                      <span>{team.name}</span>
                    </li>
                  ))}
                </ul>
              )}
              {loading && team2Search && (
                <div className="absolute inset-y-0 right-0 flex items-center pr-3 mt-6">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-violet-500"></div>
                </div>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Match Type
              </label>
              <select
                className="w-full border border-gray-300 px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-violet-500"
                name="matchType"
                value={formData.matchType}
                onChange={handleChange}
                required
              >
                <option value="">Select match type</option>
                <option value="T20">T20</option>
                <option value="T10">T10</option>
                <option value="ODI">ODI</option>
                <option value="Test">Test Match</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Series
              </label>
              <input
                className="w-full border border-gray-300 px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-violet-500"
                placeholder="Enter series name"
                type="text"
                name="series"
                value={formData.series}
                onChange={handleChange}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Start Time
              </label>
              <input
                className="w-full border border-gray-300 px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-violet-500"
                type="datetime-local"
                name="startTime"
                value={formData.startTime}
                onChange={handleChange}
                required
              />
            </div>

            <button
              type="submit"
              className="w-full bg-violet-500 text-white py-2 rounded-md hover:bg-violet-600 transition-colors disabled:bg-violet-300"
              disabled={submitLoading}
            >
              {submitLoading ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  Creating...
                </div>
              ) : (
                "Create Match"
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddMatch;