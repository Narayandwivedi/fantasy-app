import React, { useState, useEffect } from 'react'
import { Download, Smartphone } from 'lucide-react'

const PWAInstall = ({ className = "", children }) => {
  const [deferredPrompt, setDeferredPrompt] = useState(null)
  const [isInstallable, setIsInstallable] = useState(false)
  const [isInstalled, setIsInstalled] = useState(false)

  useEffect(() => {
    // Check if already installed
    if (window.matchMedia('(display-mode: standalone)').matches) {
      setIsInstalled(true)
      return
    }

    // Listen for the beforeinstallprompt event
    const handleBeforeInstallPrompt = (e) => {
      // Prevent the mini-infobar from appearing on mobile
      e.preventDefault()
      // Store the event so it can be triggered later
      setDeferredPrompt(e)
      setIsInstallable(true)
    }

    // Listen for successful app installation
    const handleAppInstalled = () => {
      setIsInstalled(true)
      setIsInstallable(false)
      setDeferredPrompt(null)
    }

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
    window.addEventListener('appinstalled', handleAppInstalled)

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
      window.removeEventListener('appinstalled', handleAppInstalled)
    }
  }, [])

  const handleInstallClick = async () => {
    if (!deferredPrompt) {
      // Fallback for browsers that don't support install prompt
      if (navigator.userAgent.includes('iPhone') || navigator.userAgent.includes('iPad')) {
        alert('To install MySeries11:\n1. Tap the Share button\n2. Select "Add to Home Screen"\n3. Tap "Add"')
      } else {
        alert('To install MySeries11:\n1. Tap the menu (⋮) in your browser\n2. Select "Add to Home screen"\n3. Tap "Add"')
      }
      return
    }

    // Show the install prompt
    deferredPrompt.prompt()
    
    // Wait for the user's response
    const { outcome } = await deferredPrompt.userChoice
    
    if (outcome === 'accepted') {
      setIsInstalled(true)
    }
    
    // Clear the deferredPrompt
    setDeferredPrompt(null)
    setIsInstallable(false)
  }

  // If already installed, show "Open App" button
  if (isInstalled) {
    return (
      <button 
        className={className}
        onClick={() => window.location.href = '/fantasy-sport'}
      >
        {children || (
          <>
            <Smartphone className="w-5 h-5 mr-2" />
            Open App
          </>
        )}
      </button>
    )
  }

  // Show install button
  return (
    <button 
      className={className}
      onClick={handleInstallClick}
    >
      {children || (
        <>
          <Download className="w-5 h-5 mr-2" />
          {isInstallable ? 'Install App' : 'Download App'}
        </>
      )}
    </button>
  )
}

export default PWAInstall