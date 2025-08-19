import React, { useState, useEffect, useContext } from 'react'
import { Trophy, Medal, Award, Users, ArrowLeft, X, Crown, Star } from 'lucide-react'
import axios from 'axios'
import { AppContext } from '../context/AppContext'

const LeaderBoard = ({ contestId, isOpen, onClose }) => {
  const { BACKEND_URL, user } = useContext(AppContext)
  const [leaderboardData, setLeaderboardData] = useState([])
  const [loading, setLoading] = useState(false)
  const [contest, setContest] = useState(null)
  const [selectedTeam, setSelectedTeam] = useState(null)
  const [showTeamModal, setShowTeamModal] = useState(false)

  useEffect(() => {
    if (isOpen && contestId) {
      fetchLeaderboardData()
    }
  }, [isOpen, contestId])

  const fetchLeaderboardData = async () => {
    try {
      setLoading(true)
      // Fetch contest details with populated joinedUsers
      const { data } = await axios.get(`${BACKEND_URL}/api/contests/${contestId}/leaderboard`)
      
      if (data.success) {
        setContest(data.data.contest)
        setLeaderboardData(data.data.leaderboard)
      }
    } catch (error) {
      console.error('Error fetching leaderboard:', error)
    } finally {
      setLoading(false)
    }
  }

  const getRankIcon = (rank) => {
    switch (rank) {
      case 1:
        return <Trophy className="w-6 h-6 text-yellow-500" />
      case 2:
        return <Medal className="w-6 h-6 text-gray-400" />
      case 3:
        return <Award className="w-6 h-6 text-amber-600" />
      default:
        return (
          <div className="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center">
            <span className="text-sm font-bold text-gray-600">#{rank}</span>
          </div>
        )
    }
  }

  const getTeamDisplayName = (teamData, userIndex) => {
    return teamData?.teamName || `Team ${userIndex + 1}`
  }

  const getUserDisplayName = (userData) => {
    if (userData?.firstName && userData?.lastName) {
      return `${userData.firstName} ${userData.lastName}`
    }
    return userData?.email?.split('@')[0] || 'Anonymous'
  }

  const handleUserClick = (entry) => {
    if (entry.team) {
      setSelectedTeam(entry.team)
      setShowTeamModal(true)
    }
  }

  const closeTeamModal = () => {
    setShowTeamModal(false)
    setSelectedTeam(null)
  }

  // Team Preview Modal Component - Ground View
  const TeamPreviewModal = ({ team, onClose }) => {
    if (!team) return null

    // Group players by position
    const getPlayersByPosition = () => {
      const positions = {
        'wicket-keeper': [],
        'batsman': [],
        'all-rounder': [],
        'bowler': []
      }

      team.players?.forEach((playerObj) => {
        const player = playerObj.player
        if (player && player.position) {
          if (positions[player.position]) {
            positions[player.position].push({
              ...player,
              fantasyPoints: playerObj.fantasyPoints || 0,
              isCaptain: team.captain?._id === player._id,
              isViceCaptain: team.viceCaptain?._id === player._id
            })
          }
        }
      })

      return positions
    }

    const playersByPosition = getPlayersByPosition()

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-end justify-center z-[60]">
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
                
                {/* Boundary rope indication */}
                <div className="absolute inset-y-8 inset-x-0.5 border-2 border-white border-opacity-60 rounded-full"></div>
                
                {/* Team Name - Top */}
                <div className="absolute -top-6 left-1/2 transform -translate-x-1/2">
                  <div className="text-lg font-black tracking-wider" style={{
                    color: 'rgba(255, 255, 255, 0.9)',
                    textShadow: `
                      0 1px 0 rgba(255,255,255,0.3),
                      0 -1px 0 rgba(0,0,0,0.4),
                      0 2px 4px rgba(0,0,0,0.3)
                    `,
                    letterSpacing: '2px',
                    fontWeight: '900'
                  }}>
                    {team.teamName || 'TEAM'}
                  </div>
                </div>
                
                {/* Total Points - Bottom */}
                <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2">
                  <div className="text-lg font-black tracking-wider" style={{
                    color: 'rgba(255, 255, 255, 0.9)',
                    textShadow: `
                      0 1px 0 rgba(255,255,255,0.3),
                      0 -1px 0 rgba(0,0,0,0.4),
                      0 2px 4px rgba(0,0,0,0.3)
                    `,
                    letterSpacing: '2px',
                    fontWeight: '900'
                  }}>
                    {team.totalPoints || 0} PTS
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-white hover:text-gray-300 p-2 z-20"
          >
            <X size={24} />
          </button>

          {/* Ground View - Players positioned by role */}
          <div className="h-full flex flex-col justify-center space-y-4 py-4 relative z-10">
            {/* Wicket Keepers - Top */}
            {playersByPosition['wicket-keeper'].length > 0 && (
              <div>
                <h3 className="text-white text-xs mb-2 text-center font-bold">WICKET-KEEPERS</h3>
                <div className="space-y-2">
                  {Array.from({ length: Math.ceil(playersByPosition['wicket-keeper'].length / 3) }, (_, rowIndex) => (
                    <div key={rowIndex} className="flex justify-around">
                      {playersByPosition['wicket-keeper'].slice(rowIndex * 3, (rowIndex + 1) * 3).map((player) => (
                        <div key={player._id} className="flex flex-col items-center">
                          <div className="relative">
                            {player.imgLink ? (
                              <img 
                                src={`${BACKEND_URL}${player.imgLink}`} 
                                alt={`${player.firstName} ${player.lastName}`}
                                className="w-14 h-14 object-cover rounded-full border-2 border-white shadow-lg"
                              />
                            ) : (
                              <div className="w-14 h-14 bg-gray-400 rounded-full flex items-center justify-center shadow-lg border-2 border-white">
                                <span className="text-xs font-bold text-white">
                                  {player.firstName?.charAt(0)}{player.lastName?.charAt(0)}
                                </span>
                              </div>
                            )}
                            {/* Captain/Vice-Captain Badge */}
                            {(player.isCaptain || player.isViceCaptain) && (
                              <div className="absolute -top-1 -right-1 w-5 h-5 bg-yellow-500 rounded-full flex items-center justify-center border border-white">
                                <span className="text-white text-xs font-bold">
                                  {player.isCaptain ? 'C' : 'VC'}
                                </span>
                              </div>
                            )}
                          </div>
                          <div className="bg-black bg-opacity-80 text-white px-2 py-1 rounded mt-1">
                            <div className="text-xs font-medium text-center">{player.firstName?.charAt(0)} {player.lastName}</div>
                          </div>
                          <div className="text-white text-xs font-bold mt-1 bg-green-600 px-2 py-1 rounded">
                            {player.fantasyPoints} pts
                          </div>
                        </div>
                      ))}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Batsmen */}
            {playersByPosition['batsman'].length > 0 && (
              <div>
                <h3 className="text-white text-xs mb-2 text-center font-bold">BATTERS</h3>
                <div className="space-y-2">
                  {Array.from({ length: Math.ceil(playersByPosition['batsman'].length / 3) }, (_, rowIndex) => (
                    <div key={rowIndex} className="flex justify-around">
                      {playersByPosition['batsman'].slice(rowIndex * 3, (rowIndex + 1) * 3).map((player) => (
                        <div key={player._id} className="flex flex-col items-center">
                          <div className="relative">
                            {player.imgLink ? (
                              <img 
                                src={`${BACKEND_URL}${player.imgLink}`} 
                                alt={`${player.firstName} ${player.lastName}`}
                                className="w-14 h-14 object-cover rounded-full border-2 border-white shadow-lg"
                              />
                            ) : (
                              <div className="w-14 h-14 bg-gray-400 rounded-full flex items-center justify-center shadow-lg border-2 border-white">
                                <span className="text-xs font-bold text-white">
                                  {player.firstName?.charAt(0)}{player.lastName?.charAt(0)}
                                </span>
                              </div>
                            )}
                            {/* Captain/Vice-Captain Badge */}
                            {(player.isCaptain || player.isViceCaptain) && (
                              <div className="absolute -top-1 -right-1 w-5 h-5 bg-yellow-500 rounded-full flex items-center justify-center border border-white">
                                <span className="text-white text-xs font-bold">
                                  {player.isCaptain ? 'C' : 'VC'}
                                </span>
                              </div>
                            )}
                          </div>
                          <div className="bg-black bg-opacity-80 text-white px-2 py-1 rounded mt-1">
                            <div className="text-xs font-medium text-center">{player.firstName?.charAt(0)} {player.lastName}</div>
                          </div>
                          <div className="text-white text-xs font-bold mt-1 bg-green-600 px-2 py-1 rounded">
                            {player.fantasyPoints} pts
                          </div>
                        </div>
                      ))}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* All Rounders */}
            {playersByPosition['all-rounder'].length > 0 && (
              <div>
                <h3 className="text-white text-xs mb-2 text-center font-bold">ALL-ROUNDERS</h3>
                <div className="space-y-2">
                  {Array.from({ length: Math.ceil(playersByPosition['all-rounder'].length / 3) }, (_, rowIndex) => (
                    <div key={rowIndex} className="flex justify-around">
                      {playersByPosition['all-rounder'].slice(rowIndex * 3, (rowIndex + 1) * 3).map((player) => (
                        <div key={player._id} className="flex flex-col items-center">
                          <div className="relative">
                            {player.imgLink ? (
                              <img 
                                src={`${BACKEND_URL}${player.imgLink}`} 
                                alt={`${player.firstName} ${player.lastName}`}
                                className="w-14 h-14 object-cover rounded-full border-2 border-white shadow-lg"
                              />
                            ) : (
                              <div className="w-14 h-14 bg-gray-400 rounded-full flex items-center justify-center shadow-lg border-2 border-white">
                                <span className="text-xs font-bold text-white">
                                  {player.firstName?.charAt(0)}{player.lastName?.charAt(0)}
                                </span>
                              </div>
                            )}
                            {/* Captain/Vice-Captain Badge */}
                            {(player.isCaptain || player.isViceCaptain) && (
                              <div className="absolute -top-1 -right-1 w-5 h-5 bg-yellow-500 rounded-full flex items-center justify-center border border-white">
                                <span className="text-white text-xs font-bold">
                                  {player.isCaptain ? 'C' : 'VC'}
                                </span>
                              </div>
                            )}
                          </div>
                          <div className="bg-black bg-opacity-80 text-white px-2 py-1 rounded mt-1">
                            <div className="text-xs font-medium text-center">{player.firstName?.charAt(0)} {player.lastName}</div>
                          </div>
                          <div className="text-white text-xs font-bold mt-1 bg-green-600 px-2 py-1 rounded">
                            {player.fantasyPoints} pts
                          </div>
                        </div>
                      ))}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Bowlers - Bottom */}
            {playersByPosition['bowler'].length > 0 && (
              <div>
                <h3 className="text-white text-xs mb-2 text-center font-bold">BOWLERS</h3>
                <div className="space-y-2">
                  {Array.from({ length: Math.ceil(playersByPosition['bowler'].length / 3) }, (_, rowIndex) => (
                    <div key={rowIndex} className="flex justify-around">
                      {playersByPosition['bowler'].slice(rowIndex * 3, (rowIndex + 1) * 3).map((player) => (
                        <div key={player._id} className="flex flex-col items-center">
                          <div className="relative">
                            {player.imgLink ? (
                              <img 
                                src={`${BACKEND_URL}${player.imgLink}`} 
                                alt={`${player.firstName} ${player.lastName}`}
                                className="w-14 h-14 object-cover rounded-full border-2 border-white shadow-lg"
                              />
                            ) : (
                              <div className="w-14 h-14 bg-gray-400 rounded-full flex items-center justify-center shadow-lg border-2 border-white">
                                <span className="text-xs font-bold text-white">
                                  {player.firstName?.charAt(0)}{player.lastName?.charAt(0)}
                                </span>
                              </div>
                            )}
                            {/* Captain/Vice-Captain Badge */}
                            {(player.isCaptain || player.isViceCaptain) && (
                              <div className="absolute -top-1 -right-1 w-5 h-5 bg-yellow-500 rounded-full flex items-center justify-center border border-white">
                                <span className="text-white text-xs font-bold">
                                  {player.isCaptain ? 'C' : 'VC'}
                                </span>
                              </div>
                            )}
                          </div>
                          <div className="bg-black bg-opacity-80 text-white px-2 py-1 rounded mt-1">
                            <div className="text-xs font-medium text-center">{player.firstName?.charAt(0)} {player.lastName}</div>
                          </div>
                          <div className="text-white text-xs font-bold mt-1 bg-green-600 px-2 py-1 rounded">
                            {player.fantasyPoints} pts
                          </div>
                        </div>
                      ))}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    )
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 z-50">
      <div className="w-full h-[100vh] bg-gradient-to-b from-gray-900 to-black text-white overflow-hidden flex flex-col">
        {/* Header with Match Info */}
        <div className="flex-shrink-0">
          {/* Header Bar */}
          <div className="flex items-center justify-between p-4">
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/10 rounded-full transition-colors"
            >
              <ArrowLeft size={24} className="text-white" />
            </button>
            <div className="flex items-center space-x-4">
              <h2 className="text-lg font-bold">
                {contest?.contestFormat === 'practice' ? 'Practice Contest' : 
                 contest?.contestFormat === 'h2h' ? 'Head to Head' : 
                 contest?.contestFormat?.toUpperCase() || 'Contest'}
              </h2>
              <span className="bg-green-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                COMPLETED
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gray-600 rounded-full flex items-center justify-center">
                <span className="text-sm">?</span>
              </div>
              <div className="w-8 h-8 bg-gray-600 rounded-full flex items-center justify-center">
                <span className="text-sm">PTS</span>
              </div>
            </div>
          </div>

          {/* Match Score Section */}
          {contest && (
            <div className="px-4 pb-6">
              <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-700">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-red-600 rounded-lg flex items-center justify-center">
                      <span className="text-white font-bold text-sm">TEAM1</span>
                    </div>
                    <div>
                      <div className="text-white font-semibold">219-6 (20)</div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div>
                      <div className="text-white font-semibold">201-5 (20)</div>
                    </div>
                    <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                      <span className="text-white font-bold text-sm">TEAM2</span>
                    </div>
                  </div>
                </div>
                <div className="text-center">
                  <div className="w-12 h-12 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-full mx-auto mb-2 flex items-center justify-center">
                    <Trophy className="text-white" size={24} />
                  </div>
                  <div className="text-white font-semibold">TEAM1 beat TEAM2 by 18 runs</div>
                </div>
              </div>
              
              {/* Scorecard Button */}
              <div className="flex justify-center mt-4">
                <button className="bg-gray-700 hover:bg-gray-600 text-white px-6 py-2 rounded-lg border border-gray-600 transition-colors">
                  Scorecard ▼
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Tab Navigation - Removed Commentary and Stats */}
        <div className="bg-white flex-shrink-0">
          <div className="flex">
            <button className="flex-1 py-3 text-gray-500 text-center font-medium">
              Winnings
            </button>
            <button className="flex-1 py-3 text-red-500 text-center font-bold border-b-2 border-red-500">
              Leaderboard
            </button>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="bg-white px-4 py-3 border-b border-gray-200 flex-shrink-0">
          <div className="flex space-x-3">
            <button className="flex items-center space-x-2 bg-gray-100 hover:bg-gray-200 px-4 py-2 rounded-lg transition-colors">
              <span className="text-gray-700 text-sm">📊 Compare</span>
            </button>
            <button className="flex items-center space-x-2 bg-gray-100 hover:bg-gray-200 px-4 py-2 rounded-lg transition-colors">
              <span className="text-gray-700 text-sm">⬇️ Download</span>
            </button>
          </div>
        </div>

        {/* Points Update Info */}
        <div className="bg-white px-4 py-2 border-b border-gray-200 flex-shrink-0">
          <div className="text-center text-blue-600 text-sm font-medium">
            Points last updated at {new Date().toLocaleTimeString()}
          </div>
        </div>

        {/* Team Count and Edit Section */}
        <div className="bg-gray-50 px-4 py-3 border-b border-gray-200 flex-shrink-0">
          <div className="flex items-center justify-between">
            <div className="text-gray-800 font-semibold">
              All Teams ({leaderboardData.length})
            </div>
            <div className="flex items-center space-x-2 text-gray-600">
              <span className="text-sm font-medium">Points</span>
              <span className="text-sm font-medium">Rank</span>
            </div>
          </div>
          
          {/* Edit Team Name Section */}
          <div className="mt-3 p-3 bg-blue-50 rounded-lg border border-blue-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <span className="text-gray-600">✏️</span>
                <span className="text-gray-800 font-medium">Give your team a unique name</span>
              </div>
              <button className="text-blue-600 font-semibold">EDIT ›</button>
            </div>
          </div>
        </div>

        {/* Leaderboard Content - Made scrollable and fills remaining space */}
        <div className="flex-1 bg-white overflow-y-auto min-h-0">
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="text-lg text-gray-500">Loading leaderboard...</div>
            </div>
          ) : leaderboardData.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-64">
              <Trophy className="w-16 h-16 text-gray-300 mb-4" />
              <div className="text-lg font-medium text-gray-500 mb-2">No participants yet</div>
              <div className="text-sm text-gray-400 text-center px-4">
                Be the first to join this contest and climb the leaderboard!
              </div>
            </div>
          ) : (
            <div className="space-y-0">
              {/* Leaderboard Entries */}
              {leaderboardData.map((entry, index) => {
                // Calculate actual rank based on points (handle ties)
                let rank = 1;
                for (let i = 0; i < index; i++) {
                  const prevPoints = leaderboardData[i].team?.totalPoints || 0;
                  const currentPoints = entry.team?.totalPoints || 0;
                  if (prevPoints > currentPoints) {
                    rank = i + 2;
                    break;
                  }
                }
                
                const isCurrentUser = entry.user?._id === user?._id
                const userName = getUserDisplayName(entry.user)
                const teamName = getTeamDisplayName(entry.team, index)
                const points = entry.team?.totalPoints || 0
                
                // Generate diverse avatar backgrounds
                const avatarColors = [
                  'bg-orange-400', 'bg-red-400', 'bg-purple-400', 'bg-blue-400', 
                  'bg-green-400', 'bg-yellow-400', 'bg-pink-400', 'bg-indigo-400'
                ]
                const avatarBg = avatarColors[index % avatarColors.length]
                
                return (
                  <div 
                    key={entry._id}
                    onClick={() => handleUserClick(entry)}
                    className="px-4 py-4 border-b border-gray-100 bg-white cursor-pointer hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-center justify-between">
                      {/* Left Side - Avatar and User Info */}
                      <div className="flex items-center space-x-3 flex-1">
                        {/* User Avatar */}
                        <div className="relative">
                          <div className={`w-12 h-12 ${avatarBg} rounded-full flex items-center justify-center overflow-hidden`}>
                            {entry.user?.profileImage ? (
                              <img 
                                src={`${BACKEND_URL}${entry.user.profileImage}`} 
                                alt={userName}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <span className="text-white text-sm font-bold">
                                {userName.charAt(0).toUpperCase()}
                              </span>
                            )}
                          </div>
                        </div>
                        
                        {/* User Name and Team Indicator */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center space-x-2 mb-1">
                            <span className="font-semibold text-gray-900 text-base truncate">
                              {userName}
                            </span>
                            <span className="bg-gray-200 text-gray-700 px-2 py-1 rounded text-xs font-bold">
                              T{index + 1}
                            </span>
                          </div>
                          {/* Winner Badge */}
                          {rank === 1 && (
                            <div className="text-green-600 text-sm font-semibold">
                              Winner!
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Middle - Points */}
                      <div className="text-center mx-4">
                        <div className="font-bold text-gray-900 text-lg">
                          {points}
                        </div>
                      </div>

                      {/* Right Side - Rank */}
                      <div className="text-right">
                        <div className="font-bold text-gray-900 text-lg">
                          #{rank}
                        </div>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>

        {/* Team Preview Modal */}
        {showTeamModal && (
          <TeamPreviewModal 
            team={selectedTeam} 
            onClose={closeTeamModal}
          />
        )}
      </div>
    </div>
  )
}

export default LeaderBoard