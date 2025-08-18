const { default: mongoose } = require("mongoose");
const Match = require("../models/Match");
const UserTeam = require("../models/Userteam");

const createUserTeam = async (req, res) => {
  try {
    const { userId, matchId, players, captainId, viceCaptainId } = req.body;

    // check req body
    if ((!userId, !matchId || !players || !captainId || !viceCaptainId)) {
      return res.status(400).json({ success: false, message: "missing data" });
    }

    // check players array length
    if (!Array.isArray(players) || players.length !== 11) {
      return res
        .status(400)
        .json({ success: false, message: "must select exactly 11 players" });
    }

    // check is valid object id
    if (
      !mongoose.isValidObjectId(matchId) ||
      !mongoose.isValidObjectId(userId)
    ) {
      return res.status(400).json({ success: false, message: "invalid id" });
    }

    // check is valid captain and vc valid object id
    if (
      !mongoose.isValidObjectId(captainId) ||
      !mongoose.isValidObjectId(viceCaptainId)
    ) {
      return res.status(400).json({
        success: false,
        message: "invalid captain and vice captain id",
      });
    }

    //  check is match exist or not
    const getMatch = await Match.findById(matchId)
      .populate("team1", "squad name")
      .populate("team2", "squad name");
    if (!getMatch) {
      return res
        .status(404)
        .json({ success: false, message: "match not found" });
    }

    const allPlayers = getMatch.team1.squad.concat(getMatch.team2.squad);
    const allPlayerIds = allPlayers.map((id) => id.toString());

    // validate all selected players are in squad
    for (let i = 0; i < players.length; i++) {
      if (!allPlayerIds.includes(players[i].toString())) {
        return res
          .status(404)
          .json({ success: false, message: "player is not in squad" });
      }
    }

    // validate captain is in squad and selected players
    if (
      !allPlayerIds.includes(captainId.toString()) ||
      !players.includes(captainId)
    ) {
      return res.status(400).json({
        success: false,
        message: "captain must be in squad and selected players",
      });
    }

    // validate vice captain is in squad and selected players
    if (
      !allPlayerIds.includes(viceCaptainId.toString()) ||
      !players.includes(viceCaptainId)
    ) {
      return res.status(400).json({
        success: false,
        message: "vice captain must be in squad and selected players",
      });
    }

    // ensure captain and vice captain are different
    if (captainId.toString() === viceCaptainId.toString()) {
      return res.status(400).json({
        success: false,
        message: "captain and vice captain must be different players",
      });
    }

    // Format players array according to schema
    const formattedPlayers = players.map((playerId) => ({
      player: playerId,
      fantasyPoints: 0,
    }));

    await UserTeam.create({
      user: userId,
      match: matchId,
      players: formattedPlayers,
      captain: captainId,
      viceCaptain: viceCaptainId,
    });

    res.json({ success: true });
  } catch (err) {
    console.log(err.message);

    return res.status(500).json({ success: false, message: "server error" });
  }
};

const getAllTeamOfAMatch = async (req, res) => {
  try {
    const { matchId } = req.params;
    const { userId } = req.query;

    if (!userId || !matchId) {
      return res
        .status(400)
        .json({ success: false, message: "missing userid or matchid" });
    }

    // Validate ObjectIds
    if (!mongoose.isValidObjectId(userId) || !mongoose.isValidObjectId(matchId)) {
      return res
        .status(400)
        .json({ success: false, message: "invalid userid or matchid" });
    }

    const userTeams = await UserTeam.find({ match: matchId, user: userId })
      .populate({
        path: 'players.player',
        select: 'firstName lastName position imgLink fantasyPrice'
      })
      .populate('captain', 'firstName lastName position imgLink')
      .populate('viceCaptain', 'firstName lastName position imgLink')

    return res.json({ 
      success: true, 
      data: userTeams,
      count: userTeams.length 
    });
  } catch (err) {
    console.log(err.message);
    return res.status(500).json({ success: false, message: "server error" });
  }
};

