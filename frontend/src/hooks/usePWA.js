import { useState, useEffect } from 'react'
import { isPWA, isPWAInstallable, requestNotificationPermission } from '../utils/pwaUtils'

export const usePWA = () => {
  const [isAppInstalled, setIsAppInstalled] = useState(false)
  const [isInstallable, setIsInstallable] = useState(false)
  const [deferredPrompt, setDeferredPrompt] = useState(null)
  const [notificationsEnabled, setNotificationsEnabled] = useState(false)

  useEffect(() => {
    // Check if app is already installed
    setIsAppInstalled(isPWA())
    setIsInstallable(isPWAInstallable())

    // Check notification permission
    if ('Notification' in window) {
      setNotificationsEnabled(Notification.permission === 'granted')
    }

    // Listen for beforeinstallprompt event
    const handleBeforeInstallPrompt = (e) => {
      e.preventDefault()
      setDeferredPrompt(e)
      setIsInstallable(true)
    }

    // Listen for app installed event
    const handleAppInstalled = () => {
      setIsAppInstalled(true)
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

  const installApp = async () => {
    if (!deferredPrompt) return false

    deferredPrompt.prompt()
    const { outcome } = await deferredPrompt.userChoice
    
    if (outcome === 'accepted') {
      setIsAppInstalled(true)
      setIsInstallable(false)
    }
    
    setDeferredPrompt(null)
    return outcome === 'accepted'
  }

  const enableNotifications = async () => {
    const granted = await requestNotificationPermission()
    setNotificationsEnabled(granted)
    return granted
  }

  return {
    isAppInstalled,
    isInstallable,
    installApp,
    notificationsEnabled,
    enableNotifications,
    isPWAMode: isPWA()
  }
}