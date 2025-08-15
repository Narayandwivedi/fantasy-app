import React, { useState, useEffect, useContext } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import axios from 'axios'
import { AppContext } from '../context/AppContext'
import { ArrowLeft, Trophy, Users, Shield, Clock, Eye } from 'lucide-react'

const MyContests = () => {
  const { matchId } = useParams()
  const { BACKEND_URL, user } = useContext(AppContext)
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState('myContests')
  const [matchData, setMatchData] = useState(null)
  const [userContests, setUserContests] = useState([])
  const [userTeams, setUserTeams] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchUserContestsByMatch()
  }, [matchId, user])

  const fetchUserContestsByMatch = async () => {
    if (!user?._id || !matchId) return
    
    try {
      setLoading(true)
      const { data } = await axios.get(`${BACKEND_URL}/api/contests/user/${user._id}/match/${matchId}`)
      
      if (data.success) {
        console.log('MyContests API Response:', data.data)
        setUserContests(data.data.contests)
        setUserTeams(data.data.teams)
        if (data.data.contests.length > 0) {
          setMatchData(data.data.contests[0].matchId)
        }
      }
    } catch (error) {
      console.error('Error fetching user contests:', error)
    } finally {
      setLoading(false)
    }
  }

  const formatPrize = (amount) => {
    if (amount >= 100000) {
      return `₹${(amount / 100000).toFixed(2)} Lakhs`
    }
    return `₹${amount?.toLocaleString() || 0}`
  }

  const getWinPercentage = (contest) => {
    if (contest.contestFormat === "h2h") return "50%"
    return `${Math.round(100 / (contest.totalSpots || 1))}%`
  }

  const getPositionText = (position) => {
    if (position === 1) return "1st"
    if (position === 2) return "2nd" 
    if (position === 3) return "3rd"
    return `#${position}`
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'upcoming': return 'text-blue-600 bg-blue-100'
      case 'live': return 'text-green-600 bg-green-100'
      case 'completed': return 'text-gray-600 bg-gray-100'
      default: return 'text-gray-600 bg-gray-100'
    }
  }

  const handleLeaderboardClick = (contest) => {
    navigate(`/my-contests/${matchId}/leaderboard/${contest._id}`)
  }

  const TabButton = ({ tab, label, count }) => (
    <button
      onClick={() => setActiveTab(tab)}
      className={`px-4 py-3 font-medium border-b-2 transition-colors ${
        activeTab === tab
          ? 'border-red-500 text-red-600'
          : 'border-transparent text-gray-600 hover:text-gray-800'
      }`}
    >
      <span>{label}</span>
      {count !== undefined && (
        <span className="ml-1 text-sm">({count})</span>
      )}
    </button>
  )

  const ContestCard = ({ contest, userTeam, teamIndex }) => {
    // Use the team passed as prop since we don't have joinedUsers data
    const userTeamInContest = userTeam || userTeams[teamIndex] || userTeams[0]
    
    return (
      <div 
        className="bg-white rounded-xl mx-3 mb-5 overflow-hidden shadow-xl border border-gray-300 cursor-pointer hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1"
        onClick={() => handleLeaderboardClick(contest)}
      >
        {/* Contest Header */}
        <div className="px-4 py-3 bg-white border-b border-gray-100">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Shield size={16} className="text-green-600" />
              <span className="text-sm font-medium text-gray-700">
                {contest.contestFormat === 'guaranteed' ? 'Guaranteed' : contest.contestFormat.toUpperCase()}
              </span>
            </div>
          </div>
        </div>

        {/* Prize Info */}
        <div className="px-4 py-3 border-b border-gray-100">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center space-x-2">
              <Trophy size={16} className="text-yellow-600" />
              <span className="text-sm font-medium text-gray-800">
                {formatPrize(contest.prizePool)}
              </span>
              <span className="bg-green-600 text-white px-2 py-0.5 rounded text-xs font-medium">
                ₹{contest.entryFee}
              </span>
            </div>
            <span className="text-sm font-medium text-gray-600">
              {contest.totalSpots} Spots
            </span>
          </div>
        </div>

        {/* Contest Stats */}
        <div className="px-4 py-2 bg-gray-50 border-b border-gray-100">
          <div className="flex items-center justify-between text-xs text-gray-600">
            <span>{contest.currentParticipants || 0} Joined</span>
            <span>{contest.totalSpots - (contest.currentParticipants || 0)} Spots Left</span>
          </div>
        </div>

      </div>
    )
  }

  const TeamCard = ({ team, index }) => (
    <div className="bg-white rounded-xl mx-3 mb-5 overflow-hidden shadow-sm border border-gray-200">
      <div className="p-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-semibold text-gray-800">Team {index + 1}</h3>
          <div className="flex items-center space-x-2">
            <Users size={16} className="text-gray-500" />
            <span className="text-sm text-gray-600">{team.players?.length || 11}</span>
          </div>
        </div>

        {/* Captain and Vice Captain */}
        <div className="flex justify-center space-x-6 mb-4">
          {team.captainId && (
            <div className="text-center">
              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mb-1">
                <span className="text-xs font-bold text-blue-600">C</span>
              </div>
              <span className="text-xs text-gray-600">
                {team.captainId.firstName} {team.captainId.lastName}
              </span>
            </div>
          )}
          {team.viceCaptainId && (
            <div className="text-center">
              <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center mb-1">
                <span className="text-xs font-bold text-purple-600">VC</span>
              </div>
              <span className="text-xs text-gray-600">
                {team.viceCaptainId.firstName} {team.viceCaptainId.lastName}
              </span>
            </div>
          )}
        </div>

        <div className="text-center">
          <span className="text-sm text-gray-600">
            Total Points: {team.totalPoints || 0}
          </span>
        </div>
      </div>
    </div>
  )

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-lg">Loading contests...</div>
      </div>
    )
  }

  if (!matchData) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-lg text-gray-500">No contest data found</div>
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
              onClick={() => navigate(-1)}
              className="mr-3 p-1 hover:bg-slate-700 rounded-full"
            >
              <ArrowLeft size={24} />
            </button>
            <div>
              <h1 className="text-xl font-bold">
                {matchData.team1?.shortName} v {matchData.team2?.shortName}
              </h1>
              <div className="flex items-center space-x-2 text-sm text-gray-300">
                <Clock size={14} />
                <span>
                  {matchData.status === 'completed' ? 'COMPLETED' : 
                   matchData.status === 'live' ? 'LIVE' : 'UPCOMING'}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Match Score Card (for completed matches) */}
      {matchData.status === 'completed' && (
        <div className="mx-3 mt-4 mb-4">
          <div className="bg-gradient-to-r from-slate-700 to-slate-800 rounded-xl p-4 text-white">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center">
                  {matchData.team1?.logo ? (
                    <img 
                      src={`${BACKEND_URL}${matchData.team1.logo}`} 
                      alt={matchData.team1.shortName}
                      className="w-8 h-8 object-contain"
                    />
                  ) : (
                    <span className="font-bold">{matchData.team1?.shortName?.charAt(0)}</span>
                  )}
                </div>
                <div>
                  <div className="font-bold">{matchData.team1?.shortName}</div>
                  <div className="text-sm opacity-75">
                    {matchData.team1Score || '200-6 (20)'}
                  </div>
                </div>
              </div>
              
              <div className="text-center">
                <div className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center mb-2">
                  <span className="text-2xl">🏆</span>
                </div>
              </div>

              <div className="flex items-center space-x-4">
                <div className="text-right">
                  <div className="font-bold">{matchData.team2?.shortName}</div>
                  <div className="text-sm opacity-75">
                    {matchData.team2Score || '120-10 (16.4)'}
                  </div>
                </div>
                <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center">
                  {matchData.team2?.logo ? (
                    <img 
                      src={`${BACKEND_URL}${matchData.team2.logo}`} 
                      alt={matchData.team2.shortName}
                      className="w-8 h-8 object-contain"
                    />
                  ) : (
                    <span className="font-bold">{matchData.team2?.shortName?.charAt(0)}</span>
                  )}
                </div>
              </div>
            </div>
            
            <div className="text-center mt-3 pt-3 border-t border-white/20">
              <span className="text-sm">
                {matchData.result || `${matchData.team1?.shortName} beat ${matchData.team2?.shortName} by 80 runs`}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Tabs */}
      <div className="bg-white border-b border-gray-200">
        <div className="flex justify-center overflow-x-auto scrollbar-hide">
          <TabButton tab="myContests" label="My Contests" count={userContests.length} />
        </div>
      </div>

      {/* Tab Content */}
      <div className="pb-20 pt-4">
        {activeTab === 'myContests' && (
          <div>
            {userContests.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 px-4">
                <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mb-4">
                  <Trophy size={24} className="text-gray-400" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  No contests joined
                </h3>
                <p className="text-gray-600 text-center">
                  You haven't joined any contests for this match
                </p>
              </div>
            ) : (
              <div>
                {userContests.map((contest, index) => {
                  // Since we don't have joinedUsers data, use teams in order
                  const teamUsedInContest = userTeams[index % userTeams.length] || userTeams[0]
                  const teamIndex = index % userTeams.length
                  
                  return (
                    <ContestCard 
                      key={contest._id} 
                      contest={contest} 
                      userTeam={teamUsedInContest}
                      teamIndex={teamIndex}
                    />
                  )
                })}
              </div>
            )}
          </div>
        )}


      </div>
    </div>
  )
}

export default MyContests