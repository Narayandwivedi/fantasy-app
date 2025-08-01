import React, { useState, useContext } from 'react'
import { AppContext } from '../context/AppContext'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'

const Login = () => {
  const { login, signup, BACKEND_URL } = useContext(AppContext)
  const navigate = useNavigate()
  const [isLogin, setIsLogin] = useState(true)
  const [loading, setLoading] = useState(false)
  const [showForgotPassword, setShowForgotPassword] = useState(false)
  const [otpSent, setOtpSent] = useState(false)

  // Login form state
  const [loginData, setLoginData] = useState({
    emailOrMobile: '',
    password: ''
  })

  // Signup form state
  const [signupData, setSignupData] = useState({
    fullName: '',
    email: '',
    mobile: '',
    password: '',
    confirmPassword: '',
    referedBy: ''
  })

  // Forgot password state
  const [forgotData, setForgotData] = useState({
    email: '',
    otp: '',
    newPassword: '',
    confirmNewPassword: ''
  })

  const [errors, setErrors] = useState({})

  // Handle login
  const handleLogin = async (e) => {
    e.preventDefault()
    setLoading(true)
    setErrors({})

    try {
      const result = await login(loginData)
      
      if (result.success) {
        navigate('/')
      } else {
        setErrors({
          login: result.error
        })
      }
    } catch (error) {
      setErrors({
        login: 'Login failed'
      })
    } finally {
      setLoading(false)
    }
  }

  // Handle signup
  const handleSignup = async (e) => {
    e.preventDefault()
    setLoading(true)
    setErrors({})

    // Validate passwords match
    if (signupData.password !== signupData.confirmPassword) {
      setErrors({ signup: 'Passwords do not match' })
      setLoading(false)
      return
    }

    try {
      const { confirmPassword, ...submitData } = signupData
      const result = await signup(submitData)
      
      if (result.success) {
        navigate('/')
      } else {
        setErrors({
          signup: result.error
        })
      }
    } catch (error) {
      setErrors({
        signup: 'Signup failed'
      })
    } finally {
      setLoading(false)
    }
  }

  // Handle forgot password - send OTP
  const handleSendOTP = async (e) => {
    e.preventDefault()
    setLoading(true)
    setErrors({})

    try {
      const response = await axios.post(`${BACKEND_URL}/api/auth/forgot-password`, {
        email: forgotData.email
      })
      
      if (response.data.success) {
        setOtpSent(true)
      }
    } catch (error) {
      setErrors({
        forgot: error.response?.data?.message || 'Failed to send OTP'
      })
    } finally {
      setLoading(false)
    }
  }

  // Handle reset password
  const handleResetPassword = async (e) => {
    e.preventDefault()
    setLoading(true)
    setErrors({})

    // Validate passwords match
    if (forgotData.newPassword !== forgotData.confirmNewPassword) {
      setErrors({ forgot: 'Passwords do not match' })
      setLoading(false)
      return
    }

    try {
      const response = await axios.post(`${BACKEND_URL}/api/auth/reset-password`, {
        email: forgotData.email,
        otp: forgotData.otp,
        newPass: forgotData.newPassword
      })
      
      if (response.data.success) {
        setShowForgotPassword(false)
        setOtpSent(false)
        setForgotData({ email: '', otp: '', newPassword: '', confirmNewPassword: '' })
        // Navigate to login form
        setIsLogin(true)
      }
    } catch (error) {
      setErrors({
        forgot: error.response?.data?.message || 'Password reset failed'
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="bg-gradient-to-br from-gray-900 via-slate-900 to-black min-h-screen max-w-md mx-auto relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-10 left-10 w-20 h-20 bg-yellow-300 rounded-full"></div>
        <div className="absolute top-32 right-8 w-16 h-16 bg-yellow-300 rounded-full"></div>
        <div className="absolute bottom-40 left-8 w-12 h-12 bg-yellow-300 rounded-full"></div>
        <div className="absolute bottom-20 right-12 w-24 h-24 bg-yellow-300 rounded-full"></div>
      </div>

      {/* Header with Logo */}
      <div className="pt-12 pb-8 px-6 text-center relative z-10">
        {/* Logo Container */}
        <div className="mb-6">
          <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center mx-auto shadow-lg">
            <div className="text-gray-900 font-bold text-2xl">
              W11
            </div>
          </div>
        </div>
        
        <div className="mb-2">
          <h1 className="text-3xl font-bold text-white mb-2">
            Winners<span className="text-yellow-300">11</span>
          </h1>
          <p className="text-white text-opacity-90 text-sm">
            {showForgotPassword ? 'Reset Your Password' : (isLogin ? 'Welcome Back!' : 'Join the Game')}
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="bg-white mx-4 rounded-t-3xl min-h-[60vh] relative z-10 shadow-2xl">
        <div className="p-6 pt-8">
        {!showForgotPassword ? (
          <>
            {/* Login/Signup Toggle */}
            <div className="flex bg-gray-100 rounded-xl p-1 mb-6">
              <button
                className={`flex-1 py-3 px-4 rounded-lg font-medium transition-all ${
                  isLogin ? 'bg-yellow-500 text-black shadow-md' : 'text-gray-600'
                }`}
                onClick={() => setIsLogin(true)}
              >
                Login
              </button>
              <button
                className={`flex-1 py-3 px-4 rounded-lg font-medium transition-all ${
                  !isLogin ? 'bg-yellow-500 text-black shadow-md' : 'text-gray-600'
                }`}
                onClick={() => setIsLogin(false)}
              >
                Sign Up
              </button>
            </div>

            {isLogin ? (
              /* Login Form */
              <form onSubmit={handleLogin} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email or Mobile Number
                  </label>
                  <input
                    type="text"
                    value={loginData.emailOrMobile}
                    onChange={(e) => setLoginData({...loginData, emailOrMobile: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 transition-all"
                    placeholder="Enter email or mobile number"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Password
                  </label>
                  <input
                    type="password"
                    value={loginData.password}
                    onChange={(e) => setLoginData({...loginData, password: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 transition-all"
                    placeholder="Enter password"
                    required
                  />
                </div>

                {errors.login && (
                  <div className="text-red-500 text-sm">{errors.login}</div>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-yellow-500 text-black py-3 px-4 rounded-xl font-medium hover:bg-yellow-600 disabled:bg-yellow-300 transition-colors shadow-lg"
                >
                  {loading ? 'Logging in...' : 'Login'}
                </button>

                <button
                  type="button"
                  onClick={() => setShowForgotPassword(true)}
                  className="w-full text-yellow-600 text-sm hover:underline font-medium"
                >
                  Forgot Password?
                </button>
              </form>
            ) : (
              /* Signup Form */
              <form onSubmit={handleSignup} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Full Name
                  </label>
                  <input
                    type="text"
                    value={signupData.fullName}
                    onChange={(e) => setSignupData({...signupData, fullName: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 transition-all"
                    placeholder="Enter full name"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email
                  </label>
                  <input
                    type="email"
                    value={signupData.email}
                    onChange={(e) => setSignupData({...signupData, email: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 transition-all"
                    placeholder="Enter email"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Mobile Number
                  </label>
                  <input
                    type="tel"
                    value={signupData.mobile}
                    onChange={(e) => setSignupData({...signupData, mobile: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 transition-all"
                    placeholder="Enter 10-digit mobile number"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Password
                  </label>
                  <input
                    type="password"
                    value={signupData.password}
                    onChange={(e) => setSignupData({...signupData, password: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 transition-all"
                    placeholder="Enter password"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Confirm Password
                  </label>
                  <input
                    type="password"
                    value={signupData.confirmPassword}
                    onChange={(e) => setSignupData({...signupData, confirmPassword: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 transition-all"
                    placeholder="Confirm password"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Referral Code (Optional)
                  </label>
                  <input
                    type="text"
                    value={signupData.referedBy}
                    onChange={(e) => setSignupData({...signupData, referedBy: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 transition-all"
                    placeholder="Enter referral code (optional)"
                  />
                </div>

                {errors.signup && (
                  <div className="text-red-500 text-sm">{errors.signup}</div>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-yellow-500 text-black py-3 px-4 rounded-lg font-medium hover:bg-yellow-600 disabled:bg-yellow-400 transition-colors"
                >
                  {loading ? 'Signing up...' : 'Sign Up'}
                </button>
              </form>
            )}
          </>
        ) : (
          /* Forgot Password Form */
          <>
            {!otpSent ? (
              <form onSubmit={handleSendOTP} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={forgotData.email}
                    onChange={(e) => setForgotData({...forgotData, email: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 transition-all"
                    placeholder="Enter your email"
                    required
                  />
                </div>

                {errors.forgot && (
                  <div className="text-red-500 text-sm">{errors.forgot}</div>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-yellow-500 text-black py-3 px-4 rounded-xl font-medium hover:bg-yellow-600 disabled:bg-yellow-300 transition-colors shadow-lg"
                >
                  {loading ? 'Sending OTP...' : 'Send OTP'}
                </button>

                <button
                  type="button"
                  onClick={() => setShowForgotPassword(false)}
                  className="w-full text-gray-600 text-sm hover:underline"
                >
                  Back to Login
                </button>
              </form>
            ) : (
              <form onSubmit={handleResetPassword} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    OTP
                  </label>
                  <input
                    type="text"
                    value={forgotData.otp}
                    onChange={(e) => setForgotData({...forgotData, otp: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 transition-all"
                    placeholder="Enter 6-digit OTP"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    New Password
                  </label>
                  <input
                    type="password"
                    value={forgotData.newPassword}
                    onChange={(e) => setForgotData({...forgotData, newPassword: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 transition-all"
                    placeholder="Enter new password"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Confirm New Password
                  </label>
                  <input
                    type="password"
                    value={forgotData.confirmNewPassword}
                    onChange={(e) => setForgotData({...forgotData, confirmNewPassword: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 transition-all"
                    placeholder="Confirm new password"
                    required
                  />
                </div>

                {errors.forgot && (
                  <div className="text-red-500 text-sm">{errors.forgot}</div>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-yellow-500 text-black py-3 px-4 rounded-lg font-medium hover:bg-yellow-600 disabled:bg-yellow-400 transition-colors"
                >
                  {loading ? 'Resetting Password...' : 'Reset Password'}
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setOtpSent(false)
                    setForgotData({...forgotData, otp: '', newPassword: '', confirmNewPassword: ''})
                  }}
                  className="w-full text-gray-600 text-sm hover:underline"
                >
                  Resend OTP
                </button>
              </form>
            )}
          </>
        )}
        </div>
      </div>
    </div>
  )
}

export default Login
