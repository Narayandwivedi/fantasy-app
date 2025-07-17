import React, { useState } from "react";
import axios from "axios";
import { useContext } from "react";
import { AppContext } from "../../context/AppContext";
import { useEffect } from "react";
import AddMatch from "./AddMatch";

const ManageMatch = () => {
  const [team1, setTeam1] = useState();
  const [team2, setTeam2] = useState();
  const [allMatches, setAllMatches] = useState([]);
  const [isAddMatchPopupOpen, setIsAddMatchPopupOpen] = useState(false);

  const { BACKEND_URL } = useContext(AppContext);


  function handleClosePopup(){

    setIsAddMatchPopupOpen(false)
    
  }

  async function fetchMatches() {
    const { data } = await axios.get(`${BACKEND_URL}/api/matches`);
    console.log(data);
    
    setAllMatches(data.data || []);
    console.log(data);
  }


  useEffect(() => {
    fetchMatches();
  }, []);

  return (
    <div className="p-5 w-full">
      {/*  topbar*/}
      <div className="">
        <div className="bg-gray-200 max-w-3xl py-2 flex items-center justify-between px-4">
          <button className="bg-violet-500 text-white text-sm py-2 px-3">
            upcoming
          </button>
          <button className="bg-violet-500 text-white text-sm py-2 px-3">
            live
          </button>
          <button className="bg-violet-500 text-white text-sm py-2 px-3">
            completed
          </button>
        </div>

        {/* add match button */}
        <div 
          onClick={() => setIsAddMatchPopupOpen(true)} 
          className="bg-green-600 w-[100px] cursor-pointer px-2 py-2 text-white rounded-md mt-3 hover:bg-green-700 transition-colors"
        >
          Add Match
        </div>
      </div>


      {/* matches */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-5">
           {
            allMatches.map((match) => (
              <div key={match._id} className="bg-white shadow-md rounded-lg p-4 mb-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center">   
                    <img 
                      src={`${BACKEND_URL}${match.team1.logo} `}      
                      alt={match.team1.name}
                      className="w-8 h-8 mr-2"
                    />
                    <span className="text-sm font-semibold">{match.team1.name}</span>
                  </div>  
                  <div className="flex items-center">
                    <img
                      src={`${BACKEND_URL}${match.team2.logo} `}
                      alt={match.team2.name}
                      className="w-8 h-8 ml-2"
                    />
                    <span className="text-sm font-semibold">{match.team2.name}</span>
                  </div>  
                </div>
                <div className="text-sm text-gray-600">
                  <p>Sport: {match.sport}</p>
                  <p>Match Type: {match.matchType}</p>    
                  <p>Series: {match.series}</p>
                  <p>Venue: {match.venue}</p>
                  <p>Start Time: {new Date(match.startTime).toLocaleString()}</p>
                  <p>End Time: {new Date(match.endTime).toLocaleString()}</p>
                  <p>Status: {match.status}</p>
                </div>
              </div>
            ))    
           }
        
       </div>



      {/* add match popup */}
      {isAddMatchPopupOpen && (
        <AddMatch onClose = {handleClosePopup}/>
      )}
    </div>
  );
};

export default ManageMatch;