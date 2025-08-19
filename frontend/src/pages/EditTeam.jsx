import axios from 'axios'
import React, { useState, useContext, useEffect } from 'react'
import { useParams, useNavigate, useSearchParams } from 'react-router-dom'
import { AppContext } from '../context/AppContext'
import { toast } from 'react-toastify'
import { ArrowLeft } from 'lucide-react'
import PreviewModal from './createteam/PreviewModal'
import CaptainSelectionModal from './createteam/CaptainSelectionModal'
import PlayersList from './createteam/PlayersList'

// WebP support detection
const supportsWebP = (() => {
  try {
    return document.createElement('canvas').toDataURL('image/webp').indexOf('data:image/webp') === 0;
  } catch (e) {
    return false;
  }
})();

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

const EditTeam = () => {
  const { matchId, teamId } = useParams()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const { BACKEND_URL, user } = useContext(AppContext)
  
  const fromPage = searchParams.get('from') || 'my-teams' // Default to my-teams if not specified
  
  const getBackNavigationPath = () => {
    switch(fromPage) {
      case 'contest':
        return `/${matchId}/contest`
      case 'my-teams':
      default:
        return `/${matchId}/my-teams`
    }
  }
  
  const handleBackNavigation = () => {
    // Use navigate(-1) to go back in browser history instead of navigating to a specific path
    // This ensures proper browser back button behavior
    navigate(-1)
  }
  
  const [matchData, setMatchData] = useState(null)
  const [teamData, setTeamData] = useState(null)
  const [selectedPlayers, setSelectedPlayers] = useState([])
  const [activeTab, setActiveTab] = useState('wicket-keeper')
  const [loading, setLoading] = useState(true)
  const [showPreview, setShowPreview] = useState(false)
  const [showCaptainSelection, setShowCaptainSelection] = useState(false)
  const [captain, setCaptain] = useState(null)
  const [viceCaptain, setViceCaptain] = useState(null)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState(null)

  const fetchTeamData = async () => {
    try {
      setLoading(true)
      setError(null)
      
      // Fetch team details
      const teamResponse = await axios.get(`${BACKEND_URL}/api/userteam/detail/${teamId}`)
      if (!teamResponse.data.success) {
        throw new Error('Failed to load team data')
      }
      
      const team = teamResponse.data.data
      setTeamData(team)
      
      // Fetch match players
      const matchResponse = await axios.get(`${BACKEND_URL}/api/matches/${matchId}/players`)
      if (!matchResponse.data.success) {
        throw new Error('Failed to load match data')
      }
      
      setMatchData(matchResponse.data.data)
      
      // Set initial selected players from team data
      const playersWithTeamType = team.players.map(playerObj => {
        const player = playerObj.player
        const allPlayers = [...matchResponse.data.data.team1.squad, ...matchResponse.data.data.team2.squad]
        const teamType = matchResponse.data.data.team1.squad.find(p => p._id === player._id) ? 'team1' : 'team2'
        return { ...player, teamType }
      })
      
      setSelectedPlayers(playersWithTeamType)
      setCaptain(team.captain)
      setViceCaptain(team.viceCaptain)
      
    } catch (error) {
      console.error("Error fetching team data:", error)
      setError('Failed to load team data. Please check your connection.')
      toast.error('Failed to load team data. Please check your connection.', { autoClose: 3000 })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (teamId && matchId) {
      fetchTeamData()
    }
  }, [teamId, matchId])


  const handlePlayerSelect = (player, teamType) => {
    const isSelected = selectedPlayers.some(p => p._id === player._id)
    
    if (isSelected) {
      setSelectedPlayers(selectedPlayers.filter(p => p._id !== player._id))
      return
    }

    // Check if we can select this position
    if (!canSelectPosition(player.position)) {
      toast.error(`Cannot select more ${player.position}s. You need to select required positions first.`, { autoClose: 3000 })
      return
    }

    if (selectedPlayers.length >= 11) {
      toast.error("You can only select 11 players", { autoClose: 2000 })
      return
    }

    const playerCredits = player.fantasyPrice || 8
    const currentCreditsUsed = getTotalCreditsUsed()
    
    if (currentCreditsUsed + playerCredits > 100) {
      toast.error(`Not enough credits! You need ${playerCredits} credits but only have ${100 - currentCreditsUsed} remaining.`, { autoClose: 4000 })
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

  const getTeamValidation = () => {
    const composition = getTeamComposition()
    const missing = []
    
    if (selectedPlayers.length < 11) {
      missing.push(`${11 - selectedPlayers.length} more players`)
    }
    if (composition['wicket-keeper'] < 1) {
      missing.push('1 Wicket-Keeper')
    }
    if (composition['batsman'] < 1) {
      missing.push('1 Batsman')
    }
    if (composition['all-rounder'] < 1) {
      missing.push('1 All-Rounder')
    }
    if (composition['bowler'] < 1) {
      missing.push('1 Bowler')
    }
    
    return {
      isValid: missing.length === 0,
      missing: missing
    }
  }

  const isValidTeam = () => {
    return getTeamValidation().isValid
  }

  const canSelectPosition = (position) => {
    // If we already have 11 players, can't select more
    if (selectedPlayers.length >= 11) return false
    
    const composition = getTeamComposition()
    const remainingSlots = 11 - selectedPlayers.length
    
    // Calculate how many positions we still need to fill (minimum requirements)
    const needed = {
      'wicket-keeper': Math.max(0, 1 - composition['wicket-keeper']),
      'batsman': Math.max(0, 1 - composition['batsman']),
      'all-rounder': Math.max(0, 1 - composition['all-rounder']),
      'bowler': Math.max(0, 1 - composition['bowler'])
    }
    
    // Total positions we must fill
    const totalNeeded = needed['wicket-keeper'] + needed['batsman'] + needed['all-rounder'] + needed['bowler']
    
    // If selecting this position would leave us without enough slots for required positions
    if (position !== 'wicket-keeper' && needed['wicket-keeper'] > 0 && remainingSlots - 1 < totalNeeded) return false
    if (position !== 'batsman' && needed['batsman'] > 0 && remainingSlots - 1 < totalNeeded) return false
    if (position !== 'all-rounder' && needed['all-rounder'] > 0 && remainingSlots - 1 < totalNeeded) return false
    if (position !== 'bowler' && needed['bowler'] > 0 && remainingSlots - 1 < totalNeeded) return false
    
    return true
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

    // Sort players by fantasyPrice in descending order (highest first)
    Object.keys(playersByPosition).forEach(position => {
      playersByPosition[position].sort((a, b) => {
        const priceA = a.fantasyPrice || 8
        const priceB = b.fantasyPrice || 8
        return priceB - priceA
      })
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

  const handleUpdateTeam = async () => {
    if (!captain || !viceCaptain) {
      toast.error('Please select both captain and vice-captain')
      return
    }
    
    setSaving(true)
    
    const updateData = {
      players: selectedPlayers.map(player => player._id),
      captainId: captain._id,
      viceCaptainId: viceCaptain._id
    }
    
    try {
      const response = await axios.put(`${BACKEND_URL}/api/userteam/${teamId}`, updateData)
      
      navigate(-1)
      
      toast.success('Team updated successfully! 🎉', {
        position: "top-center",
        autoClose: 600,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: false,
        draggable: true,
      })
      
    } catch (error) {
      console.error('Error updating team:', error)
      toast.error('Failed to update team. Please try again.', {
        position: "top-center",
        autoClose: 3000,
      })
    }
    
    setSaving(false)
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-lg">Loading team data...</div>
      </div>
    )
  }

  if (!matchData || !teamData) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-lg text-red-500">Failed to load team data</div>
      </div>
    )
  }

  return (
    <div className="bg-gray-50 min-h-screen pb-32 max-w-md mx-auto">
      <style>{scrollbarHideStyle}</style>
      {/* Header - Dark Theme */}
      <div className="bg-gradient-to-r from-gray-900 via-slate-900 to-black shadow-xl p-4">
        <div className="flex items-center">
          <button onClick={handleBackNavigation} className="mr-3">
            <ArrowLeft size={24} className="text-white" />
          </button>
          <div className="flex-1">
            <h1 className="text-xl font-bold text-white">Edit Your Team</h1>
            <div className="text-sm text-gray-300 mt-1">
              Modify your selection ({selectedPlayers.length}/11)
            </div>
          </div>
        </div>
        {!isValidTeam() && selectedPlayers.length > 0 && (
          <div className="text-center text-xs text-red-300 mt-2">
            Need: {getTeamValidation().missing.join(', ')}
          </div>
        )}
        
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
      <PlayersList 
        getAllPlayersByPosition={getAllPlayersByPosition}
        activeTab={activeTab}
        isPlayerSelected={isPlayerSelected}
        canSelectPosition={canSelectPosition}
        handlePlayerSelect={handlePlayerSelect}
        getPositionColor={getPositionColor}
        BACKEND_URL={BACKEND_URL}
        supportsWebP={supportsWebP}
      />

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
              const validation = getTeamValidation()
              if (validation.isValid) {
                setShowCaptainSelection(true)
              } else {
                toast.error(`Team incomplete! You need: ${validation.missing.join(', ')}`, { autoClose: 4000 })
              }
            }}
          >
            UPDATE
          </button>
        </div>
      </div>

      {/* Preview Modal */}
      <PreviewModal 
        showPreview={showPreview}
        setShowPreview={setShowPreview}
        getSelectedPlayersByPosition={getSelectedPlayersByPosition}
        BACKEND_URL={BACKEND_URL}
        supportsWebP={supportsWebP}
      />

      {/* Captain Selection Modal */}
      <CaptainSelectionModal 
        showCaptainSelection={showCaptainSelection}
        setShowCaptainSelection={setShowCaptainSelection}
        selectedPlayers={selectedPlayers}
        captain={captain}
        viceCaptain={viceCaptain}
        handleCaptainSelect={handleCaptainSelect}
        handleViceCaptainSelect={handleViceCaptainSelect}
        handleSaveTeam={handleUpdateTeam}
        saving={saving}
        matchData={matchData}
        BACKEND_URL={BACKEND_URL}
        supportsWebP={supportsWebP}
      />

    </div>
  )
}

export default EditTeam