import React from 'react'

const CaptainSelectionModal = ({ 
  showCaptainSelection, 
  setShowCaptainSelection, 
  selectedPlayers, 
  captain, 
  viceCaptain, 
  handleCaptainSelect, 
  handleViceCaptainSelect, 
  handleSaveTeam, 
  saving, 
  matchData, 
  BACKEND_URL, 
  supportsWebP 
}) => {
  if (!showCaptainSelection) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-80 z-50 flex justify-center">
      <div className="bg-gray-50 h-full w-full max-w-md overflow-y-auto scrollbar-hide">
        {/* Header */}
        <div className="bg-gradient-to-r from-gray-900 via-slate-900 to-black shadow-xl p-4 border-b border-gray-700">
          <div className="flex items-center justify-between">
            <button
              onClick={() => setShowCaptainSelection(false)}
              className="text-white hover:text-gray-300"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <div className="flex-1 text-center">
              <h1 className="text-xl font-bold text-white">Create Team</h1>
              <p className="text-sm text-gray-300">5h 15m left</p>
            </div>
            <div className="w-6 h-6"></div>
          </div>
        </div>

        {/* Captain Info Section */}
        <div className="px-4 py-4">
          <h2 className="text-xl font-semibold text-gray-800 mb-4 text-center">
            Select Captain and Vice Captain
          </h2>

          {/* Point Multipliers Info */}
          <div className="flex justify-center items-center space-x-8 mb-6">
            <div className="text-center">
              <p className="text-gray-600 text-xs">Captain gets</p>
              <p className="text-gray-800 font-bold text-sm">2x (double) points</p>
            </div>
            
            {/* Vertical Line */}
            <div className="w-px h-12 bg-gray-400"></div>
            
            <div className="text-center">
              <p className="text-gray-600 text-xs">Vice Captain gets</p>
              <p className="text-gray-800 font-bold text-sm">1.5x points</p>
            </div>
          </div>

          {/* Players List */}
          <div className="space-y-1">
            {selectedPlayers.map((player, index) => (
              <div key={player._id} className="bg-white rounded-lg p-3 border-2 border-gray-200">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center relative">
                      {player.imgLink && supportsWebP ? (
                        <>
                          <img 
                            src={`${BACKEND_URL}${player.imgLink}`} 
                            alt={`${player.firstName} ${player.lastName}`}
                            className="w-16 h-16 rounded-full object-cover"
                          />
                          <div className="absolute bottom-0 left-0 bg-black bg-opacity-70 text-white px-1 py-0.5 rounded-br-full rounded-tl-lg font-medium" style={{fontSize: '10px'}}>
                            {player.teamData?.shortName || (player.teamType === 'team1' ? matchData.team1.shortName : matchData.team2.shortName)}
                          </div>
                        </>
                      ) : (
                        <>
                          <span className="text-sm font-bold text-gray-600">
                            {player.firstName.charAt(0)}{player.lastName.charAt(0)}
                          </span>
                          <div className="absolute bottom-0 left-0 bg-black bg-opacity-70 text-white px-1 py-0.5 rounded-br-full rounded-tl-lg font-medium" style={{fontSize: '10px'}}>
                            {player.teamData?.shortName || (player.teamType === 'team1' ? matchData.team1.shortName : matchData.team2.shortName)}
                          </div>
                        </>
                      )}
                    </div>
                    <div>
                      <div className="text-gray-800 font-medium text-sm">
                        {player.firstName.charAt(0)} {player.lastName}
                      </div>
                      <div className="text-gray-600 text-sm">0 pts</div>
                      <div className="flex items-center space-x-1 mt-1">
                        <span className="bg-gray-600 text-white px-1 py-0.5 rounded" style={{fontSize: '10px'}}>
                          {player.position === 'wicket-keeper' ? 'WK' : 
                           player.position === 'bowler' ? 'BOWL' : 
                           player.position.substring(0, 3).toUpperCase()}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-center space-x-2">
                    <div className="flex space-x-3">
                      <button
                        onClick={() => handleCaptainSelect(player)}
                        className={`w-10 h-10 rounded-full border-2 flex items-center justify-center transition-all ${
                          captain && captain._id === player._id
                            ? 'bg-blue-600 border-blue-600 text-white'
                            : 'bg-white border-gray-300 text-gray-500 '
                        }`}
                      >
                        <span className="font-bold text-sm">
                          {captain && captain._id === player._id ? '2x' : 'C'}
                        </span>
                      </button>
                      <button
                        onClick={() => handleViceCaptainSelect(player)}
                        className={`w-10 h-10 rounded-full border-2 flex items-center justify-center transition-all ${
                          viceCaptain && viceCaptain._id === player._id
                            ? 'bg-purple-600 border-purple-600 text-white'
                            : 'bg-white border-gray-300 text-gray-500 hover:border-purple-400'
                        }`}
                      >
                        <span className="font-bold text-xs">
                          {viceCaptain && viceCaptain._id === player._id ? '1.5x' : 'VC'}
                        </span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom Save Button */}
        <div className="fixed bottom-0 left-1/2 transform -translate-x-1/2 w-full max-w-md bg-white border-t border-gray-200 p-4">
          <button
            onClick={handleSaveTeam}
            disabled={!captain || !viceCaptain || saving}
            className={`w-full py-3 px-6 rounded-lg font-medium transition-colors ${
              captain && viceCaptain && !saving
                ? 'bg-green-500 text-white hover:bg-green-600'
                : 'bg-gray-500 text-gray-300 cursor-not-allowed'
            }`}
          >
            {saving ? 'SAVING...' : 'SAVE'}
          </button>
        </div>

        {/* Bottom padding for fixed button */}
        <div className="h-24"></div>
      </div>
    </div>
  )
}

export default CaptainSelectionModal