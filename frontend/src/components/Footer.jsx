import React from 'react';
import { Link } from 'react-router-dom';
import { Trophy, Mail, Phone, MapPin } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-gradient-to-r from-gray-900 via-slate-900 to-black text-white">
      <div className="px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-7xl mx-auto">
          
          {/* Brand Section */}
          <div className="lg:col-span-1 text-center md:text-left">
            <div className="flex items-center space-x-3 mb-6 justify-center md:justify-start">
              <div className="bg-white bg-opacity-20 p-2 rounded-lg">
                <Trophy className="w-8 h-8 text-yellow-300" />
              </div>
              <h2 className="text-2xl font-bold tracking-wide">
                MySeries<span className="text-yellow-300">11</span>
              </h2>
            </div>
            <p className="text-gray-300 text-sm leading-relaxed mb-4">
              India's premier fantasy sports platform. Play smart, win big, and claim your series with the best cricket fantasy experience.
            </p>
            <div className="flex space-x-4 justify-center md:justify-start">
              <div className="bg-white bg-opacity-10 hover:bg-opacity-20 p-2 rounded-lg cursor-pointer transition-all duration-200">
                <Mail className="w-5 h-5 text-yellow-300" />
              </div>
              <div className="bg-white bg-opacity-10 hover:bg-opacity-20 p-2 rounded-lg cursor-pointer transition-all duration-200">
                <Phone className="w-5 h-5 text-yellow-300" />
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div className="lg:col-span-1">
            <h3 className="text-lg font-semibold mb-6 text-yellow-300">Quick Links</h3>
            <ul className="space-y-3">
              <li>
                <Link to="/about" className="text-gray-300 hover:text-white transition-colors duration-200 text-sm">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-gray-300 hover:text-white transition-colors duration-200 text-sm">
                  Contact Us
                </Link>
              </li>
              <li>
                <Link to="/game-rules" className="text-gray-300 hover:text-white transition-colors duration-200 text-sm">
                  How to Play
                </Link>
              </li>
              <li>
                <Link to="/login" className="text-gray-300 hover:text-white transition-colors duration-200 text-sm">
                  Login / Sign Up
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal Links */}
          <div className="lg:col-span-1">
            <h3 className="text-lg font-semibold mb-6 text-yellow-300">Legal</h3>
            <ul className="space-y-3">
              <li>
                <Link to="/terms-and-conditions" className="text-gray-300 hover:text-white transition-colors duration-200 text-sm">
                  Terms & Conditions
                </Link>
              </li>
              <li>
                <Link to="/privacy-policy" className="text-gray-300 hover:text-white transition-colors duration-200 text-sm">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <a href="mailto:myseries11assist@gmail.com" className="text-gray-300 hover:text-white transition-colors duration-200 text-sm">
                  Customer Support
                </a>
              </li>
              <li>
                <Link to="/game-rules" className="text-gray-300 hover:text-white transition-colors duration-200 text-sm">
                  Fair Play Policy
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div className="lg:col-span-1">
            <h3 className="text-lg font-semibold mb-6 text-yellow-300">Contact Info</h3>
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <Mail className="w-5 h-5 text-yellow-300 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-gray-300 text-sm">Email</p>
                  <a href="mailto:myseries11assist@gmail.com" className="text-white text-sm hover:text-yellow-300 transition-colors">
                    myseries11assist@gmail.com
                  </a>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <MapPin className="w-5 h-5 text-yellow-300 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-gray-300 text-sm">Location</p>
                  <p className="text-white text-sm">India</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-gray-700 mt-12 pt-8 max-w-7xl mx-auto">
          
          {/* Bottom Bar */}
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="text-gray-400 text-sm">
              © {new Date().getFullYear()} MySeries11. All rights reserved.
            </div>
            <div className="flex space-x-6 text-sm">
              <Link to="/terms-and-conditions" className="text-gray-400 hover:text-white transition-colors">
                Terms
              </Link>
              <Link to="/privacy-policy" className="text-gray-400 hover:text-white transition-colors">
                Privacy
              </Link>
              <a href="mailto:myseries11assist@gmail.com" className="text-gray-400 hover:text-white transition-colors">
                Support
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;