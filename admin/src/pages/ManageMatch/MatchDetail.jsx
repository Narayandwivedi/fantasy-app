import axios from 'axios'
import React, { useContext, useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { AppContext } from '../../context/AppContext'
import { Edit3, Plus, X, Calendar, Clock, Trophy, Save, AlertCircle, Check, ArrowUp, ArrowDown, Hash } from 'lucide-react'

const MatchDetail = () => {
    const { matchId } = useParams()
    const { BACKEND_URL } = useContext(AppContext)
    const [matchDetail, setMatchDetail] = useState(null)
    const [loading, setLoading] = useState(true)
    const [editingTeam, setEditingTeam] = useState(null) // 'team1' or 'team2' or null
    const [saving, setSaving] = useState(false)
    
    // Enhanced local state for playing 11 with batting order
    const [localPlaying11, setLocalPlaying11] = useState({
        team1: [], // Array of objects: { playerId: string, battingOrder: number }
        team2: []
    })
    
    // Track if there are unsaved changes
    const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false)
    
    const fetchMatchDetail = async () => {
        try {
            setLoading(true)
            const { data } = await axios.get(`${BACKEND_URL}/api/matches/${matchId}`)
            console.log(data)
            setMatchDetail(data.data)
            
            // Initialize local state with current playing 11
            // Convert from array of player IDs to array of objects with batting order
            const initializeTeamPlaying11 = (playingSquad) => {
                if (!playingSquad || playingSquad.length === 0) return []
                
                // Check if data already has batting order structure
                if (playingSquad[0] && typeof playingSquad[0] === 'object' && playingSquad[0].playerId) {
                    return playingSquad.sort((a, b) => a.battingOrder - b.battingOrder)
                }
                
                // Convert from simple array to batting order structure
                return playingSquad.map((playerId, index) => ({
                    playerId,
                    battingOrder: index + 1
                }))
            }
            
            setLocalPlaying11({
                team1: initializeTeamPlaying11(data.data.team1PlayingSquad),
                team2: initializeTeamPlaying11(data.data.team2PlayingSquad)
            })
        } catch (error) {
            console.error('Error fetching match details:', error)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchMatchDetail()
    }, [])

    // Check for unsaved changes
    useEffect(() => {
        if (!matchDetail) return
        
        // Convert current data to comparable format
        const getComparableData = (playingSquad) => {
            if (!playingSquad || playingSquad.length === 0) return []
            if (playingSquad[0] && typeof playingSquad[0] === 'object') {
                return playingSquad.sort((a, b) => a.battingOrder - b.battingOrder)
            }
            return playingSquad.map((playerId, index) => ({
                playerId,
                battingOrder: index + 1
            }))
        }
        
        const originalTeam1 = getComparableData(matchDetail.team1PlayingSquad)
        const originalTeam2 = getComparableData(matchDetail.team2PlayingSquad)
        
        const hasChanges = 
            JSON.stringify(localPlaying11.team1) !== JSON.stringify(originalTeam1) ||
            JSON.stringify(localPlaying11.team2) !== JSON.stringify(originalTeam2)
        
        setHasUnsavedChanges(hasChanges)
    }, [localPlaying11, matchDetail])

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        })
    }

    const formatTime = (dateString) => {
        return new Date(dateString).toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit'
        })
    }

    const getPositionColor = (position) => {
        const colors = {
            'batsman': 'bg-blue-100 text-blue-800',
            'bowler': 'bg-red-100 text-red-800',
            'all-rounder': 'bg-green-100 text-green-800',
            'wicket-keeper': 'bg-purple-100 text-purple-800'
        }
        return colors[position] || 'bg-gray-100 text-gray-800'
    }

    const togglePlayer = (playerId, teamKey) => {
        setLocalPlaying11(prev => {
            const currentPlaying11 = prev[teamKey]
            const existingPlayerIndex = currentPlaying11.findIndex(p => p.playerId === playerId)
            
            if (existingPlayerIndex !== -1) {
                // Remove player and reorder batting positions
                const newPlaying11 = currentPlaying11
                    .filter(p => p.playerId !== playerId)
                    .map((player, index) => ({
                        ...player,
                        battingOrder: index + 1
                    }))
                
                return {
                    ...prev,
                    [teamKey]: newPlaying11
                }
            } else {
                // Add player (only if less than 11 players)
                if (currentPlaying11.length < 11) {
                    const newPlayer = {
                        playerId,
                        battingOrder: currentPlaying11.length + 1
                    }
                    
                    return {
                        ...prev,
                        [teamKey]: [...currentPlaying11, newPlayer]
                    }
                }
                return prev // Don't add if already 11 players
            }
        })
    }

    const moveBattingOrder = (playerId, teamKey, direction) => {
        setLocalPlaying11(prev => {
            const currentPlaying11 = [...prev[teamKey]]
            const playerIndex = currentPlaying11.findIndex(p => p.playerId === playerId)
            
            if (playerIndex === -1) return prev
            
            const newIndex = direction === 'up' ? playerIndex - 1 : playerIndex + 1
            
            // Check bounds
            if (newIndex < 0 || newIndex >= currentPlaying11.length) return prev
            
            // Swap players
            const temp = currentPlaying11[playerIndex]
            currentPlaying11[playerIndex] = currentPlaying11[newIndex]
            currentPlaying11[newIndex] = temp
            
            // Update batting orders
            currentPlaying11.forEach((player, index) => {
                player.battingOrder = index + 1
            })
            
            return {
                ...prev,
                [teamKey]: currentPlaying11
            }
        })
    }

    const savePlayingSquads = async () => {
        try {
            
            setSaving(true)
            
            const response = await axios.put(`${BACKEND_URL}/api/matches/${matchId}/playing11`, {
                team1PlayingSquad: localPlaying11.team1,
                team2PlayingSquad: localPlaying11.team2
            })
            
            if (response.data.success) {
                // Update the match detail with new playing squads
                setMatchDetail(prev => ({
                    ...prev,
                    team1PlayingSquad: localPlaying11.team1,
                    team2PlayingSquad: localPlaying11.team2
                }))
                
                // Exit editing mode
                setEditingTeam(null)
                
                // Show success message (you can replace with toast notification)
                alert('Playing 11 and batting order updated successfully!')
            }
        } catch (error) {
            console.error('Error saving playing squads:', error)
            alert('Error saving playing squads. Please try again.')
        } finally {
            setSaving(false)
        }
    }

    const resetChanges = () => {
        if (!matchDetail) return
        
        const initializeTeamPlaying11 = (playingSquad) => {
            if (!playingSquad || playingSquad.length === 0) return []
            
            if (playingSquad[0] && typeof playingSquad[0] === 'object' && playingSquad[0].playerId) {
                return playingSquad.sort((a, b) => a.battingOrder - b.battingOrder)
            }
            
            return playingSquad.map((playerId, index) => ({
                playerId,
                battingOrder: index + 1
            }))
        }
        
        setLocalPlaying11({
            team1: initializeTeamPlaying11(matchDetail.team1PlayingSquad),
            team2: initializeTeamPlaying11(matchDetail.team2PlayingSquad)
        })
        setEditingTeam(null)
    }

    const PlayerCard = ({ player, isInPlaying11, battingOrder, onToggle, onMoveUp, onMoveDown, showActions = false, teamKey, canAdd = true, canMoveUp = false, canMoveDown = false }) => (
        <div className={`bg-white rounded-lg shadow-sm border ${isInPlaying11 ? 'border-green-300 bg-green-50' : 'border-gray-200'} p-4 transition-all duration-200 hover:shadow-md`}>
            <div className="flex items-center space-x-3">
                {/* Batting order number */}
                {isInPlaying11 && (
                    <div className="flex-shrink-0">
                        <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold">
                            {battingOrder}
                        </div>
                    </div>
                )}

                {/* Player image */}
                <img 
                    src={"h"} 
                    alt={`${player.firstName} ${player.lastName}`}
                    className="w-12 h-12 rounded-full object-cover bg-gray-200 flex-shrink-0"
                />

                {/* Player info */}
                <div className="flex-1 min-w-0">
                    <h4 className="font-semibold text-gray-800 truncate">
                        {player.firstName} {player.lastName}
                    </h4>
                    <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${getPositionColor(player.position)}`}>
                        {player.position.replace('-', ' ').toUpperCase()}
                    </span>
                </div>

                {/* Action buttons */}
                {showActions && (
                    <div className="flex items-center space-x-1 flex-shrink-0">
                        {/* Batting order controls */}
                        {isInPlaying11 && (
                            <>
                                <button
                                    onClick={() => onMoveUp(player._id, teamKey)}
                                    disabled={!canMoveUp}
                                    className={`p-1 rounded transition-colors ${
                                        canMoveUp
                                            ? 'hover:bg-blue-100 text-blue-600'
                                            : 'text-gray-400 cursor-not-allowed'
                                    }`}
                                    title="Move up in batting order"
                                >
                                    <ArrowUp size={14} />
                                </button>
                                <button
                                    onClick={() => onMoveDown(player._id, teamKey)}
                                    disabled={!canMoveDown}
                                    className={`p-1 rounded transition-colors ${
                                        canMoveDown
                                            ? 'hover:bg-blue-100 text-blue-600'
                                            : 'text-gray-400 cursor-not-allowed'
                                    }`}
                                    title="Move down in batting order"
                                >
                                    <ArrowDown size={14} />
                                </button>
                            </>
                        )}
                        
                        {/* Add/Remove button */}
                        <button
                            onClick={() => onToggle(player._id, teamKey)}
                            disabled={!isInPlaying11 && !canAdd}
                            className={`p-2 rounded-full transition-colors ${
                                isInPlaying11 
                                    ? 'bg-red-100 hover:bg-red-200 text-red-600' 
                                    : canAdd
                                        ? 'bg-green-100 hover:bg-green-200 text-green-600'
                                        : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                            }`}
                            title={!isInPlaying11 && !canAdd ? 'Playing 11 is full (11/11)' : ''}
                        >
                            {isInPlaying11 ? <X size={16} /> : <Plus size={16} />}
                        </button>
                    </div>
                )}
            </div>
        </div>
    )

    const TeamSection = ({ team, teamKey }) => {
        const isEditing = editingTeam === teamKey
        const currentPlaying11 = localPlaying11[teamKey]
        const canAddMore = currentPlaying11.length < 11
        
        const toggleEditMode = () => {
            setEditingTeam(isEditing ? null : teamKey)
        }

        // Get player object by ID
        const getPlayerById = (playerId) => {
            return team.squad.find(player => player._id === playerId)
        }

        return (
            <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                {/* Team Header */}
                <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-6">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                            <img 
                                src={team.logo} 
                                alt={team.name}
                                className="w-16 h-16 rounded-full bg-white p-2"
                            />
                            <div>
                                <h2 className="text-2xl font-bold">{team.name}</h2>
                                <p className="text-blue-100">({team.shortName})</p>
                            </div>
                        </div>
                        <div className="flex items-center space-x-3">
                            {currentPlaying11.length === 11 && (
                                <div className="flex items-center space-x-1 bg-green-500/20 px-3 py-1 rounded-full">
                                    <Check size={14} />
                                    <span className="text-sm">Complete</span>
                                </div>
                            )}
                            <button
                                onClick={toggleEditMode}
                                className="flex items-center space-x-2 bg-white/20 hover:bg-white/30 px-4 py-2 rounded-lg transition-colors"
                            >
                                <Edit3 size={16} />
                                <span>{isEditing ? 'Done' : 'Edit Playing 11'}</span>
                            </button>
                        </div>
                    </div>
                </div>

                <div className="p-6">
                    {/* Squad Section */}
                    <div className="mb-8">
                        <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
                            <Trophy className="mr-2 text-yellow-600" size={20} />
                            Full Squad ({team.squad.length} players)
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {team.squad.map(player => {
                                const playerInPlaying11 = currentPlaying11.find(p => p.playerId === player._id)
                                const isInPlaying11 = !!playerInPlaying11
                                
                                return (
                                    <PlayerCard
                                        key={player._id}
                                        player={player}
                                        isInPlaying11={isInPlaying11}
                                        battingOrder={playerInPlaying11?.battingOrder}
                                        onToggle={togglePlayer}
                                        showActions={isEditing}
                                        teamKey={teamKey}
                                        canAdd={canAddMore || isInPlaying11}
                                    />
                                )
                            })}
                        </div>
                    </div>

                    {/* Playing 11 Section */}
                    <div className="border-t pt-8">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-xl font-semibold text-gray-800 flex items-center">
                                <div className={`w-5 h-5 rounded-full mr-2 ${
                                    currentPlaying11.length === 11 ? 'bg-green-600' : 'bg-yellow-500'
                                }`}></div>
                                Playing 11 - Batting Order ({currentPlaying11.length}/11)
                            </h3>
                            
                            {currentPlaying11.length < 11 && isEditing && (
                                <div className="flex items-center space-x-1 text-amber-600 text-sm">
                                    <AlertCircle size={14} />
                                    <span>Need {11 - currentPlaying11.length} more player(s)</span>
                                </div>
                            )}
                        </div>
                        
                        {currentPlaying11.length > 0 ? (
                            <div className="space-y-3">
                                {/* Batting order hint */}
                                {isEditing && (
                                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-4">
                                        <div className="flex items-center space-x-2 text-blue-800 text-sm">
                                            <Hash size={14} />
                                            <span>Use ↑↓ buttons to adjust batting order. Players are arranged from 1st to 11th position.</span>
                                        </div>
                                    </div>
                                )}
                                
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                    {currentPlaying11
                                        .sort((a, b) => a.battingOrder - b.battingOrder)
                                        .map((playerData, index) => {
                                            const player = getPlayerById(playerData.playerId)
                                            if (!player) return null
                                            
                                            return (
                                                <PlayerCard
                                                    key={player._id}
                                                    player={player}
                                                    isInPlaying11={true}
                                                    battingOrder={playerData.battingOrder}
                                                    onToggle={togglePlayer}
                                                    onMoveUp={moveBattingOrder}
                                                    onMoveDown={moveBattingOrder}
                                                    showActions={isEditing}
                                                    teamKey={teamKey}
                                                    canAdd={true}
                                                    canMoveUp={index > 0}
                                                    canMoveDown={index < currentPlaying11.length - 1}
                                                />
                                            )
                                        })}
                                </div>
                            </div>
                        ) : (
                            <div className="text-center py-8 bg-gray-50 rounded-lg">
                                <p className="text-gray-500">No players selected for playing 11</p>
                                {isEditing && (
                                    <p className="text-sm text-gray-400 mt-2">
                                        Click the + button on squad players to add them
                                    </p>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        )
    }

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                    <p className="mt-4 text-gray-600">Loading match details...</p>
                </div>
            </div>
        )
    }

    if (!matchDetail) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <p className="text-gray-600">Match details not found</p>
                </div>
            </div>
        )
    }

    const bothTeamsComplete = localPlaying11.team1.length === 11 && localPlaying11.team2.length === 11

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Match Header */}
            <div className="bg-white shadow-sm border-b">
                <div className="max-w-7xl mx-auto px-4 py-6">
                    <div className="text-center">
                        <div className="flex items-center justify-center space-x-2 text-sm text-gray-600 mb-2">
                            <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full font-medium">
                                {matchDetail.matchType}
                            </span>
                            <span className="px-3 py-1 bg-gray-100 text-gray-800 rounded-full">
                                {matchDetail.series}
                            </span>
                        </div>
                        
                        <h1 className="text-3xl font-bold text-gray-800 mb-4">
                            {matchDetail.team1.name} vs {matchDetail.team2.name}
                        </h1>
                        
                        <div className="flex items-center justify-center space-x-6 text-gray-600">
                            <div className="flex items-center space-x-2">
                                <Calendar size={16} />
                                <span>{formatDate(matchDetail.startTime)}</span>
                            </div>
                            <div className="flex items-center space-x-2">
                                <Clock size={16} />
                                <span>{formatTime(matchDetail.startTime)}</span>
                            </div>
                            <div className={`px-3 py-1 rounded-full text-sm font-medium ${
                                matchDetail.status === 'upcoming' 
                                    ? 'bg-yellow-100 text-yellow-800' 
                                    : 'bg-green-100 text-green-800'
                            }`}>
                                {matchDetail.status.toUpperCase()}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Save/Reset Actions Bar */}
            {hasUnsavedChanges && (
                <div className="bg-yellow-50 border-b border-yellow-200">
                    <div className="max-w-7xl mx-auto px-4 py-4">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-2 text-yellow-800">
                                <AlertCircle size={16} />
                                <span className="text-sm font-medium">You have unsaved changes</span>
                            </div>
                            <div className="flex items-center space-x-3">
                                <button
                                    onClick={resetChanges}
                                    className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800 transition-colors"
                                >
                                    Reset Changes
                                </button>
                                <button
                                    onClick={savePlayingSquads}
                                    disabled={!bothTeamsComplete || saving}
                                    className={`flex items-center space-x-2 px-6 py-2 rounded-lg text-sm font-medium transition-colors ${
                                        bothTeamsComplete && !saving
                                            ? 'bg-green-600 hover:bg-green-700 text-white'
                                            : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                    }`}
                                >
                                    <Save size={16} />
                                    <span>{saving ? 'Saving...' : 'Save Playing 11 & Order'}</span>
                                </button>
                            </div>
                        </div>
                        {!bothTeamsComplete && (
                            <p className="text-xs text-yellow-700 mt-2">
                                Both teams must have exactly 11 players selected to save
                            </p>
                        )}
                    </div>
                </div>
            )}

            {/* Teams Section */}
            <div className="max-w-7xl mx-auto px-4 py-8">
                <div className="space-y-8">
                    <TeamSection 
                        team={matchDetail.team1} 
                        teamKey="team1"
                    />
                    <TeamSection 
                        team={matchDetail.team2} 
                        teamKey="team2"
                    />
                </div>
            </div>
        </div>
    )
}

export default MatchDetail