import React, { useState, useEffect, useContext } from 'react';
import { Edit3, Save, X, Plus, Minus } from 'lucide-react';
import axios from 'axios';
import { AppContext } from '../context/AppContext';

const ScoreCard = ({ matchId }) => {
  const { BACKEND_URL } = useContext(AppContext);
  const [matchData, setMatchData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editingPlayer, setEditingPlayer] = useState(null);
  const [battingTeam, setBattingTeam] = useState(''); // Dynamic team name
  const [pendingUpdates, setPendingUpdates] = useState({});
  const [bulkEditMode, setBulkEditMode] = useState(false);
  const [availableTeams, setAvailableTeams] = useState([]); // Store team names

  const fetchScore = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get(`${BACKEND_URL}/api/matches/${matchId}/scores`);
      console.log(data);
      setMatchData(data);
      
      // Extract team names dynamically from API response
      if (data.matchScore && data.matchScore.length > 0) {
        const teamNames = data.matchScore.map(team => team.teamName);
        setAvailableTeams(teamNames);
        
        // Set first team as default batting team if not already set
        if (!battingTeam && teamNames.length > 0) {
          setBattingTeam(teamNames[0]);
        }
      }
    } catch (error) {
      console.error('Error fetching match data:', error);
    } finally {
      setLoading(false);
    }
  };

  const editMultipleScores = async (playersData) => {
    try {
      const { data } = await axios.put(`${BACKEND_URL}/api/matches/${matchId}/players/scores`, {
        players: playersData
      });
      console.log('Multiple stats updated:', data);
      fetchScore();
    } catch (error) {
      console.error('Error updating multiple stats:', error);
    }
  };

  const addToPendingUpdates = (playerId, stats) => {
    setPendingUpdates(prev => ({
      ...prev,
      [playerId]: {
        ...prev[playerId],
        ...stats
      }
    }));
  };

  const saveAllPendingUpdates = async () => {
    const playersToUpdate = Object.keys(pendingUpdates).map(playerId => ({
      playerId,
      ...pendingUpdates[playerId]
    }));
    
    if (playersToUpdate.length > 0) {
      await editMultipleScores(playersToUpdate);
      setPendingUpdates({});
      setBulkEditMode(false);
      setEditingPlayer(null);
    }
  };

  const cancelAllUpdates = () => {
    setPendingUpdates({});
    setBulkEditMode(false);
    setEditingPlayer(null);
  };

  useEffect(() => {
    fetchScore();
  }, [matchId]);

  const handleEditClick = (player) => {
    if (!bulkEditMode) {
      setBulkEditMode(true);
    }
    
    setEditingPlayer(player._id);
    
    if (!pendingUpdates[player._id]) {
      addToPendingUpdates(player._id, {
        batting: { ...player.batting },
        bowling: { ...player.bowling },
        fielding: { ...player.fielding }
      });
    }
  };

  const handleCancelEdit = () => {
    if (editingPlayer) {
      const newPending = { ...pendingUpdates };
      delete newPending[editingPlayer];
      setPendingUpdates(newPending);
      setEditingPlayer(null);
      
      if (Object.keys(newPending).length === 0) {
        setBulkEditMode(false);
      }
    }
  };

  const updateStat = (category, field, value) => {
    if (editingPlayer && pendingUpdates[editingPlayer]) {
      setPendingUpdates(prev => ({
        ...prev,
        [editingPlayer]: {
          ...prev[editingPlayer],
          [category]: {
            ...prev[editingPlayer][category],
            [field]: value
          }
        }
      }));
    }
  };

  const incrementStat = (category, field) => {
    if (editingPlayer && pendingUpdates[editingPlayer]) {
      const currentValue = pendingUpdates[editingPlayer][category][field] || 0;
      updateStat(category, field, currentValue + 1);
    }
  };

  const decrementStat = (category, field) => {
    if (editingPlayer && pendingUpdates[editingPlayer]) {
      const currentValue = pendingUpdates[editingPlayer][category][field] || 0;
      updateStat(category, field, Math.max(currentValue - 1, 0));
    }
  };

  // Dynamic function to get bowling team players
  const getBowlingTeamPlayers = () => {
    if (!matchData || !matchData.matchScore || !battingTeam) return [];
    
    // Find the team that is NOT batting (bowling team)
    const bowlingTeam = matchData.matchScore.find(team => team.teamName !== battingTeam);
    return bowlingTeam ? bowlingTeam.players : [];
  };

  // Dynamic function to get batting team players
  const getBattingTeamPlayers = () => {
    if (!matchData || !matchData.matchScore || !battingTeam) return [];
    
    const battingTeamData = matchData.matchScore.find(team => team.teamName === battingTeam);
    return battingTeamData ? battingTeamData.players : [];
  };

  // Dynamic function to get fielding team players (opposite of batting team)
  const getFieldingTeamPlayers = () => {
    if (!matchData || !matchData.matchScore || !battingTeam) return [];
    
    // Fielding team is the team that is NOT batting
    const fieldingTeam = matchData.matchScore.find(team => team.teamName !== battingTeam);
    return fieldingTeam ? fieldingTeam.players : [];
  };

  // Get the bowling team name dynamically
  const getBowlingTeamName = () => {
    if (!availableTeams.length || !battingTeam) return '';
    return availableTeams.find(team => team !== battingTeam) || '';
  };

  // Get the fielding team name dynamically (same as bowling team)
  const getFieldingTeamName = () => {
    if (!availableTeams.length || !battingTeam) return '';
    return availableTeams.find(team => team !== battingTeam) || '';
  };

  // Get match title dynamically
  const getMatchTitle = () => {
    if (!matchData || !matchData.matchScore || matchData.matchScore.length < 2) {
      return 'Match Scorecard';
    }
    
    const team1 = matchData.matchScore[0].teamName;
    const team2 = matchData.matchScore[1].teamName;
    const series = matchData.matchScore[0].series || '';
    
    return `${team1} vs ${team2}${series ? ` • ${series}` : ''}`;
  };

  const getCurrentStats = (player, category) => {
    if (pendingUpdates[player._id] && pendingUpdates[player._id][category]) {
      return pendingUpdates[player._id][category];
    }
    return player[category];
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!matchData || !matchData.matchScore || availableTeams.length === 0) {
    return <div className="text-center p-8">No match data available</div>;
  }

  return (
    <div className="max-w-full mx-auto p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-3xl font-bold text-gray-800">{getMatchTitle()}</h1>
          <div className="flex gap-4">
            <select 
              value={battingTeam} 
              onChange={(e) => setBattingTeam(e.target.value)}
              className="px-4 py-2 border rounded-lg bg-white"
            >
              {availableTeams.map(teamName => (
                <option key={teamName} value={teamName}>
                  {teamName} Batting
                </option>
              ))}
            </select>
            
            {bulkEditMode && (
              <div className="flex gap-2">
                <button
                  onClick={saveAllPendingUpdates}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                >
                  Save All ({Object.keys(pendingUpdates).length})
                </button>
                <button
                  onClick={cancelAllUpdates}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                >
                  Cancel All
                </button>
              </div>
            )}
          </div>
        </div>
        <div className="text-lg text-gray-600">
          Total Players: {matchData.totalPlayers}
          {bulkEditMode && (
            <span className="ml-4 px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
              Bulk Edit Mode Active
            </span>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Batting Team Scorecard */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-md">
            <div className="bg-blue-600 text-white p-4 rounded-t-lg">
              <h2 className="text-xl font-bold">{battingTeam} Batting</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="p-3 text-left">Batsman</th>
                    <th className="p-3 text-center">R</th>
                    <th className="p-3 text-center">B</th>
                    <th className="p-3 text-center">4s</th>
                    <th className="p-3 text-center">6s</th>
                    <th className="p-3 text-center">SR</th>
                    <th className="p-3 text-center">Status</th>
                    <th className="p-3 text-center">Points</th>
                    <th className="p-3 text-center">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {getBattingTeamPlayers().map((player) => {
                    const battingStats = getCurrentStats(player, 'batting');
                    const isEditing = editingPlayer === player._id;
                    const hasPendingChanges = pendingUpdates[player._id];
                    
                    return (
                      <tr key={player._id} className="border-b hover:bg-gray-50">
                        <td className="p-3">
                          <div className="font-semibold">
                            {player.player.firstName} {player.player.lastName}
                            {hasPendingChanges && <span className="ml-2 text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded">Modified</span>}
                          </div>
                          <div className="text-sm text-gray-500">#{player.batting.battingOrder}</div>
                        </td>
                        <td className="p-3 text-center font-bold text-blue-600">
                          {isEditing ? (
                            <div className="flex items-center justify-center gap-1">
                              <button onClick={() => decrementStat('batting', 'runs')} className="text-red-500 hover:bg-red-100 rounded p-1">
                                <Minus size={12} />
                              </button>
                              <input
                                type="number"
                                value={battingStats.runs || 0}
                                onChange={(e) => updateStat('batting', 'runs', parseInt(e.target.value) || 0)}
                                className="w-16 p-1 border rounded text-center"
                              />
                              <button onClick={() => incrementStat('batting', 'runs')} className="text-green-500 hover:bg-green-100 rounded p-1">
                                <Plus size={12} />
                              </button>
                            </div>
                          ) : (
                            <span className={hasPendingChanges ? 'bg-yellow-100 px-2 py-1 rounded' : ''}>
                              {battingStats.runs}
                            </span>
                          )}
                        </td>
                        <td className="p-3 text-center">
                          {isEditing ? (
                            <input
                              type="number"
                              value={battingStats.ballsFaced || 0}
                              onChange={(e) => updateStat('batting', 'ballsFaced', parseInt(e.target.value) || 0)}
                              className="w-16 p-1 border rounded text-center"
                            />
                          ) : (
                            <span className={hasPendingChanges ? 'bg-yellow-100 px-2 py-1 rounded' : ''}>
                              {battingStats.ballsFaced}
                            </span>
                          )}
                        </td>
                        <td className="p-3 text-center">
                          {isEditing ? (
                            <div className="flex items-center justify-center gap-1">
                              <button onClick={() => decrementStat('batting', 'fours')} className="text-red-500 hover:bg-red-100 rounded p-1">
                                <Minus size={12} />
                              </button>
                              <span className="w-8 text-center">{battingStats.fours || 0}</span>
                              <button onClick={() => incrementStat('batting', 'fours')} className="text-green-500 hover:bg-green-100 rounded p-1">
                                <Plus size={12} />
                              </button>
                            </div>
                          ) : (
                            <span className={hasPendingChanges ? 'bg-yellow-100 px-2 py-1 rounded' : ''}>
                              {battingStats.fours}
                            </span>
                          )}
                        </td>
                        <td className="p-3 text-center">
                          {isEditing ? (
                            <div className="flex items-center justify-center gap-1">
                              <button onClick={() => decrementStat('batting', 'sixes')} className="text-red-500 hover:bg-red-100 rounded p-1">
                                <Minus size={12} />
                              </button>
                              <span className="w-8 text-center">{battingStats.sixes || 0}</span>
                              <button onClick={() => incrementStat('batting', 'sixes')} className="text-green-500 hover:bg-green-100 rounded p-1">
                                <Plus size={12} />
                              </button>
                            </div>
                          ) : (
                            <span className={hasPendingChanges ? 'bg-yellow-100 px-2 py-1 rounded' : ''}>
                              {battingStats.sixes}
                            </span>
                          )}
                        </td>
                        <td className="p-3 text-center">
                          {battingStats.ballsFaced > 0 ? ((battingStats.runs / battingStats.ballsFaced) * 100).toFixed(2) : '0.00'}
                        </td>
                        <td className="p-3 text-center">
                          {isEditing ? (
                            <select
                              value={battingStats.isOut ? 'out' : 'not-out'}
                              onChange={(e) => updateStat('batting', 'isOut', e.target.value === 'out')}
                              className="p-1 border rounded text-sm"
                            >
                              <option value="not-out">Not Out</option>
                              <option value="out">Out</option>
                            </select>
                          ) : (
                            <span className={`px-2 py-1 rounded text-xs ${battingStats.isOut ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'}`}>
                              {battingStats.isOut ? 'Out' : 'Not Out'}
                            </span>
                          )}
                        </td>
                        <td className="p-3 text-center font-bold text-green-600">
                          {player.fantasyPoints.totalPoints}
                        </td>
                        <td className="p-3 text-center">
                          {isEditing ? (
                            <button onClick={handleCancelEdit} className="text-red-600 hover:bg-red-100 p-1 rounded">
                              <X size={16} />
                            </button>
                          ) : (
                            <button onClick={() => handleEditClick(player)} className="text-blue-600 hover:bg-blue-100 p-1 rounded">
                              <Edit3 size={16} />
                            </button>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Fielding Stats - Now shows the fielding team (opposite of batting team) */}
          <div className="bg-white rounded-lg shadow-md mt-6">
            <div className="bg-green-600 text-white p-4 rounded-t-lg">
              <h2 className="text-xl font-bold">{getFieldingTeamName()} Fielding</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="p-3 text-left">Player</th>
                    <th className="p-3 text-center">Catches</th>
                    <th className="p-3 text-center">Stumpings</th>
                    <th className="p-3 text-center">Run Outs</th>
                    <th className="p-3 text-center">Fantasy Points</th>
                    <th className="p-3 text-center">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {getFieldingTeamPlayers().map((player) => {
                    const fieldingStats = getCurrentStats(player, 'fielding');
                    const isEditing = editingPlayer === player._id;
                    const hasPendingChanges = pendingUpdates[player._id];
                    
                    return (
                      <tr key={player._id} className="border-b hover:bg-gray-50">
                        <td className="p-3 font-semibold">
                          {player.player.firstName} {player.player.lastName}
                          {hasPendingChanges && <span className="ml-2 text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded">Modified</span>}
                        </td>
                        <td className="p-3 text-center">
                          {isEditing ? (
                            <div className="flex items-center justify-center gap-1">
                              <button onClick={() => decrementStat('fielding', 'catches')} className="text-red-500 hover:bg-red-100 rounded p-1">
                                <Minus size={12} />
                              </button>
                              <span className="w-8 text-center">{fieldingStats.catches || 0}</span>
                              <button onClick={() => incrementStat('fielding', 'catches')} className="text-green-500 hover:bg-green-100 rounded p-1">
                                <Plus size={12} />
                              </button>
                            </div>
                          ) : (
                            <span className={hasPendingChanges ? 'bg-yellow-100 px-2 py-1 rounded' : ''}>
                              {fieldingStats.catches}
                            </span>
                          )}
                        </td>
                        <td className="p-3 text-center">
                          {isEditing ? (
                            <div className="flex items-center justify-center gap-1">
                              <button onClick={() => decrementStat('fielding', 'stumpings')} className="text-red-500 hover:bg-red-100 rounded p-1">
                                <Minus size={12} />
                              </button>
                              <span className="w-8 text-center">{fieldingStats.stumpings || 0}</span>
                              <button onClick={() => incrementStat('fielding', 'stumpings')} className="text-green-500 hover:bg-green-100 rounded p-1">
                                <Plus size={12} />
                              </button>
                            </div>
                          ) : (
                            <span className={hasPendingChanges ? 'bg-yellow-100 px-2 py-1 rounded' : ''}>
                              {fieldingStats.stumpings}
                            </span>
                          )}
                        </td>
                        <td className="p-3 text-center">
                          {isEditing ? (
                            <div className="flex items-center justify-center gap-1">
                              <button onClick={() => decrementStat('fielding', 'runOuts')} className="text-red-500 hover:bg-red-100 rounded p-1">
                                <Minus size={12} />
                              </button>
                              <span className="w-8 text-center">{fieldingStats.runOuts || 0}</span>
                              <button onClick={() => incrementStat('fielding', 'runOuts')} className="text-green-500 hover:bg-green-100 rounded p-1">
                                <Plus size={12} />
                              </button>
                            </div>
                          ) : (
                            <span className={hasPendingChanges ? 'bg-yellow-100 px-2 py-1 rounded' : ''}>
                              {fieldingStats.runOuts}
                            </span>
                          )}
                        </td>
                        <td className="p-3 text-center font-bold text-green-600">
                          {player.fantasyPoints.totalPoints}
                        </td>
                        <td className="p-3 text-center">
                          {isEditing ? (
                            <button onClick={handleCancelEdit} className="text-red-600 hover:bg-red-100 p-1 rounded">
                              <X size={16} />
                            </button>
                          ) : (
                            <button onClick={() => handleEditClick(player)} className="text-blue-600 hover:bg-blue-100 p-1 rounded">
                              <Edit3 size={16} />
                            </button>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Bowling Team Stats - Table Format (Fantasy points removed) */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-md">
            <div className="bg-red-600 text-white p-4 rounded-t-lg">
              <h2 className="text-xl font-bold">{getBowlingTeamName()} Bowling</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="p-3 text-left">Bowler</th>
                    <th className="p-3 text-center">O</th>
                    <th className="p-3 text-center">R</th>
                    <th className="p-3 text-center">W</th>
                    <th className="p-3 text-center">Eco</th>
                    <th className="p-3 text-center">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {getBowlingTeamPlayers().map((player) => {
                    const bowlingStats = getCurrentStats(player, 'bowling');
                    const isEditing = editingPlayer === player._id;
                    const hasPendingChanges = pendingUpdates[player._id];
                    
                    return (
                      <tr key={player._id} className="border-b hover:bg-gray-50">
                        <td className="p-3">
                          <div className="font-semibold">
                            {player.player.firstName} {player.player.lastName}
                            {hasPendingChanges && <span className="ml-2 text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded">Modified</span>}
                          </div>
                        </td>
                        <td className="p-3 text-center">
                          {isEditing ? (
                            <input
                              type="number"
                              step="0.1"
                              value={bowlingStats.oversBowled || 0}
                              onChange={(e) => updateStat('bowling', 'oversBowled', parseFloat(e.target.value) || 0)}
                              className="w-16 p-1 border rounded text-center"
                            />
                          ) : (
                            <span className={hasPendingChanges ? 'bg-yellow-100 px-2 py-1 rounded' : ''}>
                              {bowlingStats.oversBowled}
                            </span>
                          )}
                        </td>
                        <td className="p-3 text-center">
                          {isEditing ? (
                            <input
                              type="number"
                              value={bowlingStats.runsGiven || 0}
                              onChange={(e) => updateStat('bowling', 'runsGiven', parseInt(e.target.value) || 0)}
                              className="w-16 p-1 border rounded text-center"
                            />
                          ) : (
                            <span className={hasPendingChanges ? 'bg-yellow-100 px-2 py-1 rounded' : ''}>
                              {bowlingStats.runsGiven}
                            </span>
                          )}
                        </td>
                        <td className="p-3 text-center">
                          {isEditing ? (
                            <div className="flex items-center justify-center gap-1">
                              <button onClick={() => decrementStat('bowling', 'wicketsTaken')} className="text-red-500 hover:bg-red-100 rounded p-1">
                                <Minus size={12} />
                              </button>
                              <span className="w-8 text-center">{bowlingStats.wicketsTaken || 0}</span>
                              <button onClick={() => incrementStat('bowling', 'wicketsTaken')} className="text-green-500 hover:bg-green-100 rounded p-1">
                                <Plus size={12} />
                              </button>
                            </div>
                          ) : (
                            <span className={`font-bold text-red-600 ${hasPendingChanges ? 'bg-yellow-100 px-2 py-1 rounded' : ''}`}>
                              {bowlingStats.wicketsTaken}
                            </span>
                          )}
                        </td>
                        <td className="p-3 text-center">
                          <span className="font-semibold">
                            {bowlingStats.oversBowled > 0 ? (bowlingStats.runsGiven / bowlingStats.oversBowled).toFixed(2) : '0.00'}
                          </span>
                        </td>
                        <td className="p-3 text-center">
                          {isEditing ? (
                            <button onClick={handleCancelEdit} className="text-red-600 hover:bg-red-100 p-1 rounded">
                              <X size={16} />
                            </button>
                          ) : (
                            <button onClick={() => handleEditClick(player)} className="text-blue-600 hover:bg-blue-100 p-1 rounded">
                              <Edit3 size={16} />
                            </button>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ScoreCard;