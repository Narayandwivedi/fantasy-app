import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const MatchCard = ({ match, BACKEND_URL, onStatusChange }) => {
  const [isUpdating, setIsUpdating] = useState(false);
  const [showStatusMenu, setShowStatusMenu] = useState(false);

  const navigate = useNavigate();
  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case "live":
        return "bg-red-100 text-red-800 border-red-200";
      case "upcoming":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "completed":
        return "bg-green-100 text-green-800 border-green-200";
      case "cancelled":
        return "bg-gray-100 text-gray-800 border-gray-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const formatDateTime = (dateString) => {
    if (!dateString) return "TBD";
    return new Date(dateString).toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };

  const handleStatusChange = async (newStatus) => {
    try {
      setIsUpdating(true);
      setShowStatusMenu(false);

      const response = await axios.put(
        `${BACKEND_URL}/api/matches/${match._id}/status`,
        {
          status: newStatus,
        }
      );

      // Call parent callback to refresh data
      if (onStatusChange) {
        onStatusChange(match._id, newStatus);
      }

      console.log("Status updated successfully:", response.data);
    } catch (error) {
      console.error("Error updating match status:", error);
      alert("Failed to update match status. Please try again.");
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div
      className="bg-white shadow-lg cursor-pointer rounded-xl overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border border-gray-100"
    >
      {/* Header with Status */}
      <div className="bg-gradient-to-r from-violet-500 to-purple-600 px-4 py-3 flex justify-between items-center">
        <div className="text-white text-sm font-medium">
          {match.series || "Tournament"}
        </div>
        <div className="flex items-center space-x-2">
          <div
            className={`px-3 py-1 rounded-full text-xs font-semibold border ${getStatusColor(
              match.status
            )}`}
          >
            {match.status?.toUpperCase() || "SCHEDULED"}
          </div>

          {/* Status Change Button - Only show for upcoming matches */}
          {
            <div className="relative">
              <button
                onClick={() => setShowStatusMenu(!showStatusMenu)}
                disabled={isUpdating}
                className="bg-white bg-opacity-20 hover:bg-opacity-30 text-white p-1.5 rounded-full transition-all duration-200 disabled:opacity-50"
                title="Change Status"
              >
                {isUpdating ? (
                  <svg
                    className="w-4 h-4 animate-spin"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                    />
                  </svg>
                ) : (
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z"
                    />
                  </svg>
                )}
              </button>

              {/* Status Menu Dropdown */}
              {showStatusMenu && (
                <div className="absolute top-full right-0 mt-2 bg-white rounded-lg shadow-xl border border-gray-200 z-10 min-w-40">
                  {/* Show different options based on current status */}
                  {match.status !== "upcoming" && (
                    <button
                      onClick={() => handleStatusChange("upcoming")}
                      className="w-full px-4 py-2 text-left text-sm text-blue-700 hover:bg-blue-50 rounded-t-lg flex items-center space-x-2"
                    >
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      <span>Make Upcoming</span>
                    </button>
                  )}
                  
                  {match.status !== "live" && (
                    <button
                      onClick={() => handleStatusChange("live")}
                      className={`w-full px-4 py-2 text-left text-sm text-red-700 hover:bg-red-50 flex items-center space-x-2 ${
                        match.status === "upcoming" ? "rounded-t-lg" : ""
                      }`}
                    >
                      <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                      <span>Make Live</span>
                    </button>
                  )}
                  
                  {match.status !== "completed" && (
                    <button
                      onClick={() => handleStatusChange("completed")}
                      className="w-full px-4 py-2 text-left text-sm text-green-700 hover:bg-green-50 flex items-center space-x-2"
                    >
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span>Mark Completed</span>
                    </button>
                  )}

                  {match.status !== "cancelled" && (
                    <button
                      onClick={() => handleStatusChange("cancelled")}
                      className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 rounded-b-lg flex items-center space-x-2"
                    >
                      <div className="w-2 h-2 bg-gray-500 rounded-full"></div>
                      <span>Cancel Match</span>
                    </button>
                  )}
                </div>
              )}
            </div>
          }
        </div>
      </div>

      {/* Teams Section */}
      <div  onClick={() => {
        navigate(`/matches/${match._id}`);
      }} className="p-4">
        <div className="flex items-center justify-between mb-4">
          {/* Team 1 */}
          <div className="flex items-center space-x-3 flex-1">
            <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-gray-200 flex-shrink-0">
              <img
                src={`${BACKEND_URL}${match.team1?.logo}`}
                alt={match.team1?.name || "Team 1"}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="min-w-0 flex-1">
              <p className="font-semibold text-gray-900 truncate text-sm">
                {match.team1?.name || "Team 1"}
              </p>
            </div>
          </div>

          {/* VS Divider */}
          <div className="mx-3 flex-shrink-0">
            <div className="bg-gray-100 rounded-full px-3 py-1">
              <span className="text-xs font-bold text-gray-600">VS</span>
            </div>
          </div>

          {/* Team 2 */}
          <div className="flex items-center space-x-3 flex-1 justify-end">
            <div className="min-w-0 flex-1 text-right">
              <p className="font-semibold text-gray-900 truncate text-sm">
                {match.team2?.name || "Team 2"}
              </p>
            </div>
            <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-gray-200 flex-shrink-0">
              <img
                src={`${BACKEND_URL}${match.team2?.logo}`}
                alt={match.team2?.name || "Team 2"}
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>

        {/* Match Details */}
        <div className="space-y-2 text-sm">
          <div className="flex items-center justify-between">
            <span className="text-gray-600">Sport:</span>
            <span className="font-medium text-gray-900">
              {match.sport || "N/A"}
            </span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-gray-600">Type:</span>
            <span className="font-medium text-gray-900">
              {match.matchType || "N/A"}
            </span>
          </div>
        </div>

        {/* Time Information */}
        <div className="mt-4 pt-3 border-t border-gray-100">
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center space-x-2">
              <svg
                className="w-4 h-4 text-gray-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <span className="text-gray-600">Start:</span>
            </div>
            <span className="font-medium text-gray-900">
              {formatDateTime(match.startTime)}
            </span>
          </div>

          {match.endTime && (
            <div className="flex items-center justify-between text-sm mt-1">
              <div className="flex items-center space-x-2">
                <svg
                  className="w-4 h-4 text-gray-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <span className="text-gray-600">End:</span>
              </div>
              <span className="font-medium text-gray-900">
                {formatDateTime(match.endTime)}
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MatchCard;
