import React, { useState, useEffect, useContext } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { ArrowLeft, Copy, CheckCircle } from 'lucide-react'
import { AppContext } from '../context/AppContext'
import QRCode from 'qrcode'
import axios from 'axios'
import { toast } from 'react-toastify'

const QRPayment = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const { user } = useContext(AppContext)
  const [qrCodeSVG, setQrCodeSVG] = useState('')
  const [copySuccess, setCopySuccess] = useState(false)
  const [utr, setUtr] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [timeLeft, setTimeLeft] = useState(300) // 5 minutes in seconds

  // Get amount from navigation state
  const amount = location.state?.amount

  // Redirect back if no amount
  useEffect(() => {
    if (!amount) {
      navigate('/wallet')
      return
    }
  }, [amount, navigate])

  // Timer countdown effect
  useEffect(() => {
    if (timeLeft <= 0) {
      navigate('/')
      return
    }

    const timer = setInterval(() => {
      setTimeLeft(prev => prev - 1)
    }, 1000)

    return () => clearInterval(timer)
  }, [timeLeft, navigate])

  // Format time as MM:SS
  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`
  }

  // Generate UPI payment string
  const generateUPIString = (amount) => {
    return `upi://pay?pa=myseries11official@oksbi&am=${amount}&cu=INR`
  }

  // Generate QR Code
  const generateQRCode = async (upiString) => {
    try {
      const svg = await QRCode.toString(upiString, {
        type: 'svg',
        errorCorrectionLevel: 'H',
        margin: 1,
        width: 160,
        color: {
          dark: '#000000',
          light: '#FFFFFF'
        }
      })
      setQrCodeSVG(svg)
    } catch (err) {
      console.error('QR code generation failed:', err)
    }
  }

  // Generate QR code when component mounts
  useEffect(() => {
    if (amount) {
      const upiString = generateUPIString(amount)
      generateQRCode(upiString)
    }
  }, [amount])

  // Copy UPI ID to clipboard
  const copyUPIId = async () => {
    try {
      await navigator.clipboard.writeText('myseries11official@oksbi')
      setCopySuccess(true)
      setTimeout(() => setCopySuccess(false), 2000)
    } catch (err) {
      toast.error('Failed to copy. UPI ID: myseries11official@oksbi', { autoClose: 600 })
    }
  }

  // Handle UTR submission
  const handleSubmitUTR = async (e) => {
    e.preventDefault()
    
    if (!utr.trim()) {
      toast.error('Please enter UTR/Transaction ID', { autoClose: 600 })
      return
    }

    if (utr.trim().length < 10 || utr.trim().length > 20) {
      toast.error('Please enter a valid UTR (10-20 characters)', { autoClose: 600 })
      return
    }

    setIsSubmitting(true)
    
    try {
      const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/deposits`, {
        userId: user?._id,
        amount: amount,
        UTR: utr.trim()
      }, {
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        withCredentials: true // Include cookies for auth
      })
      
      const data = response.data
      
      if (data.success) {
        // Show simple success message for all cases
        toast.success(`Balance added successfully!`, { 
          autoClose: 600
        })
        
        // Reset form and navigate to fantasy sport page immediately
        setUtr('')
        navigate('/fantasy-sport')
        
      } else {
        toast.error(`Error: ${data.message}`, { autoClose: 600 })
      }
      
    } catch (error) {
      console.error('UTR submission error:', error)
      const errorMessage = error.response?.data?.message || 'Failed to submit payment. Please check your connection and try again.'
      toast.error(`Error: ${errorMessage}`, { autoClose: 600 })
    } finally {
      setIsSubmitting(false)
    }
  }

  if (!amount) {
    return null // Will redirect
  }

  return (
    <div className="h-screen bg-gray-50 flex flex-col overflow-hidden">
      {/* Timer Header */}
      <div className="bg-white shadow-sm border-b px-4 py-3 flex-shrink-0">
        <div className="flex items-center justify-between">
          <button
            onClick={() => navigate('/wallet')}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ArrowLeft size={20} className="text-gray-600" />
          </button>
          <div className="text-center">
            <p className="text-sm text-gray-600">Complete payment within</p>
            <p className={`text-lg font-bold ${timeLeft <= 60 ? 'text-red-600' : 'text-orange-600'}`}>
              {formatTime(timeLeft)}
            </p>
          </div>
          <div className="w-10"></div> {/* Spacer for center alignment */}
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col justify-between p-2">
        <div className="bg-white rounded-2xl shadow-lg p-6 w-full max-w-md mx-auto flex-1 flex flex-col justify-start">
        
        {/* QR Code Section */}
        <div className="text-center mb-5">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Scan to Pay ₹{amount}</h2>
          
          {/* QR Code Display */}
          <div className="bg-gray-50 p-4 rounded-xl mb-4">
            {qrCodeSVG ? (
              <div 
                className="flex justify-center"
                dangerouslySetInnerHTML={{ __html: qrCodeSVG }} 
              />
            ) : (
              <div className="w-32 h-32 bg-gray-100 rounded-lg flex items-center justify-center mx-auto">
                <span className="text-gray-400 text-sm">Loading QR Code...</span>
              </div>
            )}
          </div>

          {/* UPI ID Display */}
          <div className="bg-gray-50 rounded-lg p-3 mb-4">
            <div className="flex items-center justify-between">
              <div className="text-left">
                <p className="text-xs text-gray-500">UPI ID</p>
                <p className="font-mono font-medium text-gray-800 text-sm">myseries11official@oksbi</p>
              </div>
              <button
                onClick={copyUPIId}
                className="flex items-center gap-1 px-3 py-2 bg-blue-100 text-blue-700 rounded-md text-xs font-medium hover:bg-blue-200 transition-colors"
              >
                {copySuccess ? <CheckCircle size={14} /> : <Copy size={14} />}
                {copySuccess ? 'Copied!' : 'Copy'}
              </button>
            </div>
          </div>
        </div>

        {/* UTR Input Section */}
        <div className="border-t pt-4">
          <h3 className="text-sm font-semibold text-gray-800 mb-3">Enter UTR after payment</h3>
          
          {/* Warning Message */}
          <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-4">
            <div className="flex items-start gap-2">
              <div className="w-4 h-4 rounded-full bg-red-500 flex-shrink-0 mt-0.5">
                <span className="block w-full h-full text-white text-xs text-center leading-4">!</span>
              </div>
              <p className="text-xs text-red-700">
                <strong>Important:</strong> Invalid UTR leads to account suspension. Only submit genuine payment references.
              </p>
            </div>
          </div>
          
          <form onSubmit={handleSubmitUTR} className="space-y-4">
            <div>
              <input
                type="text"
                value={utr}
                onChange={(e) => setUtr(e.target.value)}
                placeholder="Enter 12-digit UTR number"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono text-sm"
                disabled={isSubmitting}
              />
              <p className="text-xs text-gray-500 mt-2">
                Find UTR in payment confirmation message
              </p>
            </div>
            
            <button
              type="submit"
              disabled={isSubmitting || !utr.trim()}
              className="w-full py-3 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
            >
              {isSubmitting ? 'Submitting...' : 'Confirm Payment'}
            </button>
          </form>
        </div>
        </div>
      </div>
    </div>
  )
}

export default QRPayment