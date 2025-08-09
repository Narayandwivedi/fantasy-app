import React, { useState, useEffect } from 'react';
import { ArrowLeft, Phone, Mail, MessageCircle, Clock, HeadphonesIcon, Send } from 'lucide-react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';

const ContactUs = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
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
    alert('Thank you for contacting us! We will get back to you soon.');
    setFormData({ name: '', email: '', subject: '', message: '' });
  };

  const handleCall = (phoneNumber) => {
    window.location.href = `tel:+91${phoneNumber}`;
  };

  const handleEmail = () => {
    window.location.href = 'mailto:winners11assist@gmail.com';
  };

  useEffect(() => {
    // Update meta tags for Contact Us page
    document.title = 'Contact Winners11 - Customer Support | Phone +91-6264682508 | Email Support';
    
    // Update meta description
    let metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', 'Contact Winners11 customer support. Call +91-6264682508 or +91-9202469725, email winners11assist@gmail.com. Get help with fantasy cricket gaming, account issues, and withdrawals.');
    }

    // Update Open Graph tags
    let ogTitle = document.querySelector('meta[property="og:title"]');
    if (ogTitle) {
      ogTitle.setAttribute('content', 'Contact Winners11 - Customer Support & Help');
    }

    let ogDescription = document.querySelector('meta[property="og:description"]');
    if (ogDescription) {
      ogDescription.setAttribute('content', 'Get support for Winners11 fantasy cricket platform. Multiple contact options available including phone, email, and contact form.');
    }

    let ogUrl = document.querySelector('meta[property="og:url"]');
    if (ogUrl) {
      ogUrl.setAttribute('content', 'https://winners11.in/contact');
    }

    // Update canonical URL
    let canonical = document.querySelector('link[rel="canonical"]');
    if (canonical) {
      canonical.setAttribute('href', 'https://winners11.in/contact');
    }

    return () => {
      document.title = 'Winners11 - Skill Based Fantasy Cricket Gaming Platform | Play & Win Cash';
    };
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      {/* Header */}
      <div className="bg-gradient-to-r from-gray-900 via-slate-900 to-black py-6 px-6 shadow-xl">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <Link to="/" className="mr-4">
              <ArrowLeft className="w-6 h-6 text-white hover:text-yellow-300 transition-colors" />
            </Link>
            <div>
              <h1 className="text-2xl font-bold text-white tracking-wide">Contact Us</h1>
              <p className="text-gray-300 text-sm mt-1">We're here to help you</p>
            </div>
          </div>
          <div className="bg-white bg-opacity-20 p-3 rounded-lg">
            <HeadphonesIcon className="w-8 h-8 text-yellow-300" />
          </div>
        </div>
      </div>

      {/* Quick Contact Options */}
      <div className="px-4 py-6">
        <div className="grid grid-cols-1 gap-4 mb-6">
          {/* Phone Support */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center">
                <div className="bg-yellow-100 p-2 rounded-lg mr-3">
                  <Phone className="w-5 h-5 text-yellow-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-800 text-sm">Phone Support</h3>
                  <p className="text-gray-600 text-xs">Call us for immediate assistance</p>
                </div>
              </div>
            </div>
            
            <div className="space-y-2">
              <button
                onClick={() => handleCall('6264682508')}
                className="w-full bg-yellow-50 border border-yellow-200 rounded-lg p-3 text-left hover:bg-yellow-100 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <span className="font-medium text-gray-800">+91 6264682508</span>
                  <Phone className="w-4 h-4 text-yellow-600" />
                </div>
                <p className="text-yellow-600 text-xs mt-1">Primary Support Line</p>
              </button>
              
              <button
                onClick={() => handleCall('9202469725')}
                className="w-full bg-yellow-50 border border-yellow-200 rounded-lg p-3 text-left hover:bg-yellow-100 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <span className="font-medium text-gray-800">+91 9202469725</span>
                  <Phone className="w-4 h-4 text-yellow-600" />
                </div>
                <p className="text-yellow-600 text-xs mt-1">Alternative Support Line</p>
              </button>
            </div>
          </div>

          {/* Email Support */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center flex-1">
                <div className="bg-yellow-100 p-2 rounded-lg mr-3">
                  <Mail className="w-5 h-5 text-yellow-600" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-800 text-sm">Email Support</h3>
                  <p className="text-gray-600 text-xs">Send us a detailed message</p>
                </div>
              </div>
              <button
                onClick={handleEmail}
                className="bg-yellow-500 text-black px-4 py-2 rounded-lg text-xs hover:bg-yellow-600 font-semibold transition-colors"
              >
                Email Us
              </button>
            </div>
            <div className="mt-3 p-3 bg-yellow-50 rounded-lg">
              <p className="text-gray-800 font-medium text-sm">winners11assist@gmail.com</p>
            </div>
          </div>

          {/* Business Hours */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-4">
            <div className="flex items-start">
              <div className="bg-yellow-100 p-2 rounded-lg mr-3">
                <Clock className="w-5 h-5 text-yellow-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-800 text-sm mb-2">Support Hours</h3>
                <div className="space-y-1 text-xs text-gray-600">
                  <div className="flex justify-between">
                    <span>Monday - Friday:</span>
                    <span className="font-medium">9:00 AM - 8:00 PM</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Saturday:</span>
                    <span className="font-medium">10:00 AM - 6:00 PM</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Sunday:</span>
                    <span className="font-medium">10:00 AM - 4:00 PM</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Contact Form */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-4 mb-6">
          <div className="flex items-center mb-4">
            <div className="bg-yellow-100 p-2 rounded-lg mr-3">
              <MessageCircle className="w-5 h-5 text-yellow-600" />
            </div>
            <div>
              <h2 className="font-semibold text-gray-800">Send us a Message</h2>
              <p className="text-gray-600 text-xs">Fill out the form below and we'll respond within 24 hours</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Full Name *</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                required
                className="w-full bg-gray-50 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                placeholder="Enter your full name"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email Address *</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                required
                className="w-full bg-gray-50 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                placeholder="Enter your email address"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Subject *</label>
              <select
                name="subject"
                value={formData.subject}
                onChange={handleInputChange}
                required
                className="w-full bg-gray-50 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              >
                <option value="">Select a subject</option>
                <option value="account">Account Related</option>
                <option value="payment">Payment Issues</option>
                <option value="technical">Technical Support</option>
                <option value="contest">Contest Related</option>
                <option value="withdrawal">Withdrawal Issues</option>
                <option value="feedback">Feedback & Suggestions</option>
                <option value="other">Other</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Message *</label>
              <textarea
                name="message"
                value={formData.message}
                onChange={handleInputChange}
                required
                rows={4}
                className="w-full bg-gray-50 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
                placeholder="Describe your issue or query in detail..."
              />
            </div>

            <button
              type="submit"
              className="w-full bg-gradient-to-r from-gray-900 via-slate-900 to-black text-white py-3 rounded-lg font-semibold hover:from-gray-800 hover:via-slate-800 hover:to-gray-900 transition-all duration-200 flex items-center justify-center"
            >
              <Send className="w-4 h-4 mr-2 text-yellow-300" />
              Send Message
            </button>
          </form>
        </div>

        {/* FAQ Link */}
        <div className="bg-yellow-50 rounded-lg p-4 border border-yellow-200">
          <div className="flex items-center">
            <div className="bg-yellow-100 p-2 rounded-lg mr-3">
              <HeadphonesIcon className="w-5 h-5 text-yellow-600" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-gray-800 text-sm">Need Quick Help?</h3>
              <p className="text-gray-600 text-xs">Check out our Game Rules and FAQ section for instant answers</p>
            </div>
            <Link
              to="/game-rules"
              className="bg-yellow-500 text-black px-3 py-1 rounded-lg text-xs hover:bg-yellow-600 font-semibold transition-colors"
            >
              View FAQ
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactUs;