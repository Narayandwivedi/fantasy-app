  import React, { useContext, useState, useEffect } from "react";
  import { AppContext } from "../context/AppContext";
  import { Clock } from "lucide-react";
  import { useNavigate } from "react-router-dom";

  const MatchCard = ({
    team1Name,
    team1Img,
    team2Name,
    team2Img,
    series,
    startTime,
    matchId,
  }) => {
    const { BACKEND_URL } = useContext(AppContext);
    const [timeLeft, setTimeLeft] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
      const calculateTimeLeft = () => {
        const now = new Date().getTime();
        const matchStart = new Date(startTime).getTime();
        const difference = matchStart - now;

        if (difference > 0) {
          const days = Math.floor(difference / (1000 * 60 * 60 * 24));
          const hours = Math.floor(
            (difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
          );
          const minutes = Math.floor(
            (difference % (1000 * 60 * 60)) / (1000 * 60)
          );

          if (days > 0) {
            setTimeLeft(`${days}d ${hours}h`);
          } else if (hours > 0) {
            setTimeLeft(`${hours}h ${minutes}m`);
          } else {
            setTimeLeft(`${minutes}m`);
          }
        } else {
          setTimeLeft("Live");
        }
      };

      calculateTimeLeft();
      const timer = setInterval(calculateTimeLeft, 60000); // Update every minute

      return () => clearInterval(timer);
    }, [startTime]);

    return (
      <div
        onClick={() => {
          navigate(`/${matchId}/contest`);
        }}
        className="bg-white rounded-lg w-full shadow-lg hover:shadow-xl transition-shadow duration-300 overflow-hidden border border-gray-100 cursor-pointer"
      >
        {/* top strip */}
        <div className="bg-gradient-to-r from-gray-900 via-slate-900 to-black px-4 py-2 flex justify-between items-center">
          <p className="text-gray-300 text-xs font-medium">{series}</p>
          <div className="border border-gray-500 rounded-full px-2 py-0.5">
            <p className="text-gray-300 text-xs font-medium">T20</p>
          </div>
        </div>

        {/* teams and time */}
        <div className="flex justify-between items-center p-4">
          {/* team1 */}
          <div className="flex flex-col items-center space-y-1.5">
            <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-gray-200 shadow-md">
              <img
                src={`${BACKEND_URL}${team1Img}`}
                alt={team1Name}
                className="w-full h-full object-cover"
              />
            </div>
            <span className="text-xs font-medium text-gray-800 text-center">
              {team1Name}
            </span>
          </div>

          {/* time left and vs */}
          <div className="flex flex-col items-center space-y-1.5">
            <div className="bg-red-500 text-white px-2 py-1 rounded-full text-xs font-bold flex items-center space-x-1">
              <Clock className="w-3 h-3" />
              <span>{timeLeft}</span>
            </div>
            <div className="text-gray-400 text-base font-bold">VS</div>
            <div className="text-xs text-gray-500">
              {timeLeft === "Live" ? "Match Started" : "Starting Soon"}
            </div>
          </div>

          {/* team2 */}
          <div className="flex flex-col items-center space-y-1.5">
            <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-gray-200 shadow-md">
              <img
                src={`${BACKEND_URL}${team2Img}`}
                alt={team2Name}
                className="w-full h-full object-cover"
              />
            </div>
            <span className="text-xs font-medium text-gray-800 text-center">
              {team2Name}
            </span>
          </div>
        </div>

        {/* bottom actions */}
        <div className="border-t border-gray-100 px-4 py-2 bg-gray-50">
          <div className="flex justify-between items-center">
            <div className="text-xs text-gray-500">Prize Pool: ₹10,000</div>
            <button className="bg-green-500 hover:bg-green-600 text-white px-4 py-1 rounded-full text-xs font-semibold transition-colors duration-200">
              Join Contest
            </button>
          </div>
        </div>
      </div>
    );
  };

  export default MatchCard;
