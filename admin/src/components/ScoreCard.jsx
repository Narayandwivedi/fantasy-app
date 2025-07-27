import React, { useState, useEffect, useContext, useCallback } from 'react';
import { Edit3, Save, X, Plus, Minus, ChevronUp, ChevronDown, Zap, Users, Activity } from 'lucide-react';
import axios from 'axios';
import { AppContext } from '../context/AppContext';

const ScoreCard = ({ matchId }) => {
  const { BACKEND_URL } = useContext(AppContext);
  const [matchData, setMatchData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editingPlayer, setEditingPlayer] = useState(null);
  const [battingTeam, setBattingTeam] = useState('');
  const [pendingUpdates, setPendingUpdates] = useState({});
  const [bulkEditMode, setBulkEditMode] = useState(false);
  const [availableTeams, setAvailableTeams] = useState([]);
  const [quickEditMode, setQuickEditMode] = useState(false);
  const [selectedPlayers, setSelectedPlayers] = useState(new Set());
  const [isUpdating, setIsUpdating] = useState(false);

  // Quick action presets
  const quickActions = {
    batting: [
      { label: 'Single', runs: 1, balls: 1 },
      { label: 'Double', runs: 2, balls: 1 },
      { label: 'Triple', runs: 3, balls: 1 },
      { label: 'Four', runs: 4, balls: 1, fours: 1 },
      { label: 'Six', runs: 6, balls: 1, sixes: 1 },
      { label: 'Dot Ball', runs: 0, balls: 1 },
    ],
    bowling: [
      { label: 'Dot Ball', runs: 0, balls: 1 },
      { label: 'Single', runs: 1, balls: 1 },
      { label: 'Wicket', runs: 0, balls: 1, wickets: 1 },
      { label: 'Wide', runs: 1, balls: 0, wides: 1 },
      { label: 'No Ball', runs: 1, balls: 0, noBalls: 1 },
    ]
  };

  const fetchScore = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get(`${BACKEND_URL}/api/matches/${matchId}/scores`);
      setMatchData(data);
      
      if (data.matchScore && data.matchScore.length > 0) {
        const teamNames = data.matchScore.map(team => team.teamName);
        setAvailableTeams(teamNames);
        
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
      setIsUpdating(true);
      const { data } = await axios.put(`${BACKEND_URL}/api/matches/${matchId}/players/scores`, {
        players: playersData
      });
      console.log('Multiple stats updated:', data);
      await fetchScore();
      // Show success toast/notification here
    } catch (error) {
      console.error('Error updating multiple stats:', error);
      // Show error toast/notification here
    } finally {
      setIsUpdating(false);
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
      setSelectedPlayers(new Set());
    }
  };

  const cancelAllUpdates = () => {
    setPendingUpdates({});
    setBulkEditMode(false);
    setEditingPlayer(null);
    setSelectedPlayers(new Set());
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

  // Enhanced update function with validation
  const updateStat = (category, field, value) => {
    if (editingPlayer && pendingUpdates[editingPlayer]) {
      // Validation to prevent negative values
      const validatedValue = Math.max(0, value);
      
      setPendingUpdates(prev => ({
        ...prev,
        [editingPlayer]: {
          ...prev[editingPlayer],
          [category]: {
            ...prev[editingPlayer][category],
            [field]: validatedValue
          }
        }
      }));
    }
  };

  // Keyboard shortcuts for quick updates
  useEffect(() => {
    const handleKeyPress = (e) => {
      if (!editingPlayer || !pendingUpdates[editingPlayer]) return;
      
      // Number keys 1-6 for quick runs update
      if (e.key >= '1' && e.key <= '6' && !e.ctrlKey && !e.altKey) {
        const runs = parseInt(e.key);
        updateStat('batting', 'runs', pendingUpdates[editingPlayer].batting.runs + runs);
        updateStat('batting', 'ballsFaced', pendingUpdates[editingPlayer].batting.ballsFaced + 1);
        
        if (runs === 4) {
          updateStat('batting', 'fours', pendingUpdates[editingPlayer].batting.fours + 1);
        } else if (runs === 6) {
          updateStat('batting', 'sixes', pendingUpdates[editingPlayer].batting.sixes + 1);
        }
      }
      
      // 0 for dot ball
      if (e.key === '0') {
        updateStat('batting', 'ballsFaced', pendingUpdates[editingPlayer].batting.ballsFaced + 1);
      }
      
      // W for wicket
      if (e.key.toLowerCase() === 'w') {
        updateStat('batting', 'isOut', true);
      }
    };
    
    window.addEventListener('keypress', handleKeyPress);
    return () => window.removeEventListener('keypress', handleKeyPress);
  }, [editingPlayer, pendingUpdates]);

  const incrementStat = (category, field, increment = 1) => {
    if (editingPlayer && pendingUpdates[editingPlayer]) {
      const currentValue = pendingUpdates[editingPlayer][category][field] || 0;
      updateStat(category, field, currentValue + increment);
    }
  };

  const decrementStat = (category, field, decrement = 1) => {
    if (editingPlayer && pendingUpdates[editingPlayer]) {
      const currentValue = pendingUpdates[editingPlayer][category][field] || 0;
      updateStat(category, field, Math.max(currentValue - decrement, 0));
    }
  };

  // Quick action handler
  const applyQuickAction = (playerId, action, category) => {
    if (!pendingUpdates[playerId]) {
      const player = getBattingTeamPlayers().find(p => p._id === playerId) || 
                     getBowlingTeamPlayers().find(p => p._id === playerId);
      if (player) {
        addToPendingUpdates(playerId, {
          batting: { ...player.batting },
          bowling: { ...player.bowling },
          fielding: { ...player.fielding }
        });
      }
    }
    
    setEditingPlayer(playerId);
    
    if (category === 'batting') {
      if (action.runs !== undefined) {
        incrementStat('batting', 'runs', action.runs);
      }
      if (action.balls !== undefined) {
        incrementStat('batting', 'ballsFaced', action.balls);
      }
      if (action.fours !== undefined) {
        incrementStat('batting', 'fours', action.fours);
      }
      if (action.sixes !== undefined) {
        incrementStat('batting', 'sixes', action.sixes);
      }
    } else if (category === 'bowling') {
      if (action.runs !== undefined) {
        incrementStat('bowling', 'runsGiven', action.runs);
      }
      if (action.balls !== undefined) {
        incrementStat('bowling', 'oversBowled', action.balls / 6);
      }
      if (action.wickets !== undefined) {
        incrementStat('bowling', 'wicketsTaken', action.wickets);
      }
    }
    
    if (!bulkEditMode) {
      setBulkEditMode(true);
    }
  };

  // Batch player selection
  const togglePlayerSelection = (playerId) => {
    const newSelection = new Set(selectedPlayers);
    if (newSelection.has(playerId)) {
      newSelection.delete(playerId);
    } else {
      newSelection.add(playerId);
    }
    setSelectedPlayers(newSelection);
  };

  const getBowlingTeamPlayers = () => {
    if (!matchData || !matchData.matchScore || !battingTeam) return [];
    const bowlingTeam = matchData.matchScore.find(team => team.teamName !== battingTeam);
    return bowlingTeam ? bowlingTeam.players : [];
  };

  const getBattingTeamPlayers = () => {
    if (!matchData || !matchData.matchScore || !battingTeam) return [];
    const battingTeamData = matchData.matchScore.find(team => team.teamName === battingTeam);
    return battingTeamData ? battingTeamData.players : [];
  };

  const getFieldingTeamPlayers = () => {
    if (!matchData || !matchData.matchScore || !battingTeam) return [];
    const fieldingTeam = matchData.matchScore.find(team => team.teamName !== battingTeam);
    return fieldingTeam ? fieldingTeam.players : [];
  };

  const getBowlingTeamName = () => {
    if (!availableTeams.length || !battingTeam) return '';
    return availableTeams.find(team => team !== battingTeam) || '';
  };

  const getFieldingTeamName = () => {
    if (!availableTeams.length || !battingTeam) return '';
    return availableTeams.find(team => team !== battingTeam) || '';
  };

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

  // Calculate team totals
  const getTeamTotals = (teamPlayers) => {
    return teamPlayers.reduce((totals, player) => {
      const battingStats = getCurrentStats(player, 'batting');
      return {
        runs: totals.runs + (battingStats.runs || 0),
        wickets: totals.wickets + (battingStats.isOut ? 1 : 0),
        overs: totals.overs + (getCurrentStats(player, 'bowling').oversBowled || 0)
      };
    }, { runs: 0, wickets: 0, overs: 0 });
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

  const battingTeamTotals = getTeamTotals(getBattingTeamPlayers());

  return (
    <div className="max-w-full mx-auto p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-3xl font-bold text-gray-800">{getMatchTitle()}</h1>
          <div className="flex gap-4 items-center">
            <button
              onClick={() => setQuickEditMode(!quickEditMode)}
              className={`px-4 py-2 rounded-lg flex items-center gap-2 ${
                quickEditMode ? 'bg-purple-600 text-white' : 'bg-gray-200 text-gray-700'
              }`}
            >
              <Zap size={16} />
              Quick Edit
            </button>
            
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
                  disabled={isUpdating}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 flex items-center gap-2"
                >
                  <Save size={16} />
                  Save All ({Object.keys(pendingUpdates).length})
                </button>
                <button
                  onClick={cancelAllUpdates}
                  disabled={isUpdating}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50"
                >
                  Cancel All
                </button>
              </div>
            )}
          </div>
        </div>
        
        {/* Live Score Display */}
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white p-4 rounded-lg">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-xl font-semibold">{battingTeam}</h3>
              <p className="text-3xl font-bold">
                {battingTeamTotals.runs}/{battingTeamTotals.wickets}
              </p>
              <p className="text-sm opacity-90">Overs: {battingTeamTotals.overs.toFixed(1)}</p>
            </div>
            <div className="text-right">
              <p className="text-sm opacity-90">Run Rate</p>
              <p className="text-2xl font-bold">
                {battingTeamTotals.overs > 0 
                  ? (battingTeamTotals.runs / battingTeamTotals.overs).toFixed(2) 
                  : '0.00'}
              </p>
            </div>
          </div>
        </div>
        
        <div className="flex gap-4 mt-4">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Activity size={16} />
            Total Players: {matchData.totalPlayers}
          </div>
          {bulkEditMode && (
            <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
              Bulk Edit Mode Active
            </span>
          )}
          {editingPlayer && (
            <span className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-sm">
              Press 1-6 for runs, 0 for dot, W for wicket
            </span>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Batting Team Scorecard */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-md">
            <div className="bg-blue-600 text-white p-4 rounded-t-lg flex justify-between items-center">
              <h2 className="text-xl font-bold flex items-center gap-2">
                <Users size={20} />
                {battingTeam} Batting
              </h2>
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
                      <tr key={player._id} className={`border-b hover:bg-gray-50 ${isEditing ? 'bg-blue-50' : ''}`}>
                        <td className="p-3">
                          <div className="flex items-center gap-2">
                            {quickEditMode && (
                              <input
                                type="checkbox"
                                checked={selectedPlayers.has(player._id)}
                                onChange={() => togglePlayerSelection(player._id)}
                                className="rounded"
                              />
                            )}
                            <div>
                              <div className="font-semibold">
                                {player.player.firstName} {player.player.lastName}
                                {hasPendingChanges && <span className="ml-2 text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded">Modified</span>}
                              </div>
                              <div className="text-sm text-gray-500">#{player.batting.battingOrder}</div>
                            </div>
                          </div>
                        </td>
                        <td className="p-3 text-center font-bold text-blue-600">
                          {isEditing ? (
                            <div className="flex items-center justify-center gap-1">
                              <button 
                                onClick={() => decrementStat('batting', 'runs')} 
                                className="text-red-500 hover:bg-red-100 rounded p-1"
                                title="Decrease runs"
                              >
                                <Minus size={12} />
                              </button>
                              <input
                                type="number"
                                value={battingStats.runs || 0}
                                onChange={(e) => updateStat('batting', 'runs', parseInt(e.target.value) || 0)}
                                className="w-16 p-1 border rounded text-center"
                                min="0"
                              />
                              <button 
                                onClick={() => incrementStat('batting', 'runs')} 
                                className="text-green-500 hover:bg-green-100 rounded p-1"
                                title="Increase runs"
                              >
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
                            <div className="flex items-center justify-center gap-1">
                              <button 
                                onClick={() => decrementStat('batting', 'ballsFaced')} 
                                className="text-red-500 hover:bg-red-100 rounded p-1"
                              >
                                <Minus size={12} />
                              </button>
                              <input
                                type="number"
                                value={battingStats.ballsFaced || 0}
                                onChange={(e) => updateStat('batting', 'ballsFaced', parseInt(e.target.value) || 0)}
                                className="w-16 p-1 border rounded text-center"
                                min="0"
                              />
                              <button 
                                onClick={() => incrementStat('batting', 'ballsFaced')} 
                                className="text-green-500 hover:bg-green-100 rounded p-1"
                              >
                                <Plus size={12} />
                              </button>
                            </div>
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
                          <div className="flex items-center justify-center gap-1">
                            {isEditing ? (
                              <button onClick={handleCancelEdit} className="text-red-600 hover:bg-red-100 p-1 rounded">
                                <X size={16} />
                              </button>
                            ) : (
                              <button onClick={() => handleEditClick(player)} className="text-blue-600 hover:bg-blue-100 p-1 rounded">
                                <Edit3 size={16} />
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
              
              {/* Quick Actions for Batting */}
              {quickEditMode && editingPlayer && (
                <div className="p-4 bg-gray-50 border-t">
                  <p className="text-sm font-semibold mb-2">Quick Actions:</p>
                  <div className="flex flex-wrap gap-2">
                    {quickActions.batting.map((action, index) => (
                      <button
                        key={index}
                        onClick={() => applyQuickAction(editingPlayer, action, 'batting')}
                        className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm"
                      >
                        {action.label}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Fielding Stats */}
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
                      <tr key={player._id} className={`border-b hover:bg-gray-50 ${isEditing ? 'bg-green-50' : ''}`}>
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