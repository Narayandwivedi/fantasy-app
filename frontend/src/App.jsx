import React from 'react'
import MatchCard from './components/MatchCard'
import HomePage from './pages/HomePage'
import BottomNav from './components/BottomNav'
import { Routes , Route } from 'react-router-dom'
import Contest from './pages/Contest'

const App = () => {
  return (
    <div className='max-w-[440px] mx-auto bg-white min-h-screen rounded-lg shadow relative overflow-hidden'>
      <div>
        <Routes>
          <Route path='/' element = {<HomePage/>} />
          <Route path='/:matchId/contest' element = {<Contest/>} />
        </Routes>
        <BottomNav/>
      </div>
    </div>
  )
}

export default App
