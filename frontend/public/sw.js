// Service Worker for MySeries11 PWA
const CACHE_NAME = 'myseries11-v2.0.0'
const STATIC_CACHE = 'myseries11-static-v2'
const DYNAMIC_CACHE = 'myseries11-dynamic-v2'

// Files to cache for offline functionality
const urlsToCache = [
  '/',
  '/login',
  '/fantasy-sport',
  '/my-matches',
  '/wallet',
  '/manifest.json',
  '/favicon.svg',
  '/favicon-dark.svg',
  '/series11.png',
  '/series11desktop.png'
]

// API endpoints to cache
const API_CACHE_PATTERNS = [
  '/api/matches',
  '/api/user/profile',
  '/api/teams'
]

// Install event - cache resources
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        return cache.addAll(urlsToCache)
      })
  )
  // Skip waiting and immediately activate
  self.skipWaiting()
})

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME && cacheName !== STATIC_CACHE && cacheName !== DYNAMIC_CACHE) {
            return caches.delete(cacheName)
          }
        })
      )
    })
  )
  // Take control of all pages immediately
  self.clients.claim()
})

// Fetch event - serve from cache when offline
self.addEventListener('fetch', (event) => {
  // Skip non-GET requests
  if (event.request.method !== 'GET') {
    return
  }

  // Handle API requests with network-first strategy
  if (event.request.url.includes('/api/')) {
    event.respondWith(
      fetch(event.request)
        .then((response) => {
          // Cache successful API responses
          if (response.status === 200) {
            const responseClone = response.clone()
            caches.open(DYNAMIC_CACHE).then((cache) => {
              cache.put(event.request, responseClone)
            })
          }
          return response
        })
        .catch(() => {
          // Fallback to cached API response when offline
          return caches.match(event.request)
        })
    )
    return
  }

  // Handle static assets with cache-first strategy
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        // Return cached version if available
        if (response) {
          return response
        }

        // Otherwise fetch from network
        return fetch(event.request).then((response) => {
          // Don't cache non-successful responses
          if (!response || response.status !== 200 || response.type !== 'basic') {
            return response
          }

          // Clone the response
          const responseToCache = response.clone()

          // Add to cache for future offline use
          caches.open(CACHE_NAME)
            .then((cache) => {
              cache.put(event.request, responseToCache)
            })

          return response
        }).catch(() => {
          // If network fails and no cache, return offline page
          if (event.request.destination === 'document') {
            return caches.match('/login') || caches.match('/')
          }
        })
      })
  )
})

// Background sync for form submissions when back online
self.addEventListener('sync', (event) => {
  if (event.tag === 'background-sync') {
    event.waitUntil(handleBackgroundSync())
  }
})

// Handle push notifications
self.addEventListener('push', (event) => {
  if (event.data) {
    const data = event.data.json()
    const options = {
      body: data.body,
      icon: '/favicon.svg',
      badge: '/favicon.svg',
      data: data.data,
      actions: [
        {
          action: 'open',
          title: 'Open App'
        },
        {
          action: 'close',
          title: 'Close'
        }
      ]
    }
    
    event.waitUntil(
      self.registration.showNotification(data.title, options)
    )
  }
})

// Handle notification clicks
self.addEventListener('notificationclick', (event) => {
  event.notification.close()
  
  if (event.action === 'open' || !event.action) {
    event.waitUntil(
      clients.openWindow(event.notification.data?.url || '/fantasy-sport')
    )
  }
})

async function handleBackgroundSync() {
  // Handle any pending form submissions when back online
  return Promise.resolve()
}