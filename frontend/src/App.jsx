import React, { useMemo, useContext } from 'react'
import MatchCard from './components/MatchCard'
import HomePage from './pages/HomePage'
import BottomNav from './components/BottomNav'
import { Routes , Route, useLocation } from 'react-router-dom'
import { AppContext } from './context/AppContext'
import Contest from './pages/Contest'
import CreateTeam from './pages/CreateTeam'
import MyTeams from './pages/MyTeams'
import MyMatches from './pages/my matches/MyMatches'
import MyContests from './pages/MyContests'
import Wallet from './pages/user profile/Wallet'
import QRPayment from './pages/QRPayment'
import ReferAndEarn from './pages/ReferAndEarn'
import GameRules from './pages/user profile/GameRules'
import ChatPage from './pages/ChatPage'
import Login from './pages/Login'
import AboutUs from './pages/AboutUs'
import ContactUs from './pages/ContactUs'
import ProtectedRoute from './components/ProtectedRoute'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

const App = () => {
  const location = useLocation()
  const { user } = useContext(AppContext)
  
  const hideBottomNav = useMemo(() => {
    // Hide bottom nav for all public users (not logged in)
    if (!user) {
      return true
    }
    
    const hidePaths = ['/create-team', '/login', '/my-teams', '/contest', '/chat', '/my-contests', '/my-matches', '/qr-payment', '/about', '/game-rules', '/admin']
    
    // Special case: show bottom nav for logged-in users on contact page
    if (location.pathname.includes('/contact')) {
      return false
    }
    
    return hidePaths.some(path => location.pathname.includes(path))
  }, [location.pathname, user])

  // Mobile-first container for all pages
  const containerClasses = 'max-w-[440px] mx-auto bg-white min-h-screen rounded-lg shadow relative overflow-hidden'

  return (
    <div className={containerClasses}>
      <div>
        <Routes>
          
          <Route path='/login' element = {<Login/>} />
          
          <Route path='/' element = {
            <ProtectedRoute>
              <HomePage/>
            </ProtectedRoute>
          } />


          <Route path='/:matchId/contest' element = {
            <ProtectedRoute>
              <Contest/>
            </ProtectedRoute>
          } />


          <Route path='/:matchId/create-team' element = {
            <ProtectedRoute>
              <CreateTeam/>
            </ProtectedRoute>
          } />


          <Route path='/:matchId/my-teams' element = {
            <ProtectedRoute>
              <MyTeams/>
            </ProtectedRoute>
          } />

          <Route path='/my-matches' element = {
            <ProtectedRoute>
              <MyMatches/>
            </ProtectedRoute>
          } />

          <Route path='/my-contests/:matchId' element = {
            <ProtectedRoute>
              <MyContests/>
            </ProtectedRoute>
          } />

          <Route path='/wallet' element = {
            <ProtectedRoute>
              <Wallet/>
            </ProtectedRoute>
          } />

          <Route path='/qr-payment' element = {
            <ProtectedRoute>
              <QRPayment/>
            </ProtectedRoute>
          } />

          <Route path='/refer' element = {
            <ProtectedRoute>
              <ReferAndEarn/>
            </ProtectedRoute>
          } />

          <Route path='/game-rules' element = {<GameRules/>} />


          <Route path='/chat' element = {
            <ProtectedRoute>
              <ChatPage/>
            </ProtectedRoute>
          } />

          <Route path='/about' element = {<AboutUs/>} />
          <Route path='/contact' element = {<ContactUs/>} />

        </Routes>
        {!hideBottomNav && <BottomNav/>}
      </div>
      
      {/* Global Toast Container - shows notifications from any component */}
      <ToastContainer
        position="top-center"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
      
    </div>
  )
}

export default App
