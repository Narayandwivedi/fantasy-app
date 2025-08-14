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

    console.log('Searching for keyword:', keyword); // Debug log

    const regEx = new RegExp(keyword, "i");

    const searchQuery = {
      $or: [
        { firstName: regEx }, 
        { lastName: regEx },
        { country: regEx },
        { position: regEx }
      ],
    };

    console.log('Search query:', JSON.stringify(searchQuery)); // Debug log

    // Execute the search query
    const players = await player.find(searchQuery);

    console.log('Found players count:', players.length); // Debug log
    
    // Show first few countries for debugging
    if (players.length > 0) {
      console.log('Sample countries found:', players.slice(0, 5).map(p => p.country));
    }

    // Also get all unique countries in database for debugging
    const allCountries = await player.distinct('country');
    console.log('All countries in database:', allCountries);

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