const ChatMessage = require('../models/ChatMessage');
const fs = require('fs').promises;
const path = require('path');

const cleanupOldChatMessages = async () => {
  try {
    console.log('Starting chat cleanup job...');
    
    // Calculate 24 hours ago
    const twentyFourHoursAgo = new Date();
    twentyFourHoursAgo.setHours(twentyFourHoursAgo.getHours() - 24);
    
    // Find messages older than 24 hours with attachments
    const messagesWithAttachments = await ChatMessage.find({
      createdAt: { $lt: twentyFourHoursAgo },
      attachment: { $ne: null }
    });
    
    // Delete physical files first
    for (const message of messagesWithAttachments) {
      if (message.attachment) {
        try {
          const filePath = path.join(__dirname, '../upload', message.attachment);
          await fs.unlink(filePath);
          console.log(`Deleted file: ${message.attachment}`);
        } catch (fileError) {
          console.warn(`Could not delete file ${message.attachment}:`, fileError.message);
        }
      }
    }
    
    // Delete all chat messages older than 24 hours
    const deleteResult = await ChatMessage.deleteMany({
      createdAt: { $lt: twentyFourHoursAgo }
    });
    
    console.log(`Chat cleanup completed: ${deleteResult.deletedCount} messages deleted`);
    
    return {
      success: true,
      deletedCount: deleteResult.deletedCount,
      filesDeleted: messagesWithAttachments.length
    };
    
  } catch (error) {
    console.error('Error during chat cleanup:', error);
    return { success: false, error: error.message };
  }
};

module.exports = { cleanupOldChatMessages };