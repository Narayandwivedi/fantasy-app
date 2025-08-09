const mongoose = require("mongoose");

const depositSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    amount: {
      type: Number,
      required: true,
      min: 1,
      max: 500000, // Set reasonable upper limit
    },
    UTR: {
      type: String,
      required: true,
      unique: true, // UTR should be unique
      trim: true,
    },
    status: {
      type: String,
      enum: ["pending", "auto-approved", "approved", "rejected"],
      default: "pending",
    },
    paymentMethod: {
      type: String,
      enum: ["UPI", "bank_transfer"],
      default: "UPI",
    },
    rejectionReason: {
      type: String,
      trim: true,
    },
    processedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // Admin who processed
    },
  },
  {
    timestamps: true, // Adds createdAt and updatedAt
  }
);

// Index for better query performance
depositSchema.index({ userId: 1, createdAt: -1 });
depositSchema.index({ status: 1 });

module.exports = mongoose.model("Deposit", depositSchema);
