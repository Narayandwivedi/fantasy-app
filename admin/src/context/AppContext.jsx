import { useEffect, useState, createContext, useMemo, useCallback } from "react";
import axios from "axios";

export const AppContext = createContext();

// Move BACKEND_URL outside component to prevent recreating on every render
// const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:4000'
const BACKEND_URL = 'https://api.series11.com'

export const AppContextProvider = (props) => {

  // Admin authentication state (similar to frontend pattern)
  const [adminUser, setAdminUser] = useState(null);
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(null); // null = loading, true/false = auth status
  const [loading, setLoading] = useState(true);
  const [isCheckingAuth, setIsCheckingAuth] = useState(false);

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

  const fetchAllPlayersCallback = useCallback(fetchAllPlayers, []);

  // Admin authentication functions (improved with loading states)
  const checkAdminAuth = useCallback(async () => {
    // Prevent multiple simultaneous auth checks
    if (isCheckingAuth) return
    
    try {
      setIsCheckingAuth(true)
      setLoading(true)
      const response = await axios.get(`${BACKEND_URL}/api/admin/status`, {
        withCredentials: true
      });
      
      if (response.data.isLoggedIn && response.data.user.role === 'admin') {
        setAdminUser(response.data.user);
        setIsAdminAuthenticated(true);
        console.log('Admin auth successful:', response.data.user);
        return true;
      } else {
        setAdminUser(null);
        setIsAdminAuthenticated(false);
        return false;
      }
    } catch (error) {
      console.error('Admin auth check failed:', error);
      setAdminUser(null);
      setIsAdminAuthenticated(false);
      return false;
    } finally {
      setLoading(false)
      setIsCheckingAuth(false)
    }
  }, []); // Removed isCheckingAuth from dependencies to prevent infinite loop

  // Check authentication status on app load
  useEffect(() => {
    // Only check auth if we haven't already checked
    if (isAdminAuthenticated === null && !adminUser) {
      checkAdminAuth()
    }
  }, [isAdminAuthenticated, adminUser, checkAdminAuth])

  useEffect(() => {
    fetchAllPlayers();
  }, []);

  // Admin login function
  const adminLogin = useCallback(async (loginData) => {
    try {
      const response = await axios.post(`${BACKEND_URL}/api/admin/login`, loginData, {
        withCredentials: true
      })
      
      if (response.data.success) {
        setIsAdminAuthenticated(true)
        setAdminUser(response.data.userData)
        console.log('Admin login successful, user data set:', response.data.userData)
        return { success: true }
      } else {
        return { 
          success: false, 
          error: response.data.message || 'Admin login failed' 
        }
      }
    } catch (error) {
      return { 
        success: false, 
        error: error.response?.data?.message || 'Admin login failed' 
      }
    }
  }, [])

  // Admin logout function (without navigation - let components handle navigation)
  const adminLogout = useCallback(async () => {
    try {
      await axios.post(`${BACKEND_URL}/api/admin/logout`, {}, {
        withCredentials: true
      });
    } catch (error) {
      console.error('Admin logout failed:', error);
    } finally {
      setAdminUser(null);
      setIsAdminAuthenticated(false);
      // Navigation will be handled by the component that calls this function
    }
  }, []);

  // Refresh admin data (useful after profile updates)
  const refreshAdminUser = useCallback(async () => {
    await checkAdminAuth()
  }, [checkAdminAuth])

  // Update admin data locally (for optimistic updates)
  const updateAdminUser = useCallback((userData) => {
    setAdminUser(prevUser => ({ ...prevUser, ...userData }))
  }, [])

  const value = useMemo(() => ({
    BACKEND_URL,
    allPlayers,
    fetchAllPlayers: fetchAllPlayersCallback,
    // Admin auth (following frontend pattern)
    adminUser,
    isAdminAuthenticated,
    loading,
    adminLogin,
    adminLogout,
    checkAdminAuth,
    refreshAdminUser,
    updateAdminUser,
  }), [BACKEND_URL, allPlayers, fetchAllPlayersCallback, adminUser, isAdminAuthenticated, loading, adminLogin, adminLogout, checkAdminAuth, refreshAdminUser, updateAdminUser]);

  return (
    <AppContext.Provider value={value}>{props.children}</AppContext.Provider>
  );
};
