const Match = require("../models/Match");
const mongoose = require("mongoose");
const PlayerScore = require("../models/PlayerScore");
const { calculateFantasyPoints, calculateStrikeRate, calculateEconomyRate } = require("../utils/cricketCalculations");
const { updateAllContestTeamPointsForMatch } = require("../utils/userTeamPointsCalculator");

// set playing 11 and create player scores
async function setMatchPlaying11AndCreateScores(req, res) {
  try {
    const { team1PlayingSquad, team2PlayingSquad } = req.body;
    const { matchId } = req.params;

    console.log(team1PlayingSquad, team2PlayingSquad);

    //  check req body

    if (!team1PlayingSquad || !team2PlayingSquad || !matchId) {
      return res
        .status(400)
        .json({ success: false, message: "please provide valid details" });
    }

    //  check squad length

    if (team1PlayingSquad.length !== 11 || team2PlayingSquad.length !== 11) {
      return res
        .status(400)
        .json({ success: false, message: "squad must have 11 players " });
    }

    //  check is valid object id

    if (!mongoose.isValidObjectId(matchId)) {
      return res
        .status(400)
        .json({ success: false, message: "invalid match id type" });
    }

    const getMatch = await Match.findById(matchId)
      .populate("team1", "name")
      .populate("team2", "name");
      
    if (!getMatch) {
      return res
        .status(400)
        .json({ success: false, message: "match not found" });
    }

    // Check if PlayerScores already exist for this match
    const existingScores = await PlayerScore.find({ match: matchId });
    if (existingScores.length > 0) {
      return res.status(400).json({
        success: false,
        message: "Player scores already exist for this match. Please delete existing scores first.",
      });
    }

    const playerScoresToCreate = [];

    // Create PlayerScore entries for Team 1 players
    for (let i = 0; i < team1PlayingSquad.length; i++) {
      const player = team1PlayingSquad[i];

      const playerScoreData = {
        match: matchId,
        team: getMatch.team1._id,
        series: getMatch.series || "",
        player: player.playerId,
        sport: getMatch.sport,
        batting: {
          battingOrder: player.battingOrder,
        },
      };

      // Add sport-specific default values based on schema
      if (getMatch.sport === "cricket") {
        playerScoreData.batting = {
          ...playerScoreData.batting,
          runs: 0,
          ballsFaced: 0,  
          fours: 0,
          sixes: 0,
          isOut: false,
          strikeRate: 0,
        };

        playerScoreData.bowling = {
          oversBowled: 0,
          ballsBowled: 0,
          dotBalls: 0,
          runsGiven: 0,
          wicketsTaken: 0,
          maidenOvers: 0,
          wides: 0,
          noBalls: 0,
          economyRate: 0,
        };

        playerScoreData.fielding = {
          catches: 0,
          stumpings: 0,
          runOuts: 0,
        };

        playerScoreData.isDuckOut = false;
      } else {
        // For non-cricket sports, only set fielding catches and runOuts
        playerScoreData.fielding = {
          catches: 0,
          runOuts: 0,
        };
      }

      playerScoreData.isManOfMatch = false;
      playerScoreData.fantasyPoints = {
        battingPoints: 0,
        bowlingPoints: 0,
        fieldingPoints: 0,
        bonusPoints: 0,
        totalPoints: 0,
      };

      playerScoresToCreate.push(playerScoreData);
    }

    // Create PlayerScore entries for Team 2 players
    for (let i = 0; i < team2PlayingSquad.length; i++) {
      const player = team2PlayingSquad[i];

      const playerScoreData = {
        match: matchId,
        team: getMatch.team2._id,
        series: getMatch.series || "",
        player: player.playerId,
        sport: getMatch.sport,
        batting: {
          battingOrder: player.battingOrder,
        },
      };

      // Add sport-specific default values
      if (getMatch.sport === "cricket") {
        playerScoreData.batting = {
          ...playerScoreData.batting,
          runs: 0,
          ballsFaced: 0,
          fours: 0,
          sixes: 0,
          isOut: false,
          strikeRate: 0,
        };

        playerScoreData.bowling = {
          oversBowled: 0,
          ballsBowled: 0,
          dotBalls: 0,
          runsGiven: 0,
          wicketsTaken: 0,
          maidenOvers: 0,
          wides: 0,
          noBalls: 0,
          economyRate: 0,
        };

        playerScoreData.fielding = {
          catches: 0,
          stumpings: 0,
          runOuts: 0,
        };

        playerScoreData.isDuckOut = false;
      } else {
        playerScoreData.fielding = {
          catches: 0,
          runOuts: 0,
        };
      }

      playerScoreData.isManOfMatch = false;
      playerScoreData.fantasyPoints = {
        battingPoints: 0,
        bowlingPoints: 0,
        fieldingPoints: 0,
        bonusPoints: 0,
        totalPoints: 0,
      };

      playerScoresToCreate.push(playerScoreData);
    }

    // Bulk create all PlayerScore documents
    const createdPlayerScores = await PlayerScore.insertMany(
      playerScoresToCreate
    );

    return res.status(201).json({
      success: true,
      message: "Playing 11 set and player scores created successfully",
      data: {
        matchId: matchId,
        sport: getMatch.sport,
        totalPlayersCreated: createdPlayerScores.length,
        team1Players: team1PlayingSquad.length,
        team2Players: team2PlayingSquad.length,
        createdScores: createdPlayerScores,
      },
    });
  } catch (err) {
    console.error("Error setting playing 11 and creating scores:", err);
    return res.status(500).json({ 
      success: false, 
      message: "server error",
      error: err.message 
    });
  }
}

