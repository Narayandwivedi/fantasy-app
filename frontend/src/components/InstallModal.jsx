import React from 'react'
import { X, Download, Smartphone, Zap } from 'lucide-react'

const InstallModal = ({ isOpen, onClose, onInstall, canInstallNatively = false }) => {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-md w-full mx-4 overflow-hidden shadow-2xl animate-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 px-6 py-4 relative">
          <button
            onClick={onClose}
            className="absolute right-4 top-4 text-white hover:bg-white hover:bg-opacity-20 rounded-full p-1 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
          
          <div className="flex items-center space-x-3">
            <Download className="w-8 h-8 text-white" />
            <div>
              <h2 className="text-xl font-bold text-white">Install MySeries11</h2>
              <p className="text-blue-100 text-sm">Get the full app experience</p>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* App Preview */}
          <div className="text-center mb-6">
            <div className="inline-block bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 rounded-2xl p-4 mb-4">
              <img 
                src="/favicon.svg" 
                alt="MySeries11" 
                className="w-16 h-16 mx-auto"
              />
            </div>
            <h3 className="font-bold text-lg text-gray-800">MySeries11</h3>
            <p className="text-gray-600 text-sm">Fantasy Cricket Gaming</p>
          </div>

          {/* Quick Install Notice */}
          {canInstallNatively && (
            <div className="bg-gradient-to-r from-green-50 to-blue-50 border border-green-200 rounded-xl p-4 mb-4">
              <div className="flex items-center space-x-2 mb-2">
                <Zap className="w-5 h-5 text-green-600" />
                <span className="font-semibold text-green-800">Quick Install Available!</span>
              </div>
              <p className="text-sm text-green-700">Your browser supports one-click installation!</p>
            </div>
          )}

          {/* Benefits */}
          <div className="bg-gray-50 rounded-xl p-4 mb-6">
            <h4 className="font-semibold text-gray-800 mb-3">Why install?</h4>
            <div className="space-y-2 text-sm text-gray-600">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span>Faster loading & offline access</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <span>Native app-like experience</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                <span>Push notifications for matches</span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="bg-gray-50 px-6 py-4 flex space-x-3">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-100 transition-colors"
          >
            Maybe Later
          </button>
          <button
            onClick={() => {
              onInstall()
              onClose()
            }}
            className="flex-1 px-4 py-2 bg-gradient-to-r from-green-500 to-blue-600 text-white rounded-lg font-medium hover:from-green-600 hover:to-blue-700 transition-all transform hover:scale-105 flex items-center justify-center space-x-2"
          >
            <Download className="w-4 h-4" />
            <span>Install Now</span>
          </button>
        </div>
      </div>
    </div>
  )
}

export default InstallModal