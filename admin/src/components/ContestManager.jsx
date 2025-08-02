import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AppContext } from '../context/AppContext';
import { toast } from 'react-toastify';
import { 
  Plus, 
  Trophy, 
  Users, 
  DollarSign, 
  Target, 
  CheckCircle, 
  Edit3,
  Trash2,
  Eye,
  EyeOff
} from 'lucide-react';

const ContestManager = ({ matchId, matchData }) => {
  const { BACKEND_URL } = useContext(AppContext);
  const [contests, setContests] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [formData, setFormData] = useState({
    contestFormat: 'h2h',
    entryFee: '',
    prizePool: '',
    totalSpots: '',
    contestType: 'public',
    maxTeamPerUser: 1
  });

  // Default contest templates
  const defaultContests = [
    // H2H Contests
    {
      name: 'H2H',
      contestFormat: 'h2h',
      entryFee: 15,
      prizePool: 25,
      totalSpots: 2,
      contestType: 'public',
      maxTeamPerUser: 1,
      isDefault: true
    },
    {
      name: 'H2H',
      contestFormat: 'h2h',
      entryFee: 59,
      prizePool: 100,
      totalSpots: 2,
      contestType: 'public',
      maxTeamPerUser: 1,
      isDefault: true
    },
    {
      name: 'H2H',
      contestFormat: 'h2h',
      entryFee: 88,
      prizePool: 150,
      totalSpots: 2,
      contestType: 'public',
      maxTeamPerUser: 1,
      isDefault: true
    },
    {
      name: 'H2H',
      contestFormat: 'h2h',
      entryFee: 120,
      prizePool: 200,
      totalSpots: 2,
      contestType: 'public',
      maxTeamPerUser: 1,
      isDefault: true
    },
    {
      name: 'H2H',
      contestFormat: 'h2h',
      entryFee: 175,
      prizePool: 300,
      totalSpots: 2,
      contestType: 'public',
      maxTeamPerUser: 1,
      isDefault: true
    },
    // Winner Takes All Contests
    {
      name: 'Winner Takes All',
      contestFormat: 'winners-takes-all',
      entryFee: 30,
      prizePool: 85,
      totalSpots: 3,
      contestType: 'public',
      maxTeamPerUser: 1,
      isDefault: true
    },
    {
      name: 'Winner Takes All',
      contestFormat: 'winners-takes-all',
      entryFee: 50,
      prizePool: 140,
      totalSpots: 3,
      contestType: 'public',
      maxTeamPerUser: 1,
      isDefault: true
    },
    {
      name: 'Winner Takes All',
      contestFormat: 'winners-takes-all',
      entryFee: 100,
      prizePool: 290,
      totalSpots: 3,
      contestType: 'public',
      maxTeamPerUser: 1,
      isDefault: true
    },
    {
      name: 'Winner Takes All',
      contestFormat: 'winners-takes-all',
      entryFee: 150,
      prizePool: 420,
      totalSpots: 3,
      contestType: 'public',
      maxTeamPerUser: 1,
      isDefault: true
    },
    // Other Contest Types
    {
      name: 'Small League',
      contestFormat: 'league',
      entryFee: 50,
      prizePool: 200,
      totalSpots: 5,
      contestType: 'public',
      maxTeamPerUser: 2,
      isDefault: true
    },
    {
      name: 'Mega Contest',
      contestFormat: 'mega-contest',
      entryFee: 100,
      prizePool: 1000,
      totalSpots: 15,
      contestType: 'public',
      maxTeamPerUser: 3,
      isDefault: true
    },
    {
      name: 'Practice Contest',
      contestFormat: 'practice',
      entryFee: 0,
      prizePool: 0,
      totalSpots: 10,
      contestType: 'public',
      maxTeamPerUser: 1,
      isDefault: true
    }
  ];

  const [selectedDefaults, setSelectedDefaults] = useState(new Set(defaultContests.map((_, index) => index))); // Select all by default

  useEffect(() => {
    if (matchId) {
      fetchContests();
    }
  }, [matchId]);

  const fetchContests = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get(`${BACKEND_URL}/api/contests/${matchId}`);
      setContests(data.data || []);
    } catch (error) {
      console.error('Error fetching contests:', error);
      if (error.response?.status !== 404) {
        toast.error('Failed to fetch contests');
      }
    } finally {
      setLoading(false);
    }
  };

  const createDefaultContests = async () => {
    try {
      setLoading(true);
      const contestsToCreate = defaultContests.filter((_, index) => selectedDefaults.has(index));
      
      for (const contest of contestsToCreate) {
        await axios.post(`${BACKEND_URL}/api/contests/${matchId}`, {
          contestFormat: contest.contestFormat,
          entryFee: contest.entryFee,
          prizePool: contest.prizePool,
          totalSpots: contest.totalSpots,
          contestType: contest.contestType,
          maxTeamPerUser: contest.maxTeamPerUser
        });
      }

      toast.success(`${contestsToCreate.length} default contests created successfully!`);
      fetchContests();
      setSelectedDefaults(new Set());
    } catch (error) {
      console.error('Error creating contests:', error);
      toast.error('Failed to create contests');
    } finally {
      setLoading(false);
    }
  };

  const createCustomContest = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      await axios.post(`${BACKEND_URL}/api/contests/${matchId}`, formData);
      
      toast.success('Contest created successfully!');
      setShowCreateForm(false);
      setFormData({
        contestFormat: 'h2h',
        entryFee: '',
        prizePool: '',
        totalSpots: '',
        contestType: 'public',
        maxTeamPerUser: 1
      });
      fetchContests();
    } catch (error) {
      console.error('Error creating contest:', error);
      toast.error('Failed to create contest');
    } finally {
      setLoading(false);
    }
  };

  const toggleDefaultSelection = (index) => {
    const newSelected = new Set(selectedDefaults);
    if (newSelected.has(index)) {
      newSelected.delete(index);
    } else {
      newSelected.add(index);
    }
    setSelectedDefaults(newSelected);
  };

  const getContestFormatColor = (format) => {
    const colors = {
      'h2h': 'bg-blue-100 text-blue-800 border-blue-200',
      'league': 'bg-green-100 text-green-800 border-green-200',
      'winners-takes-all': 'bg-purple-100 text-purple-800 border-purple-200',
      'mega-contest': 'bg-red-100 text-red-800 border-red-200',
      'practice': 'bg-gray-100 text-gray-800 border-gray-200'
    };
    return colors[format] || 'bg-gray-100 text-gray-800 border-gray-200';
  };

  // Group contests by category
  const getGroupedContests = () => {
    const grouped = contests.reduce((acc, contest) => {
      const category = contest.contestFormat;
      if (!acc[category]) {
        acc[category] = [];
      }
      acc[category].push(contest);
      return acc;
    }, {});

    // Sort categories by priority
    const categoryOrder = ['h2h', 'winners-takes-all', 'league', 'mega-contest', 'practice'];
    return categoryOrder
      .filter(category => grouped[category])
      .map(category => [category, grouped[category]]);
  };

  // Get category display name
  const getCategoryDisplayName = (category) => {
    const names = {
      'h2h': 'Head to Head',
      'winners-takes-all': 'Winner Takes All',
      'league': 'League Contests',
      'mega-contest': 'Mega Contests',
      'practice': 'Practice Contests'
    };
    return names[category] || category.replace('-', ' ').toUpperCase();
  };

  // Get category header styling
  const getCategoryHeaderStyle = (category) => {
    const styles = {
      'h2h': 'bg-blue-500 text-white',
      'winners-takes-all': 'bg-purple-500 text-white',
      'league': 'bg-green-500 text-white',
      'mega-contest': 'bg-red-500 text-white',
      'practice': 'bg-gray-500 text-white'
    };
    return styles[category] || 'bg-gray-500 text-white';
  };

  // Get category icon
  const getCategoryIcon = (category, size = 20) => {
    switch (category) {
      case 'h2h':
        return <Users size={size} />;
      case 'winners-takes-all':
        return <Trophy size={size} />;
      case 'league':
        return <Target size={size} />;
      case 'mega-contest':
        return <DollarSign size={size} />;
      case 'practice':
        return <Eye size={size} />;
      default:
        return <Trophy size={size} />;
    }
  };

  // Group default contests by category
  const getGroupedDefaultContests = () => {
    const grouped = defaultContests.reduce((acc, contest, index) => {
      const category = contest.contestFormat;
      if (!acc[category]) {
        acc[category] = [];
      }
      acc[category].push({ contest, originalIndex: index });
      return acc;
    }, {});

    // Sort categories by priority
    const categoryOrder = ['h2h', 'winners-takes-all', 'league', 'mega-contest', 'practice'];
    return categoryOrder
      .filter(category => grouped[category])
      .map(category => [category, grouped[category]]);
  };

  // Get category progress bar color
  const getCategoryProgressColor = (category) => {
    const colors = {
      'h2h': 'bg-gradient-to-r from-blue-400 to-blue-600',
      'winners-takes-all': 'bg-gradient-to-r from-purple-400 to-purple-600',
      'league': 'bg-gradient-to-r from-green-400 to-green-600',
      'mega-contest': 'bg-gradient-to-r from-red-400 to-red-600',
      'practice': 'bg-gradient-to-r from-gray-400 to-gray-600'
    };
    return colors[category] || 'bg-gradient-to-r from-gray-400 to-gray-600';
  };

  return (
    <div className="bg-white rounded-2xl shadow-xl border border-slate-200">
      {/* Header */}
      <div className="relative bg-gradient-to-br from-slate-800 via-slate-700 to-slate-600 text-white p-6 rounded-t-2xl">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-blue-500/10 rounded-t-2xl"></div>
        <div className="relative flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-blue-500 rounded-2xl flex items-center justify-center shadow-lg">
              <Trophy size={24} className="text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold">Contest Management</h2>
              <p className="text-slate-300 text-sm">Create and manage contests for this match</p>
            </div>
          </div>
          <div className="text-right">
            <div className="text-lg font-semibold text-white">{contests.length}</div>
            <div className="text-slate-300 text-sm">Active Contests</div>
          </div>
        </div>
      </div>

      <div className="p-6 space-y-6">
        {/* Quick Create Section - Different Design */}
        <div className="bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 rounded-3xl p-6 border-2 border-blue-200 shadow-lg">
          <div className="flex items-center space-x-3 mb-6">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
              <Plus size={20} className="text-white" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-800">Quick Create Templates</h3>
              <p className="text-sm text-gray-600">Select pre-configured contest templates</p>
            </div>
          </div>
          
          <div className="space-y-4 mb-6">
            {getGroupedDefaultContests().map(([category, categoryContests]) => (
              <div key={category} className="bg-white/70 backdrop-blur-sm rounded-2xl p-4 border border-blue-200/50 shadow-sm">
                {/* Category Header */}
                <div className="flex items-center space-x-3 mb-4">
                  <div className={`w-7 h-7 rounded-lg flex items-center justify-center ${getCategoryHeaderStyle(category)} shadow-sm`}>
                    {getCategoryIcon(category, 14)}
                  </div>
                  <h4 className="font-bold text-gray-800">{getCategoryDisplayName(category)}</h4>
                </div>

                {/* Category Contests - Compact Cards */}
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                  {categoryContests.map((contestData) => {
                    const { contest, originalIndex } = contestData;
                    return (
                      <div
                        key={originalIndex}
                        className={`px-2 py-3 rounded-lg border-2 cursor-pointer transition-all duration-300 hover:scale-105 bg-white/80 hover:bg-white ${
                          selectedDefaults.has(originalIndex)
                            ? 'border-emerald-400 shadow-md scale-105'
                            : 'border-blue-200 hover:border-blue-300'
                        }`}
                        onClick={() => toggleDefaultSelection(originalIndex)}
                      >
                        <div className="text-center">
                          {selectedDefaults.has(originalIndex) ? (
                            <div className="w-5 h-5 bg-emerald-500 rounded-full flex items-center justify-center mx-auto mb-2">
                              <CheckCircle className="text-white" size={12} />
                            </div>
                          ) : (
                            <div className="w-5 h-5 border-2 border-blue-300 rounded-full mx-auto mb-2"></div>
                          )}
                          <div className="space-y-1 text-xs">
                            <div className="font-bold text-green-600">₹{contest.entryFee}</div>
                            <div className="text-gray-500">Prize: ₹{contest.prizePool}</div>
                            <div className="text-gray-500">{contest.totalSpots} spots</div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
          
          {selectedDefaults.size > 0 && (
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-4 border border-blue-200">
              <div className="flex items-center justify-between mb-3">
                <div className="text-sm text-gray-600">
                  <span className="font-semibold text-blue-600">{selectedDefaults.size}</span> template{selectedDefaults.size > 1 ? 's' : ''} selected
                </div>
                <button
                  onClick={createDefaultContests}
                  disabled={loading}
                  className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 disabled:from-gray-400 disabled:to-gray-500 text-white font-semibold py-2 px-6 rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl hover:scale-105"
                >
                  {loading ? 'Creating...' : 'Create Selected'}
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Custom Contest Form - Connected to Templates */}
        <div className="mt-4">
          <div className="bg-gradient-to-br from-indigo-50 via-purple-50 to-blue-50 rounded-2xl p-6 border-2 border-blue-200/50 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center shadow-sm">
                  <Plus size={16} className="text-white" />
                </div>
                <h3 className="text-lg font-semibold text-gray-800">Create Custom Contest</h3>
              </div>
              <button
                onClick={() => setShowCreateForm(!showCreateForm)}
                className="flex items-center space-x-2 text-indigo-600 hover:text-indigo-700 font-medium transition-colors duration-200 bg-white/70 px-3 py-2 rounded-lg hover:bg-white"
              >
                <Plus size={16} />
                <span>{showCreateForm ? 'Cancel' : 'Create Custom'}</span>
              </button>
            </div>

            {showCreateForm && (
              <form onSubmit={createCustomContest} className="bg-white/70 backdrop-blur-sm rounded-xl p-6 space-y-4 border border-blue-200/50 mt-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Contest Format
                  </label>
                  <select
                    value={formData.contestFormat}
                    onChange={(e) => setFormData({...formData, contestFormat: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="h2h">Head to Head</option>
                    <option value="league">League</option>
                    <option value="winners-takes-all">Winner Takes All</option>
                    <option value="mega-contest">Mega Contest</option>
                    <option value="practice">Practice</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Entry Fee (₹)
                  </label>
                  <input
                    type="number"
                    value={formData.entryFee}
                    onChange={(e) => setFormData({...formData, entryFee: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter entry fee"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Prize Pool (₹)
                  </label>
                  <input
                    type="number"
                    value={formData.prizePool}
                    onChange={(e) => setFormData({...formData, prizePool: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter prize pool"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Total Spots
                  </label>
                  <input
                    type="number"
                    value={formData.totalSpots}
                    onChange={(e) => setFormData({...formData, totalSpots: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter total spots"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Contest Type
                  </label>
                  <select
                    value={formData.contestType}
                    onChange={(e) => setFormData({...formData, contestType: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="public">Public</option>
                    <option value="private">Private</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Max Teams Per User
                  </label>
                  <input
                    type="number"
                    value={formData.maxTeamPerUser}
                    onChange={(e) => setFormData({...formData, maxTeamPerUser: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    min="1"
                    placeholder="Max teams per user"
                  />
                </div>
              </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 disabled:from-gray-400 disabled:to-gray-500 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl hover:scale-105"
                >
                  {loading ? 'Creating Contest...' : 'Create Custom Contest'}
                </button>
              </form>
            )}
          </div>
        </div>

        {/* Existing Contests - Separate Big Card */}
        <div className="mt-12">
          <div className="bg-white rounded-3xl shadow-xl border border-gray-200 p-8">
            <div className="flex items-center space-x-3 mb-8">
              <div className="w-12 h-12 bg-gradient-to-br from-gray-600 to-gray-800 rounded-2xl flex items-center justify-center shadow-lg">
                <Trophy size={24} className="text-white" />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-gray-800">Existing Contests</h3>
                <p className="text-sm text-gray-600">Monitor and manage your active contests</p>
              </div>
            </div>

            {contests.length === 0 ? (
              <div className="text-center py-12 bg-gray-50 rounded-xl">
                <Trophy className="mx-auto mb-4 text-gray-400" size={48} />
                <h4 className="text-xl font-semibold text-gray-800 mb-2">No Contests Yet</h4>
                <p className="text-gray-600">Create your first contest using the options above</p>
              </div>
            ) : (
              <div className="space-y-6">
                {getGroupedContests().map(([category, categoryContests]) => (
                  <div key={category} className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-2xl p-6 border border-gray-200">
                    {/* Category Header */}
                    <div className="flex items-center justify-between mb-6">
                      <div className="flex items-center space-x-3">
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${getCategoryHeaderStyle(category)}`}>
                          {getCategoryIcon(category)}
                        </div>
                        <div>
                          <h4 className="text-xl font-bold text-gray-800">{getCategoryDisplayName(category)}</h4>
                          <p className="text-sm text-gray-600">{categoryContests.length} contest{categoryContests.length > 1 ? 's' : ''}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-4">
                        <div className="text-right">
                          <div className="text-sm text-gray-600">
                            Total Participants: <span className="text-lg font-bold text-gray-800">
                              {categoryContests.reduce((sum, contest) => sum + (contest.currentParticipants || 0), 0)}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Category Contests - Compact Cards */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-4 gap-3">
                      {categoryContests.map((contest) => (
                        <div key={contest._id} className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-all duration-200 hover:border-gray-300">
                          <div className="flex items-center justify-between mb-3">
                            <span className={`px-2 py-1 rounded-md text-xs font-medium border ${getContestFormatColor(contest.contestFormat)}`}>
                              {contest.contestFormat.replace('-', ' ').toUpperCase()}
                            </span>
                            <div className="flex items-center space-x-1">
                              <button className="text-blue-500 hover:text-blue-600 p-1.5 rounded-md hover:bg-blue-50 transition-colors duration-200" title="Edit Contest">
                                <Edit3 size={14} />
                              </button>
                              <button className="text-red-500 hover:text-red-600 p-1.5 rounded-md hover:bg-red-50 transition-colors duration-200" title="Delete Contest">
                                <Trash2 size={14} />
                              </button>
                            </div>
                          </div>

                          {/* Compact Info Grid */}
                          <div className="space-y-2">
                            <div className="grid grid-cols-2 gap-2 text-xs">
                              <div className="flex items-center space-x-1">
                                <DollarSign size={12} className="text-green-600" />
                                <span className="text-gray-600">Entry:</span>
                              </div>
                              <span className="font-semibold text-gray-800 text-right">₹{contest.entryFee}</span>
                              
                              <div className="flex items-center space-x-1">
                                <Trophy size={12} className="text-yellow-600" />
                                <span className="text-gray-600">Prize:</span>
                              </div>
                              <span className="font-semibold text-gray-800 text-right">₹{contest.prizePool?.toLocaleString()}</span>
                              
                              <div className="flex items-center space-x-1">
                                <Users size={12} className="text-blue-600" />
                                <span className="text-gray-600">Joined:</span>
                              </div>
                              <span className="font-semibold text-gray-800 text-right">
                                {contest.currentParticipants || 0}/{contest.totalSpots}
                              </span>
                            </div>

                            {/* Status and Progress Combined */}
                            <div className="border-t border-gray-100 pt-2">
                              <div className="flex items-center justify-between mb-2">
                                <span className={`font-medium px-2 py-1 rounded-md text-xs ${
                                  contest.status === 'open' ? 'bg-green-100 text-green-700' : 
                                  contest.status === 'closed' ? 'bg-red-100 text-red-700' : 
                                  'bg-gray-100 text-gray-700'
                                }`}>
                                  {(contest.status || 'OPEN').toUpperCase()}
                                </span>
                                <span className="text-xs font-medium text-gray-600">
                                  {Math.round(((contest.currentParticipants || 0) / contest.totalSpots) * 100)}% Full
                                </span>
                              </div>
                              <div className="w-full bg-gray-200 rounded-full h-1.5">
                                <div 
                                  className={`h-1.5 rounded-full transition-all duration-300 ${getCategoryProgressColor(category)}`}
                                  style={{ width: `${((contest.currentParticipants || 0) / contest.totalSpots) * 100}%` }}
                                ></div>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContestManager;