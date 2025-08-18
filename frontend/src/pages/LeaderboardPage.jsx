import React, { useState, useEffect, useContext } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Trophy, ArrowLeft, Users, X } from 'lucide-react'
import axios from 'axios'
import { AppContext } from '../context/AppContext'

const LeaderboardPage = () => {
  const { matchId, contestId } = useParams()
  const { BACKEND_URL, user } = useContext(AppContext)
  const navigate = useNavigate()
  const [leaderboardData, setLeaderboardData] = useState([])
  const [loading, setLoading] = useState(false)
  const [contest, setContest] = useState(null)
  const [selectedTeam, setSelectedTeam] = useState(null)
  const [showTeamModal, setShowTeamModal] = useState(false)

  useEffect(() => {
    if (contestId) {
      fetchLeaderboardData()
    }
  }, [contestId])

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


  const getUserDisplayName = (userData) => {
    if (userData?.firstName && userData?.lastName) {
      return `${userData.firstName} ${userData.lastName}`
    }
    return userData?.email?.split('@')[0] || 'Anonymous'
  }

  const getTeamDisplayName = (teamData, userIndex) => {
    return teamData?.teamName || `Team ${userIndex + 1}`
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
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-end justify-center z-50">
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


  if (loading) {
    return (
      <div className="bg-gray-50 min-h-screen">
        <div className="flex justify-center items-center min-h-screen">
          <div className="text-lg">Loading leaderboard...</div>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="bg-slate-800 text-white p-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center">
            <button
              onClick={() => navigate(`/my-contests/${matchId}`)}
              className="mr-3 p-1 hover:bg-slate-700 rounded-full"
            >
              <ArrowLeft size={24} />
            </button>
            <div>
              <h1 className="text-xl font-bold">
                {contest?.contestFormat === 'practice' ? 'Practice Contest' : 
                 contest?.contestFormat === 'h2h' ? 'Head to Head' : 
                 contest?.contestFormat?.toUpperCase() || 'Contest'}
              </h1>
            </div>
          </div>
        </div>
      </div>

      {/* Contest Info Card */}
      {contest && (
        <div className="mx-3 mt-4 mb-4">
          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center space-x-3">
                <Trophy className="text-yellow-500" size={20} />
                <div>
                  <div className="font-semibold text-gray-800">
                    ₹{contest.prizePool?.toLocaleString()}
                  </div>
                  <div className="text-sm text-gray-600">Prize Pool</div>
                </div>
              </div>
              <div className="text-right">
                <div className="font-semibold text-gray-800">
                  ₹{contest.entryFee}
                </div>
                <div className="text-sm text-gray-600">Entry Fee</div>
              </div>
            </div>
            <div className="flex items-center justify-between text-sm text-gray-600">
              <span>{contest.currentParticipants || 0} Joined</span>
              <span>{contest.totalSpots} Total Spots</span>
            </div>
          </div>
        </div>
      )}

      {/* Tab Navigation */}
      <div className="bg-white border-b border-gray-200">
        <div className="flex justify-center">
          <button className="py-3 text-red-500 text-center font-bold border-b-2 border-red-500 px-8">
            Leaderboard
          </button>
        </div>
      </div>



      {/* Team Count Header */}
      <div className="bg-gray-50 px-4 py-3 border-b border-gray-200">
        <div className="flex items-center">
          <div className="flex items-center space-x-3 flex-1">
            <div className="text-gray-800 font-semibold">
              All Teams ({leaderboardData.length})
            </div>
          </div>
          <div className="w-20 text-center">
            <span className="text-sm font-medium text-gray-600">Team Pts</span>
          </div>
          <div className="w-20 text-center">
            <span className="text-sm font-medium text-gray-600">Total Pts</span>
          </div>
          <div className="w-16 text-center">
            <span className="text-sm font-medium text-gray-600">Rank</span>
          </div>
        </div>
      </div>

      {/* Leaderboard Content */}
      <div className="bg-white">
        {leaderboardData.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 px-4">
            <Trophy className="w-16 h-16 text-gray-300 mb-4" />
            <div className="text-lg font-medium text-gray-500 mb-2">No participants yet</div>
            <div className="text-sm text-gray-400 text-center">
              Be the first to join this contest and climb the leaderboard!
            </div>
          </div>
        ) : (
          <div className="space-y-0">
            {/* Leaderboard Entries */}
            {leaderboardData.map((entry, index) => {
              const rank = index + 1
              const isCurrentUser = entry.user?._id === user?._id
              const userName = getUserDisplayName(entry.user)
              const teamName = getTeamDisplayName(entry.team, index)
              const teamPoints = entry.team?.totalPoints || 0
              const totalFantasyPoints = entry.totalFantasyPoints || 0
              
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
                  className={`px-4 py-3 border-b border-gray-100 cursor-pointer hover:bg-gray-50 transition-colors ${
                    isCurrentUser ? 'bg-blue-50' : 'bg-white'
                  }`}
                >
                  <div className="flex items-center">
                    {/* Left Side - Avatar and User Info */}
                    <div className="flex items-center space-x-3 flex-1">
                      {/* User Avatar */}
                      <div className="relative">
                        <div className={`w-10 h-10 ${avatarBg} rounded-full flex items-center justify-center overflow-hidden`}>
                          {entry.user?.profileImage ? (
                            <img 
                              src={`${BACKEND_URL}${entry.user.profileImage}`} 
                              alt={userName}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <span className="text-white text-xs font-bold">
                              {userName.charAt(0).toUpperCase()}
                            </span>
                          )}
                        </div>
                      </div>
                      
                      {/* User Name and Team Indicator */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-2 mb-1">
                          <span className="font-medium text-gray-900 text-sm truncate max-w-32">
                            {userName.length > 12 ? `${userName.substring(0, 12)}...` : userName}
                          </span>
                          <span className="bg-gray-200 text-gray-700 px-2 py-1 rounded text-xs font-bold">
                            T{index + 1}
                          </span>
                        </div>
                        {/* Winner Badge - Only show when match is completed */}
                        {rank === 1 && contest?.matchStatus === 'completed' && (
                          <div className="text-green-600 text-xs font-semibold">
                            Winner!
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Team Points - Aligned with header */}
                    <div className="w-20 text-center">
                      <div className="font-medium text-gray-900 text-sm">
                        {teamPoints}
                      </div>
                    </div>

                    {/* Total Fantasy Points - Aligned with header */}
                    <div className="w-20 text-center">
                      <div className="font-medium text-blue-600 text-sm">
                        {totalFantasyPoints}
                      </div>
                    </div>

                    {/* Rank - Aligned with header */}
                    <div className="w-16 text-center">
                      <div className="font-medium text-gray-900 text-sm">
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

      {/* Bottom padding for mobile */}
      <div className="h-20"></div>

      {/* Team Preview Modal */}
      {showTeamModal && (
        <TeamPreviewModal 
          team={selectedTeam} 
          onClose={closeTeamModal}
        />
      )}
    </div>
  )
}

export default LeaderboardPage