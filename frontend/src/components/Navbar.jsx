import React, { useState, useContext } from "react";
import { Wallet, Menu, Trophy } from "lucide-react";
import { Link } from 'react-router-dom';
import MenuSidebar from './MenuSidebar';
import { AppContext } from '../context/AppContext';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user } = useContext(AppContext);

  return (
    <>
      <div className="bg-gradient-to-r from-gray-900 via-slate-900 to-black py-3 px-6 shadow-xl">
        <div className="flex justify-between items-center">
          {/* Left side - Menu (only for logged-in users) */}
          {user ? (
            <div 
              className="bg-white bg-opacity-10 hover:bg-opacity-20 p-2 rounded-lg cursor-pointer transition-all duration-200 group"
              onClick={() => setIsMenuOpen(true)}
            >
              <Menu className="w-6 h-6 text-white group-hover:text-yellow-300 transition-colors duration-200" />
            </div>
          ) : (
            <div className="w-10 h-10"></div>
          )}
        
        {/* Center - Logo/Brand */}
        <Link to="/fantasy-sport" className="flex items-center justify-center space-x-2 cursor-pointer">
          <div className="bg-white bg-opacity-20 p-2 rounded-lg">
            <Trophy className="w-6 h-6 text-yellow-300" />
          </div>
          <h1 className="text-white text-xl font-bold tracking-wide">
            MySeries<span className="text-yellow-300">11</span>
          </h1>
        </Link>
        
        {/* Right side - Wallet (only for logged-in users) */}
        {user ? (
          <Link to="/wallet">
            <div className="flex items-center space-x-2 bg-white bg-opacity-10 hover:bg-opacity-20 px-3 py-2 rounded-lg cursor-pointer transition-all duration-200 group">
            <Wallet className="w-5 h-5 text-white group-hover:text-yellow-300 transition-colors duration-200" />
            <span className="text-white text-sm font-medium group-hover:text-yellow-300 transition-colors duration-200">₹{user?.balance || 0}</span>
          </div>
          </Link>
        ) : (
          <div className="w-20 h-10"></div>
        )}
      </div>
    </div>
    
    <MenuSidebar 
      isOpen={isMenuOpen} 
      onClose={() => setIsMenuOpen(false)} 
    />
  </>
  );
};

export default Navbar;
