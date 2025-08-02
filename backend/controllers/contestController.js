const Contest = require("../models/Contest");
const Match = require("../models/Match");
const mongoose = require("mongoose");
const User = require("../models/User");

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

async function joinContest(req, res) {
  try {
    
    const { matchId, userId, teamId, contestId } = req.body;
    // validate req body
    if (!userId || !teamId || !contestId || !matchId) {
      return res
        .status(400)
        .json({ success: false, message: "missing details" });
    }

    // validate object id
    if (
      !mongoose.isValidObjectId(userId) ||
      !mongoose.isValidObjectId(teamId) ||
      !mongoose.isValidObjectId(contestId) ||
      !mongoose.isValidObjectId(matchId)
    ) {
      return res
        .status(400)
        .json({ success: false, message: "invalid object id" });
    }

    // check user
    const getUser = await User.findById(userId)
    if(!getUser){
      return res.status(400).json({success:false , message:"user not found"})
    }


    const getContest = await Contest.findById(contestId);
    
    getContest.currentParticipants+=1

    getContest.joinedUsers.push({
      user:userId,
      team:teamId
    })

    await getContest.save()

    return res.json({ success: true });
  } catch (err) {
    console.log(err.message);
    return res.status(500).json({ success: false, message: "server error" });
  }
}

module.exports = { createContest, getContest, joinContest };
