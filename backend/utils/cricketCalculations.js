// Separate function to calculate fantasy points
const calculateFantasyPoints = (playerData, updates = {}, matchType = '') => {
  const batting = { ...playerData.batting, ...updates.batting };
  const bowling = { ...playerData.bowling, ...updates.bowling };
  const fielding = { ...playerData.fielding, ...updates.fielding };

  let battingPoints = 0;
  let bowlingPoints = 0;
  let fieldingPoints = 0;
  let bonusPoints = 0;

  // Batting points calculation
  if (batting.runs && batting.runs > 0) {
    battingPoints += batting.runs * 1; // 1 point per run
    if (batting.runs >= 25) bonusPoints += 5; // 25+ bonus
    if (batting.runs >= 50) bonusPoints += 10; // 50+ bonus
    if (batting.runs >= 75) bonusPoints += 12; // 75+ bonus
    if (batting.runs >= 100) bonusPoints += 15; // 100+ bonus
  }
  if (batting.fours && batting.fours > 0) {
    battingPoints += batting.fours * 1; // 1 point per four
  }
  if (batting.sixes && batting.sixes > 0) {
    battingPoints += batting.sixes * 2; // 2 points per six
  }

  // Bowling points calculation
  if (bowling.wicketsTaken) {
    bowlingPoints += bowling.wicketsTaken * 25; // 25 points per wicket
    if (bowling.wicketsTaken >= 3) bonusPoints += 10; // 3+ wickets bonus
    if (bowling.wicketsTaken >= 5) bonusPoints += 15; // 5+ wickets bonus
  }
  if (bowling.maidenOvers) bowlingPoints += bowling.maidenOvers * 12; // 12 points per maiden

  // Fielding points calculation
  if (fielding.catches) fieldingPoints += fielding.catches * 8; // 8 points per catch
  if (fielding.stumpings) fieldingPoints += fielding.stumpings * 12; // 12 points per stumping
  if (fielding.runOuts) fieldingPoints += fielding.runOuts * 12; // 12 points per run out

  // Duck out penalty based on match type
  if (batting.runs === 0 && batting.isOut === true) {
    const matchTypeLower = matchType.toLowerCase();
    if (matchTypeLower === 't20' || matchTypeLower === 't10') {
      bonusPoints -= 2; // T20/T10 duck out penalty
    } else if (matchTypeLower === 'odi') {
      bonusPoints -= 3; // ODI duck out penalty
    } else if (matchTypeLower === 'test') {
      bonusPoints -= 4; // Test duck out penalty
    } else {
      bonusPoints -= 2; // Default duck out penalty
    }
  }

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