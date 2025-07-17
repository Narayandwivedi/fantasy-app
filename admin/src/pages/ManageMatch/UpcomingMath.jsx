import React from 'react'
import axios from 'axios'
import { useContext } from 'react'
import { AppContext } from '../../context/AppContext'
import { useEffect } from 'react'

const UpcomingMath = () => {

    const {BACKEND_URL} = useContext(AppContext)


    const fetchUpcomingMatches = async ()=>{

       const {data} =  await axios.get(`${BACKEND_URL}/api/matches/upcoming`)
       console.log(data);
    }


    useEffect(()=>{
        fetchUpcomingMatches()
    },[])

  return (
    <div>

        hello
      
    </div>
  )
}

export default UpcomingMath
