import React, { useContext } from 'react'
import { Navigate } from 'react-router-dom'
import { AppContext } from '../context/AppContext'

const AdminProtectedRoute = ({ children }) => {
  const { isAdminAuthenticated, loading } = useContext(AppContext)

  // Show loading spinner while checking authentication
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-gray-800 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-white">Verifying admin access...</p>
        </div>
      </div>
    )
  }

  // Redirect to login if not authenticated
  if (!isAdminAuthenticated) {
    return <Navigate to="/login" replace />
  }

  // Render protected content if authenticated
  return <>{children}</>
}

export default AdminProtectedRoute