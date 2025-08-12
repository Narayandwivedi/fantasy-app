import React, { useState, useEffect, useContext } from 'react';
import { ArrowLeft, Phone, Mail, MessageCircle, Clock, HeadphonesIcon, Send, User, AlertCircle, CreditCard, Zap, Star, CheckCircle } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { AppContext } from '../context/AppContext';

const CustomerSupport = () => {
  const navigate = useNavigate();
  const { user } = useContext(AppContext);
  const [formData, setFormData] = useState({
    subject: '',
    message: '',
    priority: 'medium'
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission logic here
    alert('Your support ticket has been submitted! Our team will respond within 2-4 hours.');
    setFormData({ subject: '', message: '', priority: 'medium' });
  };

  const handleCall = (phoneNumber) => {
    window.location.href = `tel:+91${phoneNumber}`;
  };

  const handleEmail = () => {
    window.location.href = 'mailto:myseries11assist@gmail.com';
  };

  const handleChatNow = () => {
    navigate('/chat');
  };

  useEffect(() => {
    // Update meta tags for Customer Support page
    document.title = 'Customer Support - MySeries11 | Priority Help for Users';
    
    // Update meta description
    let metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', 'Get priority customer support for MySeries11 users. Live chat, priority tickets, account help, and instant assistance for fantasy cricket gaming.');
    }

    return () => {
      document.title = 'MySeries11 - Skill Based Fantasy Cricket Gaming Platform | Play & Win Cash';
    };
  }, []);

  // Quick action buttons with better icons and colors
  const quickActions = [
    {
      icon: <CreditCard className="w-6 h-6" />,
      title: "Payment Issues",
      description: "Deposits & withdrawals",
      bgColor: "bg-blue-500",
      bgLight: "bg-blue-50",
      textColor: "text-blue-600",
      action: () => setFormData({...formData, subject: 'payment'})
    },
    {
      icon: <User className="w-6 h-6" />,
      title: "Account Help",
      description: "Profile & verification",
      bgColor: "bg-purple-500",
      bgLight: "bg-purple-50",
      textColor: "text-purple-600",
      action: () => setFormData({...formData, subject: 'account'})
    },
    {
      icon: <AlertCircle className="w-6 h-6" />,
      title: "Contest Issues",
      description: "Teams & scoring",
      bgColor: "bg-orange-500",
      bgLight: "bg-orange-50",
      textColor: "text-orange-600",
      action: () => setFormData({...formData, subject: 'contest'})
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <Navbar />
      
      {/* Header */}
      <div className="bg-gradient-to-r from-gray-900 via-slate-900 to-black px-4 py-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <Link to="/" className="mr-3">
              <ArrowLeft className="w-6 h-6 text-white hover:text-yellow-300 transition-colors" />
            </Link>
            <div>
              <h1 className="text-xl font-bold text-white">Customer Support</h1>
              <p className="text-gray-300 text-sm">Hi {user?.fullName?.split(' ')[0]} 👋</p>
            </div>
          </div>
          <div className="bg-gradient-to-br from-yellow-400 to-yellow-500 p-3 rounded-xl shadow-lg">
            <HeadphonesIcon className="w-6 h-6 text-gray-900" />
          </div>
        </div>
      </div>

      <div className="px-4 py-6 space-y-6">

          {/* Live Chat Support - Redesigned */}
          <div className="bg-gradient-to-br from-green-400 via-green-500 to-green-600 rounded-2xl p-6 shadow-lg relative overflow-hidden">
            <div className="absolute top-0 right-0 w-20 h-20 bg-white bg-opacity-10 rounded-full -mr-10 -mt-10"></div>
            <div className="absolute bottom-0 left-0 w-16 h-16 bg-white bg-opacity-10 rounded-full -ml-8 -mb-8"></div>
            
            <div className="relative">
              <div className="flex items-center space-x-3 mb-4">
                <div className="bg-white bg-opacity-20 backdrop-blur-sm p-3 rounded-xl">
                  <MessageCircle className="w-7 h-7 text-white" />
                </div>
                <div>
                  <h3 className="font-bold text-xl text-white">Live Chat</h3>
                  <div className="flex items-center space-x-2 mt-1">
                    <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                    <span className="text-sm text-white opacity-90">Online now</span>
                  </div>
                </div>
              </div>
              
              <p className="text-white text-sm opacity-90 mb-6 leading-relaxed">
                Get instant help from our priority support team. Average response time: under 2 minutes
              </p>
              
              <button
                onClick={handleChatNow}
                className="w-full bg-white text-green-600 font-bold py-4 px-6 rounded-xl hover:bg-gray-50 transition-all duration-200 shadow-lg flex items-center justify-center space-x-2"
              >
                <MessageCircle className="w-5 h-5" />
                <span>Start Live Chat</span>
              </button>
            </div>
          </div>

          {/* Quick Actions - Redesigned */}
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <Zap className="w-5 h-5 text-yellow-500" />
              <h2 className="text-lg font-bold text-gray-800">Quick Actions</h2>
            </div>
            
            <div className="space-y-3">
              {quickActions.map((action, index) => (
                <button
                  key={index}
                  onClick={action.action}
                  className="w-full bg-white rounded-xl p-4 shadow-sm border border-gray-100 hover:shadow-md hover:scale-[1.02] transition-all duration-200 text-left"
                >
                  <div className="flex items-center space-x-4">
                    <div className={`${action.bgColor} p-3 rounded-xl shadow-sm`}>
                      <div className="text-white">
                        {action.icon}
                      </div>
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900 text-base">{action.title}</h3>
                      <p className="text-sm text-gray-500 mt-1">{action.description}</p>
                    </div>
                    <div className="text-gray-400">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Priority Support Form - Redesigned */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
            <div className="flex items-center space-x-3 mb-6">
              <div className="bg-gradient-to-br from-yellow-400 to-yellow-500 p-3 rounded-xl shadow-sm">
                <Send className="w-6 h-6 text-gray-900" />
              </div>
              <div>
                <h2 className="font-bold text-gray-900 text-lg">Priority Support</h2>
                <div className="flex items-center space-x-2 mt-1">
                  <Star className="w-4 h-4 text-yellow-500 fill-current" />
                  <p className="text-gray-600 text-sm">VIP response within 2-4 hours</p>
                </div>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3">Issue Type *</label>
                <select
                  name="subject"
                  value={formData.subject}
                  onChange={handleInputChange}
                  required
                  className="w-full bg-gray-50 border-2 border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 transition-all duration-200"
                >
                  <option value="">Select issue type</option>
                  <option value="account">Account Related</option>
                  <option value="payment">Payment & Withdrawal Issues</option>
                  <option value="technical">Technical Support</option>
                  <option value="contest">Contest Related</option>
                  <option value="verification">KYC & Verification</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3">Priority Level</label>
                <select
                  name="priority"
                  value={formData.priority}
                  onChange={handleInputChange}
                  className="w-full bg-gray-50 border-2 border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 transition-all duration-200"
                >
                  <option value="low">🟢 Low - General inquiry</option>
                  <option value="medium">🟡 Medium - Account issue</option>
                  <option value="high">🟠 High - Payment problem</option>
                  <option value="urgent">🔴 Urgent - Cannot access account</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3">Describe your issue *</label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleInputChange}
                  required
                  rows={4}
                  className="w-full bg-gray-50 border-2 border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 resize-none transition-all duration-200"
                  placeholder="Please provide as much detail as possible to help us resolve your issue quickly..."
                />
              </div>

              <button
                type="submit"
                className="w-full bg-gradient-to-r from-yellow-400 via-yellow-500 to-yellow-600 text-gray-900 py-4 rounded-xl font-bold hover:shadow-lg hover:scale-[1.02] transition-all duration-200 flex items-center justify-center space-x-2 text-base"
              >
                <Send className="w-5 h-5" />
                <span>Submit Priority Ticket</span>
              </button>
              </form>
            </div>

          {/* Emergency Contact - Redesigned */}
          <div className="bg-gradient-to-br from-red-50 to-red-100 border-2 border-red-200 rounded-2xl p-6">
            <div className="flex items-center space-x-3 mb-4">
              <div className="bg-red-500 p-3 rounded-xl shadow-sm">
                <AlertCircle className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="font-bold text-gray-900 text-base">Emergency Support</h3>
                <p className="text-red-600 text-sm font-medium">Urgent issues only</p>
              </div>
            </div>
            
            <button
              onClick={() => handleCall('6264682508')}
              className="w-full bg-red-500 hover:bg-red-600 text-white p-4 rounded-xl transition-all duration-200 hover:shadow-lg"
            >
              <div className="flex items-center justify-center space-x-3">
                <Phone className="w-5 h-5" />
                <div className="text-left">
                  <div className="font-bold">+91 6264682508</div>
                  <div className="text-sm opacity-90">Tap to call now</div>
                </div>
              </div>
            </button>
          </div>

          {/* Other Contact Options */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2 mb-4">
              <Phone className="w-5 h-5 text-gray-600" />
              <h3 className="font-bold text-gray-800 text-lg">Other Ways to Reach Us</h3>
            </div>

            {/* Regular Phone */}
            <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="bg-blue-500 p-2 rounded-lg">
                    <Phone className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900">+91 9202469725</div>
                    <div className="text-sm text-gray-500">General Support</div>
                  </div>
                </div>
                <button
                  onClick={() => handleCall('9202469725')}
                  className="bg-blue-500 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-blue-600 transition-colors"
                >
                  Call
                </button>
              </div>
            </div>

            {/* Email */}
            <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="bg-purple-500 p-2 rounded-lg">
                    <Mail className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900">Email Support</div>
                    <div className="text-sm text-gray-500">myseries11assist@gmail.com</div>
                  </div>
                </div>
                <button
                  onClick={handleEmail}
                  className="bg-purple-500 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-purple-600 transition-colors"
                >
                  Email
                </button>
              </div>
            </div>
          </div>

          {/* Support Hours */}
          <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl p-6 border border-gray-200">
            <div className="flex items-center space-x-3 mb-4">
              <div className="bg-gray-600 p-3 rounded-xl">
                <Clock className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="font-bold text-gray-900 text-base">Support Hours</h3>
                <p className="text-gray-600 text-sm">We're here to help</p>
              </div>
            </div>
            
            <div className="space-y-3">
              <div className="flex items-center justify-between bg-white rounded-xl p-3">
                <div className="flex items-center space-x-3">
                  <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                  <span className="text-gray-700 font-medium">Live Chat</span>
                </div>
                <span className="text-green-600 font-semibold">9 AM - 12 AM</span>
              </div>
              
              <div className="flex items-center justify-between bg-white rounded-xl p-3">
                <div className="flex items-center space-x-3">
                  <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                  <span className="text-gray-700 font-medium">Phone Support</span>
                </div>
                <span className="text-blue-600 font-semibold">9 AM - 8 PM</span>
              </div>
              
              <div className="flex items-center justify-between bg-white rounded-xl p-3">
                <div className="flex items-center space-x-3">
                  <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                  <span className="text-gray-700 font-medium">Email Support</span>
                </div>
                <span className="text-purple-600 font-semibold">24/7</span>
              </div>
            </div>
          </div>

      </div>
    </div>
  );
};

export default CustomerSupport;