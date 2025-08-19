import React, { useState, useEffect, useContext } from 'react'
import Navbar from '../../components/Navbar'
import BottomNav from '../../components/BottomNav'
import { AppContext } from '../../context/AppContext'
import Upcoming from './Upcoming'
import Live from './Live'
import Completed from './Completed'

const MyMatches = () => {
  const [activeTab, setActiveTab] = useState('upcoming')
  const [matchesData, setMatchesData] = useState({ upcoming: [], live: [], completed: [] })
  const [loading, setLoading] = useState(true)
  const { user, getUserMatches } = useContext(AppContext)

  useEffect(() => {
    const fetchMatches = async () => {
      if (!user?._id) {
        setLoading(false)
        return
      }
      
      try {
        setLoading(true)
        const result = await getUserMatches(user._id)
        
        if (result.success) {
          setMatchesData(result.data)
        } else {
          console.error('Failed to fetch matches:', result.error)
          // Set empty data on error
          setMatchesData({ upcoming: [], live: [], completed: [] })
        }
      } catch (error) {
        console.error('Error fetching matches:', error)
        // Set empty data on error
        setMatchesData({ upcoming: [], live: [], completed: [] })
      } finally {
        setLoading(false)
      }
    }

    fetchMatches()
  }, [user, getUserMatches])

  const tabs = [
    { key: 'upcoming', label: 'Upcoming', component: Upcoming },
    { key: 'live', label: 'Live', component: Live },
    { key: 'completed', label: 'Completed', component: Completed }
  ]

  const ActiveComponent = tabs.find(tab => tab.key === activeTab)?.component || Upcoming

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      
      {/* Tab Navigation */}
      <div className="px-4 py-6">
        <div className="flex bg-gray-800 rounded-xl p-1 mt-4">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`flex-1 py-3 px-4 rounded-lg text-sm font-medium transition-all duration-200 ${
                activeTab === tab.key
                  ? tab.key === 'completed' 
                    ? 'bg-red-500 text-white'
                    : tab.key === 'live'
                    ? 'bg-blue-500 text-white'  
                    : 'bg-gray-600 text-white'
                  : 'text-gray-400 hover:text-white hover:bg-gray-700'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="mt-6 pb-20">
          {loading ? (
            <div className="text-center py-12">
              <div className="text-gray-500 text-lg mb-2">Loading...</div>
              <div className="text-gray-400 text-sm">Fetching your matches</div>
            </div>
          ) : (
            <ActiveComponent matches={matchesData[activeTab]} />
          )}
        </div>
      </div>
      
      <BottomNav />
    </div>
  )
}

export default MyMatches
