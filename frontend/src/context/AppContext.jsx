import { useEffect } from "react";
import { useState } from "react";
import { createContext } from "react";
import axios from "axios";

export const AppContext = createContext();

export const AppContextProvider = (props) => {

  // const BACKEND_URL = "https://fantasy-backend-three.vercel.app";
  // const BACKEND_URL = 'http://localhost:4000'
  const BACKEND_URL = 'https://fantasybackend.winnersclubs.fun'


 
  const value = {
    BACKEND_URL,

  };

  return (
    <AppContext.Provider value={value}>{props.children}</AppContext.Provider>
  );
};
