import React, { useMemo, useContext } from 'react'
import MatchCard from './components/MatchCard'
import HomePage from './pages/HomePage'
import FantasySport from './pages/FantasySport'
import BottomNav from './components/BottomNav'
import { Routes , Route, useLocation } from 'react-router-dom'
import { AppContext } from './context/AppContext'
import Contest from './pages/Contest'
import CreateTeam from './pages/CreateTeam'
import MyTeams from './pages/MyTeams'
import MyMatches from './pages/my matches/MyMatches'
import MyContests from './pages/MyContests'
import LeaderboardPage from './pages/LeaderboardPage'
import Wallet from './pages/user profile/Wallet'
import Withdraw from './pages/user profile/Withdraw'
import QRPayment from './pages/QRPayment'
import ReferAndEarn from './pages/ReferAndEarn'
import GameRules from './pages/user profile/GameRules'
import ChatPage from './pages/ChatPage'
import Login from './pages/Login'
import AboutUs from './pages/AboutUs'
import ContactUs from './pages/ContactUs'
import CustomerSupport from './pages/CustomerSupport'
import Terms from './pages/Terms'
import PrivacyPolicy from './pages/PrivacyPolicy'
import ProtectedRoute from './components/ProtectedRoute'
import ErrorBoundary from './components/ErrorBoundary'
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
    
    const hidePaths = ['/', '/create-team', '/login', '/my-teams', '/contest', '/chat', '/my-contests', '/my-matches', '/qr-payment', '/about', '/game-rules', '/terms-and-conditions', '/privacy-policy', '/admin']
    
    // Special case: show bottom nav for logged-in users on contact page
    if (location.pathname.includes('/contact')) {
      return false
    }
    
    return hidePaths.some(path => location.pathname.includes(path))
  }, [location.pathname, user])

  // Full width for homepage, contact, about pages, mobile-first for others
  const isHomePage = location.pathname === '/'
  const isContactPage = location.pathname === '/contact'
  const isAboutPage = location.pathname === '/about'
  const isTermPage = location.pathname === '/terms-and-conditions'
  const isPrivacyPage = location.pathname === '/privacy-policy'
  const containerClasses = (isHomePage || isContactPage || isAboutPage || isTermPage || isPrivacyPage)
    ? 'w-full min-h-screen relative overflow-hidden' 
    : 'max-w-[440px] mx-auto bg-white min-h-screen rounded-lg shadow relative overflow-hidden'

  return (
    <ErrorBoundary>
      <div className={containerClasses}>
        <div>
          <Routes>
            
            <Route path='/login' element = {<Login/>} />
            
            <Route path='/' element = {
              
                <HomePage/>
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

            <Route path='/my-contests/:matchId/leaderboard/:contestId' element = {
              <ProtectedRoute>
                <LeaderboardPage/>
              </ProtectedRoute>
            } />

            <Route path='/wallet' element = {
              <ProtectedRoute>
                <Wallet/>
              </ProtectedRoute>
            } />

            <Route path='/withdraw' element = {
              <ProtectedRoute>
                <Withdraw/>
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

            <Route path='/fantasy-sport' element = {
              <ProtectedRoute>
                <FantasySport/>
              </ProtectedRoute>
            } />

            <Route path='/support' element = {
              <ProtectedRoute>
                <CustomerSupport/>
              </ProtectedRoute>
            } />

            <Route path='/about' element = {<AboutUs/>} />
            <Route path='/contact' element = {<ContactUs/>} />
            <Route path='/terms-and-conditions' element = {<Terms/>} />
            <Route path='/privacy-policy' element = {<PrivacyPolicy/>} />

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
    </ErrorBoundary>
  )
}

export default App
