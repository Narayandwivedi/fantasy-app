import React, { useState } from 'react'
import axios from 'axios'
import { useContext } from 'react'
import { AppContext } from '../context/AppContext'
import { useEffect } from 'react'

const ManageMatch = () => {

  const [team1 , setTeam1] = useState()
  const [team2 , setTeam2] = useState()

  const {BACKEND_URL} = useContext(AppContext)

  async function fetchMatches(){
    const {data} =  await axios.get(`${BACKEND_URL}/api/matches`)
    console.log(data);
  }

  useEffect(()=>{
    fetchMatches()
  },[])

  return (
    <div>



      hell
    </div>
  )
}

export default ManageMatch
