// models/Match.js
const mongoose = require("mongoose");

const MatchSchema = new mongoose.Schema({
  sport: {
    type: String,
    required: true,
    enum: ["cricket", "football", "basketball", "kabaddi"],
  },

  matchType: {
    type: String,
    required: true,
    enum: ["T20", "ODI", "Test", "T10", "League", "Cup"],
  },
  series: {
    type: String,
  },

   team1: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Team',
    required: true
  },
  team2: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Team',
    required: true
  },
   venue: {
    type: String,
  },

   tossWinner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Team'
  },

   tossDecision: {
    type: String,
    enum: ["bat", "bowl"]
  },

  startTime: {
    type: Date,
    // required: true,
  },
  endTime: {
    type: Date,
  },
  status: {
    type: String,
    enum: ["upcoming", "live", "completed", "cancelled"],
    default: "upcoming",
  },
    matchWinner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Team'
  },
   team1PlayingSquad: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Player'
  }],
  team2PlayingSquad: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Player'
  }],
},{timestamps:true});



module.exports = mongoose.model("Match", MatchSchema);
