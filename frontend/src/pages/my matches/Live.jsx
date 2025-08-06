import React, { useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import { AppContext } from '../../context/AppContext'

const Live = ({ matches = [] }) => {
  const { BACKEND_URL } = useContext(AppContext)
  const navigate = useNavigate()

  const handleMatchClick = (matchId) => {
    console.log('Clicking live match with ID:', matchId)
    navigate(`/my-contests/${matchId}`)
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', { 
      day: 'numeric', 
      month: 'short' 
    })
  }

  const formatTime = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleTimeString('en-US', { 
      hour: 'numeric', 
      minute: '2-digit',
      hour12: true 
    })
  }

  const getSportIcon = (sport) => {
    const icons = {
      cricket: '🏏',
      football: '⚽',
      basketball: '🏀',
      kabaddi: '🤼'
    }
    return icons[sport] || '🏏'
  }

  const getTeamLogo = (team) => {
    if (team?.logo) {
      return `${BACKEND_URL}${team.logo}`
    }
    return null
  }

  return (
    <div className="space-y-4">
      {matches.length > 0 ? (
        matches.map((match) => (
          <div 
            key={match.matchId} 
            onClick={() => handleMatchClick(match.matchId)}
            className="bg-white rounded-xl p-4 shadow-sm border-l-4 border-green-500 cursor-pointer hover:shadow-md transition-shadow"
          >
            {/* Match Header */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-2">
                <div className="bg-gray-100 px-2 py-1 rounded text-xs font-medium text-gray-600">
                  {match.matchType}
                </div>
                <span className="text-sm text-gray-600">{match.series}</span>
              </div>
              {/* Date and Time */}
              <div className="text-right">
                <div className="text-xs text-gray-500">{formatDate(match.startTime)} • {formatTime(match.startTime)}</div>
              </div>
            </div>

            {/* Teams in same row */}
            <div className="flex items-center justify-center space-x-8 mb-4">
              {/* Team 1 */}
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center overflow-hidden">
                  {getTeamLogo(match.team1) ? (
                    <img 
                      src={getTeamLogo(match.team1)} 
                      alt={match.team1?.name}
                      className="w-full h-full object-cover rounded-full"
                      onError={(e) => {
                        e.target.style.display = 'none'
                        e.target.nextSibling.style.display = 'block'
                      }}
                    />
                  ) : null}
                  <span className="text-xs font-bold text-gray-600" style={{ display: getTeamLogo(match.team1) ? 'none' : 'block' }}>
                    {match.team1?.shortName?.charAt(0) || '🏏'}
                  </span>
                </div>
                <div className="font-medium text-gray-900 text-sm">{match.team1?.shortName || match.team1?.name}</div>
              </div>

              {/* VS */}
              <div className="text-xs text-gray-500 font-medium">VS</div>

              {/* Team 2 */}
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center overflow-hidden">
                  {getTeamLogo(match.team2) ? (
                    <img 
                      src={getTeamLogo(match.team2)} 
                      alt={match.team2?.name}
                      className="w-full h-full object-cover rounded-full"
                      onError={(e) => {
                        e.target.style.display = 'none'
                        e.target.nextSibling.style.display = 'block'
                      }}
                    />
                  ) : null}
                  <span className="text-xs font-bold text-gray-600" style={{ display: getTeamLogo(match.team2) ? 'none' : 'block' }}>
                    {match.team2?.shortName?.charAt(0) || '🏏'}
                  </span>
                </div>
                <div className="font-medium text-gray-900 text-sm">{match.team2?.shortName || match.team2?.name}</div>
              </div>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between pt-3 border-t border-gray-100">
              <div className="text-xs text-gray-600">
                {match.contestsCount} Contest{match.contestsCount !== 1 ? 's' : ''}
              </div>
              <div className="bg-green-100 text-green-800 px-2 py-1 rounded text-xs font-medium">
                LIVE
              </div>
            </div>
          </div>
        ))
      ) : (
        <div className="text-center py-12">
          <div className="text-gray-500 text-lg mb-2">No Live Matches</div>
          <div className="text-gray-400 text-sm">Check back later for live matches</div>
        </div>
      )}
    </div>
  )
}

export default Live
