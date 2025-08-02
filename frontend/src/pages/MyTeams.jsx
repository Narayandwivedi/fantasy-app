import React, { useState, useEffect, useContext } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import { AppContext } from "../context/AppContext";
import { ArrowLeft, Copy, Edit, Users } from "lucide-react";

const MyTeams = () => {
  const { matchId } = useParams();
  const { BACKEND_URL, user } = useContext(AppContext);
  const [userTeams, setUserTeams] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchUserTeams = async () => {
    if (!user?._id) return;
    
    try {
      const { data } = await axios.get(`${BACKEND_URL}/api/userteam/${matchId}?userId=${user._id}`);
      if (data.success) {
        setUserTeams(data.data);
      }
    } catch (error) {
      console.error("Error fetching user teams:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserTeams();
  }, [matchId, user]);

  const TeamCard = ({ team, index }) => {
    const captain = team.captain;
    const viceCaptain = team.viceCaptain;
    
    const getPlayerStats = (player) => {
      return {
        wk: player.playerType === 'wicket-keeper' ? 1 : 0,
        bat: player.playerType === 'batsman' ? 1 : 0,
        ar: player.playerType === 'all-rounder' ? 1 : 0,
        bowl: player.playerType === 'bowler' ? 1 : 0
      };
    };

    const teamStats = team.players?.reduce((acc, player) => {
      const stats = getPlayerStats(player);
      acc.wk += stats.wk;
      acc.bat += stats.bat;
      acc.ar += stats.ar;
      acc.bowl += stats.bowl;
      return acc;
    }, { wk: 0, bat: 0, ar: 0, bowl: 0 });

    return (
      <div className="bg-gradient-to-b from-green-600 to-green-800 rounded-xl shadow-sm border-2 border-white p-3 mb-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-base font-semibold text-white">
            Team {index + 1}
          </h3>
          <div className="flex items-center space-x-2">
            <div className="flex items-center text-white">
              <Users size={14} className="mr-1" />
              <span className="text-xs">{team.players?.length || 0}</span>
            </div>
            <button className="p-1.5 hover:bg-green-700 rounded-lg">
              <Edit size={14} className="text-white" />
            </button>
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

  if (loading) {
    return (
      <div className="min-h-screen" style={{backgroundColor: '#e5e5e5'}}>
        <div className="bg-gray-800 text-white p-4">
          <div className="flex items-center">
            <Link to={`/${matchId}/contest`}>
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
          <Link to={`/${matchId}/contest`}>
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

        {userTeams.length === 0 ? (
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
    </div>
  );
};

export default MyTeams;