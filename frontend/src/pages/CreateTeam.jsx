import axios from 'axios'
import React, { useState, useContext, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { AppContext } from '../context/AppContext'
import { toast } from 'react-toastify'

// Add custom CSS for hiding scrollbar
const scrollbarHideStyle = `
  .scrollbar-hide {
    -ms-overflow-style: none;  /* Internet Explorer 10+ */
    scrollbar-width: none;  /* Firefox */
  }
  .scrollbar-hide::-webkit-scrollbar { 
    display: none;  /* Safari and Chrome */
  }
`

const CreateTeam = () => {
  const { matchId } = useParams()
  const navigate = useNavigate()
  const { BACKEND_URL, user } = useContext(AppContext)
  
  const [matchData, setMatchData] = useState(null)
  const [selectedPlayers, setSelectedPlayers] = useState([])
  const [activeTab, setActiveTab] = useState('wicket-keeper')
  const [loading, setLoading] = useState(true)
  const [showPreview, setShowPreview] = useState(false)
  const [showCaptainSelection, setShowCaptainSelection] = useState(false)
  const [captain, setCaptain] = useState(null)
  const [viceCaptain, setViceCaptain] = useState(null)
  const [saving, setSaving] = useState(false)

  const fetchAllPlayers = async () => {
    try {
      setLoading(true)
      const { data } = await axios.get(`${BACKEND_URL}/api/matches/${matchId}/players`)
      console.log(data)
      if (data.success) {
        setMatchData(data.data)
      }
    } catch (error) {
      console.error("Error fetching players:", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchAllPlayers()
  }, [])

  const handlePlayerSelect = (player, teamType) => {
    const isSelected = selectedPlayers.some(p => p._id === player._id)
    
    if (isSelected) {
      setSelectedPlayers(selectedPlayers.filter(p => p._id !== player._id))
      return
    }

    if (selectedPlayers.length >= 11) {
      alert("You can only select 11 players")
      return
    }

    const playerCredits = player.fantasyPrice || 8
    const currentCreditsUsed = getTotalCreditsUsed()
    
    if (currentCreditsUsed + playerCredits > 100) {
      alert(`Not enough credits! You need ${playerCredits} credits but only have ${100 - currentCreditsUsed} remaining.`)
      return
    }

    setSelectedPlayers([...selectedPlayers, { ...player, teamType }])
  }

  const getTeamComposition = () => {
    const composition = {
      batsman: selectedPlayers.filter(p => p.position === 'batsman').length,
      bowler: selectedPlayers.filter(p => p.position === 'bowler').length,
      'all-rounder': selectedPlayers.filter(p => p.position === 'all-rounder').length,
      'wicket-keeper': selectedPlayers.filter(p => p.position === 'wicket-keeper').length,
      team1: selectedPlayers.filter(p => p.teamType === 'team1').length,
      team2: selectedPlayers.filter(p => p.teamType === 'team2').length
    }
    return composition
  }

  const getTotalCreditsUsed = () => {
    return selectedPlayers.reduce((total, player) => {
      const credits = player.fantasyPrice || 8
      return total + credits
    }, 0)
  }

  const getCreditsRemaining = () => {
    return 100 - getTotalCreditsUsed()
  }

  const isValidTeam = () => {
    return selectedPlayers.length >= 11
  }

  const isPlayerSelected = (playerId) => {
    return selectedPlayers.some(p => p._id === playerId)
  }

  const getPositionColor = (position) => {
    switch (position) {
      case 'batsman': return 'bg-green-100 text-green-800'
      case 'bowler': return 'bg-blue-100 text-blue-800'
      case 'all-rounder': return 'bg-purple-100 text-purple-800'
      case 'wicket-keeper': return 'bg-yellow-100 text-yellow-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getAllPlayersByPosition = () => {
    if (!matchData) return {}
    
    const allPlayers = [...matchData.team1.squad, ...matchData.team2.squad]
    const playersByPosition = {
      'wicket-keeper': [],
      'batsman': [],
      'all-rounder': [],
      'bowler': []
    }

    allPlayers.forEach(player => {
      const teamType = matchData.team1.squad.find(p => p._id === player._id) ? 'team1' : 'team2'
      const teamData = teamType === 'team1' ? matchData.team1 : matchData.team2
      
      if (playersByPosition[player.position]) {
        playersByPosition[player.position].push({
          ...player,
          teamType,
          teamData
        })
      }
    })

    return playersByPosition
  }

  const getPositionTabs = () => [
    { key: 'wicket-keeper', label: 'WK', fullName: 'Wicket Keeper' },
    { key: 'batsman', label: 'BAT', fullName: 'Batsman' },
    { key: 'all-rounder', label: 'AR', fullName: 'All Rounder' },
    { key: 'bowler', label: 'BOWL', fullName: 'Bowler' }
  ]

  const getSelectedPlayersByPosition = () => {
    return {
      'wicket-keeper': selectedPlayers.filter(p => p.position === 'wicket-keeper'),
      'batsman': selectedPlayers.filter(p => p.position === 'batsman'),
      'all-rounder': selectedPlayers.filter(p => p.position === 'all-rounder'),
      'bowler': selectedPlayers.filter(p => p.position === 'bowler')
    }
  }

  const handleCaptainSelect = (player) => {
    if (captain && captain._id === player._id) {
      setCaptain(null)
    } else {
      setCaptain(player)
      if (viceCaptain && viceCaptain._id === player._id) {
        setViceCaptain(null)
      }
    }
  }

  const handleViceCaptainSelect = (player) => {
    if (viceCaptain && viceCaptain._id === player._id) {
      setViceCaptain(null)
    } else {
      setViceCaptain(player)
      if (captain && captain._id === player._id) {
        setCaptain(null)
      }
    }
  }

  const handleSaveTeam = async () => {
    if (!captain || !viceCaptain) {
      toast.error('Please select both captain and vice-captain')
      return
    }
    
    setSaving(true)
    
    const teamData = {
      userId: user?._id,
      matchId: matchId,
      players: selectedPlayers.map(player => player._id),
      captainId: captain._id,
      viceCaptainId: viceCaptain._id
    }
    
    try {
      const response = await axios.post(`${BACKEND_URL}/api/userteam`, teamData)
      console.log('Team saved:', response.data)
      navigate(`/${matchId}/contest`)
      // Show success toast with quick duration
      toast.success('Team created successfully! 🎉', {
        position: "top-center",
        autoClose: 600,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: false,
        draggable: true,
      })
      
    } catch (error) {
      console.error('Error saving team:', error)
      toast.error('Failed to save team. Please try again.', {
        position: "top-center",
        autoClose: 3000,
      })
    }
    
    setSaving(false)
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-lg">Loading players...</div>
      </div>
    )
  }

  if (!matchData) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-lg text-red-500">Failed to load match data</div>
      </div>
    )
  }

  return (
    <div className="bg-gray-50 min-h-screen pb-32 max-w-md mx-auto">
      <style>{scrollbarHideStyle}</style>
      {/* Header - Dark Theme */}
      <div className="bg-gradient-to-r from-gray-900 via-slate-900 to-black shadow-xl p-4">
        <h1 className="text-xl font-bold text-center text-white">Create Your Team</h1>
        <div className="text-center text-sm text-gray-300 mt-1">
          Select 11 players ({selectedPlayers.length}/11)
        </div>
        
        {/* Credits Display */}
        <div className="flex justify-center items-center mt-3 space-x-6">
          <div className="flex items-center space-x-2">
            <span className="text-gray-300 text-sm">Players</span>
            <span className="bg-blue-500 bg-opacity-20 text-blue-300 px-3 py-1 rounded-full text-sm font-medium border border-blue-500 border-opacity-30">
              {selectedPlayers.length}/11
            </span>
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-gray-300 text-sm">Credits Left</span>
            <span className={`px-3 py-1 rounded-full text-sm font-medium border ${
              getCreditsRemaining() < 0 
                ? 'bg-red-500 bg-opacity-20 text-red-300 border-red-500 border-opacity-30'
                : getCreditsRemaining() <= 10
                ? 'bg-yellow-500 bg-opacity-20 text-yellow-300 border-yellow-500 border-opacity-30'
                : 'bg-green-500 bg-opacity-20 text-green-300 border-green-500 border-opacity-30'
            }`}>
              {getCreditsRemaining()}
            </span>
          </div>
        </div>
      </div>

      {/* Team Selection Counts - Dark Theme */}
      <div className="bg-gradient-to-r from-slate-800 via-gray-800 to-slate-900 border-b border-gray-700 p-4">
        <div className="flex justify-center space-x-8">
          <div className="flex items-center space-x-2">
            {matchData.team1.logo && (
              <img src={`${BACKEND_URL}${matchData.team1.logo}`} alt={matchData.team1.name} className="w-6 h-6" />
            )}
            <span className="font-medium text-white">{matchData.team1.shortName}</span>
            <span className="bg-blue-500 bg-opacity-20 text-blue-300 px-2 py-1 rounded-full text-xs font-medium border border-blue-500 border-opacity-30">
              {getTeamComposition().team1}
            </span>
          </div>
          <div className="flex items-center space-x-2">
            {matchData.team2.logo && (
              <img src={`${BACKEND_URL}${matchData.team2.logo}`} alt={matchData.team2.name} className="w-6 h-6" />
            )}
            <span className="font-medium text-white">{matchData.team2.shortName}</span>
            <span className="bg-red-500 bg-opacity-20 text-red-300 px-2 py-1 rounded-full text-xs font-medium border border-red-500 border-opacity-30">
              {getTeamComposition().team2}
            </span>
          </div>
        </div>
      </div>

      {/* Position Tabs - Dark Background */}
      <div className="bg-slate-800 border-b border-gray-600">
        <div className="flex">
          {getPositionTabs().map((tab) => (
            <button
              key={tab.key}
              className={`flex-1 py-3 px-2 text-center font-medium border-b-2 transition-all duration-200 ${
                activeTab === tab.key 
                  ? 'border-yellow-400 text-yellow-400 bg-yellow-400 bg-opacity-10' 
                  : 'border-transparent text-gray-300 hover:text-yellow-300 hover:bg-yellow-400 hover:bg-opacity-5'
              }`}
              onClick={() => setActiveTab(tab.key)}
            >
              <div className="text-xs font-bold">{tab.label} ({getSelectedPlayersByPosition()[tab.key]?.length || 0})</div>
            </button>
          ))}
        </div>
      </div>

      {/* Players List by Position */}
      <div className="p-4">
        <div className="space-y-3">
          {getAllPlayersByPosition()[activeTab]?.map((player) => (
            <div
              key={player._id}
              className={`bg-white rounded-lg p-4 border-2 transition-all ${
                isPlayerSelected(player._id) 
                  ? 'border-green-500 bg-green-50' 
                  : 'border-gray-200'
              }`}
              onClick={() => handlePlayerSelect(player, player.teamType)}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center relative">
                    {player.imgLink ? (
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
          ))}
        </div>
      </div>

      {/* Fixed Bottom Buttons */}
      <div className="fixed bottom-0 left-1/2 transform -translate-x-1/2 w-full max-w-md bg-white border-t border-gray-200 p-4 shadow-lg md:border-l md:border-r md:rounded-t-lg">
        <div className="flex space-x-4">
          <button
            className="flex-1 bg-slate-700 text-white py-3 px-6 rounded-lg font-medium flex items-center justify-center space-x-2 hover:bg-slate-800 transition-colors"
            onClick={() => setShowPreview(true)}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
            <span>PREVIEW</span>
          </button>
          <button
            className={`flex-1 py-3 px-6 rounded-lg font-medium transition-colors ${
              isValidTeam() 
                ? 'bg-green-500 text-white hover:bg-green-600' 
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
            disabled={!isValidTeam()}
            onClick={() => {
              if (isValidTeam()) {
                setShowCaptainSelection(true)
              }
            }}
          >
            NEXT
          </button>
        </div>
      </div>

      {/* Preview Modal */}
      {showPreview && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-end justify-center z-50" style={{paddingTop: '35px'}}>
          <div className="bg-gradient-to-b from-green-600 to-green-800 w-full md:max-w-md h-full overflow-y-auto relative">
            {/* Close Button - Absolute positioned */}
            <button
              onClick={() => setShowPreview(false)}
              className="absolute top-4 right-4 text-white hover:text-gray-300 p-2 z-10"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            {/* Ground View - Full Height */}
            <div className="h-full flex flex-col justify-center space-y-6 py-4">
              {/* Wicket Keepers - Always at Top */}
              <div>
                <div>
                <h3 className="text-white text-xs mb-2 text-center">WICKET-KEEPERS</h3>
                <div className="space-y-4">
                  {Array.from({ length: Math.ceil(getSelectedPlayersByPosition()['wicket-keeper'].length / 3) }, (_, rowIndex) => (
                    <div key={rowIndex} className="flex justify-around">
                      {getSelectedPlayersByPosition()['wicket-keeper'].slice(rowIndex * 3, (rowIndex + 1) * 3).map((player) => (
                        <div key={player._id} className="flex flex-col items-center">
                          {player.imgLink ? (
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
                          {player.imgLink ? (
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
                          {player.imgLink ? (
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
                          {player.imgLink ? (
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
      )}

      {/* Captain Selection Modal */}
      {showCaptainSelection && (
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
                          {player.imgLink ? (
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
                            <span className="font-bold text-sm">C</span>
                          </button>
                          <button
                            onClick={() => handleViceCaptainSelect(player)}
                            className={`w-10 h-10 rounded-full border-2 flex items-center justify-center transition-all ${
                              viceCaptain && viceCaptain._id === player._id
                                ? 'bg-purple-600 border-purple-600 text-white'
                                : 'bg-white border-gray-300 text-gray-500 hover:border-purple-400'
                            }`}
                          >
                            <span className="font-bold text-xs">VC</span>
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
      )}

    </div>
  )
}

export default CreateTeam