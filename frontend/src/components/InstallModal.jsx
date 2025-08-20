import React from 'react'
import { X, Download, Zap } from 'lucide-react'

const InstallModal = ({ isOpen, onClose, onInstall, canInstallNatively = false }) => {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4 sm:p-6">
      <div className="bg-white rounded-2xl max-w-sm w-full mx-auto overflow-hidden shadow-2xl animate-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 px-4 sm:px-6 py-4 sm:py-6 relative text-center">
          <button
            onClick={onClose}
            className="absolute right-3 sm:right-4 top-3 sm:top-4 text-white hover:bg-white hover:bg-opacity-20 rounded-full p-1 transition-colors touch-target"
          >
            <X className="w-5 h-5 sm:w-6 sm:h-6" />
          </button>
          
          <div className="inline-block bg-white bg-opacity-20 rounded-2xl p-2 sm:p-3 mb-3 sm:mb-4">
            <img 
              src="/favicon.svg" 
              alt="MySeries11" 
              className="w-10 h-10 sm:w-12 sm:h-12 mx-auto"
            />
          </div>
          <h2 className="text-lg sm:text-xl font-bold text-white mb-1">Install MySeries11</h2>
          <p className="text-blue-100 text-xs sm:text-sm">Get the full app experience</p>
        </div>

        {/* Content */}
        <div className="p-4 sm:p-6 text-center">
          {/* Benefits */}
          <div className="space-y-2 sm:space-y-3 mb-4 sm:mb-6">
            <div className="flex items-center justify-center space-x-2 text-xs sm:text-sm text-gray-600">
              <div className="w-2 h-2 bg-green-500 rounded-full flex-shrink-0"></div>
              <span>Faster loading & offline access</span>
            </div>
            <div className="flex items-center justify-center space-x-2 text-xs sm:text-sm text-gray-600">
              <div className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0"></div>
              <span>Native app-like experience</span>
            </div>
            <div className="flex items-center justify-center space-x-2 text-xs sm:text-sm text-gray-600">
              <div className="w-2 h-2 bg-purple-500 rounded-full flex-shrink-0"></div>
              <span>Push notifications for matches</span>
            </div>
          </div>

          {/* Install Button */}
          <div className="space-y-3">
            <button
              onClick={() => {
                onInstall()
                onClose()
              }}
              className="w-full px-4 sm:px-6 py-3 sm:py-4 bg-gradient-to-r from-green-500 to-blue-600 text-white rounded-xl font-bold text-base sm:text-lg hover:from-green-600 hover:to-blue-700 transition-all transform hover:scale-105 active:scale-95 flex items-center justify-center space-x-2 sm:space-x-3 shadow-lg touch-target"
            >
              <Download className="w-4 h-4 sm:w-5 sm:h-5" />
              <span>Install Now</span>
            </button>
            
            <button
              onClick={onClose}
              className="w-full px-4 py-2 text-gray-500 hover:text-gray-700 transition-colors text-sm touch-target"
            >
              Maybe Later
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default InstallModal