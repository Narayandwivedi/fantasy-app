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
    {
      name: 'Beginner H2H',
      contestFormat: 'h2h',
      entryFee: 15,
      prizePool: 25,
      totalSpots: 2,
      contestType: 'public',
      maxTeamPerUser: 1,
      isDefault: true
    },
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

  const [selectedDefaults, setSelectedDefaults] = useState(new Set([0, 1])); // Select first two by default

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
        {/* Default Contests Section */}
        <div>
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Quick Create - Default Contests</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
            {defaultContests.map((contest, index) => (
              <div
                key={index}
                className={`p-4 rounded-xl border-2 cursor-pointer transition-all duration-300 hover:shadow-lg ${
                  selectedDefaults.has(index)
                    ? 'border-emerald-400 bg-emerald-50 shadow-md'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
                onClick={() => toggleDefaultSelection(index)}
              >
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-semibold text-gray-800">{contest.name}</h4>
                  {selectedDefaults.has(index) ? (
                    <div className="w-6 h-6 bg-emerald-500 rounded-full flex items-center justify-center">
                      <CheckCircle className="text-white" size={16} />
                    </div>
                  ) : (
                    <div className="w-6 h-6 border-2 border-gray-300 rounded-full"></div>
                  )}
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Entry Fee:</span>
                    <span className="font-semibold text-gray-800">₹{contest.entryFee}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Prize Pool:</span>
                    <span className="font-semibold text-gray-800">₹{contest.prizePool}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Spots:</span>
                    <span className="font-semibold text-gray-800">{contest.totalSpots}</span>
                  </div>
                  <div className="mt-3">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getContestFormatColor(contest.contestFormat)}`}>
                      {contest.contestFormat.replace('-', ' ').toUpperCase()}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          {selectedDefaults.size > 0 && (
            <button
              onClick={createDefaultContests}
              disabled={loading}
              className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 disabled:from-gray-400 disabled:to-gray-500 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl"
            >
              {loading ? 'Creating Contests...' : `Create ${selectedDefaults.size} Selected Contest${selectedDefaults.size > 1 ? 's' : ''}`}
            </button>
          )}
        </div>

        {/* Custom Contest Form */}
        <div className="border-t border-gray-200 pt-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-800">Create Custom Contest</h3>
            <button
              onClick={() => setShowCreateForm(!showCreateForm)}
              className="flex items-center space-x-2 text-blue-600 hover:text-blue-700 font-medium transition-colors duration-200"
            >
              <Plus size={16} />
              <span>{showCreateForm ? 'Cancel' : 'Create Custom'}</span>
            </button>
          </div>

          {showCreateForm && (
            <form onSubmit={createCustomContest} className="bg-gray-50 rounded-xl p-6 space-y-4">
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
                className="w-full bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 disabled:from-gray-400 disabled:to-gray-500 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl"
              >
                {loading ? 'Creating Contest...' : 'Create Custom Contest'}
              </button>
            </form>
          )}
        </div>

        {/* Existing Contests */}
        <div className="border-t border-gray-200 pt-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Existing Contests</h3>
          {contests.length === 0 ? (
            <div className="text-center py-12 bg-gray-50 rounded-xl">
              <Trophy className="mx-auto mb-4 text-gray-400" size={48} />
              <h4 className="text-xl font-semibold text-gray-800 mb-2">No Contests Yet</h4>
              <p className="text-gray-600">Create your first contest using the options above</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {contests.map((contest) => (
                <div key={contest._id} className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-all duration-200">
                  <div className="flex items-center justify-between mb-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getContestFormatColor(contest.contestFormat)}`}>
                      {contest.contestFormat.replace('-', ' ').toUpperCase()}
                    </span>
                    <div className="flex items-center space-x-2">
                      <button className="text-blue-500 hover:text-blue-600 p-2 rounded-lg hover:bg-blue-50 transition-colors duration-200">
                        <Edit3 size={16} />
                      </button>
                      <button className="text-red-500 hover:text-red-600 p-2 rounded-lg hover:bg-red-50 transition-colors duration-200">
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <DollarSign size={16} className="text-green-600" />
                        <span className="text-sm text-gray-600">Entry Fee</span>
                      </div>
                      <span className="font-semibold text-gray-800">₹{contest.entryFee}</span>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Trophy size={16} className="text-yellow-600" />
                        <span className="text-sm text-gray-600">Prize Pool</span>
                      </div>
                      <span className="font-semibold text-gray-800">₹{contest.prizePool}</span>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Users size={16} className="text-blue-600" />
                        <span className="text-sm text-gray-600">Participants</span>
                      </div>
                      <span className="font-semibold text-gray-800">
                        {contest.currentParticipants}/{contest.totalSpots}
                      </span>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Target size={16} className="text-purple-600" />
                        <span className="text-sm text-gray-600">Status</span>
                      </div>
                      <span className={`font-semibold ${
                        contest.status === 'open' ? 'text-green-600' : 
                        contest.status === 'closed' ? 'text-red-600' : 'text-gray-600'
                      }`}>
                        {contest.status.toUpperCase()}
                      </span>
                    </div>
                  </div>

                  {/* Progress bar */}
                  <div className="mt-4">
                    <div className="flex justify-between text-xs text-gray-500 mb-1">
                      <span>Fill Rate</span>
                      <span>{Math.round((contest.currentParticipants / contest.totalSpots) * 100)}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-gradient-to-r from-blue-500 to-purple-600 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${(contest.currentParticipants / contest.totalSpots) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ContestManager;