import { useEffect } from "react";
import { useState } from "react";
import { createContext } from "react";
import axios from "axios";

export const AppContext = createContext();

export const AppContextProvider = (props) => {
  const BACKEND_URL = "http://localhost:4000";
  const [allPlayers, setAllPlayers] = useState([]);

  const fetchAllPlayers = async () => {
    try {
      const { data } = await axios.get(`${BACKEND_URL}/api/admin/players`);
      if (data.success) {
        setAllPlayers(data.allPlayers);
        console.log(data);
      }
    } catch (err) {
      console.log(err);
      toast.error("Failed to fetch players");
    }
  };

  useEffect(() => {
    fetchAllPlayers();
  }, []);

  const value = {
    BACKEND_URL,
    allPlayers,
  };


  return (
    <AppContext.Provider value={value}>{props.children}</AppContext.Provider>
  );
};
