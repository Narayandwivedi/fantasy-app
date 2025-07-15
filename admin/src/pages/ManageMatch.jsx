import React, { useState } from "react";
import axios from "axios";
import { useContext } from "react";
import { AppContext } from "../context/AppContext";
import { useEffect } from "react";

const ManageMatch = () => {
  const [team1, setTeam1] = useState();
  const [team2, setTeam2] = useState();
  const [isAddMatchPopupOpen, setIsMatchAddPopupOpen] = useState(false);

  const { BACKEND_URL } = useContext(AppContext);

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
          onClick={() => setIsMatchAddPopupOpen(true)} 
          className="bg-green-600 w-[100px] cursor-pointer px-2 py-2 text-white rounded-md mt-3 hover:bg-green-700 transition-colors"
        >
          Add Match
        </div>
      </div>

      {/* add match popup */}
      {isAddMatchPopupOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Add New Match</h2>
              <button 
                onClick={() => setIsMatchAddPopupOpen(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Team 1 ID</label>
                <input
                  className="w-full border border-gray-300 px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-violet-500"
                  placeholder="Enter team 1 id"
                  type="text"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Team 2 ID</label>
                <input
                  className="w-full border border-gray-300 px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-violet-500"
                  placeholder="Enter team 2 id"
                  type="text"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Match Format</label>
                <select 
                  className="w-full border border-gray-300 px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-violet-500"
                >
                  <option value="">Select format</option>
                  <option value="t20">T20</option>
                  <option value="t10">T10</option>
                  <option value="odi">ODI</option>
                  <option value="test">Test Match</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Series</label>
                <input
                  className="w-full border border-gray-300 px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-violet-500"
                  placeholder="Select series"
                  type="text"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
                <input
                  className="w-full border border-gray-300 px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-violet-500"
                  type="date"
                />
              </div>
              
              <button className="w-full bg-violet-500 text-white py-2 rounded-md hover:bg-violet-600 transition-colors">
                Create Match
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageMatch;