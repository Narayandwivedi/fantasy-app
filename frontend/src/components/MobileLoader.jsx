import React from 'react'

const MobileLoader = ({ message = "Loading..." }) => {
  return (
    <div className="flex flex-col justify-center items-center min-h-screen bg-gray-50 p-4">
      <div className="relative">
        {/* Spinner */}
        <div className="w-12 h-12 border-4 border-gray-200 border-t-blue-500 rounded-full animate-spin"></div>
        
        {/* Pulse effect */}
        <div className="absolute inset-0 w-12 h-12 border-4 border-blue-200 rounded-full animate-ping opacity-20"></div>
      </div>
      
      <p className="mt-4 text-gray-600 text-center font-medium">{message}</p>
      
      {/* Optional dots animation */}
      <div className="flex space-x-1 mt-2">
        <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"></div>
        <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
        <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
      </div>
    </div>
  )
}

export default MobileLoader