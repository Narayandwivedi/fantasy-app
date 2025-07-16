const player = require("../models/Player");
const Team = require("../models/Team")

async function searchPlayers(req, res) {
  try {
    const { keyword } = req.params;

    if (!keyword || typeof keyword !== "string") {
      return res.status(400).json({
        success: false,
        message: "keyword is required and must be a string",
      });
    }

    const regEx = new RegExp(keyword, "i");

    const searchQuery = {
      $or: [{ firstName: regEx }, { lastName: regEx }],
    };

    // Execute the search query
    const players = await player.find(searchQuery);

    return res.status(200).json({
      success: true,
      data: players,
      message: "Players retrieved successfully",
    });
    
  } catch (err) {
    console.error("Search error:", err);
    return res.status(500).json({ 
      success: false, 
      message: "Internal server error",
      error: err.message 
    });
  }
}

async function searchTeams(req, res) {
  try {
    const { keyword } = req.params;

    if (!keyword || typeof keyword !== "string") {
      return res.status(400).json({
        success: false,
        message: "keyword is required and must be a string",
      });
    }

    const regEx = new RegExp(keyword, "i");

    const searchQuery = {
      $or: [{ name: regEx }, { shortName: regEx }],
    };

    // Execute the search query
    const Teams = await Team.find(searchQuery);

    return res.status(200).json({
      success: true,
      data: Teams,
      message: "team retrieved successfully",
    });
    
  } catch (err) {
    console.error("Search error:", err);
    return res.status(500).json({ 
      success: false, 
      message: "Internal server error",
      error: err.message 
    });
  }
}

module.exports = { searchPlayers , searchTeams };