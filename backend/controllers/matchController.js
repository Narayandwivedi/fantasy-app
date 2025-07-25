const Match = require("../models/Match");
const mongoose = require("mongoose");
const PlayerScore = require("../models/PlayerScore");

async function createMatch(req, res) {
  try {
    const {
      sport,
      matchType,
      series,
      team1,
      team2,
      venue,
      startTime,
      endTime,
    } = req.body;

    if (!sport || !matchType || !team1 || !team2) {
      return res
        .status(400)
        .json({ success: false, message: "missing details" });
    }

    const sportsType = ["cricket", "football", "kabbadi"];
    if (!sportsType.includes(sport)) {
      return res
        .status(400)
        .json({ success: false, message: "invalid sports" });
    }

    // verify team1 and team2 object id

    if (!mongoose.isValidObjectId(team1) || !mongoose.isValidObjectId(team2)) {
      return res
        .status(400)
        .json({ success: false, message: "invalid team id" });
    }

    await Match.create({
      sport,
      matchType,
      series,
      team1,
      team2,
      venue,
      startTime,
      endTime,
    });

    return res.json({ success: true, message: "match created successfully" });
  } catch (err) {
    return res
      .status(500)
      .json({ success: false, message: err.message || "server error" });
  }
}

async function getAllMatch(req, res) {
  try {
    const allMatches = await Match.find().populate("team1 team2");
    return res.json({ success: true, data: allMatches });
  } catch (err) {
    console.log(err.message);

    return res.status(500).json({ success: false, message: "server error" });
  }
}

// match detail by id

async function matchDetailsByID(req, res) {
  try {
    const { matchId } = req.params;
    if (!matchId) {
      return res
        .status(400)
        .json({ success: false, message: "id not provided" });
    }

    if (!mongoose.isValidObjectId(matchId)) {
      return res
        .status(400)
        .json({ success: false, message: "invalid match id" });
    }

    const getMatch = await Match.findById(matchId)
      .populate("team1PlayingSquad team2PlayingSquad")
      .populate({
        path: "team1",
        populate: {
          path: "squad",
          model: "Player",
          select:
            "firstName lastName position battingStyle bowlingStyle imgLink", // Select specific fields
        },
      })
      .populate({
        path: "team2",
        populate: {
          path: "squad",
          model: "Player",
          select:
            "firstName lastName position battingStyle bowlingStyle imgLink", // Select specific fields
        },
      });

    if (!getMatch) {
      return res
        .status(400)
        .json({ success: false, message: "invalid match id" });
    }

    return res.json({
      success: true,
      data: getMatch,
    });
  } catch (err) {
    console.error("Error in matchDetailsByID:", err);
    return res.status(500).json({ success: false, message: "server error" });
  }
}

//live matches

async function getLiveMatch(req, res) {
  try {
    const liveMatches = await Match.find({ status: "live" })
      .populate("team1", "name , logo , shortName")
      .populate("team2", "name , logo , shortName")
      .select("-team1PlayingSquad -team2PlayingSquad -createdAt -updatedAt");
    return res.json({ success: true, data: liveMatches });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ success: false, message: "server error" });
  }
}

// upcoming matches

async function getUpcomingMatch(req, res) {
  try {
    const upcomingMatches = await Match.find({ status: "upcoming" })
      .populate("team1", "name , logo , shortName")
      .populate("team2", "name , logo , shortName")
      .select("-team1PlayingSquad -team2PlayingSquad -createdAt -updatedAt");
    return res.json({ success: true, data: upcomingMatches });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ success: false, message: "server error" });
  }
}

//completed matches

async function getCompletedMatch(req, res) {
  try {
    const CompletedMatch = await Match.find({ status: "completed" })
      .populate("team1", "name , logo , shortName")
      .populate("team2", "name , logo , shortName")
      .select("-team1PlayingSquad -team2PlayingSquad -createdAt -updatedAt");
    return res.json({ success: true, data: CompletedMatch });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ success: false, message: "server error" });
  }
}

// change match status

async function changeMatchStatus(req, res) {
  try {
    const { matchId } = req.params;
    const { status } = req.body;

    // console.log(status , matchId);

    //  check req body

    if (!matchId || !status) {
      return res.status(400).json({ success: false, message: "missing field" });
    }

    //  check status valid or not

    const validStatus = ["upcoming", "live", "completed", "cancelled"];
    if (!validStatus.includes(status)) {
      return res.status(400).json({
        success: false,
        message: "invalid status please enter valid name",
      });
    }

    // validate match id
    if (!mongoose.isValidObjectId(matchId)) {
      return res
        .status(400)
        .json({ success: false, message: "invalid match id" });
    }

    // check match id on db

    const getMatch = await Match.findById(matchId);

    if (!getMatch) {
      return res
        .status(400)
        .json({ success: false, message: "match not found with this id" });
    }

    if (getMatch.status === status) {
      return res.status(400).json({
        success: false,
        message: "invalid request changing same status not allowed",
      });
    }

    getMatch.status = status;

    await getMatch.save();
    return res.json({ success: true, message: "status updated successfully" });
  } catch (err) {
    console.log(err.message);
    return res.status(400).json({ success: false, message: "server error" });
  }
}

