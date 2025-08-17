const PlayerScore = require("../models/PlayerScore");
const Userteam = require("../models/Userteam");

/**
 * Reset all fantasy points for a specific match to zero
 * @param {String} matchId - MongoDB ObjectId of the match
 */
const resetMatchPoints = async (matchId) => {
  try {
    console.log(`Resetting points for match: ${matchId}`);

    // Delete all existing PlayerScore records for this match
    const deletedPlayerScores = await PlayerScore.deleteMany({ match: matchId });
    console.log(`Deleted ${deletedPlayerScores.deletedCount} PlayerScore records`);

    // Reset all user team points to 0 for this match
    const updatedTeams = await Userteam.updateMany(
      { match: matchId },
      {
        totalFantasyPoints: 0,
        $set: {
          "players.$[].fantasyPoints": 0
        }
      }
    );
    console.log(`Reset points for ${updatedTeams.modifiedCount} user teams`);

    return {
      success: true,
      message: `Successfully reset points for match ${matchId}`,
      data: {
        deletedPlayerScores: deletedPlayerScores.deletedCount,
        updatedTeams: updatedTeams.modifiedCount
      }
    };

  } catch (error) {
    console.error("Error resetting match points:", error);
    return {
      success: false,
      message: "Error resetting match points",
      error: error.message
    };
  }
};

module.exports = {
  resetMatchPoints
};