const mongoose = require("mongoose");
const Player = require("../models/Player");



async function createPlayer(req, res) {
  try {
    // 1) validate req body
    
    const {
     firstName,
     lastName,
      imgLink,
      sport,
      position,
      country,
      battingStyle,
      bowlingStyle,
    } = req.body;

    console.log(firstName , lastName , imgLink , sport , position , country , battingStyle , bowlingStyle);

    if ((!firstName || !lastName || !imgLink, !sport, !position)) {
      return res
        .status(400)
        .json({ success: false, message: "missing fields" });
    }

    // validate name

    
    

    if (typeof firstName !== "string" || firstName.trim().length === 0) {
      return res
        .status(400)
        .json({ success: false, message: "please provide valid name" });
    }

    if (typeof lastName !== "string" || lastName.trim().length === 0) {
      return res
        .status(400)
        .json({ success: false, message: "please provide valid name" });
    }

    //validate sports
    const validSports = ["cricket", "football", "basketball", "kabbadi"];
    if (!validSports.includes(sport.toLowerCase())) {
      return res
        .status(400)
        .json({ success: false, message: "invalid sports name" });
    }

    //  Validate position based on sport

    const validPositions = {
      cricket: ["batsman", "bowler", "all-rounder", "wicket-keeper"],
      football: ["goalkeeper", "defender", "midfielder", "forward"],
      basketball: [ "point-guard","shooting-guard", "small-forward","power-forward","center",],
      kabaddi: ["raider", "defender", "all-rounder"],
    };

    const sportPositions = validPositions[sport.toLowerCase()];
    if (!sportPositions || !sportPositions.includes(position.toLowerCase())) {
      return res.status(400).json({
        success: false,
        message: `Invalid position for ${sport}. Must be one of: ${
          sportPositions ? sportPositions.join(", ") : "N/A"
        }`,
      });
    }

    // validate batting style

    if (sport.toLowerCase() === "cricket" && battingStyle) {
      const validBattingStyles = ["right-handed", "left-handed"];
      if (!validBattingStyles.includes(battingStyle.toLowerCase())) {
        return res
          .status(400)
          .json({ success: false, message: "invalid batting style" });
      }
    }

    // 6) Validate bowling style (only for cricket)
    if (sport.toLowerCase() === "cricket" && bowlingStyle) {
      const validBowlingStyles = [
         "right-arm-fast",
          "right-arm-medium",
          "right-arm-medium-fast",
          "left-arm-fast",
          "left-arm-medium",
          "left-arm-medium-fast",
          "right-arm-spin",
          "left-arm-spin",
          "none",
      ];
      // Fix: Use validBowlingStyles instead of validBattingStyles
      if (!validBowlingStyles.includes(bowlingStyle.toLowerCase())) {
        return res.status(400).json({
          success: false,
          message: `Invalid bowling style. Must be one of: ${validBowlingStyles.join(
            ", "
          )}`,
        });
      }
    }

    await Player.create({
      firstName,
      lastName,
      imgLink,
      sport,
      position,
      country,
      battingStyle,
      bowlingStyle,
    });

    return res.json({ success: true, message: "player created successfully" });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
}

async function updatePlayer(req, res) {
  try {
    const playerId = req.params.id;
    if (!playerId) {
      return res
        .status(400)
        .json({ success: false, message: "invalid player id" });
    }

    console.log(req.body);
    

    const updatedPlayer = await Player.findByIdAndUpdate(playerId, req.body);
    if (!updatePlayer) {
      return res
        .status(400)
        .json({ success: false, message: "player not found" });
    }
    return res.json({ success: true, message: "player updated successfully" });
  } catch (err) {
    return res.status(500).json({ success: false, message: "server error" });
  }
}

async function getAllPlayers(req, res) {
  try {
    // Extract query parameters
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 50; // 50 players per page
    const country = req.query.country;
    const skip = (page - 1) * limit;

    // Build filter object
    let filter = {};
    if (country && country !== 'all') {
      filter.country = { $regex: country, $options: 'i' }; // Case-insensitive match
    }

    // Get total count for pagination
    const totalPlayers = await Player.countDocuments(filter);
    const totalPages = Math.ceil(totalPlayers / limit);

    // Get paginated players
    const allPlayers = await Player.find(filter)
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 }); // Sort by newest first

    // Get unique countries for filter dropdown
    const countries = await Player.distinct('country');

    return res.json({ 
      success: true, 
      allPlayers,
      pagination: {
        currentPage: page,
        totalPages,
        totalPlayers,
        hasNext: page < totalPages,
        hasPrev: page > 1,
        limit
      },
      countries: countries.sort()
    });

  } catch (error) {
    console.error("Get all players error:", error);
    return res.status(500).json({ 
      success: false, 
      message: "Failed to fetch players" 
    });
  }
}


module.exports = {createPlayer , updatePlayer , getAllPlayers}