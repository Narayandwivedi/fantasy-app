import React from 'react'

const ContestCard = ({ contest }) => {
  // Detect contest type based on totalSpots
  const detectContestType = (contest) => {
    if (!contest) return 'standard';
    if (contest.totalSpots === 2) return 'h2h';
    if (contest.totalSpots >= 3 && contest.totalSpots <= 6) return 'winners-take-all';
    if (contest.totalSpots > 50) return 'mega-contest';
    return 'standard';
  };

  const contestType = detectContestType(contest);
  const spotsLeft = contest?.totalSpots - contest?.currentParticipants || 0;
  const fillPercentage = contest?.totalSpots > 0 ? (contest?.currentParticipants / contest?.totalSpots) * 100 : 0;

  // Format prize pool
  const formatPrize = (amount) => {
    if (amount >= 100000) {
      return `₹${(amount / 100000).toFixed(2)} Lakhs`;
    }
    return `₹${amount?.toLocaleString() || 0}`;
  };

  // Get contest type label
  const getContestTypeLabel = (type) => {
    switch (type) {
      case 'h2h': return 'Head to Head';
      case 'winners-take-all': return 'Winner Takes All';
      case 'mega-contest': return 'Mega Contest';
      default: return 'Contest';
    }
  };

  // Get prize type icon and text
  const getPrizeType = (contest) => {
    if (contest?.isGuaranteed) {
      return { icon: '✓', text: 'Guaranteed Prize Pool', color: 'text-green-600' };
    }
    return { icon: '📈', text: 'Flexible Prize Pool', color: 'text-blue-600' };
  };

  const prizeType = getPrizeType(contest);

  return (
    <div className="bg-white rounded-lg border border-gray-200 mx-3 mb-4 overflow-hidden">
      {/* Prize Type Header */}
      <div className="flex items-center px-4 py-2 text-sm">
        <span className="mr-1">{prizeType.icon}</span>
        <span className={prizeType.color}>{prizeType.text}</span>
      </div>

      {/* Main Content */}
      <div className="px-4 pb-4">
        {/* Prize Pool and Entry Fee */}
        <div className="flex items-center justify-between mb-3">
          <div>
            <div className="text-2xl font-bold text-gray-900">
              {formatPrize(contest?.prizePool)}
            </div>
          </div>
          <button className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-md font-medium">
            ₹{contest?.entryFee || 0}
          </button>
        </div>

        {/* Spots Left and Total Spots */}
        <div className="flex items-center justify-between mb-3 text-sm">
          <div className="text-red-500 font-medium">
            {spotsLeft} Left
          </div>
          <div className="text-gray-500">
            {contest?.totalSpots || 0} Spots
          </div>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-gray-200 rounded-full h-1 mb-3">
          <div 
            className="bg-red-500 h-1 rounded-full transition-all duration-300" 
            style={{ width: `${Math.min(fillPercentage, 100)}%` }}
          ></div>
        </div>

        {/* Bottom Info Row */}
        <div className="flex items-center justify-between text-sm">
          {/* First Place Prize */}
          <div className="flex items-center space-x-1">
            <span className="bg-yellow-100 text-yellow-800 p-1 rounded">🏆</span>
            <span className="text-gray-600">
              ₹{contest?.prizeDistribution?.[0]?.prize?.toLocaleString() || Math.floor((contest?.prizePool || 0) * 0.5)}
            </span>
          </div>

          {/* Win Percentage */}
          <div className="flex items-center space-x-1">
            <span className="bg-blue-100 text-blue-800 p-1 rounded">🏆</span>
            <span className="text-gray-600">
              {contestType === 'h2h' ? '50%' : 
               contestType === 'winners-take-all' ? `${Math.round(100 / contest?.totalSpots)}%` :
               '64%'}
            </span>
          </div>

          {/* Max Teams per User - Creative Design */}
          <div className="flex items-center space-x-1">
            <div className="flex items-center bg-gradient-to-r from-purple-100 to-blue-100 px-2 py-1 rounded-full">
              <div className="w-4 h-4 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center mr-1">
                <span className="text-white text-xs font-bold">M</span>
              </div>
              <span className="text-gray-700 text-xs font-medium">
                Max {contest?.maxTeamPerUser || 1} {(contest?.maxTeamPerUser || 1) === 1 ? 'Team' : 'Teams'}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ContestCard
