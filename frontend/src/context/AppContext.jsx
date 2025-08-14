import { useEffect, useState, createContext, useMemo, useCallback } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export const AppContext = createContext();

// Move BACKEND_URL outside component to prevent recreating on every render
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'https://api.myseries11.com'
// const BACKEND_URL ='http://localhost:4000'


export const AppContextProvider = (props) => {
  const navigate = useNavigate()

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
  }, []) // Removed isCheckingAuth from dependencies to prevent infinite loop

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
  }, [])

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
  }, [])

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
      navigate('/')
    }
  }, [navigate])

  // Refresh user data (useful after profile updates, balance changes, etc.)
  const refreshUser = useCallback(async () => {
    await checkAuthStatus()
  }, [checkAuthStatus])

  // Update user data locally (for optimistic updates)
  const updateUser = useCallback((userData) => {
    setUser(prevUser => ({ ...prevUser, ...userData }))
  }, [])

  // Get user's matches (contests grouped by matches)
  const getUserMatches = useCallback(async (userId) => {
    try {
      const response = await axios.get(`${BACKEND_URL}/api/contests/matches/${userId}`, {
        withCredentials: true
      })
      
      if (response.data.success) {
        return { success: true, data: response.data.data }
      } else {
        return { 
          success: false, 
          error: response.data.message || 'Failed to fetch matches' 
        }
      }
    } catch (error) {
      return { 
        success: false, 
        error: error.response?.data?.message || 'Failed to fetch matches' 
      }
    }
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
    checkAuthStatus,
    // Match data
    getUserMatches
  }), [user, isAuthenticated, loading, login, signup, logout, refreshUser, updateUser, checkAuthStatus, getUserMatches]);

  return (
    <AppContext.Provider value={value}>{props.children}</AppContext.Provider>
  );
};