const getTeamDetail = async (req, res) => {
  try {
    const { teamId } = req.params;

    if (!teamId) {
      return res.status(400).json({ success: false, message: "missing team id" });
    }

    if (!mongoose.isValidObjectId(teamId)) {
      return res.status(400).json({ success: false, message: "invalid team id" });
    }

    const team = await UserTeam.findById(teamId)
      .populate({
        path: 'players.player',
        select: 'firstName lastName position imgLink fantasyPrice'
      })
      .populate('captain', 'firstName lastName position imgLink')
      .populate('viceCaptain', 'firstName lastName position imgLink')
      .populate('match', 'team1 team2');

    if (!team) {
      return res.status(404).json({ success: false, message: "team not found" });
    }

    return res.json({ 
      success: true, 
      data: team
    });
  } catch (err) {
    console.log(err.message);
    return res.status(500).json({ success: false, message: "server error" });
  }
};

const updateTeam = async (req, res) => {
  try {
    const { teamId } = req.params;
    const { players, captainId, viceCaptainId } = req.body;

    if (!teamId) {
      return res.status(400).json({ success: false, message: "missing team id" });
    }

    if (!mongoose.isValidObjectId(teamId)) {
      return res.status(400).json({ success: false, message: "invalid team id" });
    }

    // check req body
    if (!players || !captainId || !viceCaptainId) {
      return res.status(400).json({ success: false, message: "missing data" });
    }

    // check players array length
    if (!Array.isArray(players) || players.length !== 11) {
      return res
        .status(400)
        .json({ success: false, message: "must select exactly 11 players" });
    }

    // check is valid captain and vc valid object id
    if (
      !mongoose.isValidObjectId(captainId) ||
      !mongoose.isValidObjectId(viceCaptainId)
    ) {
      return res.status(400).json({
        success: false,
        message: "invalid captain and vice captain id",
      });
    }

    // Get existing team
    const existingTeam = await UserTeam.findById(teamId).populate('match');
    if (!existingTeam) {
      return res.status(404).json({ success: false, message: "team not found" });
    }

    // Get match data to validate players
    const getMatch = await Match.findById(existingTeam.match)
      .populate("team1", "squad name")
      .populate("team2", "squad name");
    
    if (!getMatch) {
      return res
        .status(404)
        .json({ success: false, message: "match not found" });
    }

    const allPlayers = getMatch.team1.squad.concat(getMatch.team2.squad);
    const allPlayerIds = allPlayers.map((id) => id.toString());

    // validate all selected players are in squad
    for (let i = 0; i < players.length; i++) {
      if (!allPlayerIds.includes(players[i].toString())) {
        return res
          .status(404)
          .json({ success: false, message: "player is not in squad" });
      }
    }

    // validate captain is in squad and selected players
    if (
      !allPlayerIds.includes(captainId.toString()) ||
      !players.includes(captainId)
    ) {
      return res.status(400).json({
        success: false,
        message: "captain must be in squad and selected players",
      });
    }

    // validate vice captain is in squad and selected players
    if (
      !allPlayerIds.includes(viceCaptainId.toString()) ||
      !players.includes(viceCaptainId)
    ) {
      return res.status(400).json({
        success: false,
        message: "vice captain must be in squad and selected players",
      });
    }

    // ensure captain and vice captain are different
    if (captainId.toString() === viceCaptainId.toString()) {
      return res.status(400).json({
        success: false,
        message: "captain and vice captain must be different players",
      });
    }

    // Format players array according to schema
    const formattedPlayers = players.map((playerId) => ({
      player: playerId,
      fantasyPoints: 0,
    }));

    // Update the team
    const updatedTeam = await UserTeam.findByIdAndUpdate(
      teamId,
      {
        players: formattedPlayers,
        captain: captainId,
        viceCaptain: viceCaptainId,
      },
      { new: true }
    );

    res.json({ success: true, data: updatedTeam });
  } catch (err) {
    console.log(err.message);
    return res.status(500).json({ success: false, message: "server error" });
  }
};

module.exports = {
  createUserTeam,
  getAllTeamOfAMatch,
  getTeamDetail,
  updateTeam,
};
