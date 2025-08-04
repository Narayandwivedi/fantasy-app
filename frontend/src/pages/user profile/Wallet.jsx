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

  const handleAddCash = () => {
    if (!selectedAmount) {
      alert('Please select or enter an amount')
      return
    }
    // TODO: Implement payment gateway integration
    console.log('Adding cash:', selectedAmount)
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

      {/* Add Cash Button */}
      <div className="fixed bottom-20 left-0 right-0 p-4 bg-white shadow-lg">
        <button
          onClick={handleAddCash}
          disabled={!selectedAmount}
          className={`w-full py-4 rounded-lg font-bold text-lg transition-all duration-200 ${
            selectedAmount
              ? 'bg-gradient-to-r from-gray-900 via-slate-900 to-black text-white hover:from-gray-800 hover:via-slate-800 hover:to-gray-900 shadow-xl'
              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
          }`}
        >
          ADD CASH ₹{selectedAmount || '0'}
        </button>
      </div>
    </div>
  )
}

export default Wallet