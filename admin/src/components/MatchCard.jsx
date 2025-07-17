import React from "react";

const MatchCard = ({ match, BACKEND_URL }) => {
  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'live':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'upcoming':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'completed':
        return 'bg-green-100 text-green-800 border-green-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const formatDateTime = (dateString) => {
    if (!dateString) return 'TBD';
    return new Date(dateString).toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  };

  return (
    <div className="bg-white shadow-lg rounded-xl overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border border-gray-100">
      {/* Header with Status */}
      <div className="bg-gradient-to-r from-violet-500 to-purple-600 px-4 py-3 flex justify-between items-center">
        <div className="text-white text-sm font-medium">
          {match.series || 'Tournament'}
        </div>
        <div className={`px-3 py-1 rounded-full text-xs font-semibold border ${getStatusColor(match.status)}`}>
          {match.status?.toUpperCase() || 'SCHEDULED'}
        </div>
      </div>

      {/* Teams Section */}
      <div className="p-4">
        <div className="flex items-center justify-between mb-4">
          {/* Team 1 */}
          <div className="flex items-center space-x-3 flex-1">
            <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-gray-200 flex-shrink-0">
              <img 
                src={`${BACKEND_URL}${match.team1?.logo}`}      
                alt={match.team1?.name || 'Team 1'}
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.target.src = '/api/placeholder/48/48';
                }}
              />
            </div>
            <div className="min-w-0 flex-1">
              <p className="font-semibold text-gray-900 truncate text-sm">
                {match.team1?.name || 'Team 1'}
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
                {match.team2?.name || 'Team 2'}
              </p>
            </div>
            <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-gray-200 flex-shrink-0">
              <img
                src={`${BACKEND_URL}${match.team2?.logo}`}
                alt={match.team2?.name || 'Team 2'}
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.target.src = '/api/placeholder/48/48';
                }}
              />
            </div>
          </div>
        </div>

        {/* Match Details */}
        <div className="space-y-2 text-sm">
          <div className="flex items-center justify-between">
            <span className="text-gray-600">Sport:</span>
            <span className="font-medium text-gray-900">{match.sport || 'N/A'}</span>
          </div>
          
          <div className="flex items-center justify-between">
            <span className="text-gray-600">Type:</span>
            <span className="font-medium text-gray-900">{match.matchType || 'N/A'}</span>
          </div>
          
        </div>

        {/* Time Information */}
        <div className="mt-4 pt-3 border-t border-gray-100">
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center space-x-2">
              <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
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
                <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
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