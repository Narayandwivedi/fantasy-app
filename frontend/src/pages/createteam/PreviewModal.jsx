import React from 'react'

const PreviewModal = ({ 
  showPreview, 
  setShowPreview, 
  getSelectedPlayersByPosition, 
  BACKEND_URL, 
  supportsWebP 
}) => {
  if (!showPreview) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-end justify-center z-50" style={{paddingTop: '35px'}}>
      <div className="w-full md:max-w-md h-full overflow-y-auto relative">
        {/* Realistic Cricket Ground Background */}
        <div className="absolute inset-0">
          {/* Base green background */}
          <div className="absolute inset-0 bg-green-600"></div>
          
          {/* Vertical grass stripes */}
          <div 
            className="absolute inset-0"
            style={{
              background: `repeating-linear-gradient(
                90deg,
                #16a34a 0px,
                #16a34a 40px,
                #15803d 40px,
                #15803d 80px
              )`
            }}
          ></div>
          
          {/* Ground Area */}
          <div className="absolute inset-8 md:inset-16">
            <div className="w-full h-full relative">
              {/* Pitch */}
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                <div className="w-8 h-24 bg-gradient-to-b from-amber-100 via-amber-200 to-amber-100 rounded shadow-lg opacity-60">
                </div>
              </div>
              
              {/* Boundary rope indication - More visible */}
              <div className="absolute inset-2 border-2 border-white border-opacity-60 rounded-full"></div>
              
              {/* MYSERIES11 Text with Embedded Grass Effect - Top */}
              <div className="absolute top-12 left-1/2 transform -translate-x-1/2">
                <div className="text-lg font-black tracking-wider" style={{
                  color: 'rgba(255, 255, 255, 0.25)',
                  textShadow: `
                    0 1px 0 rgba(255,255,255,0.3),
                    0 -1px 0 rgba(0,0,0,0.4),
                    0 2px 4px rgba(0,0,0,0.3),
                    inset 0 1px 0 rgba(255,255,255,0.2),
                    inset 0 -1px 0 rgba(0,0,0,0.2)
                  `,
                  WebkitTextStroke: '1px rgba(34, 197, 94, 0.3)',
                  letterSpacing: '2px',
                  fontWeight: '900'
                }}>
                  MYSERIES11
                </div>
              </div>

              {/* MYSERIES11 Text with Embedded Grass Effect - Bottom */}
              <div className="absolute bottom-12 left-1/2 transform -translate-x-1/2">
                <div className="text-lg font-black tracking-wider" style={{
                  color: 'rgba(255, 255, 255, 0.25)',
                  textShadow: `
                    0 1px 0 rgba(255,255,255,0.3),
                    0 -1px 0 rgba(0,0,0,0.4),
                    0 2px 4px rgba(0,0,0,0.3),
                    inset 0 1px 0 rgba(255,255,255,0.2),
                    inset 0 -1px 0 rgba(0,0,0,0.2)
                  `,
                  WebkitTextStroke: '1px rgba(34, 197, 94, 0.3)',
                  letterSpacing: '2px',
                  fontWeight: '900'
                }}>
                  MYSERIES11
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* Close Button - Absolute positioned */}
        <button
          onClick={() => setShowPreview(false)}
          className="absolute top-4 right-4 text-white hover:text-gray-300 p-2 z-20"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* Ground View - Full Height */}
        <div className="h-full flex flex-col justify-center space-y-6 py-4 relative z-10">
          {/* Wicket Keepers - Always at Top */}
          <div>
            <div>
            <h3 className="text-white text-xs mb-2 text-center">WICKET-KEEPERS</h3>
            <div className="space-y-4">
              {Array.from({ length: Math.ceil(getSelectedPlayersByPosition()['wicket-keeper'].length / 3) }, (_, rowIndex) => (
                <div key={rowIndex} className="flex justify-around">
                  {getSelectedPlayersByPosition()['wicket-keeper'].slice(rowIndex * 3, (rowIndex + 1) * 3).map((player) => (
                    <div key={player._id} className="flex flex-col items-center">
                      {player.imgLink && supportsWebP ? (
                        <img 
                          src={`${BACKEND_URL}${player.imgLink}`} 
                          alt={`${player.firstName} ${player.lastName}`}
                          className="w-14 h-14 object-cover"
                        />
                      ) : (
                        <div className="w-14 h-14 bg-gray-400 rounded-full flex items-center justify-center shadow-lg">
                          <span className="text-xs font-bold text-white">
                            {player.firstName.charAt(0)}{player.lastName.charAt(0)}
                          </span>
                        </div>
                      )}
                      <div className="bg-black bg-opacity-80 text-white px-2 py-1">
                        <div className="text-xs font-medium truncate">{player.firstName.charAt(0)} {player.lastName}</div>
                      </div>
                      <div className="text-white text-xs font-medium mt-1">{player.fantasyPrice || 8} Cr</div>
                    </div>
                  ))}
                </div>
              ))}
            </div>
            </div>
          </div>

          {/* Batsmen - Always in 2nd Position */}
          <div>
            <div>
            <h3 className="text-white text-xs mb-2 text-center">BATTERS</h3>
            <div className="space-y-4">
              {Array.from({ length: Math.ceil(getSelectedPlayersByPosition()['batsman'].length / 3) }, (_, rowIndex) => (
                <div key={rowIndex} className="flex justify-around">
                  {getSelectedPlayersByPosition()['batsman'].slice(rowIndex * 3, (rowIndex + 1) * 3).map((player) => (
                    <div key={player._id} className="flex flex-col items-center">
                      {player.imgLink && supportsWebP ? (
                        <img 
                          src={`${BACKEND_URL}${player.imgLink}`} 
                          alt={`${player.firstName} ${player.lastName}`}
                          className="w-14 h-14 object-cover"
                        />
                      ) : (
                        <div className="w-14 h-14 bg-gray-400 rounded-full flex items-center justify-center shadow-lg">
                          <span className="text-xs font-bold text-white">
                            {player.firstName.charAt(0)}{player.lastName.charAt(0)}
                          </span>
                        </div>
                      )}
                      <div className="bg-black bg-opacity-80 text-white px-2 py-1">
                        <div className="text-xs font-medium truncate">{player.firstName.charAt(0)} {player.lastName}</div>
                      </div>
                      <div className="text-white text-xs font-medium mt-1">{player.fantasyPrice || 8} Cr</div>
                    </div>
                  ))}
                </div>
              ))}
            </div>
            </div>
          </div>

          {/* All Rounders - Always in 3rd Position */}
          <div>
            <div>
            <h3 className="text-white text-xs mb-2 text-center">ALL-ROUNDERS</h3>
            <div className="space-y-4">
              {Array.from({ length: Math.ceil(getSelectedPlayersByPosition()['all-rounder'].length / 3) }, (_, rowIndex) => (
                <div key={rowIndex} className="flex justify-around">
                  {getSelectedPlayersByPosition()['all-rounder'].slice(rowIndex * 3, (rowIndex + 1) * 3).map((player) => (
                    <div key={player._id} className="flex flex-col items-center">
                      {player.imgLink && supportsWebP ? (
                        <img 
                          src={`${BACKEND_URL}${player.imgLink}`} 
                          alt={`${player.firstName} ${player.lastName}`}
                          className="w-14 h-14 object-cover"
                        />
                      ) : (
                        <div className="w-14 h-14 bg-gray-400 rounded-full flex items-center justify-center shadow-lg">
                          <span className="text-xs font-bold text-white">
                            {player.firstName.charAt(0)}{player.lastName.charAt(0)}
                          </span>
                        </div>
                      )}
                      <div className="bg-black bg-opacity-80 text-white px-2 py-1">
                        <div className="text-xs font-medium truncate">{player.firstName.charAt(0)} {player.lastName}</div>
                      </div>
                      <div className="text-white text-xs font-medium mt-1">{player.fantasyPrice || 8} Cr</div>
                    </div>
                  ))}
                </div>
              ))}
            </div>
            </div>
          </div>

          {/* Bowlers - Always at Bottom */}
          <div>
            <div>
            <h3 className="text-white text-xs mb-2 text-center">BOWLERS</h3>
            <div className="space-y-4">
              {Array.from({ length: Math.ceil(getSelectedPlayersByPosition()['bowler'].length / 3) }, (_, rowIndex) => (
                <div key={rowIndex} className="flex justify-around">
                  {getSelectedPlayersByPosition()['bowler'].slice(rowIndex * 3, (rowIndex + 1) * 3).map((player) => (
                    <div key={player._id} className="flex flex-col items-center">
                      {player.imgLink && supportsWebP ? (
                        <img 
                          src={`${BACKEND_URL}${player.imgLink}`} 
                          alt={`${player.firstName} ${player.lastName}`}
                          className="w-14 h-14 object-cover"
                        />
                      ) : (
                        <div className="w-14 h-14 bg-gray-400 rounded-full flex items-center justify-center shadow-lg">
                          <span className="text-xs font-bold text-white">
                            {player.firstName.charAt(0)}{player.lastName.charAt(0)}
                          </span>
                        </div>
                      )}
                      <div className="bg-black bg-opacity-80 text-white px-2 py-1">
                        <div className="text-xs font-medium truncate">{player.firstName.charAt(0)} {player.lastName}</div>
                      </div>
                      <div className="text-white text-xs font-medium mt-1">{player.fantasyPrice || 8} Cr</div>
                    </div>
                  ))}
                </div>
              ))}
            </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default PreviewModal