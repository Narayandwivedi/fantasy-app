import React, { memo } from 'react'
import { Link } from 'react-router-dom'
import { Home, Trophy, Share2, User } from 'lucide-react'

const BottomNav = memo(() => {
  return (
    <div className="fixed bottom-0 left-1/2 transform -translate-x-1/2 w-full max-w-[440px] bg-white shadow-lg border-t border-gray-200 z-50">
      <div className="flex justify-around items-center py-3 px-4">
        <Link to="/" className="flex flex-col items-center space-y-1 text-gray-500 hover:text-blue-600 transition-colors duration-200">
          <Home size={22} />
          <span className="text-xs font-medium">Home</span>
        </Link>
        
        <Link to="/my-matches" className="flex flex-col items-center space-y-1 text-gray-500 hover:text-purple-600 transition-colors duration-200">
          <Trophy size={22} />
          <span className="text-xs font-medium">My matches</span>
        </Link>
  
        <Link to="/refer" className="flex flex-col items-center space-y-1 text-gray-500 hover:text-emerald-600 transition-colors duration-200">
          <Share2 size={22} />
          <span className="text-xs font-medium">Refer&Earn</span>
        </Link>
  
      </div>
    </div>
  )
})

BottomNav.displayName = 'BottomNav'

export default BottomNav