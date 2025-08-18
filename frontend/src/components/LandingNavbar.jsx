import React, { useState } from "react";
import { Trophy, Menu, X } from "lucide-react";
import { Link } from 'react-router-dom';

const LandingNavbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <>
      <div className="bg-gradient-to-r from-gray-900 via-slate-900 to-black py-4 md:py-4 lg:py-5 px-6 shadow-xl">
        <div className="flex justify-between items-center md:grid md:grid-cols-[1fr_auto_1fr] md:items-center">
          {/* Left side - Menu toggle for mobile */}
          <div className="md:hidden">
            <button 
              className="bg-white bg-opacity-10 hover:bg-opacity-20 p-2 rounded-lg cursor-pointer transition-all duration-200 group"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? (
                <X className="w-6 h-6 text-white group-hover:text-yellow-300 transition-colors duration-200" />
              ) : (
                <Menu className="w-6 h-6 text-white group-hover:text-yellow-300 transition-colors duration-200" />
              )}
            </button>
          </div>
          
          {/* Desktop Navigation Links - Left */}
          <div className="hidden md:flex items-center space-x-6">
            <Link to="/about" className="text-white hover:text-yellow-300 transition-colors duration-200 font-medium text-sm">
              About Us
            </Link>
            <Link to="/contact" className="text-white hover:text-yellow-300 transition-colors duration-200 font-medium text-sm">
              Contact Us
            </Link>
            <Link to="/blog" className="text-white hover:text-yellow-300 transition-colors duration-200 font-medium text-sm">
              Blog
            </Link>
            <Link to="/privacy-policy" className="text-white hover:text-yellow-300 transition-colors duration-200 font-medium text-sm">
              Privacy Policy
            </Link>
          </div>
        
          {/* Center - Logo/Brand */}
          <Link to="/" className="flex items-center space-x-3 md:space-x-4 md:justify-center hover:opacity-90 transition-opacity duration-200 cursor-pointer">
            <div className="bg-white bg-opacity-20 p-2 md:p-3 rounded-lg">
              <Trophy className="w-7 h-7 md:w-8 md:h-8 lg:w-9 lg:h-9 text-yellow-300" />
            </div>
            <h1 className="text-white text-xl md:text-2xl lg:text-3xl font-bold tracking-wide">
              MySeries<span className="text-yellow-300">11</span>
            </h1>
          </Link>
        
          {/* Desktop Navigation Links - Right */}
          <div className="hidden md:flex items-center space-x-6 md:justify-end">
            <Link 
              to="/login"
              className="bg-yellow-400 hover:bg-yellow-500 text-black font-semibold px-4 py-2 rounded-lg transition-all duration-200"
            >
              Login
            </Link>
          </div>
          
          {/* Mobile - Login button */}
          <div className="md:hidden">
            <Link 
              to="/login"
              className="bg-yellow-400 hover:bg-yellow-500 text-black font-semibold px-3 py-2 rounded-lg transition-all duration-200 text-sm"
            >
              Login
            </Link>
          </div>
        </div>
        
        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden mt-4 pb-4 border-t border-gray-700 pt-4">
            <div className="flex flex-col space-y-4">
              <Link 
                to="/about" 
                className="text-white hover:text-yellow-300 transition-colors duration-200 font-medium text-sm"
                onClick={() => setIsMenuOpen(false)}
              >
                About Us
              </Link>
              <Link 
                to="/contact" 
                className="text-white hover:text-yellow-300 transition-colors duration-200 font-medium text-sm"
                onClick={() => setIsMenuOpen(false)}
              >
                Contact Us
              </Link>
              <Link 
                to="/blog" 
                className="text-white hover:text-yellow-300 transition-colors duration-200 font-medium text-sm"
                onClick={() => setIsMenuOpen(false)}
              >
                Blog
              </Link>
              <Link 
                to="/privacy-policy" 
                className="text-white hover:text-yellow-300 transition-colors duration-200 font-medium text-sm"
                onClick={() => setIsMenuOpen(false)}
              >
                Privacy Policy
              </Link>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default LandingNavbar;