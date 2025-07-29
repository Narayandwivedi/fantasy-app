import React from 'react'
import ContestCard from '../components/ContestCard'


const headToHead = [
    {entryFee:15 , price : 28 , maxTeamPerContest:1 , maxParticipants},
    {entryFee:55 , price:100 , maxTeamPerContest:1},
    {entryFee:85 , price:150 , maxTeamPerContest:1}
]

const WinnersTakesAll = [
     {entryFee:35 , price : 90 , maxTeamPerContest:1},
    {entryFee:55 , price:100 , maxTeamPerContest:1},
    {entryFee:85 , price:150 , maxTeamPerContest:1}


]

const Contest = () => {
  return (
    <div>


       <div>
         <h2 className='text-xl font-semibold'>head to head</h2>
         <ContestCard/>   
        </div> 
    </div>
  )
}

export default Contest
