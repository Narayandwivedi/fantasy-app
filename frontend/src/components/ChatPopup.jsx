import React, { useState, useEffect, useRef, useContext } from 'react';
import { MessageCircle, Send, X, Minimize2, Maximize2, CreditCard, Banknote, FileCheck, Gamepad2, HelpCircle, Paperclip, Image } from 'lucide-react';
import { AppContext } from '../context/AppContext';

const ChatPopup = ({ isOpen, onClose, onMessageSent }) => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [position, setPosition] = useState(() => {
    const isMobile = window.innerWidth <= 768;
    if (isMobile) {
      return { x: 10, y: 40 }; // Top position with some gap
    }
    return { x: window.innerWidth - 380, y: 100 }; // Original desktop position
  });
  const [activeCategory, setActiveCategory] = useState('Deposit Related');
  const [showCategorySelect, setShowCategorySelect] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef(null);
  
  const { BACKEND_URL } = useContext(AppContext);
  const chatRef = useRef(null);
  const messagesEndRef = useRef(null);

  const categories = [
    { id: 'Deposit Related', label: 'Deposit Related', icon: <CreditCard className="w-4 h-4" /> },
    { id: 'Withdraw', label: 'Withdraw', icon: <Banknote className="w-4 h-4" /> },
    { id: 'KYC', label: 'KYC', icon: <FileCheck className="w-4 h-4" /> },
    { id: 'Game Related', label: 'Game Related', icon: <Gamepad2 className="w-4 h-4" /> },
    { id: 'Other', label: 'Other', icon: <HelpCircle className="w-4 h-4" /> }
  ];

  // Fetch messages
  const fetchMessages = async () => {
    try {
      const response = await fetch(`${BACKEND_URL}/api/chat/my-messages`, {
        credentials: 'include'
      });

      if (response.ok) {
        const data = await response.json();
        // Sort messages by creation date (oldest first) for proper chat order
        const sortedMessages = data.messages.sort((a, b) => 
          new Date(a.createdAt) - new Date(b.createdAt)
        );
        setMessages(sortedMessages);
      }
    } catch (error) {
      console.error('Error fetching messages:', error);
    }
  };

  // Format file size for display
  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  // Handle file selection
  const handleFileSelect = (event) => {
    const file = event.target.files[0];
    if (file) {
      // Check file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert(`File size must be less than 5MB. Your file is ${formatFileSize(file.size)}.`);
        event.target.value = ''; // Clear the input
        return;
      }

      // Check file type
      const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp', 'application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'text/plain'];
      if (!allowedTypes.includes(file.type)) {
        alert('File type not allowed. Please upload images, PDFs, or documents.');
        event.target.value = ''; // Clear the input
        return;
      }

      setSelectedFile(file);
    }
  };

  // Upload file
  const uploadFile = async (file) => {
    const formData = new FormData();
    formData.append('chatFile', file);

    const response = await fetch(`${BACKEND_URL}/api/upload/chat`, {
      method: 'POST',
      credentials: 'include',
      body: formData
    });

    const result = await response.json();

    if (!response.ok) {
      // Handle specific error messages from backend
      throw new Error(result.message || 'File upload failed');
    }

    return result;
  };

  // Send message with optional file
  const sendMessage = async () => {
    if (!newMessage.trim() && !selectedFile) return;
    
    setIsLoading(true);
    setIsUploading(true);
    
    try {
      let fileData = null;
      
      // Upload file if selected
      if (selectedFile) {
        fileData = await uploadFile(selectedFile);
      }

      const response = await fetch(`${BACKEND_URL}/api/chat/send`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify({
          message: newMessage || (selectedFile ? `Sent ${selectedFile.name}` : ''),
          category: activeCategory,
          attachment: fileData?.file_url || null,
          attachmentType: fileData?.file_type || null
        })
      });

      if (response.ok) {
        setNewMessage('');
        setSelectedFile(null);
        setShowCategorySelect(false);
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
        await fetchMessages(); // Refresh messages
        // Auto-scroll to bottom after sending message
        setTimeout(() => {
          messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
        }, 100);
        // Notify parent component that a message was sent
        if (onMessageSent) {
          onMessageSent();
        }
      } else {
        const data = await response.json();
        alert(data.message || 'Failed to send message');
      }
    } catch (error) {
      console.error('Error sending message:', error);
      alert('Failed to send message. Please try again.');
    } finally {
      setIsLoading(false);
      setIsUploading(false);
    }
  };

  // Polling for new messages every 5 seconds
  useEffect(() => {
    if (!isOpen) return;

    fetchMessages(); // Initial fetch
    const interval = setInterval(fetchMessages, 5000);
    
    return () => clearInterval(interval);
  }, [isOpen]);

  // Prevent background scrolling when popup is open
  useEffect(() => {
    if (isOpen) {
      // Disable body scroll
      document.body.style.overflow = 'hidden';
      // For iOS Safari
      document.body.style.position = 'fixed';
      document.body.style.width = '100%';
    } else {
      // Re-enable body scroll
      document.body.style.overflow = '';
      document.body.style.position = '';
      document.body.style.width = '';
    }

    // Cleanup on unmount
    return () => {
      document.body.style.overflow = '';
      document.body.style.position = '';
      document.body.style.width = '';
    };
  }, [isOpen]);

  // Scroll to bottom when new messages arrive or popup opens
  useEffect(() => {
    if (messages.length > 0) {
      setTimeout(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    }
  }, [messages]);

  // Auto-scroll to bottom when popup first opens
  useEffect(() => {
    if (isOpen && messages.length > 0) {
      setTimeout(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'instant' });
      }, 200);
    }
  }, [isOpen]);


  // Handle window resize for mobile responsiveness
  useEffect(() => {
    const handleResize = () => {
      const isMobile = window.innerWidth <= 768;
      if (isMobile) {
        setPosition({ x: 10, y: 40 });
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const formatDate = (date) => {
    return new Date(date).toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  };

  if (!isOpen) return null;

  const isMobile = window.innerWidth <= 768;

  return (
    <div
      ref={chatRef}
      className={`fixed bg-white rounded-lg shadow-2xl border border-gray-200 z-50 select-none ${
        isMobile ? 'mx-2' : ''
      }`}
      style={{
        left: isMobile ? '10px' : position.x,
        top: isMobile ? '40px' : position.y,
        width: isMobile ? 'calc(100vw - 20px)' : '350px',
        maxWidth: isMobile ? '400px' : '350px',
        height: isMinimized ? 'auto' : (isMobile ? 'calc(100vh - 160px)' : '500px'),
        bottom: isMobile ? '80px' : 'auto'
      }}
    >
      {/* Header */}
      <div className="flex items-center justify-between p-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-t-lg">
        <div className="flex items-center space-x-2">
          <MessageCircle className={`${isMobile ? 'w-4 h-4' : 'w-5 h-5'}`} />
          <h3 className={`font-semibold ${isMobile ? 'text-sm' : ''}`}>Support Chat</h3>
        </div>
        <div className="flex items-center">
          <button
            onClick={onClose}
            className={`p-1 hover:bg-white/20 rounded ${isMobile ? 'p-2' : ''}`}
          >
            <X className={`${isMobile ? 'w-5 h-5' : 'w-4 h-4'}`} />
          </button>
        </div>
      </div>

      {!isMinimized && (
        <>
          {/* Messages */}
          <div className={`${isMobile ? 'p-2' : 'p-3'} overflow-y-auto bg-gray-50`} 
               style={{ 
                 height: isMobile ? (selectedFile ? 'calc(100vh - 270px)' : 'calc(100vh - 240px)') : 'calc(500px - 140px)',
                 minHeight: isMobile ? '200px' : '320px'
               }}>
            {messages.length === 0 ? (
              <div className={`text-center text-gray-500 ${isMobile ? 'mt-4' : 'mt-8'}`}>
                <MessageCircle className={`${isMobile ? 'w-8 h-8' : 'w-12 h-12'} mx-auto mb-2 text-gray-300`} />
                <p className={`${isMobile ? 'text-sm' : ''}`}>No messages yet</p>
                <p className={`${isMobile ? 'text-xs' : 'text-sm'}`}>Start a conversation!</p>
              </div>
            ) : (
              <div className={`space-y-${isMobile ? '2' : '3'}`}>
                {/* Category header - shown once at top */}
                {messages.length > 0 && (
                  <div className="text-center">
                    <div className="inline-block bg-gray-200 text-gray-700 px-3 py-1 rounded-full text-xs font-medium mb-3">
                      Category: {messages[0].category}
                    </div>
                  </div>
                )}
                
                {messages.map((message) => (
                  <div key={message._id} className="space-y-2">
                    {/* User message */}
                    <div className="flex justify-end">
                      <div className={`bg-blue-500 text-white ${isMobile ? 'p-2' : 'p-3'} rounded-lg ${isMobile ? 'max-w-[85%]' : 'max-w-xs'}`}>
                        <p className={`${isMobile ? 'text-xs' : 'text-sm'}`}>{message.message}</p>
                        {/* Show attachment if exists */}
                        {message.attachment && (
                          <div className="mt-2">
                            {message.attachmentType === 'image' ? (
                              <img 
                                src={`${BACKEND_URL}${message.attachment}`}
                                alt="Attachment"
                                className="max-w-full h-auto rounded cursor-pointer"
                                onClick={() => window.open(`${BACKEND_URL}${message.attachment}`, '_blank')}
                              />
                            ) : (
                              <a 
                                href={`${BACKEND_URL}${message.attachment}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center space-x-2 text-blue-100 hover:text-white underline"
                              >
                                <Paperclip className="w-4 h-4" />
                                <span className="text-xs">View Attachment</span>
                              </a>
                            )}
                          </div>
                        )}
                        <p className={`${isMobile ? 'text-xs' : 'text-xs'} text-blue-100 mt-1`}>
                          {formatDate(message.createdAt)}
                        </p>
                      </div>
                    </div>
                    
                    {/* Admin reply */}
                    {message.adminReply && !message.isAutoReply && (
                      <div className="flex justify-start">
                        <div className={`bg-gray-200 text-gray-800 ${isMobile ? 'p-2' : 'p-3'} rounded-lg ${isMobile ? 'max-w-[85%]' : 'max-w-xs'}`}>
                          <div className={`${isMobile ? 'text-xs' : 'text-xs'} bg-gray-300 px-2 py-1 rounded mb-1`}>
                            Support Team
                          </div>
                          <p className={`${isMobile ? 'text-xs' : 'text-sm'}`}>{message.adminReply}</p>
                          <p className={`${isMobile ? 'text-xs' : 'text-xs'} text-gray-500 mt-1`}>
                            {formatDate(message.adminRepliedAt)}
                          </p>
                        </div>
                      </div>
                    )}
                    
                    {/* Auto reply - only show if there's no real admin reply */}
                    {message.isAutoReply && !message.hasRealReply && (
                      <div className="flex justify-start">
                        <div className={`bg-blue-50 border border-blue-200 text-gray-800 ${isMobile ? 'p-2' : 'p-3'} rounded-lg ${isMobile ? 'max-w-[85%]' : 'max-w-xs'}`}>
                          <div className={`${isMobile ? 'text-xs' : 'text-xs'} bg-blue-100 text-blue-700 px-2 py-1 rounded mb-1`}>
                            Auto Reply
                          </div>
                          <p className={`${isMobile ? 'text-xs' : 'text-sm'}`}>{message.adminReply}</p>
                          <p className={`${isMobile ? 'text-xs' : 'text-xs'} text-gray-500 mt-1`}>
                            {formatDate(message.adminRepliedAt)}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>
            )}
          </div>

          {/* Category selector */}
          {showCategorySelect && (
            <div className={`${isMobile ? 'p-2' : 'p-3'} border-t bg-white`}>
              <div className={`${isMobile ? 'text-xs' : 'text-sm'} font-medium text-gray-700 mb-2`}>Select Category:</div>
              <div className={`grid grid-cols-${isMobile ? '1' : '2'} gap-1`}>
                {categories.slice(0, 4).map((category) => (
                  <button
                    key={category.id}
                    onClick={() => {
                      setActiveCategory(category.id);
                      setShowCategorySelect(false);
                    }}
                    className={`flex items-center ${isMobile ? 'justify-center' : ''} space-x-1 ${isMobile ? 'p-3' : 'p-2'} rounded ${isMobile ? 'text-sm' : 'text-xs'} ${
                      activeCategory === category.id
                        ? 'bg-blue-100 text-blue-700'
                        : 'bg-gray-100 hover:bg-gray-200'
                    }`}
                  >
                    {category.icon}
                    <span>{category.label}</span>
                  </button>
                ))}
              </div>
              <button
                onClick={() => {
                  setActiveCategory('Other');
                  setShowCategorySelect(false);
                }}
                className={`w-full mt-1 flex items-center justify-center space-x-1 ${isMobile ? 'p-3' : 'p-2'} rounded ${isMobile ? 'text-sm' : 'text-xs'} ${
                  activeCategory === 'Other'
                    ? 'bg-blue-100 text-blue-700'
                    : 'bg-gray-100 hover:bg-gray-200'
                }`}
              >
                <HelpCircle className="w-4 h-4" />
                <span>Other</span>
              </button>
            </div>
          )}

          {/* Compact Input */}
          <div className={`${isMobile ? 'p-3' : 'p-3'} border-t bg-white`}>
            {/* File preview */}
            {selectedFile && (
              <div className={`mb-2 ${isMobile ? 'p-1.5' : 'p-2'} bg-gray-100 rounded-lg flex items-center justify-between`}>
                <div className="flex items-center space-x-2 min-w-0 flex-1">
                  <Paperclip className={`${isMobile ? 'w-3 h-3' : 'w-4 h-4'} text-gray-600 flex-shrink-0`} />
                  <div className="min-w-0 flex-1">
                    <span className={`${isMobile ? 'text-xs' : 'text-sm'} text-gray-700 truncate block`}>
                      {selectedFile.name}
                    </span>
                    <span className={`${isMobile ? 'text-xs' : 'text-xs'} text-gray-500`}>
                      {formatFileSize(selectedFile.size)}
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => {
                    setSelectedFile(null);
                    if (fileInputRef.current) fileInputRef.current.value = '';
                  }}
                  className={`text-red-500 hover:text-red-700 flex-shrink-0 ${isMobile ? 'ml-2' : 'ml-3'}`}
                >
                  <X className={`${isMobile ? 'w-3 h-3' : 'w-4 h-4'}`} />
                </button>
              </div>
            )}
            
            <div className="flex space-x-2 items-end">
              <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                placeholder="Type your message..."
                className="flex-1 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
              />
              
              {/* File upload button */}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*,.pdf,.doc,.docx,.txt"
                onChange={handleFileSelect}
                className="hidden"
              />
              <button
                onClick={() => fileInputRef.current?.click()}
                disabled={isLoading || isUploading}
                className="bg-gray-500 hover:bg-gray-600 text-white p-3 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                title="Attach file (Max 5MB: Images, PDFs, Documents)"
              >
                <Paperclip className="w-4 h-4" />
              </button>
              
              <button
                onClick={sendMessage}
                disabled={(!newMessage.trim() && !selectedFile) || isLoading || isUploading}
                className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-3 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center min-w-[52px] flex-shrink-0"
              >
                {(isLoading || isUploading) ? (
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  <Send className="w-4 h-4" />
                )}
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default ChatPopup;