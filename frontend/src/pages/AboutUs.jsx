import React, { useEffect } from 'react';
import { ArrowLeft, Trophy, Users, Shield, Star, Target, Award } from 'lucide-react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';

const AboutUs = () => {
  useEffect(() => {
    // Update meta tags for About Us page
    document.title = 'About MySeries11 - Skill Based Fantasy Cricket Platform | Company Info';
    
    // Update or create meta description
    let metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', 'Learn about MySeries11, India\'s premier skill-based fantasy cricket gaming platform. Discover our mission, values, and commitment to fair, transparent, and legal fantasy sports gaming.');
    } else {
      metaDescription = document.createElement('meta');
      metaDescription.name = 'description';
      metaDescription.content = 'Learn about MySeries11, India\'s premier skill-based fantasy cricket gaming platform. Discover our mission, values, and commitment to fair, transparent, and legal fantasy sports gaming.';
      document.head.appendChild(metaDescription);
    }

    // Update Open Graph tags
    let ogTitle = document.querySelector('meta[property="og:title"]');
    if (ogTitle) {
      ogTitle.setAttribute('content', 'About MySeries11 - Fantasy Cricket Platform');
    }

    let ogDescription = document.querySelector('meta[property="og:description"]');
    if (ogDescription) {
      ogDescription.setAttribute('content', 'Learn about India\'s most trusted skill-based fantasy cricket platform. Safe, fair, and legal gaming with real cash prizes.');
    }

    let ogUrl = document.querySelector('meta[property="og:url"]');
    if (ogUrl) {
      ogUrl.setAttribute('content', 'https://myseries11.in/about');
    }

    // Update canonical URL
    let canonical = document.querySelector('link[rel="canonical"]');
    if (canonical) {
      canonical.setAttribute('href', 'https://myseries11.in/about');
    }

    return () => {
      // Reset to default title when component unmounts
      document.title = 'MySeries11 - Skill Based Fantasy Cricket Gaming Platform | Play & Win Cash';
    };
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      {/* Header */}
      <div className="bg-gradient-to-r from-gray-900 via-slate-900 to-black py-6 px-6 lg:px-16 shadow-xl">
        <div className="flex items-center justify-between max-w-7xl mx-auto">
          <div className="flex items-center">
            <Link to="/" className="mr-4">
              <ArrowLeft className="w-6 h-6 text-white hover:text-yellow-300 transition-colors" />
            </Link>
            <div>
              <h1 className="text-2xl lg:text-3xl font-bold text-white tracking-wide">About MySeries11</h1>
              <p className="text-gray-300 text-sm lg:text-base mt-1">Your Skill-Based Gaming Platform</p>
            </div>
          </div>
          <div className="bg-white bg-opacity-20 p-3 rounded-lg">
            <Trophy className="w-8 h-8 lg:w-10 lg:h-10 text-yellow-300" />
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="px-4 lg:px-16 py-6">
        <div className="max-w-7xl mx-auto">
          {/* Welcome Section */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6 lg:p-8 mb-6">
            <div className="text-center mb-6">
              <div className="bg-yellow-100 p-4 rounded-full w-16 h-16 lg:w-20 lg:h-20 mx-auto mb-4">
                <Trophy className="w-8 h-8 lg:w-12 lg:h-12 text-yellow-600" />
              </div>
              <h2 className="text-xl lg:text-2xl font-bold text-gray-800 mb-2">Welcome to MySeries11</h2>
              <p className="text-gray-600 text-sm lg:text-base leading-relaxed max-w-3xl mx-auto">
                MySeries11.in is India's premier skill-based fantasy cricket gaming platform where strategy meets excitement.
              </p>
            </div>
          </div>

          {/* What We Offer */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6 lg:p-8 mb-6">
            <h2 className="text-lg lg:text-xl font-bold text-gray-800 mb-4 lg:mb-6">What We Offer</h2>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 lg:gap-6">
              <div className="flex items-start space-x-3 lg:block lg:text-center lg:space-x-0">
                <div className="bg-yellow-100 p-2 lg:p-4 rounded-lg mt-1 lg:mt-0 lg:mb-4 lg:w-16 lg:h-16 lg:mx-auto lg:flex lg:items-center lg:justify-center">
                  <Target className="w-5 h-5 lg:w-8 lg:h-8 text-yellow-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-800 text-sm lg:text-base lg:mb-2">Fantasy Cricket</h3>
                  <p className="text-gray-600 text-sm lg:text-sm">Create your dream team and compete against players nationwide</p>
                </div>
              </div>

              <div className="flex items-start space-x-3 lg:block lg:text-center lg:space-x-0">
                <div className="bg-yellow-100 p-2 lg:p-4 rounded-lg mt-1 lg:mt-0 lg:mb-4 lg:w-16 lg:h-16 lg:mx-auto lg:flex lg:items-center lg:justify-center">
                  <Users className="w-5 h-5 lg:w-8 lg:h-8 text-yellow-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-800 text-sm lg:text-base lg:mb-2">Skill-Based Gaming</h3>
                  <p className="text-gray-600 text-sm lg:text-sm">Pure skill-based contests with fair play and transparency</p>
                </div>
              </div>

              <div className="flex items-start space-x-3 lg:block lg:text-center lg:space-x-0">
                <div className="bg-yellow-100 p-2 lg:p-4 rounded-lg mt-1 lg:mt-0 lg:mb-4 lg:w-16 lg:h-16 lg:mx-auto lg:flex lg:items-center lg:justify-center">
                  <Award className="w-5 h-5 lg:w-8 lg:h-8 text-yellow-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-800 text-sm lg:text-base lg:mb-2">Real Rewards</h3>
                  <p className="text-gray-600 text-sm lg:text-sm">Win exciting cash prizes and rewards based on your skills</p>
                </div>
              </div>
            </div>
          </div>

          {/* Our Mission */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6 lg:p-8 mb-6">
            <h2 className="text-lg lg:text-xl font-bold text-gray-800 mb-4 lg:mb-6">Our Mission</h2>
            <p className="text-gray-600 text-sm lg:text-base leading-relaxed mb-4 lg:mb-6 max-w-4xl">
              At MySeries11, we believe in creating a fair and exciting platform where cricket knowledge and strategic thinking are rewarded. Our mission is to provide:
            </p>
            <ul className="grid grid-cols-1 lg:grid-cols-2 gap-2 lg:gap-4 text-sm lg:text-base text-gray-600">
              <li className="flex items-center">
                <Star className="w-4 h-4 lg:w-5 lg:h-5 text-yellow-500 mr-2 lg:mr-3 flex-shrink-0" />
                100% skill-based fantasy cricket gaming
              </li>
              <li className="flex items-center">
                <Star className="w-4 h-4 lg:w-5 lg:h-5 text-yellow-500 mr-2 lg:mr-3 flex-shrink-0" />
                Secure and transparent gaming environment
              </li>
              <li className="flex items-center">
                <Star className="w-4 h-4 lg:w-5 lg:h-5 text-yellow-500 mr-2 lg:mr-3 flex-shrink-0" />
                Instant withdrawals and reliable support
              </li>
              <li className="flex items-center">
                <Star className="w-4 h-4 lg:w-5 lg:h-5 text-yellow-500 mr-2 lg:mr-3 flex-shrink-0" />
                Legal compliance with all gaming regulations
              </li>
            </ul>
          </div>

          {/* Why Choose Us */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6 lg:p-8 mb-6">
          <h2 className="text-lg lg:text-xl font-bold text-gray-800 mb-4 lg:mb-6">Why Choose MySeries11?</h2>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
            <div className="text-center">
              <div className="bg-yellow-100 p-3 lg:p-4 rounded-lg mb-2 lg:mb-4 lg:w-16 lg:h-16 lg:mx-auto lg:flex lg:items-center lg:justify-center">
                <Shield className="w-6 h-6 lg:w-8 lg:h-8 text-yellow-600 mx-auto" />
              </div>
              <h3 className="font-semibold text-gray-800 text-sm lg:text-base mb-1 lg:mb-2">Safe & Secure</h3>
              <p className="text-gray-600 text-xs lg:text-sm">Your data and money are completely protected</p>
            </div>

            <div className="text-center">
              <div className="bg-yellow-100 p-3 lg:p-4 rounded-lg mb-2 lg:mb-4 lg:w-16 lg:h-16 lg:mx-auto lg:flex lg:items-center lg:justify-center">
                <Trophy className="w-6 h-6 lg:w-8 lg:h-8 text-yellow-600 mx-auto" />
              </div>
              <h3 className="font-semibold text-gray-800 text-sm lg:text-base mb-1 lg:mb-2">Fair Play</h3>
              <p className="text-gray-600 text-xs lg:text-sm">Transparent algorithms and equal opportunities</p>
            </div>

            <div className="text-center">
              <div className="bg-yellow-100 p-3 lg:p-4 rounded-lg mb-2 lg:mb-4 lg:w-16 lg:h-16 lg:mx-auto lg:flex lg:items-center lg:justify-center">
                <Users className="w-6 h-6 lg:w-8 lg:h-8 text-yellow-600 mx-auto" />
              </div>
              <h3 className="font-semibold text-gray-800 text-sm lg:text-base mb-1 lg:mb-2">Active Community</h3>
              <p className="text-gray-600 text-xs lg:text-sm">Join thousands of cricket enthusiasts</p>
            </div>

            <div className="text-center">
              <div className="bg-yellow-100 p-3 lg:p-4 rounded-lg mb-2 lg:mb-4 lg:w-16 lg:h-16 lg:mx-auto lg:flex lg:items-center lg:justify-center">
                <Award className="w-6 h-6 lg:w-8 lg:h-8 text-yellow-600 mx-auto" />
              </div>
              <h3 className="font-semibold text-gray-800 text-sm lg:text-base mb-1 lg:mb-2">Quick Payouts</h3>
              <p className="text-gray-600 text-xs lg:text-sm">Fast and hassle-free withdrawals</p>
            </div>
          </div>
          </div>

          {/* Legal Disclaimer */}
          <div className="bg-gray-50 rounded-lg p-4 lg:p-6 mb-6 border border-gray-200">
          <h3 className="font-semibold text-gray-900 text-sm lg:text-base mb-2 lg:mb-3">Important Note</h3>
          <p className="text-gray-600 text-xs lg:text-sm leading-relaxed">
            MySeries11 operates as a skill-based gaming platform in compliance with applicable laws. Fantasy sports are games of skill and are legal in most Indian states. Please play responsibly and within your limits.
          </p>
          </div>

          {/* Call to Action */}
          <div className="text-center">
            <Link
              to="/"
              className="inline-flex items-center bg-gradient-to-r from-gray-900 via-slate-900 to-black text-white px-6 lg:px-8 py-3 lg:py-4 rounded-lg font-semibold hover:from-gray-800 hover:via-slate-800 hover:to-gray-900 transition-all duration-200 shadow-lg text-sm lg:text-base"
            >
              <Trophy className="w-5 h-5 lg:w-6 lg:h-6 mr-2 text-yellow-300" />
              Start Playing Now
            </Link>
            <p className="text-gray-500 text-xs lg:text-sm mt-2 lg:mt-3">Join MySeries11 and showcase your cricket skills!</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutUs;