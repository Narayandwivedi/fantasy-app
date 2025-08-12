import React, { useState, useContext } from 'react'
import { ArrowLeft, Wallet, CreditCard, IndianRupee, AlertCircle, CheckCircle, Info } from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'
import { AppContext } from '../../context/AppContext'
import Navbar from '../../components/Navbar'
import { toast } from 'react-toastify'

const Withdraw = () => {
  const { user } = useContext(AppContext)
  const navigate = useNavigate()
  const [amount, setAmount] = useState('')
  const [paymentMethod, setPaymentMethod] = useState('') // 'bank' or 'upi'

  // Mock data - replace with actual data from context
  const withdrawableBalance = user?.balance || 0
  const totalBalance = user?.balance || 0

  const handleWithdraw = async () => {
    const parsedAmount = Number(amount)
    
    if (!paymentMethod) {
      return toast.error('Please select a payment method')
    }
    
    // Check if user has added payment methods (mock check - implement actual logic)
    if (!user?.isBankAdded && !user?.isUpiAdded) {
      return toast.error('Add bank account or UPI to withdraw')
    }
    
    // Check if selected method is actually added by user
    if (paymentMethod === 'bank' && !user?.isBankAdded) {
      return toast.error('Please add bank account first')
    }
    
    if (paymentMethod === 'upi' && !user?.isUpiAdded) {
      return toast.error('Please add UPI ID first')
    }
    
    if (!amount || parsedAmount < 1) {
      return toast.error('Minimum withdrawal amount is ₹1')
    }

    if (!Number.isInteger(parsedAmount)) {
      return toast.error('Please enter whole numbers only (no decimal values)')
    }

    
    // Mock withdrawal logic - replace with actual API call
    try {
      // const response = await withdrawFunds(user._id, parsedAmount, paymentMethod)
      toast.success('Withdrawal request submitted successfully!')
      
      // Reset form
      setAmount('')
      setPaymentMethod('')
    } catch (error) {
      toast.error('Withdrawal failed')
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      {/* Header */}
      <div className="bg-white border-b border-gray-200 p-4">
        <div className="flex items-center">
          <Link to="/wallet" className="mr-3">
            <ArrowLeft className="w-6 h-6 text-gray-600" />
          </Link>
          <div>
            <h1 className="text-xl font-bold text-gray-800">Withdraw Funds</h1>
            <p className="text-gray-500 text-sm">Transfer money to your account</p>
          </div>
        </div>
      </div>

      <div className="p-4 space-y-6">
        {/* Balance Cards */}
        <div className="grid grid-cols-1 gap-4">
          {/* Total Balance Card */}
          <div className="bg-gradient-to-r from-blue-600 to-blue-500 p-4 rounded-xl shadow-md text-white">
            <div className="flex justify-between items-center">
              <div className="flex items-center space-x-3">
                <div className="bg-white bg-opacity-20 p-2 rounded-full">
                  <Wallet className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-sm opacity-90">Total Balance</p>
                  <h2 className="text-xl font-bold">₹{totalBalance.toLocaleString()}</h2>
                </div>
              </div>
            </div>
          </div>

          {/* Withdrawable Balance Card */}
          <div className="bg-gradient-to-r from-green-600 to-green-500 p-4 rounded-xl shadow-md text-white">
            <div className="flex justify-between items-center">
              <div className="flex items-center space-x-3">
                <div className="bg-white bg-opacity-20 p-2 rounded-full">
                  <CreditCard className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-sm opacity-90">Withdrawable Balance</p>
                  <h2 className="text-xl font-bold">₹{withdrawableBalance.toLocaleString()}</h2>
                </div>
              </div>
              <Info className="w-5 h-5 opacity-70" title="Amount available for withdrawal" />
            </div>
          </div>
        </div>

        {/* Payment Methods */}
        <div>
          <h2 className="text-lg font-semibold text-gray-800 mb-3">Select Payment Method</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Bank Account */}
            {user?.isBankAdded ? (
              <div 
                className={`bg-white p-4 rounded-xl shadow-sm border-2 cursor-pointer transition-all ${
                  paymentMethod === 'bank' 
                    ? 'border-blue-500 ring-2 ring-blue-200' 
                    : 'border-gray-200 hover:border-blue-300'
                }`}
                onClick={() => setPaymentMethod('bank')}
              >
                <div className="flex flex-col items-center">
                  <div className="bg-blue-100 p-3 rounded-full mb-3">
                    <CreditCard className="w-6 h-6 text-blue-600" />
                  </div>
                  <p className="text-gray-700 font-medium">Bank Account</p>
                  <p className="text-xs text-green-600 mt-1">
                    Added: ••••{user?.accountNumber?.slice(-4)}
                  </p>
                  {paymentMethod === 'bank' && (
                    <CheckCircle className="w-5 h-5 text-blue-600 mt-2" />
                  )}
                </div>
              </div>
            ) : (
              <div className="bg-white p-4 rounded-xl shadow-sm border-2 border-gray-200 opacity-50">
                <div className="flex flex-col items-center">
                  <div className="bg-gray-100 p-3 rounded-full mb-3">
                    <CreditCard className="w-6 h-6 text-gray-400" />
                  </div>
                  <p className="text-gray-500 font-medium">Bank Account</p>
                  <p className="text-xs text-red-500 mt-1">Not Added</p>
                  <button className="text-xs text-blue-600 mt-2 hover:underline">
                    Add Bank Account
                  </button>
                </div>
              </div>
            )}

            {/* UPI ID */}
            {user?.isUpiAdded ? (
              <div 
                className={`bg-white p-4 rounded-xl shadow-sm border-2 cursor-pointer transition-all ${
                  paymentMethod === 'upi' 
                    ? 'border-purple-500 ring-2 ring-purple-200' 
                    : 'border-gray-200 hover:border-purple-300'
                }`}
                onClick={() => setPaymentMethod('upi')}
              >
                <div className="flex flex-col items-center">
                  <div className="bg-purple-100 p-3 rounded-full mb-3">
                    <IndianRupee className="w-6 h-6 text-purple-600" />
                  </div>
                  <p className="text-gray-700 font-medium">UPI ID</p>
                  <p className="text-xs text-green-600 mt-1">
                    Added: {user?.upi}
                  </p>
                  {paymentMethod === 'upi' && (
                    <CheckCircle className="w-5 h-5 text-purple-600 mt-2" />
                  )}
                </div>
              </div>
            ) : (
              <div className="bg-white p-4 rounded-xl shadow-sm border-2 border-gray-200 opacity-50">
                <div className="flex flex-col items-center">
                  <div className="bg-gray-100 p-3 rounded-full mb-3">
                    <IndianRupee className="w-6 h-6 text-gray-400" />
                  </div>
                  <p className="text-gray-500 font-medium">UPI ID</p>
                  <p className="text-xs text-red-500 mt-1">Not Added</p>
                  <button className="text-xs text-blue-600 mt-2 hover:underline">
                    Add UPI ID
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Withdrawal Form */}
        <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-200">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Enter Withdrawal Amount</h2>
          
          <div className="space-y-4">
            {/* Payment Method Selection Buttons */}
            <div>
              <label className="block text-gray-600 text-sm mb-3">Selected Payment Method</label>
              <div className="flex space-x-3">
                <button
                  type="button"
                  className={`flex-1 py-3 px-4 rounded-lg border-2 transition-all ${
                    paymentMethod === 'bank' 
                      ? 'bg-blue-50 border-blue-500 text-blue-700 font-medium' 
                      : 'border-gray-200 text-gray-600'
                  }`}
                  onClick={() => setPaymentMethod('bank')}
                  disabled={!user?.isBankAdded}
                >
                  <CreditCard className="w-5 h-5 mx-auto mb-1" />
                  <div className="text-sm">Bank Transfer</div>
                  {user?.isBankAdded && paymentMethod === 'bank' && (
                    <CheckCircle className="w-4 h-4 mx-auto mt-1 text-blue-600" />
                  )}
                </button>
                
                <button
                  type="button"
                  className={`flex-1 py-3 px-4 rounded-lg border-2 transition-all ${
                    paymentMethod === 'upi' 
                      ? 'bg-purple-50 border-purple-500 text-purple-700 font-medium' 
                      : 'border-gray-200 text-gray-600'
                  }`}
                  onClick={() => setPaymentMethod('upi')}
                  disabled={!user?.isUpiAdded}
                >
                  <IndianRupee className="w-5 h-5 mx-auto mb-1" />
                  <div className="text-sm">UPI Transfer</div>
                  {user?.isUpiAdded && paymentMethod === 'upi' && (
                    <CheckCircle className="w-4 h-4 mx-auto mt-1 text-purple-600" />
                  )}
                </button>
              </div>
              
              {paymentMethod && (
                <p className="text-xs text-green-600 mt-2">
                  Selected: {paymentMethod === 'bank' 
                    ? `Bank Account (••••${user?.accountNumber?.slice(-4)})` 
                    : `UPI ID (${user?.upi})`}
                </p>
              )}
            </div>
            
            {/* Amount Input */}
            <div>
              <label className="block text-gray-600 text-sm mb-2">Enter Amount (₹)</label>
              <input
                type="number"
                step="1"
                min="1"
                placeholder="Enter amount to withdraw"
                className="w-full p-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
              />
              <p className="text-xs text-gray-500 mt-1">
                Minimum: ₹1 • Whole numbers only
              </p>
            </div>
          </div>
          
          <button 
            onClick={handleWithdraw} 
            disabled={!paymentMethod || !amount}
            className={`w-full mt-6 py-3 rounded-lg font-semibold transition-all ${
              paymentMethod && amount 
                ? 'bg-gradient-to-r from-green-600 to-green-500 text-white hover:from-green-700 hover:to-green-600 shadow-md hover:shadow-lg' 
                : 'bg-gray-200 text-gray-500 cursor-not-allowed'
            }`}
          >
            Withdraw ₹{amount || '0'}
          </button>
        </div>

        {/* Withdrawal Rules */}
        <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-200">
          <h2 className="text-lg font-semibold text-gray-800 mb-3 flex items-center space-x-2">
            <AlertCircle className="w-5 h-5 text-blue-500" />
            <span>Withdrawal Rules</span>
          </h2>
          <ul className="space-y-3">
            <li className="flex items-start space-x-3">
              <CheckCircle className="w-4 h-4 text-green-500 mt-1 flex-shrink-0" />
              <span className="text-gray-600 text-sm">Minimum withdrawal amount is ₹1</span>
            </li>
            <li className="flex items-start space-x-3">
              <CheckCircle className="w-4 h-4 text-green-500 mt-1 flex-shrink-0" />
              <span className="text-gray-600 text-sm">Withdrawals processed within 5 minutes during business hours</span>
            </li>
            <li className="flex items-start space-x-3">
              <CheckCircle className="w-4 h-4 text-green-500 mt-1 flex-shrink-0" />
              <span className="text-gray-600 text-sm">Maximum 3 withdrawals allowed per day</span>
            </li>
            <li className="flex items-start space-x-3">
              <CheckCircle className="w-4 h-4 text-green-500 mt-1 flex-shrink-0" />
              <span className="text-gray-600 text-sm">Add valid bank account or UPI ID before withdrawing</span>
            </li>
            <li className="flex items-start space-x-3">
              <CheckCircle className="w-4 h-4 text-green-500 mt-1 flex-shrink-0" />
              <span className="text-gray-600 text-sm">Winning amount is instantly withdrawable</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  )
}

export default Withdraw
