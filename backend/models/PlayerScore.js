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
    runsConceded: {
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
    droppedCatches: { type: Number, default: 0 },
  },

  // FOOTBALL-SPECIFIC FIELDS
  football: {
    goals: {
      type: Number,
      default: function () {
        return this.sport === "football" ? 0 : undefined;
      },
    },
    assists: {
      type: Number,
      default: function () {
        return this.sport === "football" ? 0 : undefined;
      },
    },
    passes: {
      type: Number,
      default: function () {
        return this.sport === "football" ? 0 : undefined;
      },
    },
    passAccuracy: {
      type: Number,
      default: function () {
        return this.sport === "football" ? 0 : undefined;
      },
    },
    tackles: {
      type: Number,
      default: function () {
        return this.sport === "football" ? 0 : undefined;
      },
    },
    interceptions: {
      type: Number,
      default: function () {
        return this.sport === "football" ? 0 : undefined;
      },
    },
    fouls: {
      type: Number,
      default: function () {
        return this.sport === "football" ? 0 : undefined;
      },
    },
    yellowCards: {
      type: Number,
      default: function () {
        return this.sport === "football" ? 0 : undefined;
      },
    },
    redCards: {
      type: Number,
      default: function () {
        return this.sport === "football" ? 0 : undefined;
      },
    },
    shots: {
      type: Number,
      default: function () {
        return this.sport === "football" ? 0 : undefined;
      },
    },
    shotsOnTarget: {
      type: Number,
      default: function () {
        return this.sport === "football" ? 0 : undefined;
      },
    },
    saves: {
      type: Number,
      default: function () {
        return this.sport === "football" ? 0 : undefined;
      },
    },
    cleanSheet: {
      type: Boolean,
      default: function () {
        return this.sport === "football" ? false : undefined;
      },
    },
    minutesPlayed: {
      type: Number,
      default: function () {
        return this.sport === "football" ? 0 : undefined;
      },
    },
    position: {
      type: String,
      enum: ["GK", "DEF", "MID", "FWD"],
      validate: {
        validator: function () {
          return (
            this.sport === "football" || this.football?.position === undefined
          );
        },
        message: "position is only valid for football",
      },
    },
  },

  // KABADDI-SPECIFIC FIELDS
  kabaddi: {
    raiding: {
      totalRaids: {
        type: Number,
        default: function () {
          return this.sport === "kabaddi" ? 0 : undefined;
        },
      },
      successfulRaids: {
        type: Number,
        default: function () {
          return this.sport === "kabaddi" ? 0 : undefined;
        },
      },
      raidPoints: {
        type: Number,
        default: function () {
          return this.sport === "kabaddi" ? 0 : undefined;
        },
      },
      touchPoints: {
        type: Number,
        default: function () {
          return this.sport === "kabaddi" ? 0 : undefined;
        },
      },
      bonusPoints: {
        type: Number,
        default: function () {
          return this.sport === "kabaddi" ? 0 : undefined;
        },
      },
      emptyRaids: {
        type: Number,
        default: function () {
          return this.sport === "kabaddi" ? 0 : undefined;
        },
      },
      gettingOut: {
        type: Number,
        default: function () {
          return this.sport === "kabaddi" ? 0 : undefined;
        },
      },
      superRaids: {
        type: Number,
        default: function () {
          return this.sport === "kabaddi" ? 0 : undefined;
        },
      },
    },
    defending: {
      totalTackles: {
        type: Number,
        default: function () {
          return this.sport === "kabaddi" ? 0 : undefined;
        },
      },
      successfulTackles: {
        type: Number,
        default: function () {
          return this.sport === "kabaddi" ? 0 : undefined;
        },
      },
      tacklePoints: {
        type: Number,
        default: function () {
          return this.sport === "kabaddi" ? 0 : undefined;
        },
      },
      superTackles: {
        type: Number,
        default: function () {
          return this.sport === "kabaddi" ? 0 : undefined;
        },
      },
      highFives: {
        type: Number,
        default: function () {
          return this.sport === "kabaddi" ? 0 : undefined;
        },
      },
    },
    position: {
      type: String,
      enum: ["Raider", "Defender", "All-Rounder"],
      validate: {
        validator: function () {
          return (
            this.sport === "kabaddi" || this.kabaddi?.position === undefined
          );
        },
        message: "position is only valid for kabaddi",
      },
    },
  },

  // COMMON FIELDS
  isManOfMatch: { type: Boolean, default: false },
  isDuckOut: {
    type: Boolean,
    default: function () {
      return this.sport === "cricket" ? false : undefined;
    },
  },

  performance: {
    minutesPlayed: { type: Number, default: 0 },
    substituteIn: { type: Number },
    substituteOut: { type: Number },
    // isStartingPlayer: { type: Boolean, default: true }
  },

  fantasyPoints: {
    battingPoints: { type: Number, default: 0 },
    bowlingPoints: { type: Number, default: 0 },
    fieldingPoints: { type: Number, default: 0 },

    // attackingPoints: { type: Number, default: 0 },
    // defendingPoints: { type: Number, default: 0 },
    bonusPoints: { type: Number, default: 0 },
    // penaltyPoints: { type: Number, default: 0 },
    totalPoints: { type: Number, default: 0 },
  },
});

// Pre-save middleware to clean up irrelevant fields
PlayerScoreSchema.pre("save", function (next) {
  // Remove irrelevant fields based on sport
  if (this.sport !== "cricket") {
    this.batting = undefined;
    this.bowling = undefined;
    this.fielding.stumpings = undefined;
    this.isDuckOut = undefined;
  }

  if (this.sport !== "football") {
    this.football = undefined;
  }

  if (this.sport !== "kabaddi") {
    this.kabaddi = undefined;
  }

  next();
});

// Add indexes for better query performance
PlayerScoreSchema.index({ match: 1, player: 1 });
PlayerScoreSchema.index({ sport: 1 });
PlayerScoreSchema.index({ team: 1, sport: 1 });

// Enhanced method to calculate fantasy points
PlayerScoreSchema.methods.calculateFantasyPoints = function () {
  let points = 0;

  switch (this.sport) {
    case "cricket":
      points += (this.batting?.runs || 0) * 1;
      points += (this.batting?.fours || 0) * 1;
      points += (this.batting?.sixes || 0) * 2;
      points += (this.bowling?.wicketsTaken || 0) * 25;
      points += (this.fielding?.catches || 0) * 8;
      this.fantasyPoints.battingPoints =
        (this.batting?.runs || 0) +
        (this.batting?.fours || 0) +
        (this.batting?.sixes || 0) * 2;
      this.fantasyPoints.bowlingPoints = (this.bowling?.wicketsTaken || 0) * 25;
      break;

    case "football":
      points += (this.football?.goals || 0) * 16;
      points += (this.football?.assists || 0) * 12;
      points += this.football?.cleanSheet ? 4 : 0;
      points -= (this.football?.yellowCards || 0) * 1;
      points -= (this.football?.redCards || 0) * 3;
      this.fantasyPoints.attackingPoints =
        (this.football?.goals || 0) * 16 + (this.football?.assists || 0) * 12;
      this.fantasyPoints.penaltyPoints = -(
        (this.football?.yellowCards || 0) +
        (this.football?.redCards || 0) * 3
      );
      break;

    case "kabaddi":
      points += (this.kabaddi?.raiding?.raidPoints || 0) * 1;
      points += (this.kabaddi?.defending?.tacklePoints || 0) * 1;
      points += (this.kabaddi?.raiding?.superRaids || 0) * 5;
      this.fantasyPoints.attackingPoints =
        (this.kabaddi?.raiding?.raidPoints || 0) +
        (this.kabaddi?.raiding?.superRaids || 0) * 5;
      this.fantasyPoints.defendingPoints =
        this.kabaddi?.defending?.tacklePoints || 0;
      break;
  }

  this.fantasyPoints.fieldingPoints = (this.fielding?.catches || 0) * 8;
  this.fantasyPoints.totalPoints = points;
  return points;
};

module.exports = mongoose.model("PlayerScore", PlayerScoreSchema);
