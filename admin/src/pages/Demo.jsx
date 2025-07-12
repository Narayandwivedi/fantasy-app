import React from 'react'
import { useContext } from 'react'
import { AppContext } from '../context/AppContext'

const Demo = () => {
  const {BACKEND_URL} = useContext(AppContext)
  
  return (
    <div className='bg-gradient-to-b from-green-400 via-green-500 to-green-600 w-full h-screen relative overflow-hidden'>
      {/* Grass texture overlay */}
      <div className='absolute inset-0 opacity-40'>
        <div className='w-full h-full bg-gradient-to-br from-green-300 via-transparent to-green-700'></div>
      </div>
      
      {/* Ground pattern lines */}
      <div className='absolute inset-0 opacity-20'>
        <div className='w-full h-full' style={{
          backgroundImage: `repeating-linear-gradient(
            90deg,
            transparent,
            transparent 50px,
            rgba(34, 197, 94, 0.3) 50px,
            rgba(34, 197, 94, 0.3) 52px
          )`
        }}></div>
      </div>
      
      {/* Cricket pitch in the center */}
      <div className='absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2'>
        <div className='w-20 h-60 bg-gradient-to-b from-yellow-100 via-yellow-50 to-yellow-100 rounded-sm opacity-60 shadow-inner'>
          {/* Pitch markings */}
          <div className='absolute inset-0 flex flex-col justify-between p-1'>
            <div className='w-full h-0.5 bg-white opacity-70'></div>
            <div className='w-full h-0.5 bg-white opacity-70'></div>
          </div>
          {/* Stumps representation */}
          <div className='absolute top-2 left-1/2 transform -translate-x-1/2 w-1 h-2 bg-gray-600 opacity-50'></div>
          <div className='absolute bottom-2 left-1/2 transform -translate-x-1/2 w-1 h-2 bg-gray-600 opacity-50'></div>
        </div>
      </div>
      
      {/* Boundary circle */}
      <div className='absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2'>
        <div className='w-96 h-96 border-2 border-white opacity-20 rounded-full'></div>
      </div>
      
      {/* Ground shadows and depth */}
      <div className='absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-green-700 to-transparent opacity-60'></div>
      <div className='absolute top-0 left-0 right-0 h-20 bg-gradient-to-b from-green-300 to-transparent opacity-30'></div>
      
      {/* Player cards */}
      <div className='relative z-10 flex justify-between gap-3 mt-5 items-center px-4'>
        <div className='transform hover:scale-105 transition-transform duration-200'>
          <img src={`${BACKEND_URL}/images/players/player_1752311279580_compressed.png`} alt="" className='shadow-lg h-[80px] w-[80px] rounded-lg' />
          <p className='text-xs bg-white font-medium text-center rounded-b-lg px-2 py-1 shadow-md'>V. Kohli</p>
        </div>

        {/* ms dhoni */}
        
        <div className='transform hover:scale-105 transition-transform duration-200'>
          <img src={`${BACKEND_URL}/images/players/player_1752312322969_compressed.png`} alt="" className='shadow-lg h-[80px] w-[80px] rounded-lg' />
          <p className='text-xs bg-white font-medium text-center rounded-b-lg px-2 py-1 shadow-md'>MS. Dhoni</p>
        </div>
        
        {/* ishant sharma */}

        <div className='transform hover:scale-105 transition-transform duration-200'>
          <img src={`${BACKEND_URL}/images/players/player_1752312599324_compressed.png`} alt="" className='shadow-lg  h-[80px] w-[80px]rounded-lg' />
          <p className='text-xs bg-white font-medium text-center rounded-b-lg px-2 py-1 shadow-md'>I. Sharma</p>
        </div>
      </div>
      
    </div>
  )
}

export default Demo