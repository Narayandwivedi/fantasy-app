import React, { useState, useContext } from 'react'
import { AppContext } from '../context/AppContext'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { toast } from 'react-toastify'

const VerifyUser = () => {
  const { BACKEND_URL, user } = useContext(AppContext)
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)

  const [formData, setFormData] = useState({
    dateOfBirth: '',
    state: '',
    aadhaarFrontImage: null,
    aadhaarBackImage: null
  })

  const [errors, setErrors] = useState({})
  const [frontImagePreview, setFrontImagePreview] = useState(null)
  const [backImagePreview, setBackImagePreview] = useState(null)

  const indianStates = [
    'Andaman and Nicobar Islands',
    'Arunachal Pradesh', 
    'Bihar',
    'Chandigarh',
    'Chhattisgarh',
    'Dadra and Nagar Haveli',
    'Daman and Diu',
    'Delhi',
    'Goa',
    'Gujarat',
    'Haryana',
    'Himachal Pradesh',
    'Jammu and Kashmir',
    'Jharkhand',
    'Karnataka',
    'Kerala',
    'Ladakh',
    'Lakshadweep',
    'Madhya Pradesh',
    'Maharashtra',
    'Manipur',
    'Meghalaya',
    'Mizoram',
    'Odisha',
    'Puducherry',
    'Punjab',
    'Rajasthan',
    'Tamil Nadu',
    'Tripura',
    'Uttar Pradesh',
    'Uttarakhand',
    'West Bengal'
  ]


  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
    
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }))
    }
  }


  const handleImageChange = (e, imageType) => {
    const file = e.target.files[0]
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setErrors(prev => ({
          ...prev,
          [imageType]: 'Image size should be less than 5MB'
        }))
        return
      }

      if (!file.type.startsWith('image/')) {
        setErrors(prev => ({
          ...prev,
          [imageType]: 'Please select a valid image file'
        }))
        return
      }

      setFormData(prev => ({
        ...prev,
        [imageType]: file
      }))

      const reader = new FileReader()
      reader.onload = () => {
        if (imageType === 'aadhaarFrontImage') {
          setFrontImagePreview(reader.result)
        } else {
          setBackImagePreview(reader.result)
        }
      }
      reader.readAsDataURL(file)

      if (errors[imageType]) {
        setErrors(prev => ({
          ...prev,
          [imageType]: ''
        }))
      }
    }
  }

  const validateForm = () => {
    const newErrors = {}

    if (!formData.dateOfBirth) {
      newErrors.dateOfBirth = 'Date of birth is required'
    }

    if (!formData.state) {
      newErrors.state = 'State is required'
    }

    if (!formData.aadhaarFrontImage) {
      newErrors.aadhaarFrontImage = 'Please upload Aadhaar front image'
    }

    if (!formData.aadhaarBackImage) {
      newErrors.aadhaarBackImage = 'Please upload Aadhaar back image'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!validateForm()) {
      return
    }

    setLoading(true)

    try {
      const submitFormData = new FormData()
      submitFormData.append('dateOfBirth', formData.dateOfBirth)
      submitFormData.append('state', formData.state)
      submitFormData.append('aadhaarFrontImage', formData.aadhaarFrontImage)
      submitFormData.append('aadhaarBackImage', formData.aadhaarBackImage)

      const response = await axios.post(`${BACKEND_URL}/api/auth/verify-aadhaar`, submitFormData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      })

      if (response.data.success) {
        toast.success('Aadhaar verification submitted successfully!')
        navigate('/fantasy-sport')
      } else {
        toast.error(response.data.message || 'Verification failed')
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="bg-gradient-to-br from-blue-50 via-white to-indigo-50 min-h-screen max-w-md mx-auto relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-10 left-4 w-20 h-20 bg-blue-400 rounded-full blur-xl"></div>
        <div className="absolute top-32 right-8 w-16 h-16 bg-indigo-400 rounded-full blur-lg"></div>
        <div className="absolute bottom-40 left-6 w-12 h-12 bg-purple-400 rounded-full blur-lg"></div>
        <div className="absolute bottom-20 right-4 w-24 h-24 bg-blue-300 rounded-full blur-xl"></div>
      </div>

      {/* Main Content */}
      <div className="min-h-screen relative z-10">
        <div className="px-6 pt-12 pb-8">
          {/* Header */}
          <div className="text-center mb-10">
            <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full mx-auto mb-6 flex items-center justify-center shadow-lg">
              <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h1 className="text-3xl font-bold text-gray-800 mb-3">
              Aadhaar Verification
            </h1>
            <p className="text-gray-600 text-base">
              Secure your account with quick verification
            </p>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Personal Information Card */}
            <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
              <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                <svg className="w-5 h-5 text-blue-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                Personal Information
              </h3>
              
              <div className="space-y-5">
                {/* Date of Birth */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Date of Birth
                  </label>
                  <input
                    type="date"
                    name="dateOfBirth"
                    value={formData.dateOfBirth}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition-all text-gray-800 text-sm bg-gray-50 hover:bg-white"
                  />
                  {errors.dateOfBirth && (
                    <p className="text-red-500 text-sm mt-2 font-medium flex items-center">
                      <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                      </svg>
                      {errors.dateOfBirth}
                    </p>
                  )}
                </div>

                {/* State Selection */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    State / Union Territory
                  </label>
                  <select
                    name="state"
                    value={formData.state}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition-all text-gray-800 text-sm bg-gray-50 hover:bg-white"
                  >
                    <option value="">Select State / Union Territory</option>
                    {indianStates.map((state) => (
                      <option key={state} value={state}>
                        {state}
                      </option>
                    ))}
                  </select>
                  {errors.state && (
                    <p className="text-red-500 text-sm mt-2 font-medium flex items-center">
                      <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                      </svg>
                      {errors.state}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Document Upload Card */}
            <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
              <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                <svg className="w-5 h-5 text-blue-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                Document Upload
              </h3>

              <div className="space-y-6">
                {/* Aadhaar Front Image Upload */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-3">
                    Aadhaar Card Front
                  </label>
                  <div className="border-2 border-dashed border-blue-200 rounded-xl p-6 text-center hover:border-blue-400 hover:bg-blue-50 transition-all duration-300 bg-gradient-to-br from-blue-25 to-indigo-25">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleImageChange(e, 'aadhaarFrontImage')}
                      className="hidden"
                      id="aadhaar-front-upload"
                    />
                    <label
                      htmlFor="aadhaar-front-upload"
                      className="cursor-pointer block"
                    >
                      {frontImagePreview ? (
                        <div className="space-y-4">
                          <img
                            src={frontImagePreview}
                            alt="Aadhaar front preview"
                            className="max-h-48 mx-auto rounded-xl shadow-lg border border-gray-200"
                          />
                          <div className="bg-green-100 text-green-700 px-4 py-2 rounded-lg inline-flex items-center">
                            <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                            Front uploaded - Click to change
                          </div>
                        </div>
                      ) : (
                        <div className="space-y-4">
                          <div className="w-20 h-20 bg-blue-100 rounded-xl mx-auto flex items-center justify-center">
                            <svg className="w-10 h-10 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                            </svg>
                          </div>
                          <div>
                            <p className="text-base font-semibold text-gray-700 mb-1">Upload Aadhaar Front</p>
                            <p className="text-sm text-gray-500">PNG, JPG up to 5MB</p>
                          </div>
                        </div>
                      )}
                    </label>
                  </div>
                  {errors.aadhaarFrontImage && (
                    <p className="text-red-500 text-sm mt-2 font-medium flex items-center">
                      <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                      </svg>
                      {errors.aadhaarFrontImage}
                    </p>
                  )}
                </div>

                {/* Aadhaar Back Image Upload */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-3">
                    Aadhaar Card Back
                  </label>
                  <div className="border-2 border-dashed border-indigo-200 rounded-xl p-6 text-center hover:border-indigo-400 hover:bg-indigo-50 transition-all duration-300 bg-gradient-to-br from-indigo-25 to-purple-25">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleImageChange(e, 'aadhaarBackImage')}
                      className="hidden"
                      id="aadhaar-back-upload"
                    />
                    <label
                      htmlFor="aadhaar-back-upload"
                      className="cursor-pointer block"
                    >
                      {backImagePreview ? (
                        <div className="space-y-4">
                          <img
                            src={backImagePreview}
                            alt="Aadhaar back preview"
                            className="max-h-48 mx-auto rounded-xl shadow-lg border border-gray-200"
                          />
                          <div className="bg-green-100 text-green-700 px-4 py-2 rounded-lg inline-flex items-center">
                            <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                            Back uploaded - Click to change
                          </div>
                        </div>
                      ) : (
                        <div className="space-y-4">
                          <div className="w-20 h-20 bg-indigo-100 rounded-xl mx-auto flex items-center justify-center">
                            <svg className="w-10 h-10 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                            </svg>
                          </div>
                          <div>
                            <p className="text-base font-semibold text-gray-700 mb-1">Upload Aadhaar Back</p>
                            <p className="text-sm text-gray-500">PNG, JPG up to 5MB</p>
                          </div>
                        </div>
                      )}
                    </label>
                  </div>
                  {errors.aadhaarBackImage && (
                    <p className="text-red-500 text-sm mt-2 font-medium flex items-center">
                      <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                      </svg>
                      {errors.aadhaarBackImage}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-6">
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-4 px-6 rounded-2xl font-bold text-lg hover:from-blue-700 hover:to-indigo-700 disabled:from-gray-400 disabled:to-gray-500 transition-all duration-300 shadow-xl hover:shadow-2xl transform hover:scale-[1.02] disabled:transform-none disabled:cursor-not-allowed"
              >
                {loading ? (
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white mr-3"></div>
                    <span className="text-lg">Verifying...</span>
                  </div>
                ) : (
                  <div className="flex items-center justify-center">
                    <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Submit Verification
                  </div>
                )}
              </button>
            </div>

            {/* Security Note */}
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mt-6">
              <div className="flex items-start">
                <svg className="w-5 h-5 text-blue-500 mr-3 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
                <div>
                  <p className="text-sm font-semibold text-blue-800 mb-1">Secure & Confidential</p>
                  <p className="text-xs text-blue-600">Your documents are encrypted and stored securely. We use bank-level security to protect your information.</p>
                </div>
              </div>
            </div>

            {/* Back to Dashboard */}
            <div className="text-center pt-6">
              <button
                type="button"
                onClick={() => navigate('/fantasy-sport')}
                className="text-gray-500 text-sm hover:text-gray-700 font-medium hover:underline transition-colors flex items-center justify-center mx-auto"
              >
                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                Back to Dashboard
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default VerifyUser