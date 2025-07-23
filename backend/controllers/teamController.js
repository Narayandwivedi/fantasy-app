const Team = require("../models/Team");
const mongoose = require("mongoose");
const Player = require("../models/Player");

async function createTeam(req, res) {
  try {
    const { name, shortName, logo, sport, captain, viceCaptain, squad } =
      req.body;

    // Basic field validation
    if (!name || !shortName || !logo || !sport || !squad) {
      return res.status(400).json({
        success: false,
        message:
          "All fields are required: name, shortName, logo, sport, captain, viceCaptain",
      });
    }

    // Additional validations

    // 1. Validate data types and formats
    if (typeof name !== "string" || name.trim().length === 0) {
      return res.status(400).json({
        success: false,
        message: "Team name must be a valid string",
      });
    }

    if (typeof shortName !== "string" || shortName.trim().length > 4) {
      return res.status(400).json({
        success: false,
        message: "Short name must be a string with maximum 4 characters",
      });
    }

    // 2. Validate sport enum (assuming you have specific sports)
    const validSports = ["cricket", "football", "basketball", "kabaddi"];
    if (!validSports.includes(sport.toLowerCase())) {
      return res.status(400).json({
        success: false,
        message: `Sport must be one of: ${validSports.join(", ")}`,
      });
    }

    // 3. Validate  captain and viceCaptain

    if (captain && viceCaptain) {
      // 3.1)validate captain id

      if (!mongoose.Types.ObjectId.isValid(captain)) {
        return res.status(400).json({
          success: false,
          message: "Captain ID is not valid",
        });
      }
      // 3.2)validate vice captain id

      if (!mongoose.Types.ObjectId.isValid(viceCaptain)) {
        return res.status(400).json({
          success: false,
          message: "Vice Captain ID is not valid",
        });
      }

      //  3.3) Captain and vice-captain should be different
      if (captain === viceCaptain) {
        return res.status(400).json({
          success: false,
          message: "Captain and Vice Captain must be different players",
        });
      }
    }

    // 4. Validate squad array
    if (!Array.isArray(squad)) {
      return res.status(400).json({
        success: false,
        message: "Squad must be an array of player IDs",
      });
    }

    // if (squad.length !== 15) {
    //   return res.status(400).json({
    //     success: false,
    //     message: "Squad must contain exactly 15 players",
    //   });
    // }

    // 4.1. Validate each player ID in squad
    const invalidPlayerIds = squad.filter(
      (playerId) => !mongoose.Types.ObjectId.isValid(playerId)
    );
    if (invalidPlayerIds.length > 0) {
      return res.status(400).json({
        success: false,
        message: `Invalid player IDs in squad: ${invalidPlayerIds.join(", ")}`,
      });
    }

    // 4.2. Check for duplicate players in squad
    const uniqueSquad = [...new Set(squad)];
    if (uniqueSquad.length !== squad.length) {
      return res.status(400).json({
        success: false,
        message: "Squad cannot contain duplicate players",
      });
    }

    // 5. Check if team name already exists
    const existingTeam = await Team.findOne({
      name: { $regex: new RegExp(`^${name.trim()}$`, "i") },
    });

    if (existingTeam) {
      return res.status(409).json({
        success: false,
        message: "Team with this name already exists",
      });
    }

    // 6. Check if short name already exists
    const existingShortName = await Team.findOne({
      shortName: { $regex: new RegExp(`^${shortName.trim()}$`, "i") },
    });

    if (existingShortName) {
      return res.status(409).json({
        success: false,
        message: "Team with this short name already exists",
      });
    }

    // 7. Verify all players in squad exist using Promise.all (recommended)
    const playerVerificationPromises = squad.map((playerId) =>
      Player.findById(playerId)
    );
    const players = await Promise.all(playerVerificationPromises);

    const nonExistentPlayers = [];
    players.forEach((player, index) => {
      if (!player) {
        nonExistentPlayers.push(squad[index]);
      }
    });

    if (nonExistentPlayers.length > 0) {
      return res.status(404).json({
        success: false,
        message: `Players not found: ${nonExistentPlayers.join(", ")}`,
      });
    }

    // 8. Verify captain and vice-captain exist in Player model (optional but recommended)

    // const [captainExists, viceCaptainExists] = await Promise.all([
    //     Player.findById(captain),
    //     Player.findById(viceCaptain)
    // ]);

    // if (!captainExists) {
    //     return res.status(404).json({
    //         success: false,
    //         message: 'Captain player not found'
    //     });
    // }

    // if (!viceCaptainExists) {
    //     return res.status(404).json({
    //         success: false,
    //         message: 'Vice Captain player not found'
    //     });
    // }

    // 8. Validate URL format for logo (optional)

    // Create the team

    const newTeam = await Team.create({
      name: name.trim(),
      shortName: shortName.trim().toUpperCase(),
      logo: logo.trim(),
      sport: sport.toLowerCase(),
      captain,
      viceCaptain,
      squad,
    });

    return res.status(201).json({
      success: true,
      message: "Team created successfully",
      data: {
        teamId: newTeam._id,
        name: newTeam.name,
        shortName: newTeam.shortName,
      },
    });
  } catch (err) {
    console.error("Create team error:", err);

    // Handle specific MongoDB errors
    if (err.code === 11000) {
      const field = Object.keys(err.keyPattern)[0];
      return res.status(409).json({
        success: false,
        message: `Team with this ${field} already exists`,
      });
    }

    if (err.name === "ValidationError") {
      const errors = Object.values(err.errors).map((e) => e.message);
      return res.status(400).json({
        success: false,
        message: "Validation error",
        errors,
      });
    }

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
}

async function getAllTeam(req, res) {
  try {
    const allTeams = await Team.find();
    return res.json({ success: true, allTeams });
  } catch (err) {
    return res
      .status(500)
      .json({ success: false, message: ` server error ${err.message}` });
  }
}

async function getTeamById(req, res) {
  try {
    const { id } = req.params;
    if (!id) {
      return res
        .status(400)
        .json({ success: false, message: "provide team id" });
    }
    const getTeam = await Team.findById(id).populate(
      "squad captain viceCaptain"
    );
    if (!getTeam) {
      return res
        .status(400)
        .json({ success: false, message: "team not found" });
    }
    res.json({ success: true, getTeam });
  } catch {
    res.status(500).json({ success: false, message: "some error" });
  }
}

async function addNewPlayerToTeam(req, res) {
  try {
    const teamId = req.params.id;
    const playerId = req.body.playerId;

    // validate req body

    if (!teamId || !playerId) {
      return res
        .status(400)
        .json({ success: false, message: "invalid request" });
    }

    // validate mongoose object id

    if (
      !mongoose.isValidObjectId(teamId) ||
      !mongoose.isValidObjectId(playerId)
    ) {
      return res
        .status(400)
        .json({ success: false, message: "invalid request" });
    }

    // check player exist in db or not

    const getPlayer = await Player.findById(playerId);
    if (!getPlayer) {
      return res.status.json({ success: false, message: "invalid playerid" });
    }

    // check team exist or not
    const getTeam = await Team.findById(teamId);
    if (!getTeam) {
      return res
        .status(400)
        .json({ success: false, message: "team not found" });
    }
    getTeam.squad.push(playerId);
    await getTeam.save();
    return res.json({ success: true, message: "player added success" });
  } catch (err) {
    console.log(err);

    return res.status(500).json({ success: false, message: "server error" });
  }
}

async function removePlayerFromTeam(req, res) {
  try {
    const teamId = req.params.id;
    const playerIdToRemove = req.params.playerId;

    // validate req body

    if (!teamId || !playerIdToRemove) {
      return res
        .status(400)
        .json({ success: false, message: "invalid request" });
    }

    // validate mongoose object id

    if (
      !mongoose.isValidObjectId(teamId) ||
      !mongoose.isValidObjectId(playerIdToRemove)
    ) {
      return res
        .status(400)
        .json({ success: false, message: "invalid request" });
    }

    // check player exist in db or not

    const getPlayer = await Player.findById(playerIdToRemove);
    if (!getPlayer) {
      return res.status(400).json({ success: false, message: "invalid playerid" });
    }

    // check team exist or not
    const getTeam = await Team.findById(teamId);

    if (!getTeam) {
      return res
        .status(400)
        .json({ success: false, message: "team not found" });
    }

    getTeam.squad = getTeam.squad.filter((playerId) => {
      return playerId.toString() !== playerIdToRemove;
    });

    if (getTeam.captain) {
      if (getTeam.captain.toString() === playerIdToRemove) {
        getTeam.captain = null;
      }
    }

    if (getTeam.viceCaptain) {
      if (getTeam.viceCaptain.toString() === playerIdToRemove) {
        getTeam.viceCaptain = null;
      }
    }

    await getTeam.save();

    return res.json({ success: true, message: "player removed successfully" });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
}


async function deleteTeam(req,res) {
  
}

async function removeCaptainFromTeam(req, res) {
  const teamId = req.params.id;
  const playerId = req.params.playerId;
}

async function getTeamSquad(req,res) {
  
}

module.exports = {
  createTeam,
  getAllTeam,
  getTeamById,
  addNewPlayerToTeam,
  removePlayerFromTeam,
  deleteTeam,
  getTeamSquad
};
