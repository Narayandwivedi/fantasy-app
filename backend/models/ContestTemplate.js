const mongoose = require("mongoose");

const ContestTemplateSchema = new mongoose.Schema({
    
    templateName: {
        type: String,
        required: true,
        enum: ["h2h", "winner", "winners_takes_all_35", "big_winning_7"]
    },

    contestFormat: {
        type: String,
        enum: ["h2h", "league", "mega-contest", "practice"],
        required: true,
    },

    entryFee: {
        type: Number,
        required: true,
        min: 0,
    },

    totalSpots: {
        type: Number,
        required: true,
    },

    maxTeamPerUser: {
        type: Number,
        default: 1,
    },

    prizeDistribution: [
        {
            rank: { type: Number, required: true },
            prize: { type: Number, required: true },
        },
    ],

    displayCategory: {
        type: String,
        enum: ["featured", "popular", "h2h", "small", "practice"],
        default: "small",
    },

    displayOrder: {
        type: Number,
        default: 100,
    },

    isActive: {
        type: Boolean,
        default: true,
    },

    description: {
        type: String,
        required: true,
    }

}, { timestamps: true });

module.exports = mongoose.model("ContestTemplate", ContestTemplateSchema);