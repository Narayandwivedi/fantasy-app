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

    // Get playing 11 from player scores if they exist
    const playerScores = await PlayerScore.find({ match: matchId })
      .populate("player", "firstName lastName position battingStyle bowlingStyle imgLink")
      .sort({ team: 1, "batting.battingOrder": 1 });

    // Create playing squads from player scores
    const team1PlayingSquad = [];
    const team2PlayingSquad = [];

    playerScores.forEach(score => {
      const playerData = {
        playerId: score.player._id,
        battingOrder: score.batting.battingOrder
      };

      if (score.team.toString() === getMatch.team1._id.toString()) {
        team1PlayingSquad.push(playerData);
      } else if (score.team.toString() === getMatch.team2._id.toString()) {
        team2PlayingSquad.push(playerData);
      }
    });

    // Add playing squads to the response
    const matchWithPlayingSquads = {
      ...getMatch.toObject(),
      team1PlayingSquad,
      team2PlayingSquad
    };

    return res.json({
      success: true,
      data: matchWithPlayingSquads,
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

async function getAllPlayerOfAMatch(req, res) {
  try {
    const { matchId } = req.params;

    if (!matchId) {
      return res
        .status(400)
        .json({ success: false, message: "please provide matchid" });
    }

    if (!mongoose.isValidObjectId(matchId)) {
      return res
        .status(400)
        .json({ success: false, message: "please provide valid matchid" });
    }

    const match = await Match.findById(matchId)
      .populate({
        path: 'team1',
        select: 'name shortName logo squad',
        populate: {
          path: 'squad',
          // Add select fields for squad/players if needed
          // select: 'name role battingStyle bowlingStyle'
        }
      })
      .populate({
        path: 'team2', 
        select: 'name shortName logo squad',
        populate: {
          path: 'squad',
          // Add select fields for squad/players if needed
          // select: 'name role battingStyle bowlingStyle'
        }
      });

    if (!match) {
      return res
        .status(404)
        .json({ success: false, message: "Match not found" });
    }

    return res.json({ 
      success: true, 
      message: "Match players retrieved successfully",
      data: {
        matchId: match._id,
        team1: match.team1,
        team2: match.team2
      }
    });

  } catch (err) {
    console.error('Error fetching match players:', err);
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








module.exports = {
  createMatch,
  getAllMatch,
  matchDetailsByID,
  getAllPlayerOfAMatch,
  getLiveMatch,
  getUpcomingMatch,
  getCompletedMatch,
  changeMatchStatus,
};
