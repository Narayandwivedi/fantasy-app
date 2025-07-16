  const mongoose = require("mongoose");

  const teamSchema = new mongoose.Schema(
    {
      name: {
        type: String,
        required: true,
        unique: true,
      },
      shortName: {
        type: String,
        required: true,
        maxlength: 4,
      },
      logo: {
        type: String,
      },
      sport: {
        type: String,
        required: true,
        enum: ["cricket", "football", "basketball", "kabaddi"],
      },
      country: {
        type: String,
      },

      captain: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Player",
      },
      viceCaptain: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Player",
      },
      squad: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Player",
      }],
    },
    {
      timestamps: true,
    }
  );

  module.exports = mongoose.model("Team" , teamSchema)