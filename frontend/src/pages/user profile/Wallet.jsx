import React, { useState, useContext } from 'react'
import { X } from 'lucide-react'
import { AppContext } from '../../context/AppContext'
import Navbar from '../../components/Navbar'

const Wallet = () => {
  const { user } = useContext(AppContext)
  const [selectedAmount, setSelectedAmount] = useState('')
  const [customAmount, setCustomAmount] = useState('')

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

  const redirectToPhonePe = () => {
    if (!selectedAmount) {
      alert('Please select or enter an amount')
      return
    }
    
    const transactionId = generateTransactionId()
    const phonepeURL = `phonepe://pay?pa=6262330338@ybl&pn=Winners11&am=${selectedAmount}&cu=INR&tn=${transactionId}`
    
    window.location.href = phonepeURL
    
    // Fallback for web
    setTimeout(() => {
      window.open(`https://phonepe.com/`, '_blank')
    }, 1000)
  }

  const redirectToGooglePay = () => {
    if (!selectedAmount) {
      alert('Please select or enter an amount')
      return
    }
    
    const transactionId = generateTransactionId()
    const gpayURL = `tez://upi/pay?pa=manojdwivedi777@oksbi&pn=Winners11&am=${selectedAmount}&cu=INR&tn=${transactionId}`
    
    window.location.href = gpayURL
    
    // Fallback for web
    setTimeout(() => {
      window.open(`https://pay.google.com/`, '_blank')
    }, 1000)
  }

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

      {/* Payment Options */}
      {selectedAmount && (
        <div className="fixed bottom-20 left-0 right-0 p-4 bg-white shadow-lg">
          <h3 className="text-center text-gray-600 text-sm mb-4">Choose Payment Method</h3>
          <div className="flex gap-3">
            <button
              onClick={redirectToPhonePe}
              className="flex-1 flex items-center justify-center gap-2 py-4 rounded-lg bg-purple-600 text-white font-bold text-lg hover:bg-purple-700 transition-colors"
            >
              <div className="w-6 h-6 bg-white rounded-full flex items-center justify-center">
                <span className="text-purple-600 font-bold text-sm">P</span>
              </div>
              PhonePe
            </button>
            <button
              onClick={redirectToGooglePay}
              className="flex-1 flex items-center justify-center gap-2 py-4 rounded-lg bg-blue-600 text-white font-bold text-lg hover:bg-blue-700 transition-colors"
            >
              <div className="w-6 h-6 bg-white rounded-full flex items-center justify-center">
                <span className="text-blue-600 font-bold text-sm">G</span>
              </div>
              Google Pay
            </button>
          </div>
          <p className="text-center text-gray-500 text-xs mt-2">Amount: ₹{selectedAmount}</p>
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