// change playing 11

async function changeMatchPlaying11(req, res) {
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

    const getMatch = await Match.findById(matchId);
    if (!getMatch) {
      return res
        .status(400)
        .json({ success: false, message: "match not found" });
    }

    getMatch.team1PlayingSquad = team1PlayingSquad;
    getMatch.team2PlayingSquad = team2PlayingSquad;

    await getMatch.save();
    res.json({ success: true, message: "team added successfull" });
  } catch (err) {
    console.log(err.message);
    return res.status(500).json({ success: false, message: "server error" });
  }
}

// match score

async function createMatchScore(req, res) {
  const { matchId } = req.params;

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

  try {
    // Check if match exists and populate team details
    const getMatch = await Match.findById(matchId)
      .populate("team1", "name")
      .populate("team2", "name")
      .populate("team1PlayingSquad.playerId", "name")
      .populate("team2PlayingSquad.playerId", "name");

    if (!getMatch) {
      return res
        .status(400)
        .json({ success: false, message: "Match not found" });
    }

    // Check if PlayerScores already exist for this match
    const existingScores = await PlayerScore.find({ match: matchId });
    if (existingScores.length > 0) {
      return res.status(400).json({
        success: false,
        message: "Player scores already exist for this match",
      });
    }

    const playerScoresToCreate = [];

    // Create PlayerScore entries for Team 1 players
    for (let i = 0; i < getMatch.team1PlayingSquad.length; i++) {
      const player = getMatch.team1PlayingSquad[i];

      const playerScoreData = {
        match: matchId,
        team: getMatch.team1,
        series: getMatch.series || "",
        player: player.playerId._id,
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
    for (let i = 0; i < getMatch.team2PlayingSquad.length; i++) {
      const player = getMatch.team2PlayingSquad[i];

      const playerScoreData = {
        match: matchId,
        team: getMatch.team2,
        series: getMatch.series || "",
        player: player.playerId._id,
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
      message: "Match player scores created successfully",
      data: {
        matchId: matchId,
        sport: getMatch.sport,
        totalPlayersCreated: createdPlayerScores.length,
        team1Players: getMatch.team1PlayingSquad.length,
        team2Players: getMatch.team2PlayingSquad.length,
        createdScores: createdPlayerScores,
      },
    });
  } catch (error) {
    console.error("Error creating match scores:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error while creating player scores",
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

          if (ballsFaced > 0) {
            updateData["batting.strikeRate"] = parseFloat(
              ((runs / ballsFaced) * 100).toFixed(2)
            );
          } else {
            updateData["batting.strikeRate"] = 0;
          }
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

          if (oversBowled > 0) {
            updateData["bowling.economyRate"] = parseFloat(
              (runsGiven / oversBowled).toFixed(2)
            );
          } else {
            updateData["bowling.economyRate"] = 0;
          }
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

      // Calculate fantasy points (basic calculation - adjust based on your scoring system)
      const calculateFantasyPoints = (playerData, updates) => {
        const batting = { ...playerData.batting, ...updates.batting };
        const bowling = { ...playerData.bowling, ...updates.bowling };
        const fielding = { ...playerData.fielding, ...updates.fielding };

        let battingPoints = 0;
        let bowlingPoints = 0;
        let fieldingPoints = 0;
        let bonusPoints = 0;

        // Batting points calculation
        if (batting.runs) {
          battingPoints += batting.runs * 1; // 1 point per run
          if (batting.runs >= 50) bonusPoints += 10; // 50+ bonus
          if (batting.runs >= 100) bonusPoints += 15; // 100+ bonus
        }
        if (batting.fours) battingPoints += batting.fours * 1; // 1 point per four
        if (batting.sixes) battingPoints += batting.sixes * 2; // 2 points per six
        if (batting.ballsFaced > 0 && batting.runs > 0) {
          const sr = (batting.runs / batting.ballsFaced) * 100;
          if (sr >= 150) bonusPoints += 5; // Strike rate bonus
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

        const totalPoints =
          battingPoints + bowlingPoints + fieldingPoints + bonusPoints;

        return {
          battingPoints,
          bowlingPoints,
          fieldingPoints,
          bonusPoints,
          totalPoints,
        };
      };

      // Calculate and update fantasy points
      const fantasyPoints = calculateFantasyPoints(existingPlayerScore, {
        batting: batting || {},
        bowling: bowling || {},
        fielding: fielding || {},
      });

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

    return res.status(200).json({
      success: true,
      message: "Player scores updated successfully",
      data: {
        matchId: matchId,
        totalPlayersUpdated: successfulUpdates.length,
        updatedPlayers: updatedPlayers,
        updatedScores: successfulUpdates,
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

module.exports = {
  createMatch,
  getAllMatch,
  matchDetailsByID,
  getLiveMatch,
  getUpcomingMatch,
  getCompletedMatch,
  changeMatchStatus,
  changeMatchPlaying11,
  createMatchScore,
  updateMatchScore,
  getMatchScore,
};
