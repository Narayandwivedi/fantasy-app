const Contest = require("../models/Contest");
const Match = require("../models/Match");
const mongoose = require("mongoose");

async function createContest(req, res) {
  try {
    const { matchId } = req.params;
    const { contestFormat, entryFee, totalSpots, prizePool } = req.body;

    // check req body
    if (!contestFormat || !entryFee || !totalSpots || !prizePool || !matchId) {
      return res
        .status(400)
        .json({ success: false, message: "missing details" });
    }

    // check match id format
    if (!mongoose.isValidObjectId(matchId)) {
      return res
        .status(400)
        .json({ success: false, message: "invalid match id" });
    }

    //check match exist and upcoming to join contest
    const getMatch = await Match.findById(matchId);
    if (!getMatch || getMatch.status !== "upcoming") {
      return res
        .status(400)
        .json({ success: false, message: "contest creation not allowed" });
    }

    await Contest.create({
      matchId,
      contestFormat,
      entryFee,
      prizePool,
      totalSpots,
    });

    return res.json({
      success: true,
      message: "contest created successfully",
    });
  } catch (err) {
    console.log(err.message);

    return res
      .status(500)
      .json({ success: false, message: "internal server error" });
  }
}

async function getContest(req, res) {
  try {
    const { matchId } = req.params;
    
    //check is match id provided
    if (!matchId) {
      return res
        .status(400)
        .json({ success: false, message: "provide match id" });
    }
    console.log(matchId);

    //check is valid mongoose id
    if (!mongoose.isValidObjectId(matchId)) {
      return res
        .status(400)
        .json({ success: false, message: "invalid match id " });
    }

    const allContest = await Contest.find({ matchId });
    return res.json({ success: true, data: allContest });
  } catch (err) {
    console.log(err.message);
    return res.status(500).json({ success: false, message: "server error" });
  }
}


async function joinContest(req,res) {
  
  const {userId , teamId} = req.body

}

module.exports = { createContest, getContest };
