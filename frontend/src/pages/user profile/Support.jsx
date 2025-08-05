import React, { useState } from 'react';
import { Phone, Mail, MessageCircle, Clock, Headphones, CreditCard, Banknote, FileCheck, Gamepad2, HelpCircle, Send, X } from 'lucide-react';
import { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppContext } from '../../context/AppContext';
import ChatPopup from '../../components/ChatPopup';
import FloatingChatButton from '../../components/FloatingChatButton';

const Support = () => {
  const navigate = useNavigate();
  const [activeCategory, setActiveCategory] = useState('Deposit Related');
  const [showChatFromButton, setShowChatFromButton] = useState(false);
  const [hasActiveChat, setHasActiveChat] = useState(false);
  const { BACKEND_URL } = useContext(AppContext);

  const categories = [
    { id: 'Deposit Related', label: 'Deposit Related', icon: <CreditCard className="w-4 h-4" /> },
    { id: 'Withdraw', label: 'Withdraw', icon: <Banknote className="w-4 h-4" /> },
    { id: 'KYC', label: 'KYC', icon: <FileCheck className="w-4 h-4" /> },
    { id: 'Game Related', label: 'Game Related', icon: <Gamepad2 className="w-4 h-4" /> },
    { id: 'Other', label: 'Other', icon: <HelpCircle className="w-4 h-4" /> }
  ];

  const supportInfo = {
    'Deposit Related': {
      description: 'Get help with adding money to your account, payment issues, bonus credits, and transaction failures.',
      commonIssues: [
        'Payment failed but money deducted',
        'Deposit not reflecting in account',
        'Payment gateway issues',
        'Bonus not credited',
        'Minimum deposit amount'
      ]
    },
    'Withdraw': {
      description: 'Need assistance with withdrawing your winnings, bank account verification, or withdrawal status.',
      commonIssues: [
        'Withdrawal request pending',
        'Bank account not verified',
        'Withdrawal amount limits',
        'Processing time queries',
        'Failed withdrawal attempts'
      ]
    },
    'KYC': {
      description: 'Help with document verification, KYC status, and account verification process.',
      commonIssues: [
        'Document rejection reasons',
        'KYC verification pending',
        'Document upload issues',
        'Identity verification failed',
        'Address proof problems'
      ]
    },
    'Game Related': {
      description: 'Questions about fantasy rules, scoring system, contest issues, and gameplay queries.',
      commonIssues: [
        'Points calculation queries',
        'Contest joining issues',
        'Team selection problems',
        'Match result disputes',
        'Fantasy rules clarification'
      ]
    },
    'Other': {
      description: 'General queries, account issues, app problems, or any other concerns not covered above.',
      commonIssues: [
        'Account login issues',
        'App crashes or bugs',
        'Profile update problems',
        'Referral code issues',
        'General feedback'
      ]
    }
  };


  const handleEmailNow = () => {
    window.location.href = 'mailto:support@winners11.com';
  };

  const handleChatNow = () => {
    navigate('/chat');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-gray-900 via-slate-900 to-black py-6 px-6 shadow-xl">
        <div className="flex items-center justify-center">
          <div className="text-center">
            <div className="flex items-center justify-center space-x-3 mb-2">
              <div className="bg-white bg-opacity-20 p-2 rounded-lg">
                <Headphones className="w-6 h-6 text-yellow-300" />
              </div>
              <h1 className="text-2xl font-bold text-white tracking-wide">Customer Support</h1>
            </div>
            <p className="text-gray-300">We're here to help you 24/7</p>
          </div>
        </div>
      </div>

      <div className="px-4 py-6 space-y-6">
        {/* Category Selection */}
        <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-800 mb-3">Select Support Category</h3>
          <div className="grid grid-cols-2 gap-2">
            {categories.slice(0, 4).map((category) => (
              <button
                key={category.id}
                onClick={() => setActiveCategory(category.id)}
                className={`flex items-center justify-center space-x-2 px-3 py-3 rounded-lg text-sm font-medium transition-all duration-200 ${
                  activeCategory === category.id
                    ? 'bg-yellow-100 text-yellow-700 border border-yellow-200'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {category.icon}
                <span>{category.label}</span>
              </button>
            ))}
          </div>
          {/* Other button taking full width */}
          <div className="mt-2">
            <button
              onClick={() => setActiveCategory('Other')}
              className={`w-full flex items-center justify-center space-x-2 px-3 py-3 rounded-lg text-sm font-medium transition-all duration-200 ${
                activeCategory === 'Other'
                  ? 'bg-yellow-100 text-yellow-700 border border-yellow-200'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              <HelpCircle className="w-4 h-4" />
              <span>Other</span>
            </button>
          </div>
        </div>

        {/* Contact Options */}
        <div className="space-y-4">
          {/* Chat Option */}
          <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-100">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-3 sm:space-y-0">
              <div className="flex items-center space-x-3">
                <div className="bg-green-100 p-2 rounded-lg flex-shrink-0">
                  <MessageCircle className="w-5 h-5 text-green-600" />
                </div>
                <div className="min-w-0 flex-1">
                  <h3 className="font-semibold text-gray-800 text-sm">Live Chat</h3>
                  <p className="text-xs text-gray-600">Get instant help from our support team</p>
                  <div className="flex items-center space-x-1 mt-1">
                    <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div>
                    <span className="text-xs text-green-600 font-medium">9 AM to 12 AM</span>
                  </div>
                </div>
              </div>
              <button
                onClick={handleChatNow}
                className="w-full sm:w-auto bg-yellow-500 hover:bg-yellow-600 text-black font-bold px-4 py-2 rounded-lg transition-all duration-200 shadow-lg text-sm"
              >
                Chat Now
              </button>
            </div>
          </div>


          {/* Email Option */}
          <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-100">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-3 sm:space-y-0">
              <div className="flex items-center space-x-3">
                <div className="bg-purple-100 p-2 rounded-lg flex-shrink-0">
                  <Mail className="w-5 h-5 text-purple-600" />
                </div>
                <div className="min-w-0 flex-1">
                  <h3 className="font-semibold text-gray-800 text-sm">Email Support</h3>
                  <p className="text-xs text-gray-600">support@winners11.com</p>
                  <div className="flex items-center space-x-1 mt-1">
                    <Clock className="w-3 h-3 text-gray-500" />
                    <span className="text-xs text-gray-500">Response within 24 hours</span>
                  </div>
                </div>
              </div>
              <button
                onClick={handleEmailNow}
                className="w-full sm:w-auto bg-yellow-500 hover:bg-yellow-600 text-black font-bold px-4 py-2 rounded-lg transition-all duration-200 shadow-lg text-sm"
              >
                Email Now
              </button>
            </div>
          </div>
        </div>

        {/* Support Hours */}
        <div className="bg-gradient-to-r from-yellow-50 to-yellow-100 border border-yellow-200 rounded-lg p-4">
          <h4 className="font-semibold text-yellow-800 mb-2">Support Hours</h4>
          <div className="space-y-1 text-sm text-yellow-700">
            <p>💬 Live Chat: 9 AM to 12 AM (Daily)</p>
            <p>📧 Email Support: Response within 24 hours</p>
          </div>
        </div>

        {/* FAQ Tip */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h4 className="font-semibold text-blue-800 mb-2">💡 Quick Tip</h4>
          <p className="text-sm text-blue-700">
            Before contacting support, try checking our FAQ section or Game Rules for quick answers to common questions.
          </p>
        </div>

        {/* Bottom padding for navigation */}
        <div className="h-20"></div>
      </div>

      {/* Chat from "Chat Now" button */}
      <ChatPopup 
        isOpen={showChatFromButton} 
        onClose={() => setShowChatFromButton(false)}
        onMessageSent={() => setHasActiveChat(true)}
      />
      
      {/* Floating Chat Button - only shows when user has sent a message and popup is closed */}
      {hasActiveChat && !showChatFromButton && <FloatingChatButton />}
    </div>
  );
};

export default Support;
