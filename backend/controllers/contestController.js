const Contest = require("../models/Contest");
const Match = require("../models/Match");
const mongoose = require("mongoose");
const User = require("../models/User");
const Userteam = require("../models/Userteam");

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

async function getContestsByMatch(req, res) {
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

    // Fetch only open contests for the match (exclude closed and completed contests)
    const openContests = await Contest.find({
      matchId,
      status: "open",
      isCancelled: false,
    }); // Sort by newest first

    return res.json({ success: true, data: openContests });
  } catch (err) {
    console.log(err.message);
    return res.status(500).json({ success: false, message: "server error" });
  }
}

async function getUserJoinedContests(req, res) {
  try {
    const { userId } = req.params;
    
    if (!userId) {
      return res
        .status(400)
        .json({ success: false, message: "user id not found" });
    }

    if (!mongoose.isValidObjectId(userId)) {
      return res
        .status(400)
        .json({ success: false, message: "invalid user id" });
    }

    // Find contests where user has joined
    const joinedContests = await Contest.find({
      "joinedUsers.user": userId
    })
    .populate({
      path: "matchId",
      select: "team1 team2 startTime status"
    })
    .sort({ createdAt: -1 });

    return res.json({ success: true, data: joinedContests });
  } catch (err) {
    console.log(err.message);
    return res
      .status(500)
      .json({ success: false, message: "internal server error" });
  }
}

async function getUserMatches(req, res) {
  try {
    const { userId } = req.params;
    
    if (!userId) {
      return res
        .status(400)
        .json({ success: false, message: "user id not found" });
    }

    if (!mongoose.isValidObjectId(userId)) {
      return res
        .status(400)
        .json({ success: false, message: "invalid user id" });
    }

    // Find contests where user has joined - only get match IDs to minimize data transfer
    const joinedContests = await Contest.find({
      "joinedUsers.user": userId
    })
    .populate({
      path: "matchId",
      populate: [
        { path: "team1", select: "shortName logo" },  // Only shortName and logo needed
        { path: "team2", select: "shortName logo" }   // Only shortName and logo needed
      ],
      select: "team1 team2 startTime status matchType series"  // Removed sport as it's not used in UI
    })
    .select("matchId")  // Only select matchId from Contest, no contest details needed
    .sort({ createdAt: -1 });

    // Group contests by match and calculate only contest count
    const matchesMap = new Map();
    
    joinedContests.forEach(contest => {
      const match = contest.matchId;
      if (!match) return;
      
      const matchId = match._id.toString();
      
      if (!matchesMap.has(matchId)) {
        matchesMap.set(matchId, {
          matchId: match._id,
          matchType: match.matchType,
          series: match.series,
          team1: match.team1,
          team2: match.team2,
          startTime: match.startTime,
          status: match.status,
          contestsCount: 0
        });
      }
      
      const matchData = matchesMap.get(matchId);
      matchData.contestsCount += 1;
    });

    // Convert map to array and sort by startTime
    const userMatches = Array.from(matchesMap.values()).sort((a, b) => {
      return new Date(b.startTime) - new Date(a.startTime);
    });

    // Categorize matches by status
    const categorizedMatches = {
      upcoming: userMatches.filter(match => match.status === 'upcoming'),
      live: userMatches.filter(match => match.status === 'live'),
      completed: userMatches.filter(match => match.status === 'completed')
    };

    return res.json({ success: true, data: categorizedMatches });
  } catch (err) {
    console.log(err.message);
    return res
      .status(500)
      .json({ success: false, message: "internal server error" });
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

    // Check if user has sufficient balance (allow negative balance)
    if (getUser.balance < getContest.entryFee) {
      return res.status(400).json({ 
        success: false, 
        message: `Insufficient balance. Required: ₹${getContest.entryFee}, Available: ₹${getUser.balance}. Please add funds to your account.`,
        requiredAmount: getContest.entryFee,
        currentBalance: getUser.balance,
        shortfall: getContest.entryFee - getUser.balance
      });
    }

    // Deduct entry fee from user balance
    getUser.balance -= getContest.entryFee;
    await getUser.save();

    console.log(`Entry fee deducted: User ${userId} paid ₹${getContest.entryFee} for contest ${contestId}. New balance: ₹${getUser.balance}`);

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
      })
        .then((newContest) => {
          console.log(
            `New contest created successfully: ${newContest._id} for match: ${matchId}`
          );
        })
        .catch((error) => {
          console.error("❌ CRITICAL: Failed to create new contest", {
            error: error.message,
            matchId,
            contestFormat: getContest.contestFormat,
            entryFee: getContest.entryFee,
            prizePool: getContest.prizePool,
            totalSpots: getContest.totalSpots,
            timestamp: new Date().toISOString(),
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

async function getUserContestsByMatch(req, res) {
  try {
    const { userId, matchId } = req.params;
    
    if (!userId || !matchId) {
      return res
        .status(400)
        .json({ success: false, message: "user id and match id required" });
    }

    if (!mongoose.isValidObjectId(userId) || !mongoose.isValidObjectId(matchId)) {
      return res
        .status(400)
        .json({ success: false, message: "invalid user id or match id" });
    }

    // Find contests where user has joined for specific match
    const userContests = await Contest.find({
      matchId: matchId,
      "joinedUsers.user": userId
    })
    .populate({
      path: "matchId",
      populate: [
        { path: "team1", select: "name shortName logo" },
        { path: "team2", select: "name shortName logo" }
      ],
      select: "team1 team2 startTime status matchType series"
    })
    .sort({ createdAt: -1 });

    // Get user's teams for this match
    const userTeams = await Userteam.find({
      userId: userId,
      matchId: matchId
    })
    .populate("players", "firstName lastName position")
    .populate("captainId", "firstName lastName")
    .populate("viceCaptainId", "firstName lastName");

    return res.json({ 
      success: true, 
      data: {
        contests: userContests,
        teams: userTeams,
        teamsCount: userTeams.length
      }
    });
  } catch (err) {
    console.log(err.message);
    return res
      .status(500)
      .json({ success: false, message: "internal server error" });
  }
}

module.exports = { createContest, getContestsByMatch, joinContest, getUserJoinedContests, getUserMatches, getUserContestsByMatch };
