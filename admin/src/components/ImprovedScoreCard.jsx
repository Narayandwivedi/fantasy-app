import React, { useState, useEffect, useContext, useRef, useMemo, useCallback, memo } from 'react';
import { Save, X, Zap, Users, Activity, RotateCcw } from 'lucide-react';
import axios from 'axios';
import { AppContext } from '../context/AppContext';

const ImprovedScoreCard = memo(({ matchId }) => {
  const { BACKEND_URL } = useContext(AppContext);
  const [matchData, setMatchData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [battingTeam, setBattingTeam] = useState('');
  const [availableTeams, setAvailableTeams] = useState([]);
  const [isUpdating, setIsUpdating] = useState(false);
  const [showQuickUpdate, setShowQuickUpdate] = useState(false);
  const [quickUpdateData, setQuickUpdateData] = useState({});
  const [focusedField, setFocusedField] = useState(null);
  const inputRefs = useRef({});

  // Handle input focus to select all text when value is 0
  const handleInputFocus = (e, fieldId) => {
    setFocusedField(fieldId);
    // Select all text when focusing, especially useful when value is 0
    setTimeout(() => {
      e.target.select();
    }, 0);
  };

  const fetchScore = useCallback(async () => {
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
  }, [matchId, BACKEND_URL]);


  useEffect(() => {
    fetchScore();
  }, [fetchScore]);

  // Add Ctrl+S keyboard shortcut for saving
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.ctrlKey && e.key === 's') {
        e.preventDefault();
        if (showQuickUpdate && Object.keys(quickUpdateData).length > 0) {
          saveQuickUpdates(true); // Keep modal open when using Ctrl+S
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [showQuickUpdate, quickUpdateData]);

  const getBattingTeamPlayers = useMemo(() => {
    if (!matchData || !matchData.matchScore || !battingTeam) return [];
    const battingTeamData = matchData.matchScore.find(team => team.teamName === battingTeam);
    if (!battingTeamData) return [];
    
    // Sort batting team players by batting order in ascending order (1 to 11)
    return battingTeamData.players.sort((a, b) => (a.batting.battingOrder || 0) - (b.batting.battingOrder || 0));
  }, [matchData, battingTeam]);

  const getBowlingTeamPlayers = useMemo(() => {
    if (!matchData || !matchData.matchScore || !battingTeam) return [];
    const bowlingTeam = matchData.matchScore.find(team => team.teamName !== battingTeam);
    if (!bowlingTeam) return [];
    
    // Sort players by batting order in descending order (11 to 1) to show bowlers first
    return bowlingTeam.players.sort((a, b) => (b.batting.battingOrder || 0) - (a.batting.battingOrder || 0));
  }, [matchData, battingTeam]);

  const getFieldingTeamPlayers = getBowlingTeamPlayers;

  const getBowlingTeamName = useMemo(() => {
    if (!availableTeams.length || !battingTeam) return '';
    return availableTeams.find(team => team !== battingTeam) || '';
  }, [availableTeams, battingTeam]);

  const getMatchTitle = useMemo(() => {
    if (!matchData || !matchData.matchScore || matchData.matchScore.length < 2) {
      return 'Match Scorecard';
    }
    
    const team1 = matchData.matchScore[0].teamName;
    const team2 = matchData.matchScore[1].teamName;
    const series = matchData.matchScore[0].series || '';
    
    return `${team1} vs ${team2}${series ? ` • ${series}` : ''}`;
  }, [matchData]);

  const getTeamTotals = useCallback((teamPlayers) => {
    return teamPlayers.reduce((totals, player) => {
      const battingStats = player.batting;
      const bowlingStats = player.bowling;
      return {
        runs: totals.runs + (battingStats.runs || 0),
        wickets: totals.wickets + (battingStats.isOut ? 1 : 0),
        overs: totals.overs + (bowlingStats.oversBowled || 0)
      };
    }, { runs: 0, wickets: 0, overs: 0 });
  }, []);

  const initializeQuickUpdate = () => {
    const battingPlayers = getBattingTeamPlayers;
    const bowlingPlayers = getBowlingTeamPlayers;
    const fieldingPlayers = getFieldingTeamPlayers;
    
    const initialData = {};
    
    // Initialize batting team players
    battingPlayers.forEach(player => {
      initialData[player._id] = {
        type: 'batting',
        name: `${player.player.firstName} ${player.player.lastName}`,
        runs: player.batting.runs || 0,
        ballsFaced: player.batting.ballsFaced || 0,
        fours: player.batting.fours || 0,
        sixes: player.batting.sixes || 0,
        isOut: player.batting.isOut || false
      };
    });
    
    // Initialize bowling team players  
    bowlingPlayers.forEach(player => {
      initialData[player._id] = {
        type: 'bowling',
        name: `${player.player.firstName} ${player.player.lastName}`,
        oversBowled: player.bowling.oversBowled || 0,
        runsGiven: player.bowling.runsGiven || 0,
        wicketsTaken: player.bowling.wicketsTaken || 0,
        catches: player.fielding.catches || 0,
        stumpings: player.fielding.stumpings || 0,
        runOuts: player.fielding.runOuts || 0
      };
    });
    
    console.log('Initialized data:', initialData); // Debug log
    setQuickUpdateData(initialData);
    setShowQuickUpdate(true);
  };

  const updateQuickData = (playerId, field, value) => {
    // Handle the case where user types a number when field is 0
    let processedValue = value;
    if (typeof value === 'string' && value.length > 1 && value.startsWith('0') && !value.includes('.')) {
      // Remove leading zero for whole numbers
      processedValue = value.replace(/^0+/, '') || '0';
    }
    
    setQuickUpdateData(prev => ({
      ...prev,
      [playerId]: {
        ...prev[playerId],
        [field]: Math.max(0, parseInt(processedValue) || 0)
      }
    }));
  };

  const updateQuickDataFloat = (playerId, field, value) => {
    // Handle the case where user types a number when field is 0
    let processedValue = value;
    if (typeof value === 'string' && value.length > 1 && value.startsWith('0')) {
      // Remove leading zero for numbers, but preserve valid decimal formats
      if (value === '0' || value === '00') {
        processedValue = value;
      } else if (value.startsWith('0.')) {
        // Keep valid decimal format like 0.5, 0.3, etc.
        processedValue = value;
      } else if (value.match(/^0+\d/)) {
        // Remove leading zeros: 01, 02, 011, etc. → 1, 2, 11, etc.
        processedValue = value.replace(/^0+/, '') || '0';
      }
    }
    
    setQuickUpdateData(prev => ({
      ...prev,
      [playerId]: {
        ...prev[playerId],
        [field]: Math.max(0, parseFloat(processedValue) || 0)
      }
    }));
  };

  const updateQuickDataBoolean = (playerId, field, value) => {
    setQuickUpdateData(prev => ({
      ...prev,
      [playerId]: {
        ...prev[playerId],
        [field]: value
      }
    }));
  };

  const saveQuickUpdates = async (keepModalOpen = false) => {
    const updates = Object.keys(quickUpdateData).map(playerId => {
      const data = quickUpdateData[playerId];
      const update = { playerId };
      
      // Always include all categories if data exists
      if (data.runs !== undefined || data.ballsFaced !== undefined || data.fours !== undefined || data.sixes !== undefined || data.isOut !== undefined) {
        update.batting = {
          runs: data.runs || 0,
          ballsFaced: data.ballsFaced || 0,
          fours: data.fours || 0,
          sixes: data.sixes || 0,
          isOut: data.isOut || false
        };
      }
      
      if (data.oversBowled !== undefined || data.runsGiven !== undefined || data.wicketsTaken !== undefined) {
        update.bowling = {
          oversBowled: data.oversBowled || 0,
          runsGiven: data.runsGiven || 0,
          wicketsTaken: data.wicketsTaken || 0
        };
      }
      
      if (data.catches !== undefined || data.stumpings !== undefined || data.runOuts !== undefined) {
        update.fielding = {
          catches: data.catches || 0,
          stumpings: data.stumpings || 0,
          runOuts: data.runOuts || 0
        };
      }
      
      return update;
    });
    
    console.log('Sending updates:', updates); // Debug log
    
    try {
      setIsUpdating(true);
      const { data } = await axios.put(`${BACKEND_URL}/api/matches/${matchId}/players/scores`, {
        players: updates
      });
      console.log('Scores updated:', data);
      await fetchScore();
      
      if (!keepModalOpen) {
        setQuickUpdateData({});
        setShowQuickUpdate(false);
      }
    } catch (error) {
      console.error('Error updating scores:', error);
    } finally {
      setIsUpdating(false);
    }
  };

  const resetQuickUpdate = () => {
    setQuickUpdateData({});
    setShowQuickUpdate(false);
    setFocusedField(null);
  };

  // Keyboard navigation for quick update fields
  const handleKeyDown = (e, playerId, fieldName) => {
    const battingPlayers = getBattingTeamPlayers;
    const bowlingPlayers = getBowlingTeamPlayers;
    const allPlayers = [...battingPlayers, ...bowlingPlayers];
    
    const currentPlayerIndex = allPlayers.findIndex(p => p._id === playerId);
    const isBattingPlayer = battingPlayers.some(p => p._id === playerId);
    
    const battingFields = ['runs', 'ballsFaced', 'fours', 'sixes', 'isOut'];
    const bowlingFields = ['oversBowled', 'runsGiven', 'wicketsTaken'];
    const fieldingFields = ['catches', 'stumpings', 'runOuts'];
    
    let currentFields = [];
    if (isBattingPlayer) {
      currentFields = battingFields;
    } else {
      currentFields = [...bowlingFields, ...fieldingFields];
    }
    
    const currentFieldIndex = currentFields.indexOf(fieldName);
    
    if (e.key === 'ArrowRight') {
      e.preventDefault();
      // Move to next field in same player
      if (currentFieldIndex < currentFields.length - 1) {
        const nextField = currentFields[currentFieldIndex + 1];
        const nextFieldId = `${playerId}-${nextField}`;
        setFocusedField(nextFieldId);
        setTimeout(() => {
          if (inputRefs.current[nextFieldId]) {
            inputRefs.current[nextFieldId].focus();
            inputRefs.current[nextFieldId].select();
          }
        }, 0);
      }
    } else if (e.key === 'ArrowLeft') {
      e.preventDefault();
      // Move to previous field in same player
      if (currentFieldIndex > 0) {
        const prevField = currentFields[currentFieldIndex - 1];
        const prevFieldId = `${playerId}-${prevField}`;
        setFocusedField(prevFieldId);
        setTimeout(() => {
          if (inputRefs.current[prevFieldId]) {
            inputRefs.current[prevFieldId].focus();
            inputRefs.current[prevFieldId].select();
          }
        }, 0);
      }
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      // Increment value by 1
      const currentData = quickUpdateData[playerId] || {};
      const currentValue = currentData[fieldName] || 0;
      
      if (fieldName === 'oversBowled') {
        updateQuickDataFloat(playerId, fieldName, (currentValue + 0.1).toFixed(1));
      } else if (fieldName !== 'isOut') {
        updateQuickData(playerId, fieldName, currentValue + 1);
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      // Decrement value by 1
      const currentData = quickUpdateData[playerId] || {};
      const currentValue = currentData[fieldName] || 0;
      
      if (fieldName === 'oversBowled') {
        updateQuickDataFloat(playerId, fieldName, Math.max(0, currentValue - 0.1).toFixed(1));
      } else if (fieldName !== 'isOut') {
        updateQuickData(playerId, fieldName, Math.max(0, currentValue - 1));
      }
    } else if (e.key === 'Enter') {
      e.preventDefault();
      // Move to next player
      if (currentPlayerIndex < allPlayers.length - 1) {
        const nextPlayer = allPlayers[currentPlayerIndex + 1];
        const nextPlayerIsBatting = battingPlayers.some(p => p._id === nextPlayer._id);
        const targetField = nextPlayerIsBatting ? battingFields[0] : bowlingFields[0];
        const nextFieldId = `${nextPlayer._id}-${targetField}`;
        setFocusedField(nextFieldId);
        setTimeout(() => {
          if (inputRefs.current[nextFieldId]) {
            inputRefs.current[nextFieldId].focus();
            inputRefs.current[nextFieldId].select();
          }
        }, 0);
      }
    }
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

  const battingTeamTotals = getTeamTotals(getBattingTeamPlayers);

  return (
    <div className="max-w-full mx-auto p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-3xl font-bold text-gray-800">{getMatchTitle}</h1>
          <div className="flex gap-4 items-center">
            <button
              onClick={initializeQuickUpdate}
              className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center gap-2 font-semibold"
            >
              <Zap size={20} />
              Quick Update
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
        </div>
      </div>

      {/* Quick Update Modal */}
      {showQuickUpdate && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-6xl w-full max-h-[90vh] overflow-auto">
            <div className="sticky top-0 bg-white border-b p-4">
              <div className="flex justify-between items-center mb-2">
                <h2 className="text-2xl font-bold text-gray-800">Quick Score Update</h2>
                <div className="flex gap-2">
                  <button
                    onClick={resetQuickUpdate}
                    className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 flex items-center gap-2"
                  >
                    <RotateCcw size={16} />
                    Reset
                  </button>
                  <button
                    onClick={() => setShowQuickUpdate(false)}
                    className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                  >
                    <X size={16} />
                  </button>
                </div>
              </div>
              <div className="bg-blue-50 p-3 rounded-lg">
                <p className="text-sm text-blue-800 font-medium mb-1">Keyboard Shortcuts:</p>
                <div className="grid grid-cols-2 md:grid-cols-5 gap-2 text-xs text-blue-700 mb-2">
                  <span><kbd className="bg-white px-1 rounded">←→</kbd> Navigate fields</span>
                  <span><kbd className="bg-white px-1 rounded">↑↓</kbd> +/- values</span>
                  <span><kbd className="bg-white px-1 rounded">Enter</kbd> Next player</span>
                  <span><kbd className="bg-white px-1 rounded">Tab</kbd> Focus next</span>
                  <span><kbd className="bg-white px-1 rounded">Ctrl+S</kbd> Save all</span>
                </div>
                <p className="text-xs text-blue-600">
                  💡 Use ↑/↓ to increment/decrement values by 1. Enter moves to next player. Ctrl+S saves all changes
                </p>
              </div>
            </div>
            
            <div className="p-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Batting Team */}
                <div className="bg-blue-50 rounded-lg p-4">
                  <h3 className="text-xl font-bold text-blue-800 mb-4 flex items-center gap-2">
                    <Users size={20} />
                    {battingTeam} - Batting
                  </h3>
                  <div className="space-y-4">
                    {getBattingTeamPlayers
                      .sort((a, b) => {
                        // Sort by out status first (not out players first), then by batting order
                        if (a.batting.isOut !== b.batting.isOut) {
                          return a.batting.isOut - b.batting.isOut;
                        }
                        return (a.batting.battingOrder || 0) - (b.batting.battingOrder || 0);
                      })
                      .map(player => {
                      const data = quickUpdateData[player._id] || {};
                      const isOut = player.batting.isOut || data.isOut;
                      return (
                        <div key={player._id} className={`p-4 rounded-lg shadow transition-all ${
                          isOut 
                            ? 'bg-gray-100 opacity-60 border-2 border-dashed border-gray-300' 
                            : 'bg-white'
                        }`}>
                          <div className={`font-semibold mb-3 flex items-center gap-2 ${
                            isOut ? 'text-gray-500' : 'text-gray-800'
                          }`}>
                            {player.player.firstName} {player.player.lastName}
                            {isOut && (
                              <span className="text-xs bg-red-100 text-red-600 px-2 py-1 rounded-full">
                                OUT
                              </span>
                            )}
                          </div>
                          <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                            <div>
                              <label className="block text-xs font-medium text-gray-700 mb-1">Runs</label>
                              <input
                                ref={el => inputRefs.current[`${player._id}-runs`] = el}
                                type="number"
                                value={data.runs || 0}
                                onChange={(e) => updateQuickData(player._id, 'runs', e.target.value)}
                                onKeyDown={(e) => handleKeyDown(e, player._id, 'runs')}
                                onFocus={(e) => handleInputFocus(e, `${player._id}-runs`)}
                                className={`w-full p-2 border rounded-md text-center font-bold text-blue-600 ${
                                  focusedField === `${player._id}-runs` ? 'ring-2 ring-blue-500' : ''
                                }`}
                                min="0"
                              />
                            </div>
                            <div>
                              <label className="block text-xs font-medium text-gray-700 mb-1">Balls</label>
                              <input
                                ref={el => inputRefs.current[`${player._id}-ballsFaced`] = el}
                                type="number"
                                value={data.ballsFaced || 0}
                                onChange={(e) => updateQuickData(player._id, 'ballsFaced', e.target.value)}
                                onKeyDown={(e) => handleKeyDown(e, player._id, 'ballsFaced')}
                                onFocus={(e) => handleInputFocus(e, `${player._id}-ballsFaced`)}
                                className={`w-full p-2 border rounded-md text-center ${
                                  focusedField === `${player._id}-ballsFaced` ? 'ring-2 ring-blue-500' : ''
                                }`}
                                min="0"
                              />
                            </div>
                            <div>
                              <label className="block text-xs font-medium text-gray-700 mb-1">4s</label>
                              <input
                                ref={el => inputRefs.current[`${player._id}-fours`] = el}
                                type="number"
                                value={data.fours || 0}
                                onChange={(e) => updateQuickData(player._id, 'fours', e.target.value)}
                                onKeyDown={(e) => handleKeyDown(e, player._id, 'fours')}
                                onFocus={(e) => handleInputFocus(e, `${player._id}-fours`)}
                                className={`w-full p-2 border rounded-md text-center ${
                                  focusedField === `${player._id}-fours` ? 'ring-2 ring-blue-500' : ''
                                }`}
                                min="0"
                              />
                            </div>
                            <div>
                              <label className="block text-xs font-medium text-gray-700 mb-1">6s</label>
                              <input
                                ref={el => inputRefs.current[`${player._id}-sixes`] = el}
                                type="number"
                                value={data.sixes || 0}
                                onChange={(e) => updateQuickData(player._id, 'sixes', e.target.value)}
                                onKeyDown={(e) => handleKeyDown(e, player._id, 'sixes')}
                                onFocus={(e) => handleInputFocus(e, `${player._id}-sixes`)}
                                className={`w-full p-2 border rounded-md text-center ${
                                  focusedField === `${player._id}-sixes` ? 'ring-2 ring-blue-500' : ''
                                }`}
                                min="0"
                              />
                            </div>
                            <div>
                              <label className="block text-xs font-medium text-gray-700 mb-1">Out</label>
                              <select
                                ref={el => inputRefs.current[`${player._id}-isOut`] = el}
                                value={data.isOut ? 'out' : 'not-out'}
                                onChange={(e) => updateQuickDataBoolean(player._id, 'isOut', e.target.value === 'out')}
                                onKeyDown={(e) => handleKeyDown(e, player._id, 'isOut')}
                                onFocus={(e) => handleInputFocus(e, `${player._id}-isOut`)}
                                className={`w-full p-2 border rounded-md text-center ${
                                  focusedField === `${player._id}-isOut` ? 'ring-2 ring-blue-500' : ''
                                }`}
                              >
                                <option value="not-out">Not Out</option>
                                <option value="out">Out</option>
                              </select>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Bowling Team */}
                <div className="bg-red-50 rounded-lg p-4">
                  <h3 className="text-xl font-bold text-red-800 mb-4 flex items-center gap-2">
                    <Activity size={20} />
                    {getBowlingTeamName} - Bowling
                  </h3>
                  <div className="space-y-4">
                    {getBowlingTeamPlayers
                      .sort((a, b) => {
                        // Sort bowlers - active bowlers (with overs > 0) first, then by batting order descending
                        const aHasBowled = (a.bowling.oversBowled || 0) > 0;
                        const bHasBowled = (b.bowling.oversBowled || 0) > 0;
                        
                        if (aHasBowled !== bHasBowled) {
                          return bHasBowled - aHasBowled; // Active bowlers first
                        }
                        return (b.batting.battingOrder || 0) - (a.batting.battingOrder || 0); // Tail first
                      })
                      .map(player => {
                      const data = quickUpdateData[player._id] || {};
                      const hasBowled = (player.bowling.oversBowled || 0) > 0 || (data.oversBowled || 0) > 0;
                      return (
                        <div key={player._id} className={`p-4 rounded-lg shadow transition-all ${
                          !hasBowled 
                            ? 'bg-gray-50 opacity-75 border border-gray-200' 
                            : 'bg-white border border-green-200'
                        }`}>
                          <div className={`font-semibold mb-3 flex items-center gap-2 ${
                            !hasBowled ? 'text-gray-600' : 'text-gray-800'
                          }`}>
                            {player.player.firstName} {player.player.lastName}
                            {hasBowled && (
                              <span className="text-xs bg-green-100 text-green-600 px-2 py-1 rounded-full">
                                BOWLING
                              </span>
                            )}
                          </div>
                          <div className="grid grid-cols-3 gap-3">
                            <div>
                              <label className="block text-xs font-medium text-gray-700 mb-1">Overs</label>
                              <input
                                ref={el => inputRefs.current[`${player._id}-oversBowled`] = el}
                                type="number"
                                step="0.1"
                                value={data.oversBowled || 0}
                                onChange={(e) => updateQuickDataFloat(player._id, 'oversBowled', e.target.value)}
                                onKeyDown={(e) => handleKeyDown(e, player._id, 'oversBowled')}
                                onFocus={(e) => handleInputFocus(e, `${player._id}-oversBowled`)}
                                className={`w-full p-2 border rounded-md text-center ${
                                  focusedField === `${player._id}-oversBowled` ? 'ring-2 ring-blue-500' : ''
                                }`}
                                min="0"
                              />
                            </div>
                            <div>
                              <label className="block text-xs font-medium text-gray-700 mb-1">Runs</label>
                              <input
                                ref={el => inputRefs.current[`${player._id}-runsGiven`] = el}
                                type="number"
                                value={data.runsGiven || 0}
                                onChange={(e) => updateQuickData(player._id, 'runsGiven', e.target.value)}
                                onKeyDown={(e) => handleKeyDown(e, player._id, 'runsGiven')}
                                onFocus={(e) => handleInputFocus(e, `${player._id}-runsGiven`)}
                                className={`w-full p-2 border rounded-md text-center ${
                                  focusedField === `${player._id}-runsGiven` ? 'ring-2 ring-blue-500' : ''
                                }`}
                                min="0"
                              />
                            </div>
                            <div>
                              <label className="block text-xs font-medium text-gray-700 mb-1">Wickets</label>
                              <input
                                ref={el => inputRefs.current[`${player._id}-wicketsTaken`] = el}
                                type="number"
                                value={data.wicketsTaken || 0}
                                onChange={(e) => updateQuickData(player._id, 'wicketsTaken', e.target.value)}
                                onKeyDown={(e) => handleKeyDown(e, player._id, 'wicketsTaken')}
                                onFocus={(e) => handleInputFocus(e, `${player._id}-wicketsTaken`)}
                                className={`w-full p-2 border rounded-md text-center font-bold text-red-600 ${
                                  focusedField === `${player._id}-wicketsTaken` ? 'ring-2 ring-blue-500' : ''
                                }`}
                                min="0"
                              />
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Fielding Team */}
              <div className="mt-6 bg-green-50 rounded-lg p-4">
                <h3 className="text-xl font-bold text-green-800 mb-4 flex items-center gap-2">
                  <Users size={20} />
                  {getBowlingTeamName} - Fielding
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {getFieldingTeamPlayers
                    .sort((a, b) => {
                      // Sort fielders - those with fielding stats first, then by batting order descending
                      const aHasFielded = (a.fielding.catches || 0) + (a.fielding.stumpings || 0) + (a.fielding.runOuts || 0) > 0;
                      const bHasFielded = (b.fielding.catches || 0) + (b.fielding.stumpings || 0) + (b.fielding.runOuts || 0) > 0;
                      
                      if (aHasFielded !== bHasFielded) {
                        return bHasFielded - aHasFielded; // Active fielders first
                      }
                      return (b.batting.battingOrder || 0) - (a.batting.battingOrder || 0); // Tail first
                    })
                    .map(player => {
                    const data = quickUpdateData[player._id] || {};
                    const hasFielded = (player.fielding.catches || 0) + (player.fielding.stumpings || 0) + (player.fielding.runOuts || 0) > 0 ||
                                     (data.catches || 0) + (data.stumpings || 0) + (data.runOuts || 0) > 0;
                    return (
                      <div key={player._id} className={`p-4 rounded-lg shadow transition-all ${
                        !hasFielded 
                          ? 'bg-gray-50 opacity-75 border border-gray-200' 
                          : 'bg-white border border-yellow-200'
                      }`}>
                        <div className={`font-semibold mb-3 flex items-center gap-2 ${
                          !hasFielded ? 'text-gray-600' : 'text-gray-800'
                        }`}>
                          {player.player.firstName} {player.player.lastName}
                          {hasFielded && (
                            <span className="text-xs bg-yellow-100 text-yellow-600 px-2 py-1 rounded-full">
                              ACTIVE
                            </span>
                          )}
                        </div>
                        <div className="grid grid-cols-3 gap-2">
                          <div>
                            <label className="block text-xs font-medium text-gray-700 mb-1">Catches</label>
                            <input
                              ref={el => inputRefs.current[`${player._id}-catches`] = el}
                              type="number"
                              value={data.catches || 0}
                              onChange={(e) => updateQuickData(player._id, 'catches', e.target.value)}
                              onKeyDown={(e) => handleKeyDown(e, player._id, 'catches')}
                              onFocus={(e) => handleInputFocus(e, `${player._id}-catches`)}
                              className={`w-full p-2 border rounded-md text-center ${
                                focusedField === `${player._id}-catches` ? 'ring-2 ring-blue-500' : ''
                              }`}
                              min="0"
                            />
                          </div>
                          <div>
                            <label className="block text-xs font-medium text-gray-700 mb-1">Stumpings</label>
                            <input
                              ref={el => inputRefs.current[`${player._id}-stumpings`] = el}
                              type="number"
                              value={data.stumpings || 0}
                              onChange={(e) => updateQuickData(player._id, 'stumpings', e.target.value)}
                              onKeyDown={(e) => handleKeyDown(e, player._id, 'stumpings')}
                              onFocus={(e) => handleInputFocus(e, `${player._id}-stumpings`)}
                              className={`w-full p-2 border rounded-md text-center ${
                                focusedField === `${player._id}-stumpings` ? 'ring-2 ring-blue-500' : ''
                              }`}
                              min="0"
                            />
                          </div>
                          <div>
                            <label className="block text-xs font-medium text-gray-700 mb-1">Run Outs</label>
                            <input
                              ref={el => inputRefs.current[`${player._id}-runOuts`] = el}
                              type="number"
                              value={data.runOuts || 0}
                              onChange={(e) => updateQuickData(player._id, 'runOuts', e.target.value)}
                              onKeyDown={(e) => handleKeyDown(e, player._id, 'runOuts')}
                              onFocus={(e) => handleInputFocus(e, `${player._id}-runOuts`)}
                              className={`w-full p-2 border rounded-md text-center ${
                                focusedField === `${player._id}-runOuts` ? 'ring-2 ring-blue-500' : ''
                              }`}
                              min="0"
                            />
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Save Button */}
              <div className="flex justify-center mt-6">
                <button
                  onClick={() => saveQuickUpdates(false)}
                  disabled={isUpdating}
                  className="px-8 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 font-semibold flex items-center gap-2 text-lg"
                >
                  <Save size={20} />
                  {isUpdating ? 'Saving...' : 'Save All Updates'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Regular Scorecard Display */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Batting Team Scorecard */}
        <div className="bg-white rounded-lg shadow-md">
          <div className="bg-blue-600 text-white p-4 rounded-t-lg">
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
                </tr>
              </thead>
              <tbody>
                {getBattingTeamPlayers.map((player) => {
                  const battingStats = player.batting;
                  
                  return (
                    <tr key={player._id} className="border-b hover:bg-gray-50">
                      <td className="p-3">
                        <div>
                          <div className="font-semibold">
                            {player.player.firstName} {player.player.lastName}
                          </div>
                          <div className="text-sm text-gray-500">#{player.batting.battingOrder}</div>
                        </div>
                      </td>
                      <td className="p-3 text-center font-bold text-blue-600">
                        {battingStats.runs}
                      </td>
                      <td className="p-3 text-center">
                        {battingStats.ballsFaced}
                      </td>
                      <td className="p-3 text-center">
                        {battingStats.fours}
                      </td>
                      <td className="p-3 text-center">
                        {battingStats.sixes}
                      </td>
                      <td className="p-3 text-center">
                        {battingStats.ballsFaced > 0 ? ((battingStats.runs / battingStats.ballsFaced) * 100).toFixed(2) : '0.00'}
                      </td>
                      <td className="p-3 text-center">
                        <span className={`px-2 py-1 rounded text-xs ${battingStats.isOut ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'}`}>
                          {battingStats.isOut ? 'Out' : 'Not Out'}
                        </span>
                      </td>
                      <td className="p-3 text-center font-bold text-green-600">
                        {player.fantasyPoints.totalPoints}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Bowling Team Scorecard */}
        <div className="bg-white rounded-lg shadow-md">
          <div className="bg-red-600 text-white p-4 rounded-t-lg">
            <h2 className="text-xl font-bold">{getBowlingTeamName} Bowling</h2>
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
                  <th className="p-3 text-center">Points</th>
                </tr>
              </thead>
              <tbody>
                {getBowlingTeamPlayers.map((player) => {
                  const bowlingStats = player.bowling;
                  
                  return (
                    <tr key={player._id} className="border-b hover:bg-gray-50">
                      <td className="p-3 font-semibold">
                        {player.player.firstName} {player.player.lastName}
                      </td>
                      <td className="p-3 text-center">
                        {bowlingStats.oversBowled}
                      </td>
                      <td className="p-3 text-center">
                        {bowlingStats.runsGiven}
                      </td>
                      <td className="p-3 text-center font-bold text-red-600">
                        {bowlingStats.wicketsTaken}
                      </td>
                      <td className="p-3 text-center">
                        {bowlingStats.oversBowled > 0 ? (bowlingStats.runsGiven / bowlingStats.oversBowled).toFixed(2) : '0.00'}
                      </td>
                      <td className="p-3 text-center font-bold text-green-600">
                        {player.fantasyPoints.totalPoints}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Fielding Stats */}
      <div className="bg-white rounded-lg shadow-md mt-6">
        <div className="bg-green-600 text-white p-4 rounded-t-lg">
          <h2 className="text-xl font-bold">{getBowlingTeamName} Fielding</h2>
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
              </tr>
            </thead>
            <tbody>
              {getFieldingTeamPlayers.map((player) => {
                const fieldingStats = player.fielding;
                
                return (
                  <tr key={player._id} className="border-b hover:bg-gray-50">
                    <td className="p-3 font-semibold">
                      {player.player.firstName} {player.player.lastName}
                    </td>
                    <td className="p-3 text-center">
                      {fieldingStats.catches}
                    </td>
                    <td className="p-3 text-center">
                      {fieldingStats.stumpings}
                    </td>
                    <td className="p-3 text-center">
                      {fieldingStats.runOuts}
                    </td>
                    <td className="p-3 text-center font-bold text-green-600">
                      {player.fantasyPoints.totalPoints}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
});

ImprovedScoreCard.displayName = 'ImprovedScoreCard';

export default ImprovedScoreCard;