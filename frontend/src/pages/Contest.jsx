import React, { useState, useEffect, useContext } from "react";
import ContestCard from "../components/ContestCard";
import { Link, useParams } from "react-router-dom";
import axios from "axios";
import { AppContext } from "../context/AppContext";
import { X, ArrowLeft, Users } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from 'react-toastify';

const Contest = () => {
  const { matchId } = useParams();
  const { BACKEND_URL, user } = useContext(AppContext);
  const navigate = useNavigate();
  const [contests, setContests] = useState([]);
  const [userTeams, setUserTeams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showJoinModal, setShowJoinModal] = useState(false);
  const [showTeamSelect, setShowTeamSelect] = useState(false);
  const [selectedContest, setSelectedContest] = useState(null);
  const [selectedTeam, setSelectedTeam] = useState(null);
  const [joining, setJoining] = useState(false);

  const fetchContest = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get(`${BACKEND_URL}/api/contests/${matchId}`);
      console.log(data);
      if (data.success) {
        setContests(data.data);
      }
    } catch (error) {
      console.error("Error fetching contests:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchUserTeams = async () => {
    if (!user?._id) return;
    
    try {
      const { data } = await axios.get(`${BACKEND_URL}/api/userteam/${matchId}?userId=${user._id}`);
      if (data.success) {
        setUserTeams(data.data);
      }
    } catch (error) {
      console.error("Error fetching user teams:", error);
    }
  };

  useEffect(() => {
    fetchContest();
    fetchUserTeams();
  }, [matchId, user]);

  // Handle browser back button behavior
  useEffect(() => {
    // Push the fantasy sports page to history so back button goes there
    window.history.pushState(null, '', window.location.href);
    
    const handlePopState = () => {
      // When back button is pressed, navigate to fantasy sports
      navigate('/fantasy-sport', { replace: true });
    };

    window.addEventListener('popstate', handlePopState);

    return () => {
      window.removeEventListener('popstate', handlePopState);
    };
  }, [navigate]);

  const groupContestsByFormat = (contests) => {
    return contests.reduce((acc, contest) => {
      if (!acc[contest.contestFormat]) {
        acc[contest.contestFormat] = [];
      }
      acc[contest.contestFormat].push(contest);
      return acc;
    }, {});
  };

  const groupedContests = groupContestsByFormat(contests);

  const handleJoinClick = (contest) => {
    if (!user?._id) {
      alert('Please login to join contests');
      return;
    }

    // If user has no teams, redirect to create team page
    if (userTeams.length === 0) {
      navigate(`/${matchId}/create-team`);
      return;
    }

    setSelectedContest(contest);
    
    // If user has only 1 team, show join modal directly
    if (userTeams.length === 1) {
      setSelectedTeam(userTeams[0]);
      setShowJoinModal(true);
    } else {
      // If user has multiple teams, show team selection first
      setShowTeamSelect(true);
    }
  };

  const handleTeamSelection = (team) => {
    setSelectedTeam(team);
    setShowTeamSelect(false);
    setShowJoinModal(true);
  };

  const handleJoinContest = async () => {
    if (!selectedContest || !user?._id || !selectedTeam) {
      alert('Please select a team first');
      return;
    }

    // Prepare payload
    const payload = {
      contestId: selectedContest._id,
      userId: user._id,
      teamId: selectedTeam._id, 
      matchId: matchId
    };

    // Console log the payload
    console.log('Join Contest Payload:', payload);
    console.log('Contest Details:', {
      contestName: selectedContest.name,
      entryFee: selectedContest.entryFee,
      prizePool: selectedContest.prizePool,
      totalSpots: selectedContest.totalSpots
    });
    console.log('Selected Team:', selectedTeam);
    
    setJoining(true);
    try {
      console.log('Making API call to:', `${BACKEND_URL}/api/contests/join`);
      console.log('Payload being sent:', payload);
      
      const {data} = await axios.post(`${BACKEND_URL}/api/contests/join`, {
      contestId: selectedContest._id,
      userId: user._id,
      teamId: selectedTeam._id, 
      matchId: matchId
      })
      
      console.log('API Response:', data);
      
      // Update the contest's current participants count in the UI
      setContests(prevContests => 
        prevContests.map(contest => 
          contest._id === selectedContest._id 
            ? { ...contest, currentParticipants: (contest.currentParticipants || 0) + 1 }
            : contest
        )
      );
      
      // Show quick success toast
      toast.success('Contest joined successfully! 🎯', {
        position: "top-center",
        autoClose: 600,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: false,
        draggable: true,
      });
      
      setShowJoinModal(false);
      setSelectedTeam(null);
      setSelectedContest(null);
    } catch (error) {
      console.error('Error joining contest:', error);
      console.error('Error details:', error.response?.data || error.message);
      
      // Extract error message from backend response
      const errorMessage = error.response?.data?.message || 'Failed to join contest. Please try again.';
      
      // Show specific error toast based on backend response
      let displayMessage = errorMessage;
      let autoCloseTime = 3000;
      
      // Check for specific error types and customize messages
      if (errorMessage.includes('Insufficient balance')) {
        displayMessage = errorMessage; // Use the detailed message from backend with amounts
        autoCloseTime = 4000;
      } else if (errorMessage.includes('only join this contest with maximum')) {
        displayMessage = errorMessage; // Use the detailed message from backend
        autoCloseTime = 3500;
      } else if (errorMessage.includes('contest full')) {
        displayMessage = 'Contest is full! Try joining another contest.';
        autoCloseTime = 2500;
      } else if (errorMessage.includes('match is live')) {
        displayMessage = 'Cannot join contest. Match has already started.';
        autoCloseTime = 2500;
      }
      
      toast.error(displayMessage, {
        position: "top-center",
        autoClose: autoCloseTime,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        style: {
          fontSize: '14px',
          maxWidth: '350px',
          textAlign: 'center'
        }
      });
    } finally {
      setJoining(false);
    }
  };


  if (loading) {
    return (
      <div className="bg-gray-50 min-h-screen">
        {/* Header */}
        <div className="bg-gray-800 text-white p-4">
          <div className="flex items-center">
            <button onClick={() => navigate('/fantasy-sport', { replace: true })} className="mr-3">
              <ArrowLeft size={24} />
            </button>
            <div>
              <h1 className="text-xl font-semibold">Contests</h1>
              <p className="text-sm text-gray-300">Loading...</p>
            </div>
          </div>
        </div>
        <div className="flex justify-center items-center min-h-96">
          <div className="text-lg">Loading contests...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="bg-gray-800 text-white p-4">
        <div className="flex items-center">
          <button onClick={() => navigate('/fantasy-sport', { replace: true })} className="mr-3">
            <ArrowLeft size={24} />
          </button>
          <div>
            <h1 className="text-xl font-semibold">Contests</h1>
            <p className="text-sm text-gray-300">Join contests and win prizes</p>
          </div>
        </div>
      </div>

      {Object.keys(groupedContests).length === 0 ? (
        <div className="flex justify-center items-center min-h-screen">
          <div className="text-lg text-gray-500">No contests available</div>
        </div>
      ) : (
        Object.entries(groupedContests).map(([format, contestList]) => (
          <div key={format} className="mb-6">
            <h2 className="text-xl font-semibold mb-4 px-4 pt-4 capitalize">
              {format === "h2h"
                ? "Head to Head"
                : format.replace(/([A-Z])/g, " $1").trim()}
            </h2>
            {contestList.map((contest) => (
              <ContestCard 
                key={contest._id} 
                contest={contest} 
                onJoinClick={handleJoinClick}
              />
            ))}
          </div>
        ))
      )}
      
      {/* Fixed Team Buttons - always visible at bottom */}
      <div className="fixed left-1/2 transform -translate-x-1/2 w-full max-w-[440px] bg-white border-t border-gray-100 px-4 py-3 z-40 bottom-0">
        <div className="flex space-x-3">
          <button 
            onClick={() => navigate(`/${matchId}/my-teams?from=contest`, { replace: true })}
            className="flex-1 bg-gray-600 text-white py-3 px-4 rounded-lg font-semibold text-center hover:bg-gray-700 transition-colors shadow-lg"
          >
            My Teams {userTeams.length > 0 && `(${userTeams.length})`}
          </button>
          <Link to={`/${matchId}/create-team`} className="flex-1">
            <button className="w-full bg-black text-white py-3 px-4 rounded-lg font-semibold text-center hover:bg-gray-800 transition-colors shadow-lg">
              Create Team
            </button>
          </Link>
        </div>
      </div>
      
      {/* Bottom padding to prevent content overlap with fixed buttons */}
      <div className="h-20"></div>

      {/* Team Selection Modal */}
      {showTeamSelect && selectedContest && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-end justify-center">
          <div className="bg-white w-full max-w-md rounded-t-2xl shadow-xl max-h-[80vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-t-2xl">
              <div className="flex items-center space-x-3">
                <button
                  onClick={() => setShowTeamSelect(false)}
                  className="p-1 hover:bg-white/10 rounded-full"
                >
                  <ArrowLeft size={20} />
                </button>
                <div>
                  <h2 className="text-lg font-semibold">Select Team</h2>
                  <p className="text-sm text-green-100">Choose team to join contest</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm text-green-100">My Teams: {userTeams.length}</p>
              </div>
            </div>

            {/* Teams List */}
            <div className="p-4 space-y-4">
              <p className="text-sm text-gray-600 mb-4">
                You can enter with maximum {selectedContest?.maxTeamPerUser || 1} team{(selectedContest?.maxTeamPerUser || 1) > 1 ? 's' : ''} in this contest
              </p>
              
              {userTeams.map((team, index) => {
                const captain = team.captain;
                const viceCaptain = team.viceCaptain;
                
                const getPlayerStats = (player) => {
                  return {
                    wk: player.position === 'wicket-keeper' ? 1 : 0,
                    bat: player.position === 'batsman' ? 1 : 0,
                    ar: player.position === 'all-rounder' ? 1 : 0,
                    bowl: player.position === 'bowler' ? 1 : 0
                  };
                };

                const teamStats = team.players?.reduce((acc, playerObj) => {
                  const player = playerObj.player; // Access the populated player data
                  if (player) {
                    const stats = getPlayerStats(player);
                    acc.wk += stats.wk;
                    acc.bat += stats.bat;
                    acc.ar += stats.ar;
                    acc.bowl += stats.bowl;
                  }
                  return acc;
                }, { wk: 0, bat: 0, ar: 0, bowl: 0 });

                return (
                  <div 
                    key={team._id}
                    onClick={() => handleTeamSelection(team)}
                    className="bg-gradient-to-b from-green-600 to-green-800 rounded-xl shadow-sm border-2 border-white p-3 cursor-pointer hover:from-green-700 hover:to-green-900 transition-all duration-200"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="text-base font-semibold text-white">
                        Team {index + 1}
                      </h3>
                      <div className="flex items-center space-x-2">
                        <div className="flex items-center text-white">
                          <Users size={14} className="mr-1" />
                          <span className="text-xs">{team.players?.length || 0}</span>
                        </div>
                        <div className="w-5 h-5 border-2 border-white rounded-full flex items-center justify-center">
                          <div className="w-2 h-2 bg-white rounded-full opacity-0 hover:opacity-100"></div>
                        </div>
                      </div>
                    </div>

                    {/* Captain and Vice Captain */}
                    <div className="flex justify-center mb-4">
                      <div className="flex space-x-6">
                        {captain && (
                          <div className="flex flex-col items-center">
                            <div className="relative mb-1">
                              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center overflow-hidden">
                                {captain.imgLink ? (
                                  <img 
                                    src={`${BACKEND_URL}${captain.imgLink}`} 
                                    alt={`${captain.firstName} ${captain.lastName}`}
                                    className="w-full h-full object-cover rounded-full"
                                  />
                                ) : (
                                  <div className="w-10 h-10 bg-blue-400 rounded-full flex items-center justify-center">
                                    <span className="text-white text-xs font-bold">
                                      {captain.firstName?.charAt(0)}{captain.lastName?.charAt(0)}
                                    </span>
                                  </div>
                                )}
                              </div>
                              <div className="absolute -top-1 -right-1 w-5 h-5 bg-gray-700 rounded-full flex items-center justify-center">
                                <span className="text-white text-xs font-bold">C</span>
                              </div>
                            </div>
                            <div className="bg-white border border-gray-800 rounded-full px-2 py-0.5">
                              <span className="text-xs font-medium text-gray-800">
                                {captain.firstName && captain.lastName 
                                  ? `${captain.firstName} ${captain.lastName}`.length > 10 
                                    ? `${captain.firstName} ${captain.lastName}`.substring(0, 10) + '...' 
                                    : `${captain.firstName} ${captain.lastName}`
                                  : 'Captain'
                                }
                              </span>
                            </div>
                          </div>
                        )}

                        {viceCaptain && (
                          <div className="flex flex-col items-center">
                            <div className="relative mb-1">
                              <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center overflow-hidden">
                                {viceCaptain.imgLink ? (
                                  <img 
                                    src={`${BACKEND_URL}${viceCaptain.imgLink}`} 
                                    alt={`${viceCaptain.firstName} ${viceCaptain.lastName}`}
                                    className="w-full h-full object-cover rounded-full"
                                  />
                                ) : (
                                  <div className="w-10 h-10 bg-orange-400 rounded-full flex items-center justify-center">
                                    <span className="text-white text-xs font-bold">
                                      {viceCaptain.firstName?.charAt(0)}{viceCaptain.lastName?.charAt(0)}
                                    </span>
                                  </div>
                                )}
                              </div>
                              <div className="absolute -top-1 -right-1 w-5 h-5 bg-gray-700 rounded-full flex items-center justify-center">
                                <span className="text-white text-xs font-bold">VC</span>
                              </div>
                            </div>
                            <div className="bg-gray-700 rounded-full px-2 py-0.5">
                              <span className="text-xs font-medium text-white">
                                {viceCaptain.firstName && viceCaptain.lastName 
                                  ? `${viceCaptain.firstName} ${viceCaptain.lastName}`.length > 10 
                                    ? `${viceCaptain.firstName} ${viceCaptain.lastName}`.substring(0, 10) + '...' 
                                    : `${viceCaptain.firstName} ${viceCaptain.lastName}`
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
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Join Contest Modal */}
      {showJoinModal && selectedContest && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-end justify-center">
          <div className="bg-white w-full max-w-md rounded-t-2xl shadow-xl">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-800">Confirmation</h2>
              <button
                onClick={() => setShowJoinModal(false)}
                className="p-1 hover:bg-gray-100 rounded-full"
              >
                <X size={20} className="text-gray-500" />
              </button>
            </div>

            {/* Amount Unutilised Info */}
            <div className="px-4 py-3 bg-gray-50 border-b border-gray-200">
              <div className="text-center">
                <span className="text-sm text-gray-600">Amount Unutilised + Winnings = </span>
                <span className="text-sm font-semibold text-gray-800">₹5</span>
              </div>
            </div>

            {/* Entry Fee Details */}
            <div className="p-4 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-gray-800 font-medium">Entry</span>
                <span className="text-gray-800 font-semibold">₹{selectedContest.entryFee || 0}</span>
              </div>

              {/* Divider */}
              <hr className="border-gray-200" />

              {/* To Pay */}
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <span className="text-gray-800 font-medium">To Pay</span>
                  <div className="w-4 h-4 bg-gray-200 rounded-full flex items-center justify-center">
                    <span className="text-gray-600 text-xs">i</span>
                  </div>
                </div>
                <span className="text-gray-800 font-bold text-lg">₹{selectedContest.entryFee || 0}</span>
              </div>

              {/* Terms and Conditions */}
              <div className="flex items-start space-x-2 mt-4">
                <input type="checkbox" className="mt-1" defaultChecked />
                <span className="text-xs text-gray-600">
                  I agree with the standard <span className="text-blue-600 underline">T&Cs</span>
                </span>
              </div>
            </div>

            {/* Join Button */}
            <div className="p-4">
              <button
                onClick={handleJoinContest}
                disabled={joining}
                className="w-full bg-green-500 hover:bg-green-600 text-white py-3 px-4 rounded-lg font-semibold transition-colors disabled:opacity-50"
              >
                {joining ? 'JOINING...' : 'JOIN CONTEST'}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default Contest;
