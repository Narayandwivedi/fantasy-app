import { X, Wallet, HelpCircle, Headphones, FileText, Settings, LogOut, User } from 'lucide-react'

const MenuSidebar = ({ isOpen, onClose }) => {
  return (
    <>
      {/* Backdrop */}
      {isOpen && (
        <div 
          className="absolute inset-0 bg-black bg-opacity-50 z-40"
          onClick={onClose}
        />
      )}
      
      {/* Sidebar */}
      <div className={`absolute top-0 left-0 h-full w-80 max-w-[85%] bg-white shadow-2xl transform transition-transform duration-300 z-50 ${
        isOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        
        {/* Header */}
        <div className="bg-gradient-to-r from-gray-900 via-slate-900 to-black p-6 text-white">
          <div className="flex justify-between items-start">
            <div className="flex items-center space-x-3">
              <div className="bg-white bg-opacity-20 p-3 rounded-full">
                <User size={24} className="text-white" />
              </div>
              <div>
                <h2 className="text-lg font-bold">John Doe</h2>
                <p className="text-xs text-gray-400">Member</p>
              </div>
            </div>
            <button 
              onClick={onClose}
              className="p-2 hover:bg-white hover:bg-opacity-20 rounded-lg transition-colors"
            >
              <X size={24} />
            </button>
          </div>
        </div>

        {/* Balance Section */}
        <div className="p-4 bg-gradient-to-r from-green-50 to-emerald-50 border-b">
          <div className="flex items-center space-x-3">
            <div className="bg-green-500 p-2 rounded-lg">
              <Wallet className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Current Balance</p>
              <p className="text-xl font-bold text-green-600">₹0</p>
            </div>
          </div>
        </div>

        {/* Menu Items */}
        <div className="flex-1 py-4">
          <div className="space-y-1">
            
            <MenuItem 
              icon={<Wallet size={20} />}
              title="My Wallet"
              subtitle="Add money & transactions"
              onClick={() => console.log('Wallet clicked')}
            />
            
            <MenuItem 
              icon={<HelpCircle size={20} />}
              title="How to Play"
              subtitle="Learn the game rules"
              onClick={() => console.log('How to play clicked')}
            />
            
            <MenuItem 
              icon={<Headphones size={20} />}
              title="Customer Support"
              subtitle="Get help & support"
              onClick={() => console.log('Support clicked')}
            />
            
            <MenuItem 
              icon={<FileText size={20} />}
              title="Terms & Conditions"
              subtitle="Read our policies"
              onClick={() => console.log('Terms clicked')}
            />
            
            <MenuItem 
              icon={<Settings size={20} />}
              title="Settings"
              subtitle="App preferences"
              onClick={() => console.log('Settings clicked')}
            />
            
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t bg-gray-50">
          <MenuItem 
            icon={<LogOut size={20} />}
            title="Logout"
            subtitle="Sign out of your account"
            onClick={() => console.log('Logout clicked')}
            className="text-red-600 hover:bg-red-50"
          />
        </div>
      </div>
    </>
  )
}

const MenuItem = ({ icon, title, subtitle, onClick, className = "" }) => {
  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center space-x-4 px-6 py-3 hover:bg-gray-100 transition-colors text-left ${className}`}
    >
      <div className="text-gray-600">
        {icon}
      </div>
      <div className="flex-1">
        <p className="text-sm font-medium text-gray-900">{title}</p>
        <p className="text-xs text-gray-500">{subtitle}</p>
      </div>
    </button>
  )
}

export default MenuSidebar