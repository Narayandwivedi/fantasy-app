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
    const getUser = await User.findById(userId);
    if (!getUser) {
      return res
        .status(400)
        .json({ success: false, message: "user not found" });
    }

    // check match

    const getMatch = await Match.findById(matchId);
    if (!getMatch) {
      return res
        .status(400)
        .json({ success: false, message: "match not found" });
    }

    // checks is match is upcoming
    if (getMatch.status !== "upcoming") {
      return res
        .status(400)
        .json({ success: false, message: "invalid request match is live" });
    }

    // validate contest

    const getContest = await Contest.findById(contestId);

    if (!getContest) {
      return res
        .status(400)
        .json({ success: false, message: "contest does not exist" });
    }

    // validate is contest full
    if (
      getContest.currentParticipants >= getContest.totalSpots ||
      getContest.status === "closed"
    ) {
      return res.status(400).json({ success: false, message: "contest full" });
    }

    // Add user to contest
    getContest.joinedUsers.push({
      user: userId,
      team: teamId,
    });

    // Increment participants count
    getContest.currentParticipants += 1;

    // Check if contest becomes full and create new one
    if (getContest.currentParticipants === getContest.totalSpots) {
      getContest.status = "closed";

      // Create new contest in background (fire and forget)
      Contest.create({
        matchId,
        contestFormat: getContest.contestFormat,
        entryFee: getContest.entryFee,
        prizePool: getContest.prizePool,
        totalSpots: getContest.totalSpots,
      }).then((newContest) => {
        console.log(`New contest created successfully: ${newContest._id} for match: ${matchId}`);
      }).catch((error) => {
        console.error('❌ CRITICAL: Failed to create new contest', {
          error: error.message,
          matchId,
          contestFormat: getContest.contestFormat,
          entryFee: getContest.entryFee,
          prizePool: getContest.prizePool,
          totalSpots: getContest.totalSpots,
          timestamp: new Date().toISOString()
        });
        
        // TODO: Implement retry mechanism or admin notification
        // For now, log to console - in production, you could:
        // 1. Send to monitoring service (e.g., Sentry, DataDog)
        // 2. Add to retry queue
        // 3. Send admin notification
        // 4. Store failed creation data for manual retry
      });
    }

    // Save the updated contest
    await getContest.save();

    return res.json({ success: true });
  } catch (err) {
    console.log(err.message);
    return res.status(500).json({ success: false, message: "server error" });
  }
}

module.exports = { createContest, getContest, joinContest };
