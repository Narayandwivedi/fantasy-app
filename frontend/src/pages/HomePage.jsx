import React, { useContext, useEffect } from 'react'
import LandingNavbar from "../components/LandingNavbar"
import { Link, useNavigate } from 'react-router-dom'
import { AppContext } from '../context/AppContext'

const HomePage = () => {
  const { user } = useContext(AppContext)
  const navigate = useNavigate()

  useEffect(() => {
    if (user) {
      navigate('/fantasy-sport')
    }
  }, [user, navigate])
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900">
      <LandingNavbar/> 
      
      {/* Hero Section - Mobile Layout */}
      <div className="md:hidden px-6 py-12 text-center">
        <h1 className="text-3xl font-bold text-white mb-2 leading-tight">
          CHOOSE YOUR BEST
        </h1>
        <h2 className="text-3xl font-bold mb-8 leading-tight">
          <span className="text-yellow-400">WINNERS 11</span> <span className="text-white">NOW</span>
        </h2>
        
        {/* Mobile App Preview */}
        <div className="flex justify-center mt-8">
          <div className="relative">
            <img 
              src="/winners11 img.png" 
              alt="Winners11 App Preview" 
              className="w-60 h-auto drop-shadow-2xl rounded-3xl"
            />
          </div>
        </div>
        
        {/* CTA Button - Mobile Only */}
        <div className="mt-12">
          <Link 
            to="/login"
            className="inline-block bg-transparent border-2 border-white hover:bg-white hover:text-gray-900 text-white font-semibold py-3 px-6 rounded-full transition-all duration-200"
          >
            Login / Sign Up
          </Link>
        </div>
        
        {/* Features - Mobile */}
        <div className="mt-16 grid grid-cols-1 gap-8">
          <div className="bg-white bg-opacity-10 backdrop-blur-sm rounded-xl p-6 text-white">
            <div className="text-3xl mb-4">🏆</div>
            <h3 className="text-xl font-bold mb-2">Win Big Prizes</h3>
            <p className="text-gray-300">Compete in contests and win exciting cash prizes</p>
          </div>
          
          <div className="bg-white bg-opacity-10 backdrop-blur-sm rounded-xl p-6 text-white">
            <div className="text-3xl mb-4">⚡</div>
            <h3 className="text-xl font-bold mb-2">Fast & Secure</h3>
            <p className="text-gray-300">Quick deposits, instant withdrawals, secure platform</p>
          </div>
          
          <div className="bg-white bg-opacity-10 backdrop-blur-sm rounded-xl p-6 text-white">
            <div className="text-3xl mb-4">🎯</div>
            <h3 className="text-xl font-bold mb-2">Skill Based</h3>
            <p className="text-gray-300">100% skill-based gaming, no luck involved</p>
          </div>
        </div>
      </div>

      {/* Hero Section - Desktop Layout */}
      <div className="hidden md:flex items-center justify-between min-h-[calc(100vh-80px)] px-8 lg:px-16 py-12">
        
        {/* Left Side - Text Content */}
        <div className="flex-1 pr-16 flex flex-col justify-between h-full">
          {/* Top Text */}
          <div className="pt-2">
            <h1 className="text-5xl lg:text-6xl xl:text-7xl font-bold text-white mb-4 leading-tight">
              CHOOSE YOUR BEST
            </h1>
            <h2 className="text-5xl lg:text-6xl xl:text-7xl font-bold mb-8 leading-tight">
              <span className="text-yellow-400">WINNERS 11</span> <span className="text-white">NOW</span>
            </h2>
          </div>
          
          {/* Bottom Features */}
          <div className="pb-8">
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
                <p className="text-gray-200 text-base lg:text-lg font-medium">Lowest Platform Fee</p>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
                <p className="text-gray-200 text-base lg:text-lg font-medium">Fair Play</p>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
                <p className="text-gray-200 text-base lg:text-lg font-medium">Withdrawal Within 5 Minutes</p>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
                <p className="text-gray-200 text-base lg:text-lg font-medium">No Withdrawal Amount Limit</p>
              </div>
            </div>
          </div>
        </div>
        
        {/* Right Side - Mobile App Preview */}
        <div className="flex-1 flex justify-end">
          <div className="relative">
            <img 
              src="/winners11 img.png" 
              alt="Winners11 App Preview" 
              className="w-80 lg:w-96 xl:w-[420px] h-auto drop-shadow-2xl rounded-3xl"
            />
          </div>
        </div>
      </div>
      
      {/* Features Section - Desktop Only */}
      <div className="hidden md:block px-8 lg:px-16 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          <div className="bg-white bg-opacity-10 backdrop-blur-sm rounded-xl p-6 text-white text-center">
            <div className="text-3xl mb-4">🏆</div>
            <h3 className="text-xl font-bold mb-2">Win Big Prizes</h3>
            <p className="text-gray-300">Compete in contests and win exciting cash prizes</p>
          </div>
          
          <div className="bg-white bg-opacity-10 backdrop-blur-sm rounded-xl p-6 text-white text-center">
            <div className="text-3xl mb-4">⚡</div>
            <h3 className="text-xl font-bold mb-2">Fast & Secure</h3>
            <p className="text-gray-300">Quick deposits, instant withdrawals, secure platform</p>
          </div>
          
          <div className="bg-white bg-opacity-10 backdrop-blur-sm rounded-xl p-6 text-white text-center">
            <div className="text-3xl mb-4">🎯</div>
            <h3 className="text-xl font-bold mb-2">Skill Based</h3>
            <p className="text-gray-300">100% skill-based gaming, no luck involved</p>
          </div>
        </div>
      </div>
      
      {/* Fixed Bottom CTA Button */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent">
        <div className="max-w-[440px] mx-auto">
          <Link 
            to="/fantasy-sport"
            className="block w-full bg-yellow-400 hover:bg-yellow-500 text-black font-bold py-4 px-8 rounded-full text-lg transition-all duration-200 transform hover:scale-105 shadow-lg text-center"
          >
            Start Playing Now
          </Link>
        </div>
      </div>
    </div>
  )
}

export default HomePage
