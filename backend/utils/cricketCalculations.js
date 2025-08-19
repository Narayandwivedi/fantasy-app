// Separate function to calculate fantasy points
const calculateFantasyPoints = (playerData, updates = {}, matchType = '') => {
  const batting = { ...playerData.batting, ...updates.batting };
  const bowling = { ...playerData.bowling, ...updates.bowling };
  const fielding = { ...playerData.fielding, ...updates.fielding };

  let battingPoints = 0;
  let bowlingPoints = 0;
  let fieldingPoints = 0;
  let bonusPoints = 0;

  const matchTypeLower = matchType.toLowerCase();

  // Batting points calculation
  if (batting.runs && batting.runs > 0) {
    battingPoints += batting.runs * 1; // 1 point per run
    
    // Run milestones based on match type
    if (batting.runs >= 25 && (matchTypeLower === 't20' || matchTypeLower === 't10')) {
      bonusPoints += 4; // 25+ runs bonus for T20/T10
    }
    if (batting.runs >= 50) bonusPoints += 8; // 50+ runs bonus
    if (batting.runs >= 75 && matchTypeLower === 't20') {
      bonusPoints += 12; // 75+ runs bonus for T20 only
    }
    if (batting.runs >= 100) bonusPoints += 16; // 100+ runs bonus
    if (batting.runs >= 125 && (matchTypeLower === 'odi' || matchTypeLower === 'test')) {
      bonusPoints += 20; // 125+ runs bonus for ODI/Test
    }
    if (batting.runs >= 150 && (matchTypeLower === 'odi' || matchTypeLower === 'test')) {
      bonusPoints += 24; // 150+ runs bonus for ODI/Test
    }
  }
  
  // Boundary points
  if (batting.fours && batting.fours > 0) {
    bonusPoints += batting.fours * 4; // 4 bonus points per four
  }
  if (batting.sixes && batting.sixes > 0) {
    bonusPoints += batting.sixes * 6; // 6 bonus points per six
  }

  // Bowling points calculation
  if (bowling.wicketsTaken) {
    // Different wicket points for Test vs other formats
    const wicketPoints = matchTypeLower === 'test' ? 16 : 28;
    bowlingPoints += bowling.wicketsTaken * wicketPoints;
    
    // Wicket bonuses based on match type
    if (matchTypeLower === 'test') {
      if (bowling.wicketsTaken >= 5) bonusPoints += 8; // 5+ wickets bonus for Test (innings)
      if (bowling.wicketsTaken >= 10) bonusPoints += 16; // 10+ wickets bonus for Test (match)
    } else if (matchTypeLower === 't10') {
      if (bowling.wicketsTaken >= 2) bonusPoints += 4; // 2+ wickets bonus for T10
      if (bowling.wicketsTaken >= 3) bonusPoints += 8; // 3+ wickets bonus for T10
    } else {
      // T20 and ODI
      if (bowling.wicketsTaken >= 3) bonusPoints += 4; // 3+ wickets bonus
      if (bowling.wicketsTaken >= 4) bonusPoints += 8; // 4+ wickets bonus
      if (bowling.wicketsTaken >= 5) bonusPoints += 16; // 5+ wickets bonus
    }
    
    // LBW/Bowled bonus (+8 points each)
    if (bowling.lbw) {
      bonusPoints += bowling.lbw * 8;
    }
    if (bowling.bowled) {
      bonusPoints += bowling.bowled * 8;
    }
  }
  
  // Maiden over points (excluding Test cricket as per game rules)
  if (bowling.maidenOvers && matchTypeLower !== 'test') {
    const maidenPoints = matchTypeLower === 't10' ? 16 : 12;
    bowlingPoints += bowling.maidenOvers * maidenPoints;
  }

  // Fielding points calculation
  if (fielding.catches) fieldingPoints += fielding.catches * 8; // 8 points per catch
  if (fielding.stumpings) fieldingPoints += fielding.stumpings * 12; // 12 points per stumping
  if (fielding.runOuts) fieldingPoints += fielding.runOuts * 12; // 12 points per run out

  // Duck out penalty based on match type (excluding bowlers)
  if (batting.runs === 0 && batting.isOut === true && playerData.position !== 'bowler') {
    if (matchTypeLower === 't20' || matchTypeLower === 't10' || matchTypeLower === 'odi') {
      bonusPoints -= 2; // T20/T10/ODI duck out penalty
    } else if (matchTypeLower === 'test') {
      bonusPoints -= 4; // Test duck out penalty
    } else {
      bonusPoints -= 2; // Default duck out penalty
    }
  }

  // Playing XI bonus is handled separately during PlayerScore creation
  // Not included in dynamic calculations to prevent disappearing on updates

  // Man of the match bonus
  if (playerData.isManOfMatch) {
    bonusPoints += 25; // Man of the match bonus
  }

  const totalPoints = battingPoints + bowlingPoints + fieldingPoints + bonusPoints;

  return {
    battingPoints,
    bowlingPoints,
    fieldingPoints,
    bonusPoints,
    totalPoints,
  };
};

// Separate function to calculate strike rate
const calculateStrikeRate = (runs, ballsFaced) => {
  // Validate inputs
  if (typeof runs !== 'number' || typeof ballsFaced !== 'number') {
    return 0;
  }
  
  // Handle edge cases
  if (ballsFaced <= 0) {
    return 0;
  }
  
  if (runs < 0) {
    return 0;
  }
  
  // Calculate strike rate: (runs / balls faced) * 100
  const strikeRate = (runs / ballsFaced) * 100;
  
  // Return rounded to 2 decimal places
  return parseFloat(strikeRate.toFixed(2));
};

// Separate function to calculate economy rate
const calculateEconomyRate = (runsGiven, oversBowled) => {
  // Validate inputs
  if (typeof runsGiven !== 'number' || typeof oversBowled !== 'number') {
    return 0;
  }
  
  // Handle edge cases
  if (oversBowled <= 0) {
    return 0;
  }
  
  if (runsGiven < 0) {
    return 0;
  }
  
  // Calculate economy rate: runs given / overs bowled
  const economyRate = runsGiven / oversBowled;
  
  // Return rounded to 2 decimal places
  return parseFloat(economyRate.toFixed(2));
};

module.exports = {
  calculateFantasyPoints,
  calculateStrikeRate,
  calculateEconomyRate,
};