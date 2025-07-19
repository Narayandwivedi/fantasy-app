const Match = require("../models/Match");
const mongoose = require("mongoose");

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

    const validStatus = ["upcoming", "live", "completed"];
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

    getMatch.status = status;

    await getMatch.save();
    return res.json({ success: true, message: "status updated successfully" });
  } catch (err) {
    console.log(err.message);
    return res.status(400).json({ success: false, message: "server error" });
  }
}


async function changeMatchPlaying11(req,res) {
  

  const {team1Squad , team2Squad} = req.body
  res.json({success:true , message})


}


async function createMatchScore(req,res) {
  
  const {matchId} = req.params

  // check req body 

  if(!matchId){
    return res.status(400).json({success:false , message:"please provide valid matchid"})

  // check is valid object id
    if(!mongoose.isValidObjectId(matchId)){
      return res.status(400).json({success:false , message:"invalid matchid"})
    }

    // check is match exist
    const getMatch = await Match.findById(matchId)
    if(!getMatch){
      return res.status(400).json({success:false , message:"match not found"})
    }

    return res.json({success:true , message:"mtach score created successfully"})

  }


}

async function updateMatchScore(req, res) {

}

module.exports = {
  createMatch,
  getAllMatch,
  getLiveMatch,
  getUpcomingMatch,
  getCompletedMatch,
  changeMatchStatus,
  changeMatchPlaying11,
  createMatchScore,
  updateMatchScore
  
};
