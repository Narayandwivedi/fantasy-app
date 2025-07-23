import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AppContext } from '../../context/AppContext';
import MatchCard from '../../components/MatchCard';

const CompletedMatch = () => {
  const { BACKEND_URL } = useContext(AppContext);
  const [completedMatches, setCompletedMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchCompletedMatches = async () => {
    try {
      setLoading(true); 
      setError(null);
      const { data } = await axios.get(`${BACKEND_URL}/api/matches/status/completed`);
      setCompletedMatches(data.data || []);
      console.log(data);
    } catch (error) {
      console.error("Error fetching completed matches:", error);
      setError("Failed to load completed matches");
      setCompletedMatches([]);
    } finally {
      setLoading(false);
    }
  };

  // Handle status change from MatchCard
  const handleStatusChange = (matchId, newStatus) => {
    // Update the local state immediately for better UX
    setCompletedMatches(prevMatches => 
      prevMatches.map(match => 
        match._id === matchId 
          ? { ...match, status: newStatus }
          : match
      ).filter(match => 
        // If status changed away from 'completed', remove from completed list
        newStatus === 'completed' || match._id !== matchId
      )
    );

    // Show a success message
    console.log(`Match ${matchId} status changed to ${newStatus}`);
  };

  // Fetch completed matches on component mount
  useEffect(() => {
    fetchCompletedMatches();
  }, []);

  if (loading) {
    return (
      <div className="p-6 w-full bg-gray-50 min-h-screen">
        <div className="mb-6">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Completed Matches</h1>
            <div className="animate-pulse">
              <div className="bg-gray-300 h-10 w-32 rounded-lg"></div>
            </div>
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {/* Loading skeleton */}
          {[...Array(6)].map((_, index) => (
            <div key={index} className="bg-white shadow-lg rounded-xl overflow-hidden border border-gray-100 animate-pulse">
              <div className="bg-gray-300 h-16"></div>
              <div className="p-4">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-3 flex-1">
                    <div className="w-12 h-12 rounded-full bg-gray-300"></div>
                    <div className="h-4 bg-gray-300 rounded w-20"></div>
                  </div>
                  <div className="mx-3 w-8 h-6 bg-gray-300 rounded-full"></div>
                  <div className="flex items-center space-x-3 flex-1 justify-end">
                    <div className="h-4 bg-gray-300 rounded w-20"></div>
                    <div className="w-12 h-12 rounded-full bg-gray-300"></div>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="h-4 bg-gray-300 rounded"></div>
                  <div className="h-4 bg-gray-300 rounded"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 w-full bg-gray-50 min-h-screen">
        <div className="mb-6">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Completed Matches</h1>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
              <span className="text-sm text-red-600 font-medium">Connection Error</span>
            </div>
          </div>
        </div>
        <div className="flex flex-col items-center justify-center py-12">
          <svg className="w-16 h-16 text-red-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <h3 className="text-lg font-medium text-gray-900 mb-2">Error Loading Completed Matches</h3>
          <p className="text-gray-500 text-center mb-4">{error}</p>
          <button
            onClick={fetchCompletedMatches}
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium transition-colors duration-200"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 w-full bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <h1 className="text-2xl font-bold text-gray-900">Completed Matches</h1>
            {/* Completed indicator */}
            <div className="flex items-center space-x-2 bg-green-100 px-3 py-1 rounded-full">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span className="text-green-600 text-sm font-medium">FINISHED</span>
            </div>
          </div>
        </div>
        
        <div className="flex items-center space-x-4">
          <div className="bg-white rounded-lg shadow-sm p-1 inline-flex items-center space-x-2">
            <div className="bg-gradient-to-r from-green-500 to-emerald-500 text-white px-4 py-2 rounded-md text-sm font-medium">
              Completed
            </div>
            <span className="px-3 py-1 rounded-full text-sm bg-green-100 text-green-600 font-semibold">
              {completedMatches.length}
            </span>
          </div>
          
          {/* Manual Refresh Button */}
          <button
            onClick={fetchCompletedMatches}
            disabled={loading}
            className="bg-white hover:bg-gray-50 text-gray-600 px-4 py-2 rounded-lg font-medium transition-colors duration-200 flex items-center space-x-2 shadow-sm border border-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <svg 
              className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            <span>{loading ? 'Refreshing...' : 'Refresh'}</span>
          </button>
        </div>
      </div>

      {/* Matches Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {completedMatches.length > 0 ? (
          completedMatches.map((match) => (
            <MatchCard 
              key={match._id}
              match={match} 
              BACKEND_URL={BACKEND_URL}
              onStatusChange={handleStatusChange}
            />
          ))
        ) : (
          <div className="col-span-full flex flex-col items-center justify-center py-16">
            <div className="bg-white rounded-full p-6 shadow-lg mb-6">
              <svg className="w-16 h-16 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No Completed Matches</h3>
            <p className="text-gray-500 text-center mb-6 max-w-md">
              There are no completed matches to display. Matches will appear here once they are finished.
            </p>
            <button
              onClick={fetchCompletedMatches}
              className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-medium transition-all duration-200 flex items-center space-x-2 shadow-lg hover:shadow-xl"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              <span>Refresh</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default CompletedMatch;