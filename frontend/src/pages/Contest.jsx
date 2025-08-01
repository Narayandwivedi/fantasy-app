import React, { useState, useEffect, useContext } from "react";
import ContestCard from "../components/ContestCard";
import { Link, useParams } from "react-router-dom";
import axios from "axios";
import { AppContext } from "../context/AppContext";

const Contest = () => {
  const { matchId } = useParams();
  const { BACKEND_URL } = useContext(AppContext);
  const [contests, setContests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isButtonVisible, setIsButtonVisible] = useState(true);

  const fetchContest = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get(`${BACKEND_URL}/api/contests/${matchId}`);
      console.log(data);
      if (data.success) {
        setContests(data.data);
      }
    } catch (error) {
      console.error("Error fetching contests:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchContest();
  }, [matchId]);

  useEffect(() => {
    let lastScrollY = window.scrollY;
    let ticking = false;

    const updateButtonVisibility = () => {
      const currentScrollY = window.scrollY;
      
      if (currentScrollY > lastScrollY && currentScrollY > 50) {
        setIsButtonVisible(false);
      } else {
        setIsButtonVisible(true);
      }
      
      lastScrollY = currentScrollY;
      ticking = false;
    };

    const handleScroll = () => {
      if (!ticking) {
        requestAnimationFrame(updateButtonVisibility);
        ticking = true;
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const groupContestsByFormat = (contests) => {
    return contests.reduce((acc, contest) => {
      if (!acc[contest.contestFormat]) {
        acc[contest.contestFormat] = [];
      }
      acc[contest.contestFormat].push(contest);
      return acc;
    }, {});
  };

  const groupedContests = groupContestsByFormat(contests);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-lg">Loading contests...</div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen">
      {Object.keys(groupedContests).length === 0 ? (
        <div className="flex justify-center items-center min-h-screen">
          <div className="text-lg text-gray-500">No contests available</div>
        </div>
      ) : (
        Object.entries(groupedContests).map(([format, contestList]) => (
          <div key={format} className="mb-6">
            <h2 className="text-xl font-semibold mb-4 px-4 pt-4 capitalize">
              {format === "h2h"
                ? "Head to Head"
                : format.replace(/([A-Z])/g, " $1").trim()}
            </h2>
            {contestList.map((contest) => (
              <ContestCard key={contest._id} contest={contest} />
            ))}
          </div>
        ))
      )}
      
      {/* Fixed Create Team Button - positioned above bottom nav */}
      <div 
        className={`fixed left-1/2 transform -translate-x-1/2 w-full max-w-[440px] bg-white border-t border-gray-100 px-4 py-3 transition-transform duration-300 ease-in-out z-40 ${
          isButtonVisible ? 'bottom-16 translate-y-0' : 'bottom-16 translate-y-full'
        }`}
      >
        <Link to={`/${matchId}/create-team`} className="block">
          <button className="w-full bg-black text-white py-3 px-6 rounded-lg font-semibold text-center hover:bg-gray-800 transition-colors shadow-lg">
            Create Team
          </button>
        </Link>
      </div>
      
      {/* Bottom padding to prevent content overlap with both button and nav */}
      <div className="h-32"></div>
    </div>
  );
};

export default Contest;
