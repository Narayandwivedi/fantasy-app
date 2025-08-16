import React from 'react'

const PlayersList = ({ 
  getAllPlayersByPosition, 
  activeTab, 
  isPlayerSelected, 
  canSelectPosition, 
  handlePlayerSelect, 
  getPositionColor, 
  BACKEND_URL, 
  supportsWebP 
}) => {
  return (
    <div className="p-4">
      <div className="space-y-3">
        {getAllPlayersByPosition()[activeTab]?.map((player) => {
          const isSelected = isPlayerSelected(player._id)
          const canSelect = isSelected || canSelectPosition(player.position)
          
          return (
          <div
            key={player._id}
            className={`rounded-lg p-4 border-2 transition-all ${
              isSelected 
                ? 'border-green-500 bg-green-50' 
                : canSelect
                ? 'bg-white border-gray-200 cursor-pointer hover:border-gray-300'
                : 'bg-gray-100 border-gray-200 opacity-50 cursor-not-allowed'
            }`}
            onClick={() => {
              if (canSelect) {
                handlePlayerSelect(player, player.teamType)
              }
            }}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center relative">
                  {player.imgLink && supportsWebP ? (
                    <>
                      <img 
                        src={`${BACKEND_URL}${player.imgLink}`} 
                        alt={`${player.firstName} ${player.lastName}`}
                        className="w-16 h-16 rounded-full object-cover"
                      />
                      <div className="absolute bottom-0 left-0 bg-black bg-opacity-70 text-white px-1 py-0.5 rounded-br-full rounded-tl-lg font-medium" style={{fontSize: '10px'}}>
                        {player.teamData.shortName}
                      </div>
                    </>
                  ) : (
                    <>
                      <span className="text-sm font-bold text-gray-600">
                        {player.firstName.charAt(0)}{player.lastName.charAt(0)}
                      </span>
                      <div className="absolute bottom-0 left-0 bg-black bg-opacity-70 text-white px-1 py-0.5 rounded-br-full rounded-tl-lg font-medium" style={{fontSize: '10px'}}>
                        {player.teamData.shortName}
                      </div>
                    </>
                  )}
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-sm">{player.firstName.charAt(0)} {player.lastName}</h3>
                  <div className="mt-1">
                    <span className={`px-2 py-0.5 rounded-full font-medium ${getPositionColor(player.position)}`} style={{fontSize: '10px'}}>
                      {player.position.toUpperCase()}
                    </span>
                  </div>
                </div>
              </div>
              <div className="text-right ml-3">
                <div className="flex flex-col items-end space-y-2">
                  <div className="text-xs text-gray-600">
                    <div className="font-medium">₹{player.fantasyPrice || 8}</div>
                    <div className="text-gray-500">Credits</div>
                  </div>
                  <div className="w-6 h-6 rounded-full border-2 flex items-center justify-center">
                    {isPlayerSelected(player._id) && (
                      <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )})}
      </div>
    </div>
  )
}

export default PlayersList