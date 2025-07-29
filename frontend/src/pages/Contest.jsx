import React, { useState } from "react";
import ContestCard from "../components/ContestCard";
import { useParams } from "react-router-dom";
import { useEffect } from "react";
import axios from "axios";
import { useContext } from "react";
import { AppContext } from "../context/AppContext";

const Contest = () => {
  const {matchId} = useParams();
  const { BACKEND_URL } = useContext(AppContext);
  const [contests, setContests] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchContest = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get(`${BACKEND_URL}/api/contest/${matchId}`);
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
              {format === "h2h" ? "Head to Head" : format.replace(/([A-Z])/g, ' $1').trim()}
            </h2>
            {contestList.map((contest) => (
              <ContestCard key={contest._id} contest={contest} />
            ))}
          </div>
        ))
      )}
    </div>
  );
};

export default Contest;