// get playing 11 from player scores
async function getMatchPlaying11(req, res) {
  const { matchId } = req.params;

  if (!matchId) {
    return res.status(400).json({
      success: false,
      message: "Match ID is required",
    });
  }

  if (!mongoose.isValidObjectId(matchId)) {
    return res.status(400).json({ success: false, message: "Invalid matchId" });
  }

  try {
    // Get match details
    const getMatch = await Match.findById(matchId)
      .populate("team1", "name shortName logo")
      .populate("team2", "name shortName logo");

    if (!getMatch) {
      return res.status(400).json({
        success: false,
        message: "Match not found",
      });
    }

    // Get player scores (which contain playing 11 data)
    const playerScores = await PlayerScore.find({ match: matchId })
      .populate("player", "firstName lastName position battingStyle bowlingStyle imgLink")
      .populate("team", "name shortName logo")
      .sort({ team: 1, "batting.battingOrder": 1 });

    // Group by teams and format playing 11
    const team1Playing11 = [];
    const team2Playing11 = [];

    playerScores.forEach(score => {
      const playerData = {
        playerId: score.player._id,
        battingOrder: score.batting.battingOrder,
        player: score.player
      };

      if (score.team._id.toString() === getMatch.team1._id.toString()) {
        team1Playing11.push(playerData);
      } else {
        team2Playing11.push(playerData);
      }
    });

    const responseData = {
      matchId: matchId,
      team1: {
        ...getMatch.team1.toObject(),
        playingSquad: team1Playing11
      },
      team2: {
        ...getMatch.team2.toObject(),
        playingSquad: team2Playing11
      }
    };

    return res.json({
      success: true,
      message: "Playing 11 retrieved successfully",
      data: responseData,
      totalPlayers: playerScores.length
    });
  } catch (error) {
    console.error("Error fetching playing 11:", error);
    return res.status(500).json({
      success: false,
      message: "Error fetching playing 11",
      error: error.message,
    });
  }
}

async function getMatchScore(req, res) {
  const { matchId } = req.params;

  if (!matchId) {
    return res.status(400).json({
      success: false,
      message: "Match ID is required",
    });
  }

  try {
    const matchScore = await PlayerScore.find({ match: matchId })
      .populate("player", "firstName lastName")
      .populate("team", "name")
      .sort({ team: 1, "batting.battingOrder": 1 });

    // Group by teams
    const groupedByTeam = matchScore.reduce((acc, score) => {
      const teamId = score.team._id.toString();
      if (!acc[teamId]) {
        acc[teamId] = {
          teamName: score.team.name,
          players: [],
        };
      }
      acc[teamId].players.push(score);
      return acc;
    }, {});

    return res.json({
      success: true,
      matchScore: Object.values(groupedByTeam),
      totalPlayers: matchScore.length,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error fetching match scores",
      error: error.message,
    });
  }
}

