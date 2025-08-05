const express = require('express');
const router = express.Router();
const ChatMessage = require('../models/ChatMessage');
const auth = require('../middleware/auth');

// Send a chat message (user)
router.post('/send', auth, async (req, res) => {
  try {
    const { message, category, attachment, attachmentType } = req.body;
    
    if (!message || !category) {
      return res.status(400).json({ message: 'Message and category are required' });
    }

    const chatMessage = new ChatMessage({
      userId: req.user._id,
      message,
      category,
      attachment: attachment || null,
      attachmentType: attachmentType || null
    });

    await chatMessage.save();
    await chatMessage.populate('userId', 'name email');

    // Check if this is the user's first message
    const existingMessages = await ChatMessage.countDocuments({ userId: req.user._id });
    
    // Only send auto-reply for the first message
    if (existingMessages === 1) { // 1 because we just saved this message
      const autoReplyMessage = "Thank you for contacting our support team. We have received your message and will respond within 3-5 minutes. Our team is working to assist you as quickly as possible.";
      
      chatMessage.adminReply = autoReplyMessage;
      chatMessage.adminRepliedAt = new Date();
      chatMessage.isRead = true;
      chatMessage.isAutoReply = true;
      
      await chatMessage.save();
    }

    res.status(201).json({
      message: 'Message sent successfully',
      data: chatMessage
    });
  } catch (error) {
    console.error('Error sending chat message:', error);
    res.status(500).json({ message: 'Failed to send message' });
  }
});

// Get all chat messages (admin)
router.get('/messages', auth, async (req, res) => {
  try {
    const { page = 1, limit = 50, category, isRead } = req.query;
    
    // Build filter object
    const filter = {};
    if (category) filter.category = category;
    if (isRead !== undefined) filter.isRead = isRead === 'true';

    const messages = await ChatMessage.find(filter)
      .populate('userId', 'name email phone')
      .populate('adminId', 'name')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await ChatMessage.countDocuments(filter);
    const unreadCount = await ChatMessage.countDocuments({ isRead: false });

    res.json({
      messages,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      },
      unreadCount
    });
  } catch (error) {
    console.error('Error fetching chat messages:', error);
    res.status(500).json({ message: 'Failed to fetch messages' });
  }
});

// Get user's chat messages
router.get('/my-messages', auth, async (req, res) => {
  try {
    const messages = await ChatMessage.find({ userId: req.user._id })
      .sort({ createdAt: -1 });

    res.json({ messages });
  } catch (error) {
    console.error('Error fetching user messages:', error);
    res.status(500).json({ message: 'Failed to fetch messages' });
  }
});

// Mark message as read (admin)
router.patch('/mark-read/:id', auth, async (req, res) => {
  try {
    const message = await ChatMessage.findByIdAndUpdate(
      req.params.id,
      { isRead: true },
      { new: true }
    ).populate('userId', 'name email');

    if (!message) {
      return res.status(404).json({ message: 'Message not found' });
    }

    res.json({ message: 'Message marked as read', data: message });
  } catch (error) {
    console.error('Error marking message as read:', error);
    res.status(500).json({ message: 'Failed to mark message as read' });
  }
});

// Reply to message (admin)
router.patch('/reply/:id', auth, async (req, res) => {
  try {
    const { adminReply } = req.body;
    
    if (!adminReply) {
      return res.status(400).json({ message: 'Admin reply is required' });
    }

    const message = await ChatMessage.findByIdAndUpdate(
      req.params.id,
      { 
        adminReply,
        adminRepliedAt: new Date(),
        adminId: req.user._id,
        isRead: true,
        hasRealReply: true,
        isAutoReply: false // Override auto-reply when admin sends real reply
      },
      { new: true }
    ).populate('userId', 'name email')
     .populate('adminId', 'name');

    if (!message) {
      return res.status(404).json({ message: 'Message not found' });
    }

    res.json({ message: 'Reply sent successfully', data: message });
  } catch (error) {
    console.error('Error sending reply:', error);
    res.status(500).json({ message: 'Failed to send reply' });
  }
});

module.exports = router;