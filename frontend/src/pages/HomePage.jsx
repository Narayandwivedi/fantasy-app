import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import { AppContext } from "../context/AppContext";
import MatchCard from "../components/MatchCard";
import Navbar from "../components/Navbar";
import Banner from "../components/Banner";
import BottomNav from "../components/BottomNav";

const HomePage = () => {
  const [upcomingMatches, setUpcomingMatches] = useState([]);
  const { BACKEND_URL } = useContext(AppContext);

  async function fetchUpcomingMatches() {
    const { data } = await axios.get(
      `${BACKEND_URL}/api/matches/status/upcoming`
    );
    setUpcomingMatches(data.data);
    console.log(data);
  }

  useEffect(() => {
    fetchUpcomingMatches();
  }, []);

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
          {upcomingMatches.map((item, index) => {
            return (
              <MatchCard
                key={index}
                team1Name={item.team1.name}
                team1Img={item.team1.logo}
                team2Name={item.team2.name}
                team2Img={item.team2.logo}
                series = {item.series}
                startTime = {item.startTime}
                matchId={item._id}
              />
            );
          })}
        </div>
        
        {/* Bottom padding to prevent overlap with BottomNav */}
        <div className="h-20"></div>
      </div>
      
      <BottomNav />
    </div>
  );
};

export default HomePage;
