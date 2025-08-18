import React, { useState, useContext } from 'react'
import { X } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { AppContext } from '../../context/AppContext'
import Navbar from '../../components/Navbar'

const Wallet = () => {
  const { user } = useContext(AppContext)
  const navigate = useNavigate()
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

  const handleProceedToPayment = () => {
    if (selectedAmount) {
      navigate('/qr-payment', { state: { amount: selectedAmount } })
    }
  }

  return (
    <div className="h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex flex-col overflow-hidden">
      <Navbar />


      {/* Main Content with Better Mobile Layout */}
      <div className="flex-1 p-3 sm:p-4 pb-20 overflow-hidden flex flex-col justify-center">
        {/* Amount Input Card */}
        <div className="bg-white rounded-2xl p-4 sm:p-6 shadow-lg mb-4 sm:mb-6 w-full max-w-full">
          <h3 className="text-gray-800 font-semibold text-base sm:text-lg mb-4 sm:mb-6">Choose Amount</h3>
          
          {/* Enhanced Custom Amount Input */}
          <div className="relative mb-6 sm:mb-8">
            <div className="flex items-center bg-gray-50 rounded-xl p-3 sm:p-4 border-2 border-gray-200 focus-within:border-blue-500 transition-colors w-full">
              <span className="text-xl sm:text-2xl font-bold text-gray-600 mr-2 flex-shrink-0">₹</span>
              <input
                type="number"
                value={customAmount}
                onChange={handleCustomAmountChange}
                placeholder="0"
                className="flex-1 text-xl sm:text-2xl font-bold bg-transparent outline-none min-w-0"
              />
              {customAmount && (
                <button
                  onClick={clearAmount}
                  className="ml-2 bg-gray-300 hover:bg-gray-400 rounded-full p-1.5 sm:p-2 transition-colors flex-shrink-0"
                >
                  <X size={14} className="sm:w-4 sm:h-4" />
                </button>
              )}
            </div>
          </div>

          {/* Quick Amount Selection with Better Mobile Layout */}
          <div className="space-y-3 sm:space-y-4">
            <p className="text-gray-600 font-medium text-sm sm:text-base">Quick Select</p>
            <div className="grid grid-cols-3 gap-2 sm:gap-3">
              {predefinedAmounts.map((amount) => (
                <button
                  key={amount}
                  onClick={() => handleAmountSelect(amount)}
                  className={`py-2 sm:py-3 px-2 sm:px-4 rounded-lg font-medium text-sm sm:text-base transition-all duration-200 ${
                    selectedAmount === amount
                      ? 'bg-blue-500 text-white shadow-lg transform scale-105'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200 active:scale-95'
                  }`}
                >
                  ₹{amount}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Payment Info Card */}
        <div className="bg-white rounded-2xl p-4 sm:p-6 shadow-lg w-full max-w-full">
          <h4 className="font-semibold text-gray-800 mb-2 sm:mb-3 text-sm sm:text-base">Payment Information</h4>
          <div className="space-y-1.5 sm:space-y-2">
            <div className="flex items-center text-xs sm:text-sm text-gray-600">
              <div className="w-2 h-2 bg-green-500 rounded-full mr-3 flex-shrink-0"></div>
              <span>100% Safe & Secure</span>
            </div>
            <div className="flex items-center text-xs sm:text-sm text-gray-600">
              <div className="w-2 h-2 bg-blue-500 rounded-full mr-3 flex-shrink-0"></div>
              <span>Instant Deposit via UPI</span>
            </div>
            <div className="flex items-center text-xs sm:text-sm text-gray-600">
              <div className="w-2 h-2 bg-purple-500 rounded-full mr-3 flex-shrink-0"></div>
              <span>Multiple Payment Options</span>
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced Fixed Bottom Button */}
      <div className="bg-white border-t border-gray-200 p-4 shadow-2xl">
        {selectedAmount ? (
          <button
            onClick={handleProceedToPayment}
            className="w-full py-4 bg-gradient-to-r from-green-500 to-green-600 text-white font-bold text-lg rounded-xl shadow-lg hover:from-green-600 hover:to-green-700 transition-all duration-200 transform active:scale-98"
          >
            PROCEED TO PAYMENT - ₹{selectedAmount}
          </button>
        ) : (
          <button
            disabled
            className="w-full py-4 rounded-xl font-bold text-lg bg-gray-200 text-gray-500 cursor-not-allowed"
          >
            SELECT AMOUNT TO PROCEED
          </button>
        )}
      </div>
    </div>
  )
}

export default Wallet