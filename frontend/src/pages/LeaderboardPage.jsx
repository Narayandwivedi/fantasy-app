import React, { useState, useEffect, useContext } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Trophy, ArrowLeft, Users } from 'lucide-react'
import axios from 'axios'
import { AppContext } from '../context/AppContext'

const LeaderboardPage = () => {
  const { matchId, contestId } = useParams()
  const { BACKEND_URL, user } = useContext(AppContext)
  const navigate = useNavigate()
  const [leaderboardData, setLeaderboardData] = useState([])
  const [loading, setLoading] = useState(false)
  const [contest, setContest] = useState(null)

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
                  className={`px-4 py-3 border-b border-gray-100 ${
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
    </div>
  )
}

export default LeaderboardPage