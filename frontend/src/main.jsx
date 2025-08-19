import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { AppContextProvider } from './context/AppContext.jsx'
import { BrowserRouter } from 'react-router-dom'

// Register service worker for PWA functionality
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js')
      .then((registration) => {
        // Service worker registered successfully
      })
      .catch((error) => {
        // Service worker registration failed
      })
  })
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
  <BrowserRouter>
     <AppContextProvider> <App /></AppContextProvider>
  </BrowserRouter>
  </StrictMode>,
)
