import React, { useState, useContext, useEffect } from 'react'
import { X, Upload, Check, QrCode, Copy, CheckCircle } from 'lucide-react'
import { AppContext } from '../../context/AppContext'
import Navbar from '../../components/Navbar'
import QRCode from 'qrcode'

const Wallet = () => {
  const { user } = useContext(AppContext)
  const [selectedAmount, setSelectedAmount] = useState('')
  const [customAmount, setCustomAmount] = useState('')
  const [showPaymentProof, setShowPaymentProof] = useState(false)
  const [transactionId, setTransactionId] = useState('')
  const [screenshot, setScreenshot] = useState(null)
  const [currentTxnId, setCurrentTxnId] = useState('')
  const [qrCodeSVG, setQrCodeSVG] = useState('')
  const [copySuccess, setCopySuccess] = useState(false)

  // Predefined amount options
  const predefinedAmounts = [50, 100, 500, 1000, 2000, 5000]

  const handleAmountSelect = (amount) => {
    setSelectedAmount(amount)
    setCustomAmount(amount.toString())
  }

  const handleCustomAmountChange = (e) => {
    const value = e.target.value
    setCustomAmount(value)
    setSelectedAmount(value ? parseInt(value) : '')
  }

  const clearAmount = () => {
    setSelectedAmount('')
    setCustomAmount('')
  }

  const generateTransactionId = () => {
    return 'TXN' + Date.now() + Math.random().toString(36).substr(2, 9)
  }

  // Generate QR Code using proper qrcode library
  const generateQRCode = async (upiString) => {
    try {
      const svg = await QRCode.toString(upiString, {
        type: 'svg',
        errorCorrectionLevel: 'H',
        margin: 1,
        width: 200,
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

  // Generate UPI payment string (using PhonePe UPI for QR code too)
  const generateUPIString = (amount) => {
    return `upi://pay?pa=6262330338@ybl&am=${amount}&cu=INR`
  }

  // Copy UPI ID to clipboard
  const copyUPIId = async () => {
    try {
      await navigator.clipboard.writeText('6262330338@ybl')
      setCopySuccess(true)
      setTimeout(() => setCopySuccess(false), 2000)
    } catch (err) {
      alert('Failed to copy. UPI ID: 6262330338@ybl')
    }
  }

  // Copy UPI payment string to clipboard
  const copyPaymentString = async () => {
    if (!selectedAmount) {
      alert('Please select an amount first')
      return
    }
    
    const upiString = generateUPIString(selectedAmount)
    try {
      await navigator.clipboard.writeText(upiString)
      alert('UPI payment link copied! Open any UPI app and paste.')
    } catch (err) {
      alert(`Copy this UPI link: ${upiString}`)
    }
  }

  // Redirect to PhonePe (clean UPI without notes)
  const redirectToPhonePe = () => {
    if (!selectedAmount) {
      alert('Please select an amount first')
      return
    }
    
    // Clean UPI string - only essential parameters
    const upiURL = `upi://pay?pa=6262330338@ybl&am=${selectedAmount}&cu=INR`
    
    console.log('PhonePe UPI URL:', upiURL)
    
    // Try to open PhonePe directly
    window.location.href = upiURL
    
    // Fallback - copy to clipboard
    setTimeout(() => {
      navigator.clipboard.writeText(upiURL)
      alert('UPI link copied to clipboard. Open PhonePe and paste.')
    }, 1000)
  }

  // Redirect to Google Pay (same UPI as PhonePe for consistency)
  const redirectToGooglePay = () => {
    if (!selectedAmount) {
      alert('Please select an amount first')
      return
    }
    
    // Clean UPI string - only essential parameters
    const upiURL = `upi://pay?pa=6262330338@ybl&am=${selectedAmount}&cu=INR`
    
    console.log('Google Pay UPI URL:', upiURL)
    
    // Try to open Google Pay directly
    window.location.href = upiURL
    
    // Fallback - copy to clipboard
    setTimeout(() => {
      navigator.clipboard.writeText(upiURL)
      alert('UPI link copied to clipboard. Open Google Pay and paste.')
    }, 1000)
  }

  // Generate QR code when amount is selected
  useEffect(() => {
    if (selectedAmount) {
      const upiString = generateUPIString(selectedAmount)
      generateQRCode(upiString)
    }
  }, [selectedAmount])

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      {/* Balance Section */}
      <div className="bg-white p-4 shadow-sm border-b">
        <div className="flex items-center justify-between">
          <span className="text-gray-600 text-sm">Total Balance Available</span>
          <span className="text-xl font-bold text-gray-900">₹{user?.balance || 25.00}</span>
        </div>
      </div>

      {/* Main Content */}
      <div className="p-4 space-y-6">

        {/* Amount Selection */}
        <div className="bg-white rounded-xl p-4 shadow-sm">
          <h3 className="text-gray-600 text-sm mb-4">Amount to add</h3>
          
          {/* Custom Amount Input */}
          <div className="relative mb-4">
            <input
              type="number"
              value={customAmount}
              onChange={handleCustomAmountChange}
              placeholder="Enter amount"
              className="w-full text-2xl font-bold border-b-2 border-gray-300 focus:border-blue-500 outline-none pb-2"
            />
            {customAmount && (
              <button
                onClick={clearAmount}
                className="absolute right-2 top-2 bg-gray-200 rounded-full p-1"
              >
                <X size={16} />
              </button>
            )}
          </div>

          {/* Predefined Amount Options */}
          <div className="grid grid-cols-3 gap-3">
            {predefinedAmounts.map((amount) => (
              <button
                key={amount}
                onClick={() => handleAmountSelect(amount)}
                className={`py-3 px-4 rounded-lg border-2 text-center font-medium transition-colors ${
                  selectedAmount === amount
                    ? 'border-blue-500 bg-blue-50 text-blue-600'
                    : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300'
                }`}
              >
                ₹{amount}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* QR Code Payment Section */}
      {selectedAmount && (
        <div className="fixed bottom-20 left-0 right-0 p-4 bg-white shadow-lg border-t">
          <div className="max-w-sm mx-auto">
            <h3 className="text-center text-gray-800 font-semibold mb-4">Scan QR Code to Pay</h3>
            
            {/* QR Code Display */}
            <div className="bg-white p-4 rounded-xl border-2 border-gray-200 mb-4">
              <div className="flex justify-center">
                {qrCodeSVG ? (
                  <div 
                    className="w-48 h-48"
                    dangerouslySetInnerHTML={{ __html: qrCodeSVG }} 
                  />
                ) : (
                  <div className="w-48 h-48 bg-gray-100 rounded-lg flex items-center justify-center">
                    <QrCode size={48} className="text-gray-400" />
                  </div>
                )}
              </div>
              
              {/* Amount Display */}
              <div className="text-center mt-3">
                <p className="text-2xl font-bold text-green-600">₹{selectedAmount}</p>
                <p className="text-sm text-gray-500">Scan with any UPI app</p>
              </div>
            </div>
            
            {/* UPI ID Display */}
            <div className="bg-gray-50 rounded-lg p-3 mb-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-gray-500">UPI ID</p>
                  <p className="font-mono font-medium text-gray-800">6262330338@ybl</p>
                </div>
                <button
                  onClick={copyUPIId}
                  className="flex items-center gap-1 px-3 py-1.5 bg-blue-100 text-blue-700 rounded-md text-sm font-medium hover:bg-blue-200 transition-colors"
                >
                  {copySuccess ? <CheckCircle size={16} /> : <Copy size={16} />}
                  {copySuccess ? 'Copied!' : 'Copy'}
                </button>
              </div>
              
            </div>
            
            {/* Quick Payment Methods */}
            <div className="space-y-3">
              <p className="text-center text-sm font-medium text-gray-700">Choose Payment Method</p>
              
              {/* PhonePe and Google Pay Buttons */}
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={redirectToPhonePe}
                  className="flex items-center justify-center gap-2 py-3 px-4 bg-purple-600 text-white font-semibold rounded-lg hover:bg-purple-700 transition-colors shadow-md"
                >
                  <div className="w-5 h-5 bg-white rounded-full flex items-center justify-center">
                    <span className="text-purple-600 font-bold text-xs">P</span>
                  </div>
                  PhonePe
                </button>
                
                <button
                  onClick={redirectToGooglePay}
                  className="flex items-center justify-center gap-2 py-3 px-4 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors shadow-md"
                >
                  <div className="w-5 h-5 bg-white rounded-full flex items-center justify-center">
                    <span className="text-blue-600 font-bold text-xs">G</span>
                  </div>
                  Google Pay
                </button>
              </div>
              
              {/* Divider */}
              <div className="flex items-center my-3">
                <div className="flex-1 border-t border-gray-300"></div>
                <span className="px-3 text-xs text-gray-500">OR</span>
                <div className="flex-1 border-t border-gray-300"></div>
              </div>
              
              {/* Copy Link Button */}
              <button
                onClick={copyPaymentString}
                className="w-full py-2.5 bg-gray-100 text-gray-700 font-medium rounded-lg hover:bg-gray-200 transition-colors border border-gray-300"
              >
                Copy Payment Link
              </button>
              
              <p className="text-center text-xs text-gray-500 mt-2">
                Scan QR code above or use payment buttons for quick access
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Add Cash Button (when no amount selected) */}
      {!selectedAmount && (
        <div className="fixed bottom-20 left-0 right-0 p-4 bg-white shadow-lg">
          <button
            disabled
            className="w-full py-4 rounded-lg font-bold text-lg bg-gray-300 text-gray-500 cursor-not-allowed"
          >
            SELECT AMOUNT TO PROCEED
          </button>
        </div>
      )}
    </div>
  )
}

export default Wallet