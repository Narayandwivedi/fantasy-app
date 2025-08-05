import React, { useState, useEffect, useContext } from 'react';
import { MessageCircle, User, Clock, Eye, EyeOff, Send, Filter, Search } from 'lucide-react';
import { AppContext } from '../context/AppContext';

const ChatSupport = () => {
  const { BACKEND_URL } = useContext(AppContext);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [reply, setReply] = useState('');
  const [isReplying, setIsReplying] = useState(false);
  const [filters, setFilters] = useState({
    category: '',
    isRead: '',
    search: ''
  });
  const [unreadCount, setUnreadCount] = useState(0);

  const categories = ['Deposit Related', 'Withdraw', 'KYC', 'Game Related', 'Other'];

  const fetchMessages = async () => {
    try {
      const queryParams = new URLSearchParams();
      if (filters.category) queryParams.append('category', filters.category);
      if (filters.isRead !== '') queryParams.append('isRead', filters.isRead);
      
      const response = await fetch(`${BACKEND_URL}/api/chat/messages?${queryParams}`, {
        credentials: 'include'
      });

      const data = await response.json();
      if (response.ok) {
        setMessages(data.messages);
        setUnreadCount(data.unreadCount);
      }
    } catch (error) {
      console.error('Error fetching messages:', error);
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (messageId) => {
    try {
      const response = await fetch(`${BACKEND_URL}/api/chat/mark-read/${messageId}`, {
        method: 'PATCH',
        credentials: 'include'
      });

      if (response.ok) {
        setMessages(messages.map(msg => 
          msg._id === messageId ? { ...msg, isRead: true } : msg
        ));
        setUnreadCount(prev => Math.max(0, prev - 1));
      }
    } catch (error) {
      console.error('Error marking message as read:', error);
    }
  };

  const sendReply = async (messageId) => {
    if (!reply.trim()) return;
    
    setIsReplying(true);
    try {
      const response = await fetch(`${BACKEND_URL}/api/chat/reply/${messageId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify({ adminReply: reply })
      });

      if (response.ok) {
        const data = await response.json();
        setMessages(messages.map(msg => 
          msg._id === messageId ? data.data : msg
        ));
        setReply('');
        setSelectedMessage(data.data);
        
        // Auto-scroll to bottom after sending reply
        setTimeout(() => {
          const messagesEnd = document.getElementById('messages-end');
          if (messagesEnd) {
            messagesEnd.scrollIntoView({ behavior: 'smooth' });
          }
        }, 100);
      }
    } catch (error) {
      console.error('Error sending reply:', error);
      alert('Failed to send reply');
    } finally {
      setIsReplying(false);
    }
  };

  // Group messages by user
  const groupedMessages = messages.reduce((groups, message) => {
    const userId = message.userId?._id;
    if (!userId) return groups;
    
    if (!groups[userId]) {
      groups[userId] = {
        user: message.userId,
        messages: [],
        lastMessageTime: message.createdAt,
        hasUnread: false
      };
    }
    
    groups[userId].messages.push(message);
    if (!message.isRead) {
      groups[userId].hasUnread = true;
    }
    
    // Update last message time
    if (new Date(message.createdAt) > new Date(groups[userId].lastMessageTime)) {
      groups[userId].lastMessageTime = message.createdAt;
    }
    
    return groups;
  }, {});

  // Convert to array and sort by last message time
  const userConversations = Object.values(groupedMessages).sort((a, b) => 
    new Date(b.lastMessageTime) - new Date(a.lastMessageTime)
  );

  // Filter conversations based on search
  const filteredConversations = userConversations.filter(conversation => {
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      return conversation.user?.name?.toLowerCase().includes(searchLower) ||
             conversation.user?.email?.toLowerCase().includes(searchLower) ||
             conversation.messages.some(msg => 
               msg.message.toLowerCase().includes(searchLower)
             );
    }
    return true;
  });

  useEffect(() => {
    fetchMessages();
  }, [filters.category, filters.isRead]);

  // Real-time polling every 2 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      fetchMessages();
    }, 2000);

    return () => clearInterval(interval);
  }, [filters.category, filters.isRead]);

  const formatDate = (date) => {
    return new Date(date).toLocaleString();
  };

  const formatShortDate = (date) => {
    const d = new Date(date);
    const day = d.getDate().toString().padStart(2, '0');
    const month = (d.getMonth() + 1).toString().padStart(2, '0');
    const year = d.getFullYear();
    return `${day}/${month}/${year}`;
  };

  const formatTime = (date) => {
    const d = new Date(date);
    const hours = d.getHours().toString().padStart(2, '0');
    const minutes = d.getMinutes().toString().padStart(2, '0');
    return `${hours}:${minutes}`;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
        <div className="text-center">
          <div className="relative">
            <div className="animate-spin rounded-full h-20 w-20 border-4 border-gray-200 mx-auto"></div>
            <div className="animate-spin rounded-full h-20 w-20 border-4 border-indigo-500 border-t-transparent absolute top-0 left-1/2 transform -translate-x-1/2"></div>
          </div>
          <div className="mt-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-2">Loading Chat Support</h2>
            <p className="text-gray-500">Fetching conversations...</p>
            <div className="flex justify-center space-x-1 mt-4">
              <div className="w-2 h-2 bg-indigo-500 rounded-full animate-pulse"></div>
              <div className="w-2 h-2 bg-indigo-500 rounded-full animate-pulse" style={{animationDelay: '0.2s'}}></div>
              <div className="w-2 h-2 bg-indigo-500 rounded-full animate-pulse" style={{animationDelay: '0.4s'}}></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <div className="p-6 max-w-7xl mx-auto">

        {/* Enhanced Filters */}
        <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6 mb-6 backdrop-blur-sm">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Category</label>
              <select
                value={filters.category}
                onChange={(e) => setFilters({...filters, category: e.target.value})}
                className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 bg-gray-50 hover:bg-white"
              >
                <option value="">All Categories</option>
                {categories.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Status</label>
              <select
                value={filters.isRead}
                onChange={(e) => setFilters({...filters, isRead: e.target.value})}
                className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 bg-gray-50 hover:bg-white"
              >
                <option value="">All Messages</option>
                <option value="false">Unread</option>
                <option value="true">Read</option>
              </select>
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-semibold text-gray-700 mb-2">Search</label>
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search messages, user name, or email..."
                  value={filters.search}
                  onChange={(e) => setFilters({...filters, search: e.target.value})}
                  className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 bg-gray-50 hover:bg-white"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Enhanced User Conversations List */}
          <div className="lg:col-span-4 bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden flex flex-col" style={{ height: 'calc(100vh - 200px)' }}>
            <div className="bg-gradient-to-r from-indigo-500 to-purple-600 p-4 flex-shrink-0">
              <h2 className="text-xl font-bold text-white flex items-center">
                <User className="w-6 h-6 mr-2" />
                Conversations ({filteredConversations.length})
              </h2>
              <p className="text-indigo-100 text-sm mt-1">Click on a conversation to view details</p>
            </div>
          <div className="flex-1 overflow-y-auto">
            {filteredConversations.length === 0 ? (
              <div className="p-8 text-center">
                <div className="bg-gradient-to-r from-gray-100 to-gray-200 p-6 rounded-full w-20 h-20 mx-auto mb-4">
                  <MessageCircle className="w-8 h-8 mx-auto mt-2 text-gray-400" />
                </div>
                <h4 className="font-semibold text-gray-700 mb-2">No Conversations</h4>
                <p className="text-sm text-gray-500 max-w-xs mx-auto leading-relaxed">
                  No conversations match your current filters. Try adjusting your search criteria.
                </p>
                <div className="mt-4 inline-flex items-center px-3 py-1 rounded-full bg-blue-50 text-blue-600 text-xs font-medium">
                  <div className="w-2 h-2 bg-blue-400 rounded-full mr-2 animate-pulse"></div>
                  Waiting for messages
                </div>
              </div>
            ) : (
              filteredConversations.map((conversation) => {
                const lastMessage = conversation.messages[conversation.messages.length - 1];
                const isSelected = selectedMessage && conversation.messages.some(msg => msg._id === selectedMessage._id);
                
                return (
                  <div
                    key={conversation.user._id}
                    onClick={() => {
                      setSelectedMessage(lastMessage);
                      // Mark all unread messages as read
                      conversation.messages.forEach(msg => {
                        if (!msg.isRead) markAsRead(msg._id);
                      });
                      // Auto-scroll to bottom when conversation is selected
                      setTimeout(() => {
                        const messagesEnd = document.getElementById('messages-end');
                        if (messagesEnd) {
                          messagesEnd.scrollIntoView({ behavior: 'smooth' });
                        }
                      }, 200);
                    }}
                    className={`p-3 border-b cursor-pointer transition-all duration-200 hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 ${
                      conversation.hasUnread ? 'bg-gradient-to-r from-blue-50 to-indigo-50 border-l-4 border-l-blue-500' : ''
                    } ${isSelected ? 'bg-gradient-to-r from-indigo-100 to-purple-100 border-l-4 border-l-indigo-500' : ''}`}
                  >
                    <div className="flex items-center space-x-3">
                      <div className="flex-shrink-0">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                          conversation.hasUnread 
                            ? 'bg-gradient-to-r from-blue-500 to-indigo-600 shadow-lg' 
                            : 'bg-gradient-to-r from-gray-400 to-gray-500'
                        }`}>
                          <User className="w-5 h-5 text-white" />
                        </div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <div className="flex-1 min-w-0 pr-2">
                            <p className="text-sm font-medium text-gray-900 truncate">
                              {conversation.user?.name || 'Unknown User'}
                            </p>
                            <p className="text-xs text-gray-500">{conversation.user?.email}</p>
                          </div>
                          <div className="flex items-center space-x-2 flex-shrink-0">
                            <p className="text-xs text-gray-400">{formatShortDate(conversation.lastMessageTime)}</p>
                            {conversation.hasUnread && (
                              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Enhanced Message Detail */}
        <div className="lg:col-span-8 bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden flex flex-col" style={{ height: 'calc(100vh - 200px)' }}>
          {selectedMessage ? (
            <div className="h-full flex flex-col">
              {/* Enhanced Messages Area */}
              <div className="flex-1 p-6 overflow-y-auto bg-gradient-to-b from-gray-50 to-white" id="admin-chat-messages">
                <div className="space-y-6">
                  {/* Show all messages from this user */}
                  {filteredConversations
                    .find(conv => conv.user._id === selectedMessage.userId._id)
                    ?.messages.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt))
                    .map((message, index) => (
                      <div key={message._id} className="space-y-4">
                        {/* User Message */}
                        <div className="flex justify-end">
                          <div className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-2xl p-4 max-w-sm shadow-lg">
                            <div className="flex items-center justify-between mb-2">
                              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-white bg-opacity-20 text-blue-100">
                                {message.category}
                              </span>
                              <span className="text-xs text-blue-100">{formatDate(message.createdAt)}</span>
                            </div>
                            <p className="text-sm leading-relaxed">{message.message}</p>
                            
                            {/* Show attachment if exists */}
                            {message.attachment && (
                              <div className="mt-2">
                                {message.attachmentType === 'image' ? (
                                  <div className="space-y-2">
                                    <img 
                                      src={`${BACKEND_URL}${message.attachment}`}
                                      alt="User attachment"
                                      className="max-w-full h-auto rounded-lg cursor-pointer border border-blue-200"
                                      onClick={() => window.open(`${BACKEND_URL}${message.attachment}`, '_blank')}
                                      style={{ maxHeight: '200px', maxWidth: '300px' }}
                                    />
                                    <p className="text-xs text-blue-200">Click to view full size</p>
                                  </div>
                                ) : (
                                  <a 
                                    href={`${BACKEND_URL}${message.attachment}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center space-x-2 text-blue-200 hover:text-white underline bg-blue-600 bg-opacity-30 p-2 rounded"
                                  >
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
                                    </svg>
                                    <span className="text-sm">View Attachment</span>
                                  </a>
                                )}
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Admin Reply */}
                        {message.adminReply && (
                          <div className="flex justify-start">
                            <div className="bg-gradient-to-r from-emerald-500 to-teal-600 text-white rounded-2xl p-4 max-w-sm shadow-lg">
                              <div className="flex items-center justify-between mb-2">
                                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-white bg-opacity-20 text-emerald-100">
                                  <div className="w-2 h-2 bg-emerald-200 rounded-full mr-1"></div>
                                  Admin Reply
                                </span>
                                <span className="text-xs text-emerald-100">{formatDate(message.adminRepliedAt)}</span>
                              </div>
                              <p className="text-sm leading-relaxed">{message.adminReply}</p>
                            </div>
                          </div>
                        )}
                      </div>
                    ))
                  }
                  {/* Auto-scroll anchor */}
                  <div id="messages-end"></div>
                </div>
              </div>

              {/* Enhanced Reply Interface */}
              <div className="p-3 bg-white border-t border-gray-200 flex-shrink-0">
                <div className="flex items-center space-x-2">
                  <input
                    type="text"
                    value={reply}
                    onChange={(e) => setReply(e.target.value)}
                    onKeyPress={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        // Get the latest message from this user for reply
                        const userMessages = filteredConversations
                          .find(conv => conv.user._id === selectedMessage.userId._id)
                          ?.messages.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
                        const latestMessage = userMessages?.[0];
                        if (latestMessage && reply.trim()) {
                          sendReply(latestMessage._id);
                        }
                      }
                    }}
                    placeholder="Message..."
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-full focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-gray-50 text-sm placeholder-gray-500"
                  />
                  <button
                    onClick={() => {
                      // Get the latest message from this user for reply
                      const userMessages = filteredConversations
                        .find(conv => conv.user._id === selectedMessage.userId._id)
                        ?.messages.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
                      const latestMessage = userMessages?.[0];
                      if (latestMessage) {
                        sendReply(latestMessage._id);
                      }
                    }}
                    disabled={!reply.trim() || isReplying}
                    className="bg-blue-500 hover:bg-blue-600 text-white p-2 rounded-full disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    {isReplying ? (
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    ) : (
                      <Send className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="h-full flex items-center justify-center bg-gradient-to-br from-slate-50 to-indigo-50">
              <div className="text-center p-8">
                <div className="bg-gradient-to-r from-indigo-500 to-purple-600 p-6 rounded-full w-24 h-24 mx-auto mb-6 shadow-lg">
                  <MessageCircle className="w-12 h-12 text-white mx-auto mt-1" />
                </div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">Select a Conversation</h3>
                <p className="text-gray-500 max-w-sm mx-auto leading-relaxed">
                  Choose a conversation from the left panel to view messages and send replies to your users.
                </p>
                <div className="mt-6 flex justify-center space-x-2">
                  <div className="w-2 h-2 bg-indigo-300 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-purple-300 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                  <div className="w-2 h-2 bg-pink-300 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  </div>
  );
};

export default ChatSupport;