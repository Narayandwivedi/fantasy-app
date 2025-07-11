
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

    const sportsType = ['cricket' , 'football' , 'kabbadi']
    if(!sportsType.includes(sport)){
      return res.status(400).json({success:false , message:"invalid sports"})
    }

    // verify team1 and team2 object id

    if(!mongoose.isValidObjectId(team1)||!mongoose.isValidObjectId(team2)){
      return res.status(400).json({success:false , message:"invalid team id"})
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

    return res.json({success:true , message:"match created successfully"})

  } catch (err) {
    return res
      .status(500)
      .json({ success: false, message: err.message || "server error" });
  }
}

async function getAllMatch(req, res) {
  try {
    const allMatches = await Match.find();
    return res.json({ success: true, allMatches });
  } catch (err) {
    return res.status(500).json({ success: false, message: "server error" });
  }
}

module.exports = {
  
  createMatch,
  getAllMatch,
};