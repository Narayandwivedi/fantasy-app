import React from "react";
import { useContext } from "react";
import { AppContext } from "../../context/AppContext";
import axios from "axios";
import { useEffect } from "react";
import { useState } from "react";

const LiveMatch = () => {
  const { BACKEND_URL } = useContext(AppContext);
  const [LiveMatches , setLiveMatches] = useState([])

  async function fetchLiveMatch() {
    try {
      const { data } = await axios.get(`${BACKEND_URL}/api/matches/live`);
      setLiveMatches(data.data || [])
      console.log(data);
    } catch (err) {
      console.log(err.message);
    }
  }

  useEffect(()=>{
    fetchLiveMatch()
  },[])

  return <div>hello</div>;
};

export default LiveMatch;