async function updateMatchScore(req, res) {
  const { matchId } = req.params;
  const { players } = req.body; // Array of player updates

  // Validate matchId
  if (!matchId) {
    return res
      .status(400)
      .json({ success: false, message: "Please provide valid matchId" });
  }

  // Check if valid ObjectId
  if (!mongoose.isValidObjectId(matchId)) {
    return res.status(400).json({ success: false, message: "Invalid matchId" });
  }

  // Validate players array
  if (!players || !Array.isArray(players) || players.length === 0) {
    return res.status(400).json({
      success: false,
      message: "Please provide valid players array",
    });
  }

  try {
    // Check if match exists
    const getMatch = await Match.findById(matchId);
    if (!getMatch) {
      return res
        .status(400)
        .json({ success: false, message: "Match not found" });
    }

    const updatePromises = [];
    const updatedPlayers = [];

    // Process each player update
    for (const playerUpdate of players) {
      const { playerId, batting, bowling, fielding } = playerUpdate;
      console.log(playerId, matchId);

      // Validate playerId
      if (!playerId || !mongoose.isValidObjectId(playerId)) {
        return res.status(400).json({
          success: false,
          message: `Invalid playerId: ${playerId}`,
        });
      }

      // Find the player score document
      const existingPlayerScore = await PlayerScore.findOne({
        match: matchId,
        _id: playerId,
      });

      if (!existingPlayerScore) {
        return res.status(404).json({
          success: false,
          message: `Player score not found for playerId: ${playerId}`,
        });
      }

      // Prepare update object
      const updateData = {};

      // Update batting stats if provided
      if (batting) {
        Object.keys(batting).forEach((key) => {
          if (batting[key] !== undefined && batting[key] !== null) {
            updateData[`batting.${key}`] = batting[key];
          }
        });

        // Calculate strike rate if runs and ballsFaced are being updated
        if (batting.runs !== undefined || batting.ballsFaced !== undefined) {
          const runs =
            batting.runs !== undefined
              ? batting.runs
              : existingPlayerScore.batting.runs;
          const ballsFaced =
            batting.ballsFaced !== undefined
              ? batting.ballsFaced
              : existingPlayerScore.batting.ballsFaced;

          updateData["batting.strikeRate"] = calculateStrikeRate(runs, ballsFaced);
        }
      }

      // Update bowling stats if provided
      if (bowling) {
        Object.keys(bowling).forEach((key) => {
          if (bowling[key] !== undefined && bowling[key] !== null) {
            updateData[`bowling.${key}`] = bowling[key];
          }
        });

        // Calculate economy rate if runsGiven and oversBowled are being updated
        if (
          bowling.runsGiven !== undefined ||
          bowling.oversBowled !== undefined
        ) {
          const runsGiven =
            bowling.runsGiven !== undefined
              ? bowling.runsGiven
              : existingPlayerScore.bowling.runsGiven;
          const oversBowled =
            bowling.oversBowled !== undefined
              ? bowling.oversBowled
              : existingPlayerScore.bowling.oversBowled;

          updateData["bowling.economyRate"] = calculateEconomyRate(runsGiven, oversBowled);
        }
      }

      // Update fielding stats if provided
      if (fielding) {
        Object.keys(fielding).forEach((key) => {
          if (fielding[key] !== undefined && fielding[key] !== null) {
            updateData[`fielding.${key}`] = fielding[key];
          }
        });
      }


      // Calculate and update fantasy points
      const fantasyPoints = calculateFantasyPoints(existingPlayerScore, {
        batting: batting || {},
        bowling: bowling || {},
        fielding: fielding || {},
      }, getMatch.matchType);

      updateData["fantasyPoints.battingPoints"] = fantasyPoints.battingPoints;
      updateData["fantasyPoints.bowlingPoints"] = fantasyPoints.bowlingPoints;
      updateData["fantasyPoints.fieldingPoints"] = fantasyPoints.fieldingPoints;
      updateData["fantasyPoints.bonusPoints"] = fantasyPoints.bonusPoints;
      updateData["fantasyPoints.totalPoints"] = fantasyPoints.totalPoints;

      // Check for duck out (0 runs and out)
      if (
        batting &&
        batting.runs !== undefined &&
        batting.isOut !== undefined
      ) {
        updateData["isDuckOut"] = batting.runs === 0 && batting.isOut === true;
      }

      // Create update promise
      const updatePromise = PlayerScore.findOneAndUpdate(
        { match: matchId, _id: playerId }, // Use PlayerScore document ID instead
        { $set: updateData },
        { new: true, runValidators: true }
      ).populate("player", "firstName lastName");

      updatePromises.push(updatePromise);
      updatedPlayers.push(playerId);
    }

    // Execute all updates
    const updatedPlayerScores = await Promise.all(updatePromises);

    // Filter out any null results (in case of update failures)
    const successfulUpdates = updatedPlayerScores.filter(
      (score) => score !== null
    );

    // After successfully updating player scores, update all user team points
    const userTeamUpdateResult = await updateAllContestTeamPointsForMatch(matchId);

    return res.status(200).json({
      success: true,
      message: "Player scores updated successfully",
      data: {
        matchId: matchId,
        totalPlayersUpdated: successfulUpdates.length,
        updatedPlayers: updatedPlayers,
        updatedScores: successfulUpdates,
        userTeamUpdates: userTeamUpdateResult
      },
    });
  } catch (error) {
    console.error("Error updating match scores:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error while updating player scores",
      error: error.message,
    });
  }
}

// Update user team points for a match
async function updateUserTeamPoints(req, res) {
  const { matchId } = req.params;

  if (!matchId) {
    return res.status(400).json({
      success: false,
      message: "Match ID is required",
    });
  }

  if (!mongoose.isValidObjectId(matchId)) {
    return res.status(400).json({ success: false, message: "Invalid matchId" });
  }

  try {
    // Check if match exists
    const getMatch = await Match.findById(matchId);
    if (!getMatch) {
      return res.status(400).json({
        success: false,
        message: "Match not found",
      });
    }

    // Update all user team points for this match
    const updateResult = await updateAllContestTeamPointsForMatch(matchId);

    if (!updateResult.success) {
      return res.status(400).json(updateResult);
    }

    return res.status(200).json({
      success: true,
      message: "User team points updated successfully",
      data: updateResult.data,
    });
  } catch (error) {
    console.error("Error updating user team points:", error);
    return res.status(500).json({
      success: false,
      message: "Error updating user team points",
      error: error.message,
    });
  }
}

module.exports = {
  setMatchPlaying11AndCreateScores,
  getMatchPlaying11,
  updateMatchScore,
  getMatchScore,
  updateUserTeamPoints,
};