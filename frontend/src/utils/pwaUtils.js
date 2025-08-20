// PWA utility functions

// Check if app is running as PWA
export const isPWA = () => {
  return (
    window.matchMedia('(display-mode: standalone)').matches ||
    window.navigator.standalone ||
    document.referrer.includes('android-app://') ||
    window.location.search.includes('source=pwa')
  )
}

// Check if PWA is installable
export const isPWAInstallable = () => {
  return 'serviceWorker' in navigator && 'PushManager' in window
}

// Get PWA display mode
export const getPWADisplayMode = () => {
  const isStandalone = window.matchMedia('(display-mode: standalone)').matches
  if (document.referrer.startsWith('android-app://')) {
    return 'twa'
  } else if (navigator.standalone || isStandalone) {
    return 'standalone'
  }
  return 'browser'
}

// Add to home screen prompt for iOS
export const showIOSInstallPrompt = () => {
  const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream
  const isInStandaloneMode = ('standalone' in window.navigator) && (window.navigator.standalone)
  
  if (isIOS && !isInStandaloneMode) {
    return {
      show: true,
      message: 'To install MySeries11:\n1. Tap the Share button (📤)\n2. Select "Add to Home Screen"\n3. Tap "Add"'
    }
  }
  return { show: false }
}

// Request notification permission
export const requestNotificationPermission = async () => {
  if (!('Notification' in window)) {
    return false
  }
  
  if (Notification.permission === 'granted') {
    return true
  }
  
  if (Notification.permission !== 'denied') {
    const permission = await Notification.requestPermission()
    return permission === 'granted'
  }
  
  return false
}

// Subscribe to push notifications
export const subscribeToNotifications = async () => {
  if (!('serviceWorker' in navigator) || !('PushManager' in window)) {
    return null
  }
  
  try {
    const registration = await navigator.serviceWorker.ready
    const subscription = await registration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: urlBase64ToUint8Array(process.env.REACT_APP_VAPID_PUBLIC_KEY || '')
    })
    
    return subscription
  } catch (error) {
    console.error('Error subscribing to notifications:', error)
    return null
  }
}

// Helper function to convert VAPID key
function urlBase64ToUint8Array(base64String) {
  const padding = '='.repeat((4 - base64String.length % 4) % 4)
  const base64 = (base64String + padding)
    .replace(/-/g, '+')
    .replace(/_/g, '/')
  
  const rawData = window.atob(base64)
  const outputArray = new Uint8Array(rawData.length)
  
  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i)
  }
  return outputArray
}

// Cache important data for offline use
export const cacheUserData = (data) => {
  if ('caches' in window) {
    caches.open('user-data').then(cache => {
      cache.put('/api/user/profile', new Response(JSON.stringify(data)))
    })
  }
}

// Get cached user data when offline
export const getCachedUserData = async () => {
  if ('caches' in window) {
    const cache = await caches.open('user-data')
    const response = await cache.match('/api/user/profile')
    if (response) {
      return await response.json()
    }
  }
  return null
}