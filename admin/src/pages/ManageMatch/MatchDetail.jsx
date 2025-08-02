import axios from 'axios'
import React, { useContext, useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { AppContext } from '../../context/AppContext'
import { Edit3, Plus, X, Calendar, Clock, Trophy, Save, AlertCircle, Check, ArrowUp, ArrowDown, Hash, Users, Shield, Target, Zap, Award } from 'lucide-react'
import ScoreCard from '../../components/ScoreCard'
import ImprovedScoreCard from '../../components/ImprovedScoreCard'
import ContestManager from '../../components/ContestManager'
import { useNavigate } from 'react-router-dom'

const MatchDetail = () => {
    const { matchId } = useParams()
    const { BACKEND_URL } = useContext(AppContext)
    const navigate = useNavigate()
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
                alert('Playing 11 set and player scores created successfully!')
            }
        } catch (error) {
            console.error('Error saving playing squads:', error)
            if (error.response?.data?.message) {
                alert(`Error: ${error.response.data.message}`)
            } else {
                alert('Error saving playing squads. Please try again.')
            }
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
        <div className={`group relative bg-white rounded-xl border-2 transition-all duration-300 hover:shadow-lg ${
            isInPlaying11 
                ? 'border-emerald-200 bg-gradient-to-br from-emerald-50 to-green-50 shadow-sm' 
                : 'border-slate-200 hover:border-slate-300'
        }`}>
            {/* Batting order badge */}
            {isInPlaying11 && (
                <div className="absolute -top-2 -left-2 z-10">
                    <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-purple-600 text-white rounded-full flex items-center justify-center text-xs font-bold shadow-lg">
                        {battingOrder}
                    </div>
                </div>
            )}

            <div className="p-4">
                <div className="flex items-center space-x-3">
                    {/* Player avatar */}
                    <div className="relative">
                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-slate-200 to-slate-300 flex items-center justify-center text-slate-600 font-semibold text-sm shadow-sm">
                            {player.firstName[0]}{player.lastName[0]}
                        </div>
                        {isInPlaying11 && (
                            <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-500 rounded-full border-2 border-white flex items-center justify-center">
                                <Check size={8} className="text-white" />
                            </div>
                        )}
                    </div>

                    {/* Player info */}
                    <div className="flex-1 min-w-0">
                        <h4 className="font-semibold text-slate-800 truncate">
                            {player.firstName} {player.lastName}
                        </h4>
                        <div className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium mt-1 ${getPositionColor(player.position)}`}>
                            {player.position === 'wicket-keeper' && <Shield size={10} className="mr-1" />}
                            {player.position === 'batsman' && <Target size={10} className="mr-1" />}
                            {player.position === 'bowler' && <Zap size={10} className="mr-1" />}
                            {player.position === 'all-rounder' && <Users size={10} className="mr-1" />}
                            {player.position.replace('-', ' ').toUpperCase()}
                        </div>
                    </div>

                    {/* Action buttons */}
                    {showActions && (
                        <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                            {/* Batting order controls */}
                            {isInPlaying11 && (
                                <>
                                    <button
                                        onClick={() => onMoveUp(player._id, teamKey)}
                                        disabled={!canMoveUp}
                                        className={`p-2 rounded-lg transition-all duration-200 ${
                                            canMoveUp
                                                ? 'hover:bg-indigo-100 text-indigo-600 hover:scale-105'
                                                : 'text-slate-400 cursor-not-allowed'
                                        }`}
                                        title="Move up in batting order"
                                    >
                                        <ArrowUp size={14} />
                                    </button>
                                    <button
                                        onClick={() => onMoveDown(player._id, teamKey)}
                                        disabled={!canMoveDown}
                                        className={`p-2 rounded-lg transition-all duration-200 ${
                                            canMoveDown
                                                ? 'hover:bg-indigo-100 text-indigo-600 hover:scale-105'
                                                : 'text-slate-400 cursor-not-allowed'
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
                                className={`p-2 rounded-lg transition-all duration-200 ${
                                    isInPlaying11 
                                        ? 'bg-red-100 hover:bg-red-200 text-red-600 hover:scale-105' 
                                        : canAdd
                                            ? 'bg-emerald-100 hover:bg-emerald-200 text-emerald-600 hover:scale-105'
                                            : 'bg-slate-100 text-slate-400 cursor-not-allowed'
                                }`}
                                title={!isInPlaying11 && !canAdd ? 'Playing 11 is full (11/11)' : ''}
                            >
                                {isInPlaying11 ? <X size={14} /> : <Plus size={14} />}
                            </button>
                        </div>
                    )}
                </div>
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
            <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-slate-200">
                {/* Team Header */}
                <div className="relative bg-gradient-to-br from-slate-800 via-slate-700 to-slate-600 text-white p-6">
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-purple-500/10"></div>
                    <div className="relative flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                            <div className="relative">
                                <div className="w-16 h-16 rounded-2xl bg-white backdrop-blur-sm border border-white/20 p-2 flex items-center justify-center shadow-lg">
                                    {team.logo ? (
                                        <img 
                                            src={team.logo} 
                                            alt={team.name}
                                            className="w-full h-full object-contain rounded-xl"
                                        />
                                    ) : (
                                        <div className="w-full h-full bg-gradient-to-br from-slate-300 to-slate-400 rounded-xl flex items-center justify-center text-slate-600 font-bold text-lg">
                                            {team.name[0]}
                                        </div>
                                    )}
                                </div>
                                <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-full flex items-center justify-center shadow-md">
                                    <Trophy size={12} className="text-white" />
                                </div>
                            </div>
                            <div>
                                <h2 className="text-2xl font-bold mb-1">{team.name}</h2>
                                <div className="flex items-center space-x-3">
                                    <span className="text-slate-300 text-sm">({team.shortName})</span>
                                    <div className="flex items-center space-x-1 text-xs text-slate-300">
                                        <Users size={12} />
                                        <span>{team.squad.length} players</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="flex items-center space-x-3">
                            {currentPlaying11.length === 11 && (
                                <div className="flex items-center space-x-2 bg-emerald-500/20 backdrop-blur-sm px-3 py-2 rounded-full border border-emerald-400/30">
                                    <Check size={14} className="text-emerald-300" />
                                    <span className="text-emerald-200 text-sm font-medium">Complete</span>
                                </div>
                            )}
                            <button
                                onClick={toggleEditMode}
                                className={`flex items-center space-x-2 px-4 py-2 rounded-xl transition-all duration-200 text-sm font-medium ${
                                    isEditing 
                                        ? 'bg-emerald-500/20 text-emerald-200 border border-emerald-400/30' 
                                        : 'bg-white/10 hover:bg-white/20 text-white border border-white/20'
                                }`}
                            >
                                <Edit3 size={14} />
                                <span>{isEditing ? 'Done' : 'Edit Squad'}</span>
                            </button>
                        </div>
                    </div>
                </div>

                <div className="p-6 space-y-8">
                    {/* Playing 11 Section */}
                    <div>
                        <div className="flex items-center justify-between mb-6">
                            <div className="flex items-center space-x-3">
                                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                                    currentPlaying11.length === 11 
                                        ? 'bg-emerald-100 text-emerald-600' 
                                        : 'bg-amber-100 text-amber-600'
                                }`}>
                                    {currentPlaying11.length === 11 ? <Check size={20} /> : <AlertCircle size={20} />}
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold text-slate-800">Playing XI</h3>
                                    <p className="text-slate-500 text-sm">
                                        {currentPlaying11.length}/11 players selected
                                    </p>
                                </div>
                            </div>
                            
                            {currentPlaying11.length < 11 && isEditing && (
                                <div className="flex items-center space-x-2 bg-amber-50 px-3 py-2 rounded-lg border border-amber-200">
                                    <AlertCircle size={16} className="text-amber-600" />
                                    <span className="text-amber-700 text-sm font-medium">
                                        Need {11 - currentPlaying11.length} more
                                    </span>
                                </div>
                            )}
                        </div>
                        
                        {currentPlaying11.length > 0 ? (
                            <div className="space-y-4">
                                {/* Batting order hint */}
                                {isEditing && (
                                    <div className="bg-indigo-50 border border-indigo-200 rounded-xl p-4">
                                        <div className="flex items-center space-x-3 text-indigo-700">
                                            <Hash size={16} />
                                            <span className="text-sm font-medium">
                                                Use ↑↓ buttons to adjust batting order
                                            </span>
                                        </div>
                                    </div>
                                )}
                                
                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
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
                            <div className="text-center py-12 bg-slate-50 rounded-xl border-2 border-dashed border-slate-200">
                                <div className="w-16 h-16 bg-slate-200 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <Users size={24} className="text-slate-400" />
                                </div>
                                <p className="text-slate-500 font-medium">No players selected</p>
                                {isEditing && (
                                    <p className="text-slate-400 text-sm mt-2">
                                        Choose players from the squad below
                                    </p>
                                )}
                            </div>
                        )}
                    </div>

                    {/* Squad Section */}
                    {isEditing && (
                        <div className="border-t border-slate-200 pt-8">
                            <div className="flex items-center space-x-3 mb-6">
                                <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
                                    <Trophy size={20} className="text-blue-600" />
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold text-slate-800">Squad</h3>
                                    <p className="text-slate-500 text-sm">{team.squad.length} players available</p>
                                </div>
                            </div>
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
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
                    )}
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
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/20">
            {/* Match Header */}
            <div className="relative bg-white shadow-lg border-b border-slate-200/60 backdrop-blur-sm">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-purple-500/5"></div>
                <div className="relative max-w-7xl mx-auto px-6 py-8">
                    <div className="text-center">
                        <div className="flex items-center justify-center space-x-3 mb-4">
                            <div className="px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-full font-semibold text-sm shadow-lg">
                                {matchDetail.matchType}
                            </div>
                            <div className="px-4 py-2 bg-gradient-to-r from-slate-100 to-slate-200 text-slate-700 rounded-full font-medium text-sm">
                                {matchDetail.series}
                            </div>
                        </div>
                        
                        <h1 className="text-4xl font-bold text-slate-800 mb-6 tracking-tight">
                            {matchDetail.team1.name} <span className="text-slate-400 mx-4">vs</span> {matchDetail.team2.name}
                        </h1>
                        
                        <div className="flex items-center justify-center space-x-8 text-slate-600">
                            <div className="flex items-center space-x-2 bg-white/60 backdrop-blur-sm px-4 py-2 rounded-xl border border-slate-200/60">
                                <Calendar size={16} className="text-blue-500" />
                                <span className="font-medium">{formatDate(matchDetail.startTime)}</span>
                            </div>
                            <div className="flex items-center space-x-2 bg-white/60 backdrop-blur-sm px-4 py-2 rounded-xl border border-slate-200/60">
                                <Clock size={16} className="text-emerald-500" />
                                <span className="font-medium">{formatTime(matchDetail.startTime)}</span>
                            </div>
                            <div className={`px-4 py-2 rounded-xl font-semibold text-sm border ${
                                matchDetail.status === 'upcoming' 
                                    ? 'bg-gradient-to-r from-amber-100 to-yellow-100 text-amber-800 border-amber-200' 
                                    : 'bg-gradient-to-r from-emerald-100 to-green-100 text-emerald-800 border-emerald-200'
                            }`}>
                                {matchDetail.status.toUpperCase()}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Floating Save Actions */}
            {hasUnsavedChanges && (
                <div className="sticky top-0 z-50 bg-gradient-to-r from-amber-500 to-orange-500 shadow-xl border-b border-orange-200/50 backdrop-blur-sm">
                    <div className="max-w-7xl mx-auto px-6 py-4">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-3 text-white">
                                <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                                    <AlertCircle size={20} />
                                </div>
                                <div>
                                    <p className="font-semibold">Unsaved Changes</p>
                                    <p className="text-orange-100 text-sm">Your squad selections haven't been saved yet</p>
                                </div>
                            </div>
                            <div className="flex items-center space-x-4">
                                <button
                                    onClick={resetChanges}
                                    className="px-6 py-2.5 text-white hover:bg-white/20 rounded-xl transition-all duration-200 font-medium border border-white/30 hover:border-white/50"
                                >
                                    Reset Changes
                                </button>
                                <button
                                    onClick={savePlayingSquads}
                                    disabled={!bothTeamsComplete || saving}
                                    className={`flex items-center space-x-3 px-8 py-3 rounded-xl font-semibold transition-all duration-200 shadow-lg ${
                                        bothTeamsComplete && !saving
                                            ? 'bg-white text-orange-600 hover:bg-orange-50 hover:scale-105 shadow-white/25'
                                            : 'bg-white/20 text-white/70 cursor-not-allowed'
                                    }`}
                                >
                                    <Save size={18} />
                                    <span>{saving ? 'Saving Squad...' : 'Save Playing XI'}</span>
                                </button>
                            </div>
                        </div>
                        {!bothTeamsComplete && (
                            <div className="mt-3 bg-orange-600/20 backdrop-blur-sm px-4 py-2 rounded-lg border border-orange-400/30">
                                <p className="text-orange-100 text-sm font-medium">
                                    ⚠️ Both teams need exactly 11 players selected to save
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* Teams Section */}
            <div className="max-w-7xl mx-auto px-6 py-8">
                <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
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

            {/* Contest Management Section - Only show for upcoming matches */}
            {matchDetail.status === 'upcoming' && (
                <div className="max-w-7xl mx-auto px-6 pb-8">
                    <ContestManager matchId={matchId} matchData={matchDetail} />
                </div>
            )}

            {/* Scorecard Section Placeholder */}
            <div className="max-w-7xl mx-auto px-4 pb-8">
                <div className="bg-white rounded-xl shadow-lg p-6">
                    <h2 className="text-2xl font-bold text-gray-800 mb-4 text-center">
                        Scorecard Section
                    </h2>
                    {/* <ScoreCard matchId={matchId}/> */}
                    <ImprovedScoreCard matchId={matchId}/>
                    
                </div>
            </div>
        </div>
    )
}

export default MatchDetail