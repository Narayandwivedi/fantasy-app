import { useEffect, useState, createContext, useMemo, useCallback } from "react";
import axios from "axios";

export const AppContext = createContext();

export const AppContextProvider = (props) => {

  // const BACKEND_URL = "https://fantasy-backend-three.vercel.app";
  // const BACKEND_URL = 'http://localhost:4000'
  const BACKEND_URL = 'https://fantasybackend.winnersclubs.fun'

  // Auth states
  const [user, setUser] = useState(null)
  const [isAuthenticated, setIsAuthenticated] = useState(null) // null = loading, true/false = auth status
  const [loading, setLoading] = useState(true)
  const [isCheckingAuth, setIsCheckingAuth] = useState(false)

  // Memoize functions to prevent re-renders
  const checkAuthStatus = useCallback(async () => {
    // Prevent multiple simultaneous auth checks
    if (isCheckingAuth) return
    
    try {
      setIsCheckingAuth(true)
      setLoading(true)
      const response = await axios.get(`${BACKEND_URL}/api/auth/status`, {
        withCredentials: true
      })
      
      if (response.data.isLoggedIn) {
        setIsAuthenticated(true)
        setUser(response.data.user)
        console.log(response.data.user);
        
      } else {
        setIsAuthenticated(false)
        setUser(null)
      }
    } catch (error) {
      console.log('Auth check failed:', error)
      setIsAuthenticated(false)
      setUser(null)
    } finally {
      setLoading(false)
      setIsCheckingAuth(false)
    }
  }, [BACKEND_URL, isCheckingAuth])

  // Check authentication status on app load
  useEffect(() => {
    // Only check auth if we haven't already checked
    if (isAuthenticated === null && !user) {
      checkAuthStatus()
    }
  }, [isAuthenticated, user, checkAuthStatus])


  // Login function
  const login = useCallback(async (loginData) => {
    try {
      const response = await axios.post(`${BACKEND_URL}/api/auth/login`, loginData, {
        withCredentials: true
      })
      
      if (response.data.success) {
        setIsAuthenticated(true)
        setUser(response.data.userData)
        console.log('Login successful, user data set:', response.data.userData)
        return { success: true }
      } else {
        return { 
          success: false, 
          error: response.data.message || 'Login failed' 
        }
      }
    } catch (error) {
      return { 
        success: false, 
        error: error.response?.data?.message || 'Login failed' 
      }
    }
  }, [BACKEND_URL])

  // Signup function
  const signup = useCallback(async (signupData) => {
    try {
      const response = await axios.post(`${BACKEND_URL}/api/auth/signup`, signupData, {
        withCredentials: true
      })
      
      if (response.data.success) {
        setIsAuthenticated(true)
        setUser(response.data.userData) // Now consistent with login
        console.log('Signup successful, user data set:', response.data.userData)
        return { success: true }
      } else {
        return { 
          success: false, 
          error: response.data.message || 'Signup failed' 
        }
      }
    } catch (error) {
      return { 
        success: false, 
        error: error.response?.data?.message || 'Signup failed' 
      }
    }
  }, [BACKEND_URL])

  // Logout function
  const logout = useCallback(async () => {
    try {
      await axios.post(`${BACKEND_URL}/api/auth/logout`, {}, {
        withCredentials: true
      })
    } catch (error) {
      console.log('Logout error:', error)
    } finally {
      setIsAuthenticated(false)
      setUser(null)
    }
  }, [BACKEND_URL])

  // Refresh user data (useful after profile updates, balance changes, etc.)
  const refreshUser = useCallback(async () => {
    await checkAuthStatus()
  }, [checkAuthStatus])

  // Update user data locally (for optimistic updates)
  const updateUser = useCallback((userData) => {
    setUser(prevUser => ({ ...prevUser, ...userData }))
  }, [])
 
  // Memoize context value to prevent unnecessary re-renders
  const value = useMemo(() => ({
    BACKEND_URL,
    // Auth values
    user,
    isAuthenticated,
    loading,
    login,
    signup,
    logout,
    refreshUser,
    updateUser,
    checkAuthStatus
  }), [user, isAuthenticated, loading, login, signup, logout, refreshUser, updateUser, checkAuthStatus]);

  return (
    <AppContext.Provider value={value}>{props.children}</AppContext.Provider>
  );
};
