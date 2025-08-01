import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AppContext } from '../../context/AppContext';
import { toast } from 'react-toastify';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { 
  Plus, 
  Search, 
  Edit3, 
  Trash2, 
  Trophy, 
  Users, 
  DollarSign, 
  Target, 
  CheckCircle, 
  Calendar,
  Filter,
  Eye,
  EyeOff,
  ArrowLeft
} from 'lucide-react';

const ManageContest = () => {
  const { BACKEND_URL } = useContext(AppContext);
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [matches, setMatches] = useState([]);
  const [selectedMatch, setSelectedMatch] = useState(null);
  const [contests, setContests] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [showCreateForm, setShowCreateForm] = useState(false);
  
  // Get matchId from URL params
  const urlMatchId = searchParams.get('matchId');
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
    fetchUpcomingMatches();
  }, []);

  // Auto-select match if provided in URL
  useEffect(() => {
    if (urlMatchId && matches.length > 0) {
      const match = matches.find(m => m._id === urlMatchId);
      if (match) {
        setSelectedMatch(match);
        fetchContests(urlMatchId);
      }
    }
  }, [urlMatchId, matches]);

  const fetchUpcomingMatches = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get(`${BACKEND_URL}/api/matches/status/upcoming`);
      setMatches(data.upcomingMatches || data.data || []);
    } catch (error) {
      console.error('Error fetching matches:', error);
      toast.error('Failed to fetch matches');
    } finally {
      setLoading(false);
    }
  };

  const fetchContests = async (matchId) => {
    try {
      const { data } = await axios.get(`${BACKEND_URL}/api/contests/${matchId}`);
      setContests(data.data || []);
    } catch (error) {
      console.error('Error fetching contests:', error);
      toast.error('Failed to fetch contests');
    }
  };

  const handleMatchSelect = (match) => {
    setSelectedMatch(match);
    fetchContests(match._id);
  };

  const createDefaultContests = async () => {
    if (!selectedMatch) {
      toast.error('Please select a match first');
      return;
    }

    try {
      setLoading(true);
      const contestsToCreate = defaultContests.filter((_, index) => selectedDefaults.has(index));
      
      for (const contest of contestsToCreate) {
        await axios.post(`${BACKEND_URL}/api/contests/${selectedMatch._id}`, {
          contestFormat: contest.contestFormat,
          entryFee: contest.entryFee,
          prizePool: contest.prizePool,
          totalSpots: contest.totalSpots,
          contestType: contest.contestType,
          maxTeamPerUser: contest.maxTeamPerUser
        });
      }

      toast.success(`${contestsToCreate.length} default contests created successfully!`);
      fetchContests(selectedMatch._id);
    } catch (error) {
      console.error('Error creating contests:', error);
      toast.error('Failed to create contests');
    } finally {
      setLoading(false);
    }
  };

  const createCustomContest = async (e) => {
    e.preventDefault();
    if (!selectedMatch) {
      toast.error('Please select a match first');
      return;
    }

    try {
      setLoading(true);
      await axios.post(`${BACKEND_URL}/api/contests/${selectedMatch._id}`, formData);
      
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
      fetchContests(selectedMatch._id);
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
      'h2h': 'bg-blue-100 text-blue-800',
      'league': 'bg-green-100 text-green-800',
      'winners-takes-all': 'bg-purple-100 text-purple-800',
      'mega-contest': 'bg-red-100 text-red-800',
      'practice': 'bg-gray-100 text-gray-800'
    };
    return colors[format] || 'bg-gray-100 text-gray-800';
  };

  const filteredMatches = matches.filter(match =>
    match.team1?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    match.team2?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    match.series?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center space-x-4 mb-4">
            {urlMatchId && (
              <button
                onClick={() => navigate(`/matches/${urlMatchId}`)}
                className="flex items-center space-x-2 text-blue-600 hover:text-blue-700 font-medium transition-colors duration-200"
              >
                <ArrowLeft size={20} />
                <span>Back to Match Detail</span>
              </button>
            )}
          </div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            {urlMatchId && selectedMatch 
              ? `Contest Management - ${selectedMatch.team1?.name} vs ${selectedMatch.team2?.name}`
              : 'Contest Management'
            }
          </h1>
          <p className="text-gray-600">
            {urlMatchId && selectedMatch
              ? `Create and manage contests for this match`
              : 'Create and manage contests for upcoming matches'
            }
          </p>
        </div>

        <div className={`grid grid-cols-1 ${urlMatchId ? 'lg:grid-cols-1' : 'lg:grid-cols-3'} gap-6`}>
          {/* Left Panel - Match Selection - Hide when specific match is selected */}
          {!urlMatchId && (
            <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
                <Calendar className="mr-2" size={20} />
                Select Match
              </h2>

              {/* Search */}
              <div className="relative mb-4">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                <input
                  type="text"
                  placeholder="Search matches..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Matches List */}
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {filteredMatches.map((match) => (
                  <div
                    key={match._id}
                    onClick={() => handleMatchSelect(match)}
                    className={`p-3 rounded-lg border cursor-pointer transition-all duration-200 ${
                      selectedMatch?._id === match._id
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    <div className="text-sm font-semibold text-gray-800">
                      {match.team1?.name} vs {match.team2?.name}
                    </div>
                    <div className="text-xs text-gray-500 mt-1">
                      {match.series} • {new Date(match.startTime).toLocaleDateString()}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          )}

          {/* Right Panel - Contest Management */}
          <div className={urlMatchId ? 'lg:col-span-1' : 'lg:col-span-2'}>
            {selectedMatch ? (
              <div className="space-y-6">
                {/* Selected Match Info - Only show when not coming from specific match */}
                {!urlMatchId && (
                  <div className="bg-white rounded-lg shadow-md p-6">
                    <h2 className="text-xl font-semibold text-gray-800 mb-4">
                      {selectedMatch.team1?.name} vs {selectedMatch.team2?.name}
                    </h2>
                    <div className="flex items-center space-x-4 text-sm text-gray-600">
                      <span>{selectedMatch.series}</span>
                      <span>•</span>
                      <span>{new Date(selectedMatch.startTime).toLocaleString()}</span>
                    </div>
                  </div>
                )}

                {/* Default Contests Section */}
                <div className="bg-white rounded-lg shadow-md p-6">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">Default Contests</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                    {defaultContests.map((contest, index) => (
                      <div
                        key={index}
                        className={`p-4 rounded-lg border-2 cursor-pointer transition-all duration-200 ${
                          selectedDefaults.has(index)
                            ? 'border-green-500 bg-green-50'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                        onClick={() => toggleDefaultSelection(index)}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-semibold text-gray-800">{contest.name}</h4>
                          {selectedDefaults.has(index) ? (
                            <CheckCircle className="text-green-500" size={20} />
                          ) : (
                            <div className="w-5 h-5 border-2 border-gray-300 rounded-full"></div>
                          )}
                        </div>
                        <div className="space-y-1 text-sm text-gray-600">
                          <div className="flex justify-between">
                            <span>Entry Fee:</span>
                            <span className="font-medium">₹{contest.entryFee}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Prize Pool:</span>
                            <span className="font-medium">₹{contest.prizePool}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Spots:</span>
                            <span className="font-medium">{contest.totalSpots}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Format:</span>
                            <span className={`px-2 py-1 rounded text-xs font-medium ${getContestFormatColor(contest.contestFormat)}`}>
                              {contest.contestFormat.toUpperCase()}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  <button
                    onClick={createDefaultContests}
                    disabled={loading || selectedDefaults.size === 0}
                    className="w-full bg-blue-500 hover:bg-blue-600 disabled:bg-gray-400 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200"
                  >
                    {loading ? 'Creating...' : `Create ${selectedDefaults.size} Selected Contests`}
                  </button>
                </div>

                {/* Custom Contest Form */}
                <div className="bg-white rounded-lg shadow-md p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-gray-800">Create Custom Contest</h3>
                    <button
                      onClick={() => setShowCreateForm(!showCreateForm)}
                      className="text-blue-500 hover:text-blue-600 font-medium"
                    >
                      {showCreateForm ? 'Cancel' : 'Create Custom'}
                    </button>
                  </div>

                  {showCreateForm && (
                    <form onSubmit={createCustomContest} className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Contest Format
                          </label>
                          <select
                            value={formData.contestFormat}
                            onChange={(e) => setFormData({...formData, contestFormat: e.target.value})}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                          >
                            <option value="h2h">Head to Head</option>
                            <option value="league">League</option>
                            <option value="winners-takes-all">Winner Takes All</option>
                            <option value="mega-contest">Mega Contest</option>
                            <option value="practice">Practice</option>
                          </select>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Entry Fee (₹)
                          </label>
                          <input
                            type="number"
                            value={formData.entryFee}
                            onChange={(e) => setFormData({...formData, entryFee: e.target.value})}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            required
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Prize Pool (₹)
                          </label>
                          <input
                            type="number"
                            value={formData.prizePool}
                            onChange={(e) => setFormData({...formData, prizePool: e.target.value})}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            required
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Total Spots
                          </label>
                          <input
                            type="number"
                            value={formData.totalSpots}
                            onChange={(e) => setFormData({...formData, totalSpots: e.target.value})}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            required
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Contest Type
                          </label>
                          <select
                            value={formData.contestType}
                            onChange={(e) => setFormData({...formData, contestType: e.target.value})}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                          >
                            <option value="public">Public</option>
                            <option value="private">Private</option>
                          </select>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Max Teams Per User
                          </label>
                          <input
                            type="number"
                            value={formData.maxTeamPerUser}
                            onChange={(e) => setFormData({...formData, maxTeamPerUser: e.target.value})}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            min="1"
                          />
                        </div>
                      </div>

                      <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-green-500 hover:bg-green-600 disabled:bg-gray-400 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200"
                      >
                        {loading ? 'Creating Contest...' : 'Create Contest'}
                      </button>
                    </form>
                  )}
                </div>

                {/* Existing Contests */}
                <div className="bg-white rounded-lg shadow-md p-6">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">Existing Contests</h3>
                  {contests.length === 0 ? (
                    <div className="text-center py-8 text-gray-500">
                      No contests created for this match yet
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {contests.map((contest) => (
                        <div key={contest._id} className="p-4 border border-gray-200 rounded-lg">
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center space-x-3">
                              <span className={`px-3 py-1 rounded-full text-xs font-medium ${getContestFormatColor(contest.contestFormat)}`}>
                                {contest.contestFormat.toUpperCase()}
                              </span>
                              <span className="text-sm text-gray-600">
                                {contest.currentParticipants}/{contest.totalSpots} joined
                              </span>
                            </div>
                            <div className="flex items-center space-x-2">
                              <button className="text-blue-500 hover:text-blue-600 p-1">
                                <Edit3 size={16} />
                              </button>
                              <button className="text-red-500 hover:text-red-600 p-1">
                                <Trash2 size={16} />
                              </button>
                            </div>
                          </div>
                          <div className="grid grid-cols-4 gap-4 text-sm">
                            <div>
                              <span className="text-gray-500">Entry Fee:</span>
                              <div className="font-semibold">₹{contest.entryFee}</div>
                            </div>
                            <div>
                              <span className="text-gray-500">Prize Pool:</span>
                              <div className="font-semibold">₹{contest.prizePool}</div>
                            </div>
                            <div>
                              <span className="text-gray-500">Status:</span>
                              <div className={`font-semibold ${contest.status === 'open' ? 'text-green-600' : 'text-red-600'}`}>
                                {contest.status.toUpperCase()}
                              </div>
                            </div>
                            <div>
                              <span className="text-gray-500">Type:</span>
                              <div className="font-semibold capitalize">{contest.contestType}</div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-lg shadow-md p-12 text-center">
                <Trophy className="mx-auto mb-4 text-gray-400" size={48} />
                <h3 className="text-xl font-semibold text-gray-800 mb-2">Select a Match</h3>
                <p className="text-gray-600">Choose a match from the left panel to manage its contests</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ManageContest;