import React, { useState, useEffect, useContext } from "react";
import { useParams, Link, useSearchParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { AppContext } from "../context/AppContext";
import { ArrowLeft, Copy, Edit, Users } from "lucide-react";

const MyTeams = () => {
  const { matchId } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { BACKEND_URL, user } = useContext(AppContext);
  
  const fromPage = searchParams.get('from') || 'fantasy'; // Default to fantasy if not specified
  
  const getBackNavigationPath = () => {
    switch(fromPage) {
      case 'contest':
        return `/${matchId}/contest`
      case 'fantasy':
      default:
        return `/fantasy-sports` // Go to fantasy sport page
    }
  }
  
  const [userTeams, setUserTeams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedTeamForPreview, setSelectedTeamForPreview] = useState(null);
  const [showPreview, setShowPreview] = useState(false);

  const fetchUserTeams = async () => {
    if (!user?._id) {
      setLoading(false);
      return;
    }
    
    try {
      setLoading(true);
      setError(null);
      const { data } = await axios.get(`${BACKEND_URL}/api/userteam/${matchId}?userId=${user._id}`);
      if (data.success) {
        setUserTeams(data.data);
      } else {
        setError('Failed to load teams');
      }
    } catch (error) {
      console.error("Error fetching user teams:", error);
      setError('Failed to load teams. Please check your connection.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserTeams();
  }, [matchId, user]);

  // Handle browser back button behavior
  useEffect(() => {
    if (fromPage === 'contest') {
      // Push current page to history to handle back button
      window.history.pushState(null, '', window.location.href);
      
      const handlePopState = () => {
        // When back button is pressed, navigate based on fromPage
        navigate(getBackNavigationPath(), { replace: true });
      };

      window.addEventListener('popstate', handlePopState);

      return () => {
        window.removeEventListener('popstate', handlePopState);
      };
    }
  }, [fromPage, navigate, getBackNavigationPath]);

  const getPlayersByPosition = (team) => {
    const positions = {
      'wicket-keeper': [],
      'batsman': [],
      'all-rounder': [],
      'bowler': []
    };

    team.players?.forEach(playerObj => {
      const player = playerObj.player; // Access the populated player data
      if (player && positions[player.position]) {
        positions[player.position].push(player);
      }
    });

    return positions;
  };

  const openTeamPreview = (team) => {
    setSelectedTeamForPreview(team);
    setShowPreview(true);
  };

  const TeamCard = ({ team, index }) => {
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
        className="bg-gradient-to-b from-green-600 to-green-800 rounded-xl shadow-sm border-2 border-white p-3 mb-4 cursor-pointer hover:from-green-500 hover:to-green-700 transition-colors"
        onClick={() => openTeamPreview(team)}
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
            <Link 
              to={`/${matchId}/edit-team/${team._id}?from=${fromPage}`} 
              className="p-1.5 hover:bg-green-700 rounded-lg"
              onClick={(e) => e.stopPropagation()}
            >
              <Edit size={14} className="text-white" />
            </Link>
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
  };

  const TeamPreviewModal = ({ team, show, onClose }) => {
    if (!show || !team) return null;

    const playersByPosition = getPlayersByPosition(team);

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
                
                {/* MYSERIES11 Text - Top */}
                <div className="absolute -top-6 left-1/2 transform -translate-x-1/2">
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
                
                {/* MYSERIES11 Text - Bottom */}
                <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2">
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

          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-white hover:text-gray-300 p-2 z-20"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          {/* Team Name */}
          <div className="absolute top-4 left-4 z-20">
            <h2 className="text-white text-lg font-bold">Team {userTeams.findIndex(t => t._id === team._id) + 1}</h2>
          </div>

          {/* Ground View - Full Height */}
          <div className="h-full flex flex-col justify-center space-y-4 py-4 relative z-10">
            {/* Wicket Keepers */}
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
                                className="w-14 h-14 object-cover rounded-full"
                              />
                            ) : (
                              <div className="w-14 h-14 bg-gray-400 rounded-full flex items-center justify-center shadow-lg">
                                <span className="text-xs font-bold text-white">
                                  {player.firstName?.charAt(0)}{player.lastName?.charAt(0)}
                                </span>
                              </div>
                            )}
                            {/* Captain/Vice Captain Badge */}
                            {team.captain?._id === player._id && (
                              <div className="absolute -top-1 -right-1 w-5 h-5 bg-gray-700 rounded-full flex items-center justify-center">
                                <span className="text-white text-xs font-bold">C</span>
                              </div>
                            )}
                            {team.viceCaptain?._id === player._id && (
                              <div className="absolute -top-1 -right-1 w-5 h-5 bg-gray-700 rounded-full flex items-center justify-center">
                                <span className="text-white text-xs font-bold">VC</span>
                              </div>
                            )}
                          </div>
                          <div className="bg-black bg-opacity-80 text-white px-2 py-1 rounded">
                            <div className="text-xs font-medium truncate">{player.firstName?.charAt(0)} {player.lastName}</div>
                          </div>
                          <div className="text-white text-xs font-medium mt-1">{player.fantasyPrice || 8} Cr</div>
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
                                className="w-14 h-14 object-cover rounded-full"
                              />
                            ) : (
                              <div className="w-14 h-14 bg-gray-400 rounded-full flex items-center justify-center shadow-lg">
                                <span className="text-xs font-bold text-white">
                                  {player.firstName?.charAt(0)}{player.lastName?.charAt(0)}
                                </span>
                              </div>
                            )}
                            {team.captain?._id === player._id && (
                              <div className="absolute -top-1 -right-1 w-5 h-5 bg-gray-700 rounded-full flex items-center justify-center">
                                <span className="text-white text-xs font-bold">C</span>
                              </div>
                            )}
                            {team.viceCaptain?._id === player._id && (
                              <div className="absolute -top-1 -right-1 w-5 h-5 bg-gray-700 rounded-full flex items-center justify-center">
                                <span className="text-white text-xs font-bold">VC</span>
                              </div>
                            )}
                          </div>
                          <div className="bg-black bg-opacity-80 text-white px-2 py-1 rounded">
                            <div className="text-xs font-medium truncate">{player.firstName?.charAt(0)} {player.lastName}</div>
                          </div>
                          <div className="text-white text-xs font-medium mt-1">{player.fantasyPrice || 8} Cr</div>
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
                                className="w-14 h-14 object-cover rounded-full"
                              />
                            ) : (
                              <div className="w-14 h-14 bg-gray-400 rounded-full flex items-center justify-center shadow-lg">
                                <span className="text-xs font-bold text-white">
                                  {player.firstName?.charAt(0)}{player.lastName?.charAt(0)}
                                </span>
                              </div>
                            )}
                            {team.captain?._id === player._id && (
                              <div className="absolute -top-1 -right-1 w-5 h-5 bg-gray-700 rounded-full flex items-center justify-center">
                                <span className="text-white text-xs font-bold">C</span>
                              </div>
                            )}
                            {team.viceCaptain?._id === player._id && (
                              <div className="absolute -top-1 -right-1 w-5 h-5 bg-gray-700 rounded-full flex items-center justify-center">
                                <span className="text-white text-xs font-bold">VC</span>
                              </div>
                            )}
                          </div>
                          <div className="bg-black bg-opacity-80 text-white px-2 py-1 rounded">
                            <div className="text-xs font-medium truncate">{player.firstName?.charAt(0)} {player.lastName}</div>
                          </div>
                          <div className="text-white text-xs font-medium mt-1">{player.fantasyPrice || 8} Cr</div>
                        </div>
                      ))}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Bowlers */}
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
                                className="w-14 h-14 object-cover rounded-full"
                              />
                            ) : (
                              <div className="w-14 h-14 bg-gray-400 rounded-full flex items-center justify-center shadow-lg">
                                <span className="text-xs font-bold text-white">
                                  {player.firstName?.charAt(0)}{player.lastName?.charAt(0)}
                                </span>
                              </div>
                            )}
                            {team.captain?._id === player._id && (
                              <div className="absolute -top-1 -right-1 w-5 h-5 bg-gray-700 rounded-full flex items-center justify-center">
                                <span className="text-white text-xs font-bold">C</span>
                              </div>
                            )}
                            {team.viceCaptain?._id === player._id && (
                              <div className="absolute -top-1 -right-1 w-5 h-5 bg-gray-700 rounded-full flex items-center justify-center">
                                <span className="text-white text-xs font-bold">VC</span>
                              </div>
                            )}
                          </div>
                          <div className="bg-black bg-opacity-80 text-white px-2 py-1 rounded">
                            <div className="text-xs font-medium truncate">{player.firstName?.charAt(0)} {player.lastName}</div>
                          </div>
                          <div className="text-white text-xs font-medium mt-1">{player.fantasyPrice || 8} Cr</div>
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
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen" style={{backgroundColor: '#e5e5e5'}}>
        <div className="bg-gray-800 text-white p-4">
          <div className="flex items-center">
            <Link to={getBackNavigationPath()}>
              <ArrowLeft size={24} className="mr-3" />
            </Link>
            <div>
              <h1 className="text-xl font-semibold flex items-center">
                My Teams
                <Users size={20} className="ml-2" />
              </h1>
              <p className="text-sm text-gray-300">Loading...</p>
            </div>
          </div>
        </div>
        <div className="flex justify-center items-center min-h-96">
          <div className="text-lg">Loading teams...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{backgroundColor: '#e5e5e5'}}>
      {/* Header */}
      <div className="bg-gray-800 text-white p-4">
        <div className="flex items-center">
          <Link to={getBackNavigationPath()}>
            <ArrowLeft size={24} className="mr-3" />
          </Link>
          <div>
            <h1 className="text-xl font-semibold flex items-center">
              My Teams
              <Users size={20} className="ml-2" />
            </h1>
            <p className="text-sm text-gray-300">
              {userTeams.length > 0 ? `${userTeams.length} team${userTeams.length > 1 ? 's' : ''} created` : 'No teams yet'}
            </p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">
            My Teams ({userTeams.length})
          </h2>
        </div>

        {error ? (
          <div className="text-center py-12">
            <div className="text-red-400 mb-4">
              <Users size={48} className="mx-auto mb-2" />
            </div>
            <h3 className="text-lg font-medium text-red-600 mb-2">Failed to load teams</h3>
            <p className="text-gray-500 mb-6">{error}</p>
            <button
              onClick={fetchUserTeams}
              className="bg-blue-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-600 transition-colors"
            >
              Try Again
            </button>
          </div>
        ) : userTeams.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <Users size={48} className="mx-auto mb-2" />
            </div>
            <h3 className="text-lg font-medium text-gray-600 mb-2">No teams created yet</h3>
            <p className="text-gray-500 mb-6">Create your first team to get started!</p>
            <Link
              to={`/${matchId}/create-team`}
              className="bg-black text-white px-6 py-3 rounded-lg font-semibold hover:bg-gray-800 transition-colors"
            >
              Create Team
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {userTeams.map((team, index) => (
              <TeamCard key={team._id} team={team} index={index} />
            ))}
          </div>
        )}

        {/* Create More Teams Button */}
        {userTeams.length > 0 && (
          <div className="mt-8 text-center">
            <Link
              to={`/${matchId}/create-team`}
              className="bg-gray-100 text-gray-700 px-8 py-4 rounded-2xl font-semibold hover:bg-gray-200 transition-colors inline-block"
            >
              Create More Teams
            </Link>
          </div>
        )}
      </div>

      {/* Bottom padding */}
      <div className="h-20"></div>

      {/* Team Preview Modal */}
      <TeamPreviewModal 
        team={selectedTeamForPreview}
        show={showPreview}
        onClose={() => setShowPreview(false)}
      />
    </div>
  );
};

export default MyTeams;