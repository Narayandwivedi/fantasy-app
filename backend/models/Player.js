  const mongoose = require("mongoose");

  const playerSchema = new mongoose.Schema(
    {
      firstName: {
        type: String,
        required: true,
      },
      lastName: {
        type: String,
        required: true,
      },

      imgLink: {
        type: String,
      },

      sport: {
        type: String,
        required: true,
        enum: ["cricket", "football", "basketball", "kabaddi"],
      },

      position: {
        type: String,
        required: true,
        // For cricket: 'batsman', 'bowler', 'all-rounder', 'wicket-keeper'
        // For football: 'goalkeeper', 'defender', 'midfielder', 'forward'
      },

      country: {
        type: String,
        required: true,
      },
      
      battingStyle: {
        type: String,
        enum: ["right-handed", "left-handed"],
        required: function () {
          return this.sport === "cricket";
        },
      },
      bowlingStyle: {
        type: String,
        enum: [
          "right-arm-fast",
          "right-arm-medium",
          "right-arm-medium-fast",
          "left-arm-fast",
          "left-arm-medium",
          "left-arm-medium-fast",
          "right-arm-spin",
          "left-arm-spin",
          "none",
        ],
        required: function () {
          return this.sport === "cricket";
        },
      },

      fantasyPrice: {
        type: Number,
        // required: true,
        min: 7.0,
        max: 12.0,
      },

      fullName: {
        type: String,
        required: true
      },
      // stats: {
      //   matches: { type: Number, default: 0 },
      //   runs: { type: Number, default: 0 },
      //   wickets: { type: Number, default: 0 },
      //   catches: { type: Number, default: 0 },
      //   stumpings: { type: Number, default: 0 },

      // },
    },
    {
      timestamps: true,
    }
  );

  module.exports = mongoose.model("Player", playerSchema);
