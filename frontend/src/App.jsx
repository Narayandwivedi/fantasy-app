import React, { useMemo } from 'react'
import MatchCard from './components/MatchCard'
import HomePage from './pages/HomePage'
import BottomNav from './components/BottomNav'
import { Routes , Route, useLocation } from 'react-router-dom'
import Contest from './pages/Contest'
import CreateTeam from './pages/CreateTeam'
import MyTeams from './pages/MyTeams'
import MyMatches from './pages/my matches/MyMatches'
import MyContests from './pages/MyContests'
import Wallet from './pages/user profile/Wallet'
import QRPayment from './pages/QRPayment'
import ReferAndEarn from './pages/ReferAndEarn'
import GameRules from './pages/user profile/GameRules'
import Support from './pages/user profile/Support'
import ChatPage from './pages/ChatPage'
import Login from './pages/Login'
import BlogList from './pages/BlogList'
import BlogPost from './pages/BlogPost'
import AboutUs from './pages/AboutUs'
import ContactUs from './pages/ContactUs'
import ProtectedRoute from './components/ProtectedRoute'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

const App = () => {
  const location = useLocation()
  
  const hideBottomNav = useMemo(() => {
    const hidePaths = ['/create-team', '/login', '/my-teams', '/contest', '/chat', '/my-contests', '/my-matches', '/qr-payment', '/blogs', '/blog', '/about', '/contact', '/support', '/game-rules']
    return hidePaths.some(path => location.pathname.includes(path))
  }, [location.pathname])

  // Check if current page is blog-related for responsive design
  const isBlogRoute = useMemo(() => {
    return location.pathname === '/blogs' || location.pathname.startsWith('/blog/')
  }, [location.pathname])

  // Conditional container classes - responsive for blogs, mobile-first for app
  const containerClasses = isBlogRoute 
    ? 'w-full min-h-screen bg-gray-50' // Full width responsive container for blogs
    : 'max-w-[440px] mx-auto bg-white min-h-screen rounded-lg shadow relative overflow-hidden' // Mobile app container

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

          <Route path='/support' element = {<Support/>} />

          <Route path='/chat' element = {
            <ProtectedRoute>
              <ChatPage/>
            </ProtectedRoute>
          } />

          <Route path='/blogs' element = {<BlogList/>} />
          <Route path='/blog/:slug' element = {<BlogPost/>} />
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
