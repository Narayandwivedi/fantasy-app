import React, { useState } from 'react'
import { Download, Smartphone } from 'lucide-react'
import { usePWA } from '../hooks/usePWA'
import InstallModal from './InstallModal'

const PWAInstall = ({ className = "", children }) => {
  const { isAppInstalled, isInstallable, installApp } = usePWA()
  const [showModal, setShowModal] = useState(false)

  const handleInstallClick = async () => {
    // Try native install first
    if (isInstallable) {
      const success = await installApp()
      if (success) {
        return // Successfully installed natively
      }
    }
    
    // If native install fails or not available, show modal
    setShowModal(true)
  }

  const handleModalInstall = async () => {
    await installApp()
  }

  // If already installed, show "Open App" button
  if (isAppInstalled) {
    return (
      <button 
        className={className}
        onClick={() => window.location.href = '/login'}
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
    <>
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
      
      <InstallModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onInstall={handleModalInstall}
        canInstallNatively={isInstallable}
      />
    </>
  )
}

export default PWAInstall