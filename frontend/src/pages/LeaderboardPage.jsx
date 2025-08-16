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

  // Team Preview Modal Component
  const TeamPreviewModal = ({ team, onClose }) => {
    if (!team) return null

    const getPlayerStats = (player) => {
      return {
        wk: player.playerType === 'wicket-keeper' ? 1 : 0,
        bat: player.playerType === 'batsman' ? 1 : 0,
        ar: player.playerType === 'all-rounder' ? 1 : 0,
        bowl: player.playerType === 'bowler' ? 1 : 0
      }
    }

    const teamStats = team.players?.reduce((acc, playerObj) => {
      const player = playerObj.player
      if (player) {
        const stats = getPlayerStats(player)
        acc.wk += stats.wk
        acc.bat += stats.bat
        acc.ar += stats.ar
        acc.bowl += stats.bowl
      }
      return acc
    }, { wk: 0, bat: 0, ar: 0, bowl: 0 })

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
          {/* Header */}
          <div className="flex justify-between items-center p-4 border-b">
            <h2 className="text-xl font-bold">Team Preview</h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-full"
            >
              <X size={20} />
            </button>
          </div>

          {/* Team Content */}
          <div className="p-4">
            <div className="bg-gradient-to-b from-green-600 to-green-800 rounded-xl p-4 text-white mb-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold">
                  {team.teamName || 'Team'}
                </h3>
                <div className="flex items-center text-white">
                  <Users size={16} className="mr-1" />
                  <span className="text-sm">{team.players?.length || 0}</span>
                </div>
              </div>

              {/* Captain and Vice Captain */}
              <div className="flex justify-center mb-4">
                <div className="flex space-x-6">
                  {team.captain && (
                    <div className="flex flex-col items-center">
                      <div className="relative mb-2">
                        <div className="w-14 h-14 bg-blue-100 rounded-full flex items-center justify-center overflow-hidden">
                          {team.captain.imgLink ? (
                            <img 
                              src={`${BACKEND_URL}${team.captain.imgLink}`} 
                              alt={`${team.captain.firstName} ${team.captain.lastName}`}
                              className="w-full h-full object-cover rounded-full"
                            />
                          ) : (
                            <div className="w-12 h-12 bg-blue-400 rounded-full flex items-center justify-center">
                              <span className="text-white text-xs font-bold">
                                {team.captain.firstName?.charAt(0)}{team.captain.lastName?.charAt(0)}
                              </span>
                            </div>
                          )}
                        </div>
                        <div className="absolute -top-1 -right-1 w-6 h-6 bg-gray-700 rounded-full flex items-center justify-center">
                          <span className="text-white text-xs font-bold">C</span>
                        </div>
                      </div>
                      <div className="bg-white border border-gray-800 rounded-full px-2 py-1">
                        <span className="text-xs font-medium text-gray-800">
                          {team.captain.firstName && team.captain.lastName 
                            ? `${team.captain.firstName} ${team.captain.lastName}`.length > 10 
                              ? `${team.captain.firstName} ${team.captain.lastName}`.substring(0, 10) + '...' 
                              : `${team.captain.firstName} ${team.captain.lastName}`
                            : 'Captain'
                          }
                        </span>
                      </div>
                    </div>
                  )}

                  {team.viceCaptain && (
                    <div className="flex flex-col items-center">
                      <div className="relative mb-2">
                        <div className="w-14 h-14 bg-orange-100 rounded-full flex items-center justify-center overflow-hidden">
                          {team.viceCaptain.imgLink ? (
                            <img 
                              src={`${BACKEND_URL}${team.viceCaptain.imgLink}`} 
                              alt={`${team.viceCaptain.firstName} ${team.viceCaptain.lastName}`}
                              className="w-full h-full object-cover rounded-full"
                            />
                          ) : (
                            <div className="w-12 h-12 bg-orange-400 rounded-full flex items-center justify-center">
                              <span className="text-white text-xs font-bold">
                                {team.viceCaptain.firstName?.charAt(0)}{team.viceCaptain.lastName?.charAt(0)}
                              </span>
                            </div>
                          )}
                        </div>
                        <div className="absolute -top-1 -right-1 w-6 h-6 bg-gray-700 rounded-full flex items-center justify-center">
                          <span className="text-white text-xs font-bold">VC</span>
                        </div>
                      </div>
                      <div className="bg-gray-700 rounded-full px-2 py-1">
                        <span className="text-xs font-medium text-white">
                          {team.viceCaptain.firstName && team.viceCaptain.lastName 
                            ? `${team.viceCaptain.firstName} ${team.viceCaptain.lastName}`.length > 10 
                              ? `${team.viceCaptain.firstName} ${team.viceCaptain.lastName}`.substring(0, 10) + '...' 
                              : `${team.viceCaptain.firstName} ${team.viceCaptain.lastName}`
                            : 'Vice Captain'
                          }
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Team Composition Stats */}
              <div className="flex justify-center items-center space-x-8">
                <div className="flex items-center space-x-1">
                  <span className="text-xs text-white">WK</span>
                  <span className="text-xs text-white font-medium">{teamStats?.wk || 0}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <span className="text-xs text-white">BAT</span>
                  <span className="text-xs text-white font-medium">{teamStats?.bat || 0}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <span className="text-xs text-white">AR</span>
                  <span className="text-xs text-white font-medium">{teamStats?.ar || 0}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <span className="text-xs text-white">BOWL</span>
                  <span className="text-xs text-white font-medium">{teamStats?.bowl || 0}</span>
                </div>
              </div>
            </div>

            {/* Players List */}
            <div className="space-y-2">
              <h4 className="font-semibold text-gray-800 mb-3">Players ({team.players?.length || 0})</h4>
              {team.players?.map((playerObj, index) => {
                const player = playerObj.player
                if (!player) return null
                
                const isCaptain = team.captain?._id === player._id
                const isViceCaptain = team.viceCaptain?._id === player._id
                
                return (
                  <div key={player._id} className="flex items-center space-x-3 p-2 bg-gray-50 rounded-lg">
                    <div className="relative">
                      <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center overflow-hidden">
                        {player.imgLink ? (
                          <img 
                            src={`${BACKEND_URL}${player.imgLink}`} 
                            alt={`${player.firstName} ${player.lastName}`}
                            className="w-full h-full object-cover rounded-full"
                          />
                        ) : (
                          <span className="text-gray-600 text-xs font-bold">
                            {player.firstName?.charAt(0)}{player.lastName?.charAt(0)}
                          </span>
                        )}
                      </div>
                      {(isCaptain || isViceCaptain) && (
                        <div className="absolute -top-1 -right-1 w-4 h-4 bg-gray-700 rounded-full flex items-center justify-center">
                          <span className="text-white text-xs font-bold">
                            {isCaptain ? 'C' : 'VC'}
                          </span>
                        </div>
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="font-medium text-sm">
                        {player.firstName} {player.lastName}
                      </div>
                      <div className="text-xs text-gray-500">
                        {player.playerType?.replace('-', ' ').toUpperCase() || player.position}
                      </div>
                    </div>
                    <div className="text-sm font-medium text-green-600">
                      {playerObj.fantasyPoints || 0} pts
                    </div>
                  </div>
                )
              })}
            </div>

            {/* Team Total Points */}
            <div className="mt-4 p-3 bg-green-50 rounded-lg">
              <div className="flex justify-between items-center">
                <span className="font-semibold text-green-800">Total Points</span>
                <span className="font-bold text-green-800 text-lg">{team.totalPoints || 0}</span>
              </div>
            </div>
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