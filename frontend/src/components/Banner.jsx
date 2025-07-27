import React from 'react';

const Banner = () => {
  return (
    <div 
      className=" mt-3 shadow-xl bg-gradient-to-r from-gray-900 via-slate-900 to-black relative overflow-hidden"
      style={{ aspectRatio: '3/1' }}
    >
      {/* Background decoration */}
      <div className="absolute inset-0 bg-black bg-opacity-10"></div>
      <div className="absolute top-0 right-0 w-20 h-20 bg-white bg-opacity-10 rounded-full -translate-y-10 translate-x-10"></div>
      <div className="absolute bottom-0 left-0 w-16 h-16 bg-white bg-opacity-10 rounded-full translate-y-8 -translate-x-8"></div>
      
      <div className="relative flex items-center justify-between px-4 h-full">
        {/* Left side - Prize */}
        <div className="text-white">
          <span className="text-2xl font-extrabold text-yellow-300">₹10 LAKH</span>
          <p className="text-sm font-medium">MEGA CONTEST</p>
        </div>

        {/* Right side - Join button */}
        <button className="bg-yellow-500 hover:bg-yellow-600 text-black font-bold px-8 py-2 rounded-full text-sm transition-all duration-200 shadow-lg transform hover:scale-105">
          JOIN FAST
        </button>
      </div>
    </div>
  );
};

export default Banner;
