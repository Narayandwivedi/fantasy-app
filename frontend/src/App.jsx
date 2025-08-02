import React from 'react'
import MatchCard from './components/MatchCard'
import HomePage from './pages/HomePage'
import BottomNav from './components/BottomNav'
import { Routes , Route, useLocation } from 'react-router-dom'
import Contest from './pages/Contest'
import CreateTeam from './pages/CreateTeam'
import MyTeams from './pages/MyTeams'
import Login from './pages/Login'
import ProtectedRoute from './components/ProtectedRoute'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

const App = () => {
  const location = useLocation()
  const hideBottomNav = location.pathname.includes('/create-team') || location.pathname.includes('/login') || location.pathname.includes('/my-teams') || location.pathname.includes('/contest')

  return (
    <div className='max-w-[440px] mx-auto bg-white min-h-screen rounded-lg shadow relative overflow-hidden'>
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
