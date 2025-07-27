import React from "react";

const MatchCard = () => {
  return (
    <div className="rounded md w-full h-[180px] shadow-md ">
      {/* top strip */}
      <div className="bg-gray-300">
        <p>india tour of england</p>
      </div>

      {/* teams and time */}
      <div className="flex justify-between items-center">
        {/* team1 */}
        <div className="flex">
          <img src="link" alt="t1" />
          <span className="text-sm">team1</span>
          </div>

        {/* time left */}
        <div>time left</div>

        {/* team2 */}
         <div className="flex">
          <img src="link" alt="t2" />
         <span className="text-sm">team2</span>
         </div>
      </div>
    </div>
  );
};

export default MatchCard;
