// models/Contest.js
const mongoose = require("mongoose");

const ContestSchema = new mongoose.Schema(
  {
    matchId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Match",
      required: true,
    },

    contestType: {
      type: String,
      enum: ["h2h", "league", "mega-contest", "practice"],
      required: true,
    },

    entryFee: {
      type: Number,
      required: true,
      min: 0,
    },
    prizePool: {
      type: Number,
      required: true,
    },
    currentParticipants: {
      type: Number,
      default: 0,
    },
    totalSpots: {
      type: Number,
      required: true,
    },

    contestType: {
      type: String,
      enum: ["public", "private"],
      default: "public",
    },
    prizeDistribution: [
      {
        rank: { type: Number, required: true },
        prize: { type: Number, required: true },
      },
    ],
    joinedUsers: [
      {
        user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        teams: [{ type: mongoose.Schema.Types.ObjectId, ref: "UserTeam" }],
        joinedAt: { type: Date, default: Date.now },
      },
    ],

    maxTeamPerUser: {
      type: Number,
      default: 1,
    },
    isCancelled: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Contest", ContestSchema);
