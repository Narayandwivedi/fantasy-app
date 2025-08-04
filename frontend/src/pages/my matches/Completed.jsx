import React, { useContext } from 'react'
import { AppContext } from '../../context/AppContext'

const Completed = ({ matches = [] }) => {
  const { BACKEND_URL } = useContext(AppContext)

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', { 
      day: 'numeric', 
      month: 'short',
      year: 'numeric'
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
          <div key={match.matchId} className="bg-white rounded-xl p-4 shadow-sm border-l-4 border-gray-400">
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
                <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center overflow-hidden">
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
                <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center overflow-hidden">
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
              <div className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs font-medium">
                COMPLETED
              </div>
            </div>
          </div>
        ))
      ) : (
        <div className="text-center py-12">
          <div className="text-gray-500 text-lg mb-2">No Completed Matches</div>
          <div className="text-gray-400 text-sm">Your completed matches will appear here</div>
        </div>
      )}
    </div>
  )
}

export default Completed
