import React from 'react'
import { ArrowLeft } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

const MobileHeader = ({ 
  title, 
  subtitle, 
  onBack, 
  showBackButton = true,
  rightElement = null,
  bgColor = "bg-gradient-to-r from-gray-900 via-slate-900 to-black"
}) => {
  const navigate = useNavigate()

  const handleBack = () => {
    if (onBack) {
      onBack()
    } else {
      navigate(-1)
    }
  }

  return (
    <div className={`${bgColor} shadow-xl p-4 safe-area-top`}>
      <div className="flex items-center justify-between">
        {showBackButton ? (
          <button
            onClick={handleBack}
            className="text-white hover:text-gray-300 touch-target touch-feedback p-2 -m-2 rounded-lg"
            aria-label="Go back"
          >
            <ArrowLeft size={24} />
          </button>
        ) : (
          <div className="w-8"></div>
        )}
        
        <div className="flex-1 text-center">
          <h1 className="text-xl font-bold text-white">{title}</h1>
          {subtitle && (
            <p className="text-sm text-gray-300 mt-1">{subtitle}</p>
          )}
        </div>
        
        <div className="w-8 flex justify-end">
          {rightElement}
        </div>
      </div>
    </div>
  )
}

export default MobileHeader