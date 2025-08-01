import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AppContext } from '../../context/AppContext';
import MatchCard from '../../components/MatchCard';
import AddMatch from '../../components/AddMatch';

const UpcomingMatch = () => {
  const { BACKEND_URL } = useContext(AppContext);
  const [upcomingMatches, setUpcomingMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAddMatchModal, setShowAddMatchModal] = useState(false);

  const fetchUpcomingMatches = async () => {
    try {
      setLoading(true);
      setError(null);
      const { data } = await axios.get(`${BACKEND_URL}/api/matches/status/upcoming`);
      setUpcomingMatches(data.upcomingMatches || data.data || []);
      console.log(data);
    } catch (error) {
      console.error("Error fetching upcoming matches:", error);
      setError("Failed to load upcoming matches");
      setUpcomingMatches([]);
    } finally {
      setLoading(false);
    }
  };

  // Handle status change from MatchCard
  const handleStatusChange = (matchId, newStatus) => {
    // Update the local state immediately for better UX
    setUpcomingMatches(prevMatches => 
      prevMatches.map(match => 
        match._id === matchId 
          ? { ...match, status: newStatus }
          : match
      ).filter(match => 
        // If status changed to 'live' or 'cancelled', remove from upcoming list
        newStatus === 'upcoming' || match._id !== matchId
      )
    );

    // Optionally show a success message
    console.log(`Match ${matchId} status changed to ${newStatus}`);
  };

  // Handle successful match creation
  const handleMatchAdded = () => {
    setShowAddMatchModal(false);
    // Refresh the matches list after adding a new match
    fetchUpcomingMatches();
  };

  useEffect(() => {
    fetchUpcomingMatches();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading upcoming matches...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error}</p>
          <button
            onClick={fetchUpcomingMatches}
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Upcoming Matches</h1>
          <p className="text-gray-600 mt-2">Manage your scheduled matches</p>
        </div>
        <button
          onClick={() => setShowAddMatchModal(true)}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg transition duration-200"
        >
          + Add Match
        </button>
      </div>

      {/* Matches Grid */}
      {upcomingMatches.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {upcomingMatches.map((match) => (
            <MatchCard 
              key={match._id} 
              match={match} 
              BACKEND_URL={BACKEND_URL}
              onStatusChange={handleStatusChange}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <div className="text-gray-500 text-lg mb-4">
            No upcoming matches found
          </div>
          <button
            onClick={() => setShowAddMatchModal(true)}
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg transition duration-200"
          >
            Create Your First Match
          </button>
        </div>
      )}

      {/* Add Match Modal */}
      {showAddMatchModal && (
        <AddMatch onClose={handleMatchAdded} />
      )}
    </div>
  );
};

export default UpcomingMatch;