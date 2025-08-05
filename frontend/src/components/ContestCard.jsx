import React, { memo, useMemo } from "react";

const ContestCard = memo(({ contest, onJoinClick }) => {
  const contestData = useMemo(() => {
    const spotsLeft = contest?.totalSpots - contest?.currentParticipants || 0;
    const fillPercentage =
      contest?.totalSpots > 0
        ? (contest?.currentParticipants / contest?.totalSpots) * 100
        : 0;

    const formatPrize = (amount) => {
      if (amount >= 100000) {
        return `₹${(amount / 100000).toFixed(2)} Lakhs`;
      }
      return `₹${amount?.toLocaleString() || 0}`;
    };

    const firstPlacePrize =
      contest?.prizeDistribution?.[0]?.prize ||
      Math.floor((contest?.prizePool || 0) * 0.6);
    const winPercentage =
      contest?.contestFormat === "h2h"
        ? "50%"
        : `${Math.round(100 / (contest?.totalSpots || 1))}%`;

    return {
      spotsLeft,
      fillPercentage,
      formatPrize,
      firstPlacePrize,
      winPercentage
    };
  }, [contest]);

  return (
    <div 
      className="bg-white rounded-xl mx-3 mb-3 overflow-hidden cursor-pointer shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100"
      onClick={() => onJoinClick && onJoinClick(contest)}
    >
      {/* Prize Pool Header */}
      <div className="px-3 py-2">
        <span className="text-xs font-medium text-gray-700">Prize Pool</span>
      </div>

      {/* Main Prize Pool and Entry Fee */}
      <div className="px-3 pb-3">
        <div className="flex items-center justify-between mb-3">
          <div className="text-2xl font-bold text-gray-900">
            {contestData.formatPrize(contest?.prizePool)}
          </div>
          <button className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white px-3 py-1.5 rounded-lg font-semibold text-xs shadow-md hover:shadow-lg transition-all duration-200">
            ₹{contest?.entryFee || 0}
          </button>
        </div>
      </div>

      {/* Bottom Strip */}
      <div className="bg-gradient-to-r from-slate-50 to-gray-100 border-t border-gray-200 px-3 py-2">
        <div className="flex justify-between items-center">
          {/* Left side - Win percentage and Max teams in one div */}
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-1">
              <div className="w-4 h-4 bg-gradient-to-br from-blue-100 to-blue-200 rounded-full flex items-center justify-center">
                <span className="text-blue-600 text-xs font-bold">🏆</span>
              </div>
              <span className="text-xs font-medium text-gray-700">{contestData.winPercentage}</span>
            </div>
            <div className="flex items-center space-x-1">
              <div className="w-4 h-4 bg-gradient-to-br from-purple-100 to-purple-200 rounded-full flex items-center justify-center">
                <span className="text-purple-600 text-xs font-bold">M</span>
              </div>
              <span className="text-xs font-medium text-gray-700">{contest?.maxTeamPerUser || 1}</span>
            </div>
          </div>

          {/* Right side - Spots info with centered progress bar */}
          <div className="flex items-center space-x-2">
            <span className="text-red-500 font-medium text-xs whitespace-nowrap">{contestData.spotsLeft} Left</span>
            
            {/* Progress Bar - centered between spots */}
            <div className="w-12 bg-gray-300 rounded-full h-1.5">
              <div
                className="bg-gradient-to-r from-red-400 to-red-500 h-1.5 rounded-full transition-all duration-300"
                style={{ width: `${Math.min(contestData.fillPercentage, 100)}%` }}
              ></div>
            </div>
            
            <span className="text-gray-500 font-medium text-xs whitespace-nowrap">{contest?.totalSpots || 0} Spots</span>
          </div>
        </div>
      </div>
    </div>
  );
});

ContestCard.displayName = 'ContestCard';

export default ContestCard;
