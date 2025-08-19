const Userteam = require("../models/Userteam");
const PlayerScore = require("../models/PlayerScore");
const Contest = require("../models/Contest");


const updateUserTeamPointsForMatch = async (matchId) => {
  try {
    // Get all player scores for the match
    const playerScores = await PlayerScore.find({ match: matchId });
    
    
    if (playerScores.length === 0) {
      return { success: false, message: "No player scores found for this match" };
    }

    // Create a map of player ID to fantasy points for quick lookup
    const playerPointsMap = {};
    playerScores.forEach(score => {
      playerPointsMap[score.player.toString()] = score.fantasyPoints.totalPoints;
    });

    // Find all user teams for this match
    const userTeams = await Userteam.find({ match: matchId });
    
    if (userTeams.length === 0) {
      return { success: false, message: "No user teams found for this match" };
    }

    const updatePromises = [];
    let updatedTeamsCount = 0;

    // Process each user team
    for (const userTeam of userTeams) {
      let totalTeamPoints = 0;
      let hasUpdates = false;

      // Update points for each player in the team
      const updatedPlayers = userTeam.players.map(playerEntry => {
        const playerId = playerEntry.player.toString();
        const newPoints = playerPointsMap[playerId] || 0;
        
        // Apply captain/vice-captain multipliers to calculate final points for team total
        let finalPoints = newPoints;
        if (userTeam.captain && userTeam.captain.toString() === playerId) {
          finalPoints = newPoints * 2; // Captain gets 2x points
        } else if (userTeam.viceCaptain && userTeam.viceCaptain.toString() === playerId) {
          finalPoints = newPoints * 1.5; // Vice-captain gets 1.5x points
        }
        
        // Check if points have changed (compare with final points)
        if (playerEntry.fantasyPoints !== finalPoints) {
          hasUpdates = true;
        }

        // Add this player's final points to team total
        totalTeamPoints += finalPoints;

        return {
          ...playerEntry.toObject(),
          fantasyPoints: finalPoints // Store final points with multiplier applied
        };
      });

      // Only update if there are changes
      if (hasUpdates) {
        const updatePromise = Userteam.findByIdAndUpdate(
          userTeam._id,
          {
            players: updatedPlayers,
            totalFantasyPoints: totalTeamPoints
          },
          { new: true }
        );
        
        updatePromises.push(updatePromise);
        updatedTeamsCount++;
      }
    }

    // Execute all updates in parallel
    await Promise.all(updatePromises);

    return {
      success: true,
      message: `Successfully updated ${updatedTeamsCount} user teams`,
      data: {
        matchId,
        totalUserTeams: userTeams.length,
        updatedTeams: updatedTeamsCount,
        playersWithScores: playerScores.length
      }
    };

  } catch (error) {
    console.error("Error updating user team points:", error);
    return {
      success: false,
      message: "Error updating user team points",
      error: error.message
    };
  }
};

/**
 * Update fantasy points for all contests of a specific match
 * @param {String} matchId - MongoDB ObjectId of the match
 * @returns {Object} - Update results
 */
const updateAllContestTeamPointsForMatch = async (matchId) => {
  try {
    // Find all contests for this match
    const contests = await Contest.find({ matchId });
    
    if (contests.length === 0) {
      return { success: false, message: "No contests found for this match" };
    }

    // Update user teams for the match (this covers all contest participants)
    const updateResult = await updateUserTeamPointsForMatch(matchId);
    
    if (!updateResult.success) {
      return updateResult;
    }

    // Update contest rankings (optional - can be done separately)
    const contestUpdatePromises = contests.map(async (contest) => {
      // Get all teams in this contest with updated points
      const contestTeams = await Userteam.find({
        _id: { $in: contest.joinedUsers.map(ju => ju.team) }
      }).populate('user', 'firstName lastName').sort({ totalFantasyPoints: -1 });

      return {
        contestId: contest._id,
        totalTeams: contestTeams.length,
        leaderboard: contestTeams.slice(0, 10) // Top 10 for preview
      };
    });

    const contestResults = await Promise.all(contestUpdatePromises);

    return {
      success: true,
      message: `Successfully updated points for ${contests.length} contests`,
      data: {
        ...updateResult.data,
        contests: contestResults
      }
    };

  } catch (error) {
    console.error("Error updating contest team points:", error);
    return {
      success: false,
      message: "Error updating contest team points",
      error: error.message
    };
  }
};

module.exports = {
  updateUserTeamPointsForMatch,
  updateAllContestTeamPointsForMatch
};