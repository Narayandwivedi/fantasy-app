import { useEffect, useState, createContext, useMemo, useCallback } from "react";
import axios from "axios";

export const AppContext = createContext();

export const AppContextProvider = (props) => {

  const BACKEND_URL = "https://api.winners11.in";
  // const BACKEND_URL = 'http://localhost:4000'


  const [allPlayers, setAllPlayers] = useState([]);

  const fetchAllPlayers = async () => {
    try {
      const { data } = await axios.get(`${BACKEND_URL}/api/players`, {
        withCredentials: true,
      });
      if (data.success) {
        
        setAllPlayers(data.allPlayers);
      }
    } catch (err) {
      console.log(err.message);
    }
  };

  useEffect(() => {
    fetchAllPlayers();
  }, []);

  const fetchAllPlayersCallback = useCallback(fetchAllPlayers, [BACKEND_URL]);

  const value = useMemo(() => ({
    BACKEND_URL,
    allPlayers,
    fetchAllPlayers: fetchAllPlayersCallback,
  }), [BACKEND_URL, allPlayers, fetchAllPlayersCallback]);

  return (
    <AppContext.Provider value={value}>{props.children}</AppContext.Provider>
  );
};
