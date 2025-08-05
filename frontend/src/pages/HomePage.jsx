import React, { useContext, useEffect, useState, useCallback } from "react";
import axios from "axios";
import { AppContext } from "../context/AppContext";
import MatchCard from "../components/MatchCard";
import Navbar from "../components/Navbar";
import Banner from "../components/Banner";
import BottomNav from "../components/BottomNav";

const HomePage = () => {
  const [upcomingMatches, setUpcomingMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { BACKEND_URL } = useContext(AppContext);

  const fetchUpcomingMatches = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const { data } = await axios.get(
        `${BACKEND_URL}/api/matches/status/upcoming`
      );
      setUpcomingMatches(data.data);
    } catch (err) {
      setError('Failed to load matches');
      console.error('Error fetching matches:', err);
    } finally {
      setLoading(false);
    }
  }, [BACKEND_URL]);

  useEffect(() => {
    fetchUpcomingMatches();
  }, [fetchUpcomingMatches]);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar/>
      
      {/* Banner Section */}
      <div className="px-4 pt-2">
        <Banner/>
      </div>
      
      {/* Matches Section */}
      <div className="px-4 py-6">
        <div className="mb-4">
          <h2 className="text-lg font-bold text-gray-800 mb-1">Upcoming Matches</h2>
          <p className="text-sm text-gray-600">Join contests and win big prizes</p>
        </div>
        
        <div className="space-y-4">
          {loading ? (
            <div className="flex justify-center items-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-600"></div>
            </div>
          ) : error ? (
            <div className="text-center py-8 text-red-500">
              <p>{error}</p>
              <button 
                onClick={fetchUpcomingMatches}
                className="mt-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                Retry
              </button>
            </div>
          ) : upcomingMatches.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <p>No upcoming matches found</p>
            </div>
          ) : (
            upcomingMatches.map((item) => (
              <MatchCard
                key={item._id} // Use unique ID instead of index
                team1Name={item.team1.name}
                team1Img={item.team1.logo}
                team2Name={item.team2.name}
                team2Img={item.team2.logo}
                series={item.series}
                startTime={item.startTime}
                matchId={item._id}
              />
            ))
          )}
        </div>
        
        {/* Bottom padding to prevent overlap with BottomNav */}
        <div className="h-20"></div>
      </div>
      
      <BottomNav />
    </div>
  );
};

export default HomePage;
