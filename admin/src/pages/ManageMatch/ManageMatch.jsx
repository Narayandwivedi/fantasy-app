import React, { useState } from "react";
import axios from "axios";
import { useContext } from "react";
import { AppContext } from "../../context/AppContext";
import { useEffect } from "react";
import AddMatch from "./AddMatch";

const ManageMatch = () => {
  const [team1, setTeam1] = useState();
  const [team2, setTeam2] = useState();
  const [isAddMatchPopupOpen, setIsAddMatchPopupOpen] = useState(false);

  const { BACKEND_URL } = useContext(AppContext);


  function handleClosePopup(){

    setIsAddMatchPopupOpen(false)
    
  }

  async function fetchMatches() {
    const { data } = await axios.get(`${BACKEND_URL}/api/matches`);
    console.log(data);
  }

  async function createNewMatch(req, res) {}

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

      {/* add match popup */}
      {isAddMatchPopupOpen && (
        <AddMatch onClose = {handleClosePopup}/>
      )}
    </div>
  );
};

export default ManageMatch;