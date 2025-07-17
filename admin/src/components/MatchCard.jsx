import React from 'react'

const MatchCard = ({team1 = 'ind' , team1Logo , team2Logo , team2 = 'aus'  }) => {
  return (
    <div className='bg-white shadow-md rounded-lg p-4 mb-4 w-[100px] h-[100px] '>
      
      <div className='flex items-center justify-between'>
        <div className='flex items-center'>
          <img src={`https://flagcdn.com/w320/${team1}.webp`} alt={team1} className='w-8 h-8 mr-2' />
          <span className='text-sm font-semibold'>{team1}</span>
        </div>
        <div className='flex items-center'>
          <img src={`https://flagcdn.com/w320/${team2}.webp`} alt={team2} className='w-8 h-8 ml-2' />
          <span className='text-sm font-semibold'>{team2}</span>
        </div>
      </div>

    </div>
  )
}

export default MatchCard
