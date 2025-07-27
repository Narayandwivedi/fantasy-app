import React from 'react'
import MatchCard from './components/MatchCard'
import HomePage from './pages/HomePage'
import BottomNav from './components/BottomNav'

const App = () => {
  return (
    <div className='max-w-[440px] mx-auto bg-white min-h-screen rounded-lg shadow relative overflow-hidden'>
      <div>
        <HomePage/>
        <BottomNav/>
      </div>
    </div>
  )
}

export default App
