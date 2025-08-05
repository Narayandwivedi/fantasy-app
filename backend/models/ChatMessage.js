const mongoose = require('mongoose');

const chatMessageSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  message: {
    type: String,
    required: true,
    trim: true
  },
  category: {
    type: String,
    required: true,
    enum: ['Deposit Related', 'Withdraw', 'KYC', 'Game Related', 'Other']
  },
  isRead: {
    type: Boolean,
    default: false
  },
  adminReply: {
    type: String,
    default: null
  },
  adminRepliedAt: {
    type: Date,
    default: null
  },
  adminId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null
  },
  isAutoReply: {
    type: Boolean,
    default: false
  },
  hasRealReply: {
    type: Boolean,
    default: false
  },
  attachment: {
    type: String,
    default: null
  },
  attachmentType: {
    type: String,
    enum: ['image', 'file'],
    default: null
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('ChatMessage', chatMessageSchema);