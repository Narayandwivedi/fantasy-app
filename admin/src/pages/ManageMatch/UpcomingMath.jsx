import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AppContext } from '../../context/AppContext';
import MatchCard from '../../components/MatchCard';

const UpcomingMath = () => {
  const { BACKEND_URL } = useContext(AppContext);
  const [upcomingMatches, setUpcomingMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchUpcomingMatches = async () => {
    try {
      setLoading(true);
      setError(null);
      const { data } = await axios.get(`${BACKEND_URL}/api/matches/upcoming`);
      setUpcomingMatches(data.upcomingMatches || []);
      console.log(data);
    } catch (error) {
      console.error("Error fetching upcoming matches:", error);
      setError("Failed to load upcoming matches");
      setUpcomingMatches([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUpcomingMatches();
  }, []);

  if (loading) {
    return (
      <div className="p-6 w-full bg-gray-50 min-h-screen">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Upcoming Matches</h1>
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
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Upcoming Matches</h1>
        </div>
        <div className="flex flex-col items-center justify-center py-12">
          <svg className="w-16 h-16 text-red-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <h3 className="text-lg font-medium text-gray-900 mb-2">Error Loading Matches</h3>
          <p className="text-gray-500 text-center mb-4">{error}</p>
          <button
            onClick={fetchUpcomingMatches}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors duration-200"
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
        <h1 className="text-2xl font-bold text-gray-900 mb-4">Upcoming Matches</h1>
        <div className="flex items-center space-x-4">
          <div className="bg-white rounded-lg shadow-sm p-1 inline-flex items-center space-x-2">
            <div className="bg-blue-500 text-white px-4 py-2 rounded-md text-sm font-medium">
              Upcoming
            </div>
            <span className="px-2 py-1 rounded-full text-xs bg-blue-100 text-blue-600">
              {upcomingMatches.length}
            </span>
          </div>
        </div>
      </div>

      {/* Matches Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {upcomingMatches.length > 0 ? (
          upcomingMatches.map((match) => (
            <MatchCard 
              key={match._id} 
              match={match} 
              BACKEND_URL={BACKEND_URL}
            />
          ))
        ) : (
          <div className="col-span-full flex flex-col items-center justify-center py-12">
            <svg className="w-16 h-16 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No Upcoming Matches</h3>
            <p className="text-gray-500 text-center">
              There are no upcoming matches scheduled at the moment.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default UpcomingMath;