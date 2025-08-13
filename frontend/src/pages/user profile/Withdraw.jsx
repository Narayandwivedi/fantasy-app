import React, { useState, useContext } from 'react'
import { ArrowLeft, Wallet, CreditCard, IndianRupee, AlertCircle, CheckCircle, Info, X, Plus, Edit } from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'
import { AppContext } from '../../context/AppContext'
import Navbar from '../../components/Navbar'
import { toast } from 'react-toastify'
import axios from 'axios'

const Withdraw = () => {
  const { user, BACKEND_URL, refreshUser } = useContext(AppContext)
  const navigate = useNavigate()
  const [amount, setAmount] = useState('')
  const [paymentMethod, setPaymentMethod] = useState('') // 'bank' or 'upi'
  
  // Modal states
  const [showBankForm, setShowBankForm] = useState(false)
  const [showUpiForm, setShowUpiForm] = useState(false)
  const [isUpdatingBank, setIsUpdatingBank] = useState(false)
  const [isUpdatingUpi, setIsUpdatingUpi] = useState(false)
  
  // Bank form data
  const [bankData, setBankData] = useState({
    accountHolderName: '',
    accountNumber: '',
    ifscCode: '',
    bankName: ''
  })
  
  // UPI form data
  const [upiData, setUpiData] = useState({
    upiId: '',
    accountHolderName: ''
  })

  // Get actual balance data from context
  const withdrawableBalance = user?.withdrawableBalance || 0
  const totalBalance = user?.balance || 0

  // Handle adding bank account
  const handleAddBank = async (e) => {
    e.preventDefault()
    
    if (!bankData.accountHolderName || !bankData.accountNumber || !bankData.ifscCode || !bankData.bankName) {
      return toast.error('All fields are required')
    }

    try {
      const response = await axios.post(`${BACKEND_URL}/api/users/addbank`, {
        userId: user._id,
        ...bankData
      }, {
        withCredentials: true
      })

      if (response.data.success) {
        toast.success('Bank account added successfully!')
        setShowBankForm(false)
        setBankData({ accountHolderName: '', accountNumber: '', ifscCode: '', bankName: '' })
        // Refresh user data to show updated state
        await refreshUser()
      } else {
        toast.error(response.data.message || 'Failed to add bank account')
      }
    } catch (error) {
      console.error('Add bank error:', error)
      toast.error(error.response?.data?.message || 'Failed to add bank account')
    }
  }

  // Handle adding UPI
  const handleAddUpi = async (e) => {
    e.preventDefault()
    
    if (!upiData.upiId || !upiData.accountHolderName) {
      return toast.error('All fields are required')
    }

    try {
      const response = await axios.post(`${BACKEND_URL}/api/users/addupi`, {
        userId: user._id,
        ...upiData
      }, {
        withCredentials: true
      })

      if (response.data.success) {
        toast.success('UPI ID added successfully!')
        setShowUpiForm(false)
        setUpiData({ upiId: '', accountHolderName: '' })
        // Refresh user data to show updated state
        await refreshUser()
      } else {
        toast.error(response.data.message || 'Failed to add UPI ID')
      }
    } catch (error) {
      console.error('Add UPI error:', error)
      toast.error(error.response?.data?.message || 'Failed to add UPI ID')
    }
  }

  // Handle updating bank account
  const handleUpdateBank = async (e) => {
    e.preventDefault()
    
    if (!bankData.accountHolderName || !bankData.accountNumber || !bankData.ifscCode || !bankData.bankName) {
      return toast.error('All fields are required')
    }

    try {
      const response = await axios.put(`${BACKEND_URL}/api/users/updatebank`, {
        userId: user._id,
        ...bankData
      }, {
        withCredentials: true
      })

      if (response.data.success) {
        toast.success('Bank account updated successfully!')
        setShowBankForm(false)
        setIsUpdatingBank(false)
        setBankData({ accountHolderName: '', accountNumber: '', ifscCode: '', bankName: '' })
        // Refresh user data to show updated state
        await refreshUser()
      } else {
        toast.error(response.data.message || 'Failed to update bank account')
      }
    } catch (error) {
      console.error('Update bank error:', error)
      toast.error(error.response?.data?.message || 'Failed to update bank account')
    }
  }

  // Handle updating UPI
  const handleUpdateUpi = async (e) => {
    e.preventDefault()
    
    if (!upiData.upiId || !upiData.accountHolderName) {
      return toast.error('All fields are required')
    }

    try {
      const response = await axios.put(`${BACKEND_URL}/api/users/updateupi`, {
        userId: user._id,
        ...upiData
      }, {
        withCredentials: true
      })

      if (response.data.success) {
        toast.success('UPI ID updated successfully!')
        setShowUpiForm(false)
        setIsUpdatingUpi(false)
        setUpiData({ upiId: '', accountHolderName: '' })
        // Refresh user data to show updated state
        await refreshUser()
      } else {
        toast.error(response.data.message || 'Failed to update UPI ID')
      }
    } catch (error) {
      console.error('Update UPI error:', error)
      toast.error(error.response?.data?.message || 'Failed to update UPI ID')
    }
  }

  const handleWithdraw = async () => {
    const parsedAmount = Number(amount)
    
    if (!paymentMethod) {
      return toast.error('Please select a payment method')
    }
    
    // Check if user has added payment methods
    if (!user?.bankAccount && !user?.upiId) {
      return toast.error('Add bank account or UPI to withdraw')
    }
    
    // Check if selected method is actually added by user
    if (paymentMethod === 'bank' && !user?.bankAccount) {
      return toast.error('Please add bank account first')
    }
    
    if (paymentMethod === 'upi' && !user?.upiId) {
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
            {user?.bankAccount ? (
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
                    Added: ••••{user?.bankAccount?.accountNumber?.slice(-4)}
                  </p>
                  <button 
                    onClick={() => {
                      setIsUpdatingBank(true)
                      setShowBankForm(true)
                    }}
                    className="text-xs text-blue-600 mt-2 hover:underline flex items-center space-x-1"
                  >
                    <Edit className="w-3 h-3" />
                    <span>Change</span>
                  </button>
                  {paymentMethod === 'bank' && (
                    <CheckCircle className="w-5 h-5 text-blue-600 mt-2" />
                  )}
                </div>
              </div>
            ) : (
              <div className="bg-white p-4 rounded-xl shadow-sm border-2 border-gray-200 hover:border-blue-300 transition-all cursor-pointer">
                <div className="flex flex-col items-center">
                  <div className="bg-blue-100 p-3 rounded-full mb-3">
                    <CreditCard className="w-6 h-6 text-blue-600" />
                  </div>
                  <p className="text-gray-700 font-medium">Bank Account</p>
                  <p className="text-xs text-red-500 mt-1">Not Added</p>
                  <button 
                    onClick={() => setShowBankForm(true)}
                    className="text-xs text-blue-600 mt-2 hover:underline flex items-center space-x-1 hover:bg-blue-50 px-2 py-1 rounded"
                  >
                    <Plus className="w-3 h-3" />
                    <span>Add Bank Account</span>
                  </button>
                </div>
              </div>
            )}

            {/* UPI ID */}
            {user?.upiId ? (
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
                    Added: {user?.upiId?.upi}
                  </p>
                  <button 
                    onClick={() => {
                      setIsUpdatingUpi(true)
                      setShowUpiForm(true)
                    }}
                    className="text-xs text-purple-600 mt-2 hover:underline flex items-center space-x-1"
                  >
                    <Edit className="w-3 h-3" />
                    <span>Change</span>
                  </button>
                  {paymentMethod === 'upi' && (
                    <CheckCircle className="w-5 h-5 text-purple-600 mt-2" />
                  )}
                </div>
              </div>
            ) : (
              <div className="bg-white p-4 rounded-xl shadow-sm border-2 border-gray-200 hover:border-purple-300 transition-all cursor-pointer">
                <div className="flex flex-col items-center">
                  <div className="bg-purple-100 p-3 rounded-full mb-3">
                    <IndianRupee className="w-6 h-6 text-purple-600" />
                  </div>
                  <p className="text-gray-700 font-medium">UPI ID</p>
                  <p className="text-xs text-red-500 mt-1">Not Added</p>
                  <button 
                    onClick={() => setShowUpiForm(true)}
                    className="text-xs text-purple-600 mt-2 hover:underline flex items-center space-x-1 hover:bg-purple-50 px-2 py-1 rounded"
                  >
                    <Plus className="w-3 h-3" />
                    <span>Add UPI ID</span>
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
                  disabled={!user?.bankAccount}
                >
                  <CreditCard className="w-5 h-5 mx-auto mb-1" />
                  <div className="text-sm">Bank Transfer</div>
                  {user?.bankAccount && paymentMethod === 'bank' && (
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
                  disabled={!user?.upiId}
                >
                  <IndianRupee className="w-5 h-5 mx-auto mb-1" />
                  <div className="text-sm">UPI Transfer</div>
                  {user?.upiId && paymentMethod === 'upi' && (
                    <CheckCircle className="w-4 h-4 mx-auto mt-1 text-purple-600" />
                  )}
                </button>
              </div>
              
              {paymentMethod && (
                <p className="text-xs text-green-600 mt-2">
                  Selected: {paymentMethod === 'bank' 
                    ? `Bank Account (••••${user?.bankAccount?.accountNumber?.slice(-4)})` 
                    : `UPI ID (${user?.upiId?.upi})`}
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

        {/* Bank Account Modal */}
        {showBankForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl w-full max-w-md max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-bold text-gray-800">
                    {isUpdatingBank ? 'Update Bank Account' : 'Add Bank Account'}
                  </h2>
                  <button 
                    onClick={() => {
                      setShowBankForm(false)
                      setIsUpdatingBank(false)
                    }}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>

                <form onSubmit={isUpdatingBank ? handleUpdateBank : handleAddBank} className="space-y-4">
                  <div>
                    <label className="block text-gray-600 text-sm mb-2">Account Holder Name</label>
                    <input
                      type="text"
                      placeholder="Enter account holder name"
                      className="w-full p-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                      value={bankData.accountHolderName}
                      onChange={(e) => setBankData({...bankData, accountHolderName: e.target.value})}
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-gray-600 text-sm mb-2">Account Number</label>
                    <input
                      type="text"
                      placeholder="Enter account number"
                      className="w-full p-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                      value={bankData.accountNumber}
                      onChange={(e) => setBankData({...bankData, accountNumber: e.target.value})}
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-gray-600 text-sm mb-2">IFSC Code</label>
                    <input
                      type="text"
                      placeholder="Enter IFSC code"
                      className="w-full p-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                      value={bankData.ifscCode}
                      onChange={(e) => setBankData({...bankData, ifscCode: e.target.value.toUpperCase()})}
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-gray-600 text-sm mb-2">Bank Name</label>
                    <input
                      type="text"
                      placeholder="Enter bank name"
                      className="w-full p-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                      value={bankData.bankName}
                      onChange={(e) => setBankData({...bankData, bankName: e.target.value})}
                      required
                    />
                  </div>

                  <div className="flex space-x-3 mt-6">
                    <button
                      type="button"
                      onClick={() => {
                        setShowBankForm(false)
                        setIsUpdatingBank(false)
                      }}
                      className="flex-1 py-3 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="flex-1 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      {isUpdatingBank ? 'Update Bank Account' : 'Add Bank Account'}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}

        {/* UPI Modal */}
        {showUpiForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl w-full max-w-md">
              <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-bold text-gray-800">
                    {isUpdatingUpi ? 'Update UPI ID' : 'Add UPI ID'}
                  </h2>
                  <button 
                    onClick={() => {
                      setShowUpiForm(false)
                      setIsUpdatingUpi(false)
                    }}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>

                <form onSubmit={isUpdatingUpi ? handleUpdateUpi : handleAddUpi} className="space-y-4">
                  <div>
                    <label className="block text-gray-600 text-sm mb-2">UPI ID</label>
                    <input
                      type="text"
                      placeholder="Enter UPI ID (e.g., user@paytm)"
                      className="w-full p-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none"
                      value={upiData.upiId}
                      onChange={(e) => setUpiData({...upiData, upiId: e.target.value})}
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-gray-600 text-sm mb-2">Account Holder Name</label>
                    <input
                      type="text"
                      placeholder="Enter account holder name"
                      className="w-full p-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none"
                      value={upiData.accountHolderName}
                      onChange={(e) => setUpiData({...upiData, accountHolderName: e.target.value})}
                      required
                    />
                  </div>

                  <div className="flex space-x-3 mt-6">
                    <button
                      type="button"
                      onClick={() => {
                        setShowUpiForm(false)
                        setIsUpdatingUpi(false)
                      }}
                      className="flex-1 py-3 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="flex-1 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                    >
                      {isUpdatingUpi ? 'Update UPI ID' : 'Add UPI ID'}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default Withdraw
