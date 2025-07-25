const mongoose = require("mongoose")


const PlayerScoreSchema = new mongoose.Schema({
  match: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Match",
    required: true,
  },
  team: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Team",
    required: true,
  },

  series: {
    type: String,
  },

  player: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Player",
    required: true,
  },
  sport: {
    type: String,
    enum: ["cricket", "football", "kabaddi"],
    required: true,
  },

  // CRICKET-SPECIFIC FIELDS
  batting: {
    runs: {
      type: Number,
      default: function () {
        return this.sport === "cricket" ? 0 : undefined;
      },
    },
    ballsFaced: {
      type: Number,
      default: function () {
        return this.sport === "cricket" ? 0 : undefined;
      },
    },
    fours: {
      type: Number,
      default: function () {
        return this.sport === "cricket" ? 0 : undefined;
      },
    },
    sixes: {
      type: Number,
      default: function () {
        return this.sport === "cricket" ? 0 : undefined;
      },
    },
    isOut: {
      type: Boolean,
      default: function () {
        return this.sport === "cricket" ? false : undefined;
      },
    },
    howOut: {
      type: String,
      enum: [
        "bowled",
        "caught",
        "lbw",
        "stumped",
        "run out",
        "hit wicket",
        "not out",
        "retired hurt",
      ],
      validate: {
        validator: function () {
          return this.sport === "cricket" || this.howOut === undefined;
        },
        message: "howOut is only valid for cricket",
      },
    },
    bowlerOut: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Player",
      validate: {
        validator: function () {
          return this.sport === "cricket" || this.bowlerOut === undefined;
        },
        message: "bowlerOut is only valid for cricket",
      },
    },
    fielderOut: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Player",
      validate: {
        validator: function () {
          return this.sport === "cricket" || this.fielderOut === undefined;
        },
        message: "fielderOut is only valid for cricket",
      },
    },
    strikeRate: {
      type: Number,
      default: function () {
        return this.sport === "cricket" ? 0 : undefined;
      },
    },
    battingOrder: {
      type: Number,
      validate: {
        validator: function () {
          return this.sport === "cricket" || this.battingOrder === undefined;
        },
        message: "battingOrder is only valid for cricket",
      },
    },
  },

  bowling: {
    oversBowled: {
      type: Number,
      default: function () {
        return this.sport === "cricket" ? 0 : undefined;
      },
    },
    ballsBowled: {
      type: Number,
      default: function () {
        return this.sport === "cricket" ? 0 : undefined;
      },
    },

    dotBalls: {
      type: Number,
      default: function () {
        return this.sport === "cricket" ? 0 : undefined;
      },
    },

    runsGiven: {
      type: Number,
      default: function () {
        return this.sport === "cricket" ? 0 : undefined;
      },
    },
    wicketsTaken: {
      type: Number,
      default: function () {
        return this.sport === "cricket" ? 0 : undefined;
      },
    },
    maidenOvers: {
      type: Number,
      default: function () {
        return this.sport === "cricket" ? 0 : undefined;
      },
    },
    wides: {
      type: Number,
      default: function () {
        return this.sport === "cricket" ? 0 : undefined;
      },
    },
    noBalls: {
      type: Number,
      default: function () {
        return this.sport === "cricket" ? 0 : undefined;
      },
    },
    economyRate: {
      type: Number,
      default: function () {
        return this.sport === "cricket" ? 0 : undefined;
      },
    },
  },

  fielding: {
    catches: { type: Number, default: 0 },
    stumpings: {
      type: Number,
      default: function () {
        return this.sport === "cricket" ? 0 : undefined;
      },
    },
    runOuts: { type: Number, default: 0 },
   
  },


  // COMMON FIELDS
  isManOfMatch: { type: Boolean, default: false },
  isDuckOut: {
    type: Boolean,
    default: function () {
      return this.sport === "cricket" ? false : undefined;
    },
  },


  fantasyPoints: {
    battingPoints: { type: Number, default: 0 },
    bowlingPoints: { type: Number, default: 0 },
    fieldingPoints: { type: Number, default: 0 },

    
    bonusPoints: { type: Number, default: 0 },
    
    totalPoints: { type: Number, default: 0 },
  },
});




module.exports = mongoose.model("PlayerScore", PlayerScoreSchema);
