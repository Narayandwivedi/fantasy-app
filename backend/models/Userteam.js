const mongoose = require('mongoose')

const userTeamSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  match: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Match',
    required: true
  },
  teamName: {
    type: String,
    maxlength: 20
  },
  players: [{
    player: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Player',
      required: true
    },
    fantasyPoints: {
      type: Number,
      default: 0
    }
  }],
  captain: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Player',
    required: true
  },
  viceCaptain: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Player',
    required: true
  },
  totalFantasyPoints: {
    type: Number,
    default: 0
  },

  teamComposition: {
    wicketKeepers: { type: Number, default: 0 },
    batsmen: { type: Number, default: 0 },
    allRounders: { type: Number, default: 0 },
    bowlers: { type: Number, default: 0 }
  },
  // contests: [{
  //   contest: { type: mongoose.Schema.Types.ObjectId, ref: 'Contest' },
  //   rank: { type: Number },
  //   prize: { type: Number, default: 0 }
  // }]
}, {
  timestamps: true
});

module.exports = mongoose.model('Userteam',userTeamSchema)