import React, { useEffect } from 'react';
import { ArrowLeft, Trophy, Users, Shield, Star, Target, Award } from 'lucide-react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';

const AboutUs = () => {
  useEffect(() => {
    // Update meta tags for About Us page
    document.title = 'About Winners11 - Skill Based Fantasy Cricket Platform | Company Info';
    
    // Update or create meta description
    let metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', 'Learn about Winners11, India\'s premier skill-based fantasy cricket gaming platform. Discover our mission, values, and commitment to fair, transparent, and legal fantasy sports gaming.');
    } else {
      metaDescription = document.createElement('meta');
      metaDescription.name = 'description';
      metaDescription.content = 'Learn about Winners11, India\'s premier skill-based fantasy cricket gaming platform. Discover our mission, values, and commitment to fair, transparent, and legal fantasy sports gaming.';
      document.head.appendChild(metaDescription);
    }

    // Update Open Graph tags
    let ogTitle = document.querySelector('meta[property="og:title"]');
    if (ogTitle) {
      ogTitle.setAttribute('content', 'About Winners11 - Fantasy Cricket Platform');
    }

    let ogDescription = document.querySelector('meta[property="og:description"]');
    if (ogDescription) {
      ogDescription.setAttribute('content', 'Learn about India\'s most trusted skill-based fantasy cricket platform. Safe, fair, and legal gaming with real cash prizes.');
    }

    let ogUrl = document.querySelector('meta[property="og:url"]');
    if (ogUrl) {
      ogUrl.setAttribute('content', 'https://winners11.in/about');
    }

    // Update canonical URL
    let canonical = document.querySelector('link[rel="canonical"]');
    if (canonical) {
      canonical.setAttribute('href', 'https://winners11.in/about');
    }

    return () => {
      // Reset to default title when component unmounts
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
              <h1 className="text-2xl font-bold text-white tracking-wide">About Winners11</h1>
              <p className="text-gray-300 text-sm mt-1">Your Skill-Based Gaming Platform</p>
            </div>
          </div>
          <div className="bg-white bg-opacity-20 p-3 rounded-lg">
            <Trophy className="w-8 h-8 text-yellow-300" />
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="px-4 py-6">
        {/* Welcome Section */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6 mb-6">
          <div className="text-center mb-6">
            <div className="bg-yellow-100 p-4 rounded-full w-16 h-16 mx-auto mb-4">
              <Trophy className="w-8 h-8 text-yellow-600" />
            </div>
            <h2 className="text-xl font-bold text-gray-800 mb-2">Welcome to Winners11</h2>
            <p className="text-gray-600 text-sm leading-relaxed">
              Winners11.in is India's premier skill-based fantasy cricket gaming platform where strategy meets excitement.
            </p>
          </div>
        </div>

        {/* What We Offer */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6 mb-6">
          <h2 className="text-lg font-bold text-gray-800 mb-4">What We Offer</h2>
          <div className="space-y-4">
            <div className="flex items-start space-x-3">
              <div className="bg-yellow-100 p-2 rounded-lg mt-1">
                <Target className="w-5 h-5 text-yellow-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-800 text-sm">Fantasy Cricket</h3>
                <p className="text-gray-600 text-sm">Create your dream team and compete against players nationwide</p>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <div className="bg-yellow-100 p-2 rounded-lg mt-1">
                <Users className="w-5 h-5 text-yellow-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-800 text-sm">Skill-Based Gaming</h3>
                <p className="text-gray-600 text-sm">Pure skill-based contests with fair play and transparency</p>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <div className="bg-yellow-100 p-2 rounded-lg mt-1">
                <Award className="w-5 h-5 text-yellow-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-800 text-sm">Real Rewards</h3>
                <p className="text-gray-600 text-sm">Win exciting cash prizes and rewards based on your skills</p>
              </div>
            </div>
          </div>
        </div>

        {/* Our Mission */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6 mb-6">
          <h2 className="text-lg font-bold text-gray-800 mb-4">Our Mission</h2>
          <p className="text-gray-600 text-sm leading-relaxed mb-4">
            At Winners11, we believe in creating a fair and exciting platform where cricket knowledge and strategic thinking are rewarded. Our mission is to provide:
          </p>
          <ul className="space-y-2 text-sm text-gray-600">
            <li className="flex items-center">
              <Star className="w-4 h-4 text-yellow-500 mr-2 flex-shrink-0" />
              100% skill-based fantasy cricket gaming
            </li>
            <li className="flex items-center">
              <Star className="w-4 h-4 text-yellow-500 mr-2 flex-shrink-0" />
              Secure and transparent gaming environment
            </li>
            <li className="flex items-center">
              <Star className="w-4 h-4 text-yellow-500 mr-2 flex-shrink-0" />
              Instant withdrawals and reliable support
            </li>
            <li className="flex items-center">
              <Star className="w-4 h-4 text-yellow-500 mr-2 flex-shrink-0" />
              Legal compliance with all gaming regulations
            </li>
          </ul>
        </div>

        {/* Why Choose Us */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6 mb-6">
          <h2 className="text-lg font-bold text-gray-800 mb-4">Why Choose Winners11?</h2>
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center">
              <div className="bg-yellow-100 p-3 rounded-lg mb-2">
                <Shield className="w-6 h-6 text-yellow-600 mx-auto" />
              </div>
              <h3 className="font-semibold text-gray-800 text-sm mb-1">Safe & Secure</h3>
              <p className="text-gray-600 text-xs">Your data and money are completely protected</p>
            </div>

            <div className="text-center">
              <div className="bg-yellow-100 p-3 rounded-lg mb-2">
                <Trophy className="w-6 h-6 text-yellow-600 mx-auto" />
              </div>
              <h3 className="font-semibold text-gray-800 text-sm mb-1">Fair Play</h3>
              <p className="text-gray-600 text-xs">Transparent algorithms and equal opportunities</p>
            </div>

            <div className="text-center">
              <div className="bg-yellow-100 p-3 rounded-lg mb-2">
                <Users className="w-6 h-6 text-yellow-600 mx-auto" />
              </div>
              <h3 className="font-semibold text-gray-800 text-sm mb-1">Active Community</h3>
              <p className="text-gray-600 text-xs">Join thousands of cricket enthusiasts</p>
            </div>

            <div className="text-center">
              <div className="bg-yellow-100 p-3 rounded-lg mb-2">
                <Award className="w-6 h-6 text-yellow-600 mx-auto" />
              </div>
              <h3 className="font-semibold text-gray-800 text-sm mb-1">Quick Payouts</h3>
              <p className="text-gray-600 text-xs">Fast and hassle-free withdrawals</p>
            </div>
          </div>
        </div>

        {/* Legal Disclaimer */}
        <div className="bg-gray-50 rounded-lg p-4 mb-6 border border-gray-200">
          <h3 className="font-semibold text-gray-900 text-sm mb-2">Important Note</h3>
          <p className="text-gray-600 text-xs leading-relaxed">
            Winners11 operates as a skill-based gaming platform in compliance with applicable laws. Fantasy sports are games of skill and are legal in most Indian states. Please play responsibly and within your limits.
          </p>
        </div>

        {/* Call to Action */}
        <div className="text-center">
          <Link
            to="/"
            className="inline-flex items-center bg-gradient-to-r from-gray-900 via-slate-900 to-black text-white px-6 py-3 rounded-lg font-semibold hover:from-gray-800 hover:via-slate-800 hover:to-gray-900 transition-all duration-200 shadow-lg"
          >
            <Trophy className="w-5 h-5 mr-2 text-yellow-300" />
            Start Playing Now
          </Link>
          <p className="text-gray-500 text-xs mt-2">Join Winners11 and showcase your cricket skills!</p>
        </div>
      </div>
    </div>
  );
};

export default AboutUs;