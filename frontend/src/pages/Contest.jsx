import React, { useState, useEffect, useContext } from "react";
import ContestCard from "../components/ContestCard";
import { Link, useParams } from "react-router-dom";
import axios from "axios";
import { AppContext } from "../context/AppContext";
import { X } from "lucide-react";

const Contest = () => {
  const { matchId } = useParams();
  const { BACKEND_URL, user } = useContext(AppContext);
  const [contests, setContests] = useState([]);
  const [userTeams, setUserTeams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showJoinModal, setShowJoinModal] = useState(false);
  const [selectedContest, setSelectedContest] = useState(null);
  const [joining, setJoining] = useState(false);

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

  const fetchUserTeams = async () => {
    if (!user?._id) return;
    
    try {
      const { data } = await axios.get(`${BACKEND_URL}/api/userteam/${matchId}?userId=${user._id}`);
      if (data.success) {
        setUserTeams(data.data);
      }
    } catch (error) {
      console.error("Error fetching user teams:", error);
    }
  };

  useEffect(() => {
    fetchContest();
    fetchUserTeams();
  }, [matchId, user]);

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

  const handleJoinClick = (contest) => {
    setSelectedContest(contest);
    setShowJoinModal(true);
  };

  const handleJoinContest = async () => {
    if (!selectedContest || !user?._id || userTeams.length === 0) {
      alert('Please create a team first before joining contests');
      return;
    }

    // Prepare payload
    const payload = {
      contestId: selectedContest._id,
      userId: user._id,
      teamId: userTeams[0]._id, 
      matchId: matchId
    };

    // Console log the payload
    console.log('Join Contest Payload:', payload);
    console.log('Contest Details:', {
      contestName: selectedContest.name,
      entryFee: selectedContest.entryFee,
      prizePool: selectedContest.prizePool,
      totalSpots: selectedContest.totalSpots
    });
    
    setJoining(true);
    try {
      console.log('Making API call to:', `${BACKEND_URL}/api/contests/join`);
      console.log('Payload being sent:', payload);
      
      const {data} = await axios.post(`${BACKEND_URL}/api/contests/join`, {
      contestId: selectedContest._id,
      userId: user._id,
      teamId: userTeams[0]._id, 
      matchId: matchId
      })
      
      console.log('API Response:', data);
      alert('Successfully joined the contest!');
      setShowJoinModal(false);
    } catch (error) {
      console.error('Error joining contest:', error);
      console.error('Error details:', error.response?.data || error.message);
      alert('Failed to join contest. Please try again.');
    } finally {
      setJoining(false);
    }
  };

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
              <ContestCard key={contest._id} contest={contest} onJoinClick={handleJoinClick} />
            ))}
          </div>
        ))
      )}
      
      {/* Fixed Team Buttons - always visible at bottom */}
      <div className="fixed left-1/2 transform -translate-x-1/2 w-full max-w-[440px] bg-white border-t border-gray-100 px-4 py-3 z-40 bottom-0">
        <div className="flex space-x-3">
          <Link to={`/${matchId}/my-teams`} className="flex-1">
            <button className="w-full bg-gray-600 text-white py-3 px-4 rounded-lg font-semibold text-center hover:bg-gray-700 transition-colors shadow-lg">
              My Teams {userTeams.length > 0 && `(${userTeams.length})`}
            </button>
          </Link>
          <Link to={`/${matchId}/create-team`} className="flex-1">
            <button className="w-full bg-black text-white py-3 px-4 rounded-lg font-semibold text-center hover:bg-gray-800 transition-colors shadow-lg">
              Create Team
            </button>
          </Link>
        </div>
      </div>
      
      {/* Bottom padding to prevent content overlap with fixed buttons */}
      <div className="h-20"></div>

      {/* Join Contest Modal */}
      {showJoinModal && selectedContest && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-end justify-center">
          <div className="bg-white w-full max-w-md rounded-t-2xl shadow-xl">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-800">Confirmation</h2>
              <button
                onClick={() => setShowJoinModal(false)}
                className="p-1 hover:bg-gray-100 rounded-full"
              >
                <X size={20} className="text-gray-500" />
              </button>
            </div>

            {/* Amount Unutilised Info */}
            <div className="px-4 py-3 bg-gray-50 border-b border-gray-200">
              <div className="text-center">
                <span className="text-sm text-gray-600">Amount Unutilised + Winnings = </span>
                <span className="text-sm font-semibold text-gray-800">₹5</span>
              </div>
            </div>

            {/* Entry Fee Details */}
            <div className="p-4 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-gray-800 font-medium">Entry</span>
                <span className="text-gray-800 font-semibold">₹{selectedContest.entryFee || 0}</span>
              </div>

              {/* Divider */}
              <hr className="border-gray-200" />

              {/* To Pay */}
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <span className="text-gray-800 font-medium">To Pay</span>
                  <div className="w-4 h-4 bg-gray-200 rounded-full flex items-center justify-center">
                    <span className="text-gray-600 text-xs">i</span>
                  </div>
                </div>
                <span className="text-gray-800 font-bold text-lg">₹{selectedContest.entryFee || 0}</span>
              </div>

              {/* Terms and Conditions */}
              <div className="flex items-start space-x-2 mt-4">
                <input type="checkbox" className="mt-1" defaultChecked />
                <span className="text-xs text-gray-600">
                  I agree with the standard <span className="text-blue-600 underline">T&Cs</span>
                </span>
              </div>
            </div>

            {/* Join Button */}
            <div className="p-4">
              <button
                onClick={handleJoinContest}
                disabled={joining}
                className="w-full bg-green-500 hover:bg-green-600 text-white py-3 px-4 rounded-lg font-semibold transition-colors disabled:opacity-50"
              >
                {joining ? 'JOINING...' : 'JOIN CONTEST'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Contest;
