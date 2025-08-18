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
          <div className="bg-gradient-to-br from-gray-900 via-black to-gray-800 rounded-2xl p-6 shadow-lg relative overflow-hidden">
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
                className="w-full bg-white text-black font-bold py-4 px-6 rounded-xl hover:bg-gray-50 transition-all duration-200 shadow-lg flex items-center justify-center space-x-2"
              >
                <MessageCircle className="w-5 h-5" />
                <span>Start Live Chat</span>
              </button>
            </div>
          </div>




          {/* Other Contact Options */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2 mb-4">
              <Phone className="w-5 h-5 text-gray-600" />
              <h3 className="font-bold text-gray-800 text-lg">Other Ways to Reach Us</h3>
            </div>

            {/* Phone Numbers */}
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

            <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="bg-green-500 p-2 rounded-lg">
                    <Phone className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900">+91 6264682508</div>
                    <div className="text-sm text-gray-500">Priority Support</div>
                  </div>
                </div>
                <button
                  onClick={() => handleCall('6264682508')}
                  className="bg-green-500 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-green-600 transition-colors"
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
                    <div className="text-xs text-gray-500">myseries11assist@gmail.com</div>
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