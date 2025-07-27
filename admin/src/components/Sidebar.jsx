import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Users, Shield, Trophy, Calendar, Play, CheckCircle, UserCheck} from 'lucide-react';

const Sidebar = () => {
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  const navItems = [
    { path: '/manage-user', label: 'Manage Users', icon: UserCheck },
    { path: '/', label: 'Players', icon: Users },
    { path: '/teams', label: 'Teams', icon: Shield },
    { path: '/upcoming-matches', label: 'Upcoming Matches', icon: Calendar },
    { path: '/live-matches', label: 'Live Matches', icon: Play },
    { path: '/completed-matches', label: 'Completed Matches', icon: CheckCircle }
  ];

  return (
    <div className='lg:h-screen lg:max-w-[300px] bg-gradient-to-b from-slate-900 via-purple-900 to-slate-900 shadow-2xl border-r border-purple-500/20'>
      {/* Header */}
      <div className='p-6 border-b border-purple-400/30'>
        <div className='flex items-center justify-center lg:justify-start space-x-3'>
          <div className='bg-gradient-to-r from-purple-500 to-blue-500 p-2 rounded-lg'>
            <Trophy className='w-6 h-6 text-white' />
          </div>
          <h2 className='text-white text-xl font-bold hidden lg:block'>
            Sports Manager
          </h2>
        </div>
      </div>

      {/* Navigation */}
      <nav className='p-6'>
        <div className='grid grid-cols-2 gap-4 lg:flex lg:flex-col lg:space-y-4'>
          
          <Link to="/manage-user">
            <button className='group flex flex-col lg:flex-row items-center justify-center lg:justify-start w-full bg-white/10 hover:bg-gradient-to-r hover:from-purple-500 hover:to-blue-500 text-white hover:text-white px-4 py-3 rounded-lg transition-all duration-300 border border-white/20 hover:border-purple-400 hover:shadow-lg hover:shadow-purple-500/25'>
              <Users className='w-5 h-5 mb-1 lg:mb-0 lg:mr-3' />
              <span className='text-xs lg:text-sm font-medium'>Manage users</span>
            </button>
          </Link>
          <Link to="/">
            <button className='group flex flex-col lg:flex-row items-center justify-center lg:justify-start w-full bg-white/10 hover:bg-gradient-to-r hover:from-purple-500 hover:to-blue-500 text-white hover:text-white px-4 py-3 rounded-lg transition-all duration-300 border border-white/20 hover:border-purple-400 hover:shadow-lg hover:shadow-purple-500/25'>
              <Users className='w-5 h-5 mb-1 lg:mb-0 lg:mr-3' />
              <span className='text-xs lg:text-sm font-medium'>Players</span>
            </button>
          </Link>

          <Link to="/teams">
            <button className='group flex flex-col lg:flex-row items-center justify-center lg:justify-start w-full bg-white/10 hover:bg-gradient-to-r hover:from-purple-500 hover:to-blue-500 text-white hover:text-white px-4 py-3 rounded-lg transition-all duration-300 border border-white/20 hover:border-purple-400 hover:shadow-lg hover:shadow-purple-500/25'>
              <Shield className='w-5 h-5 mb-1 lg:mb-0 lg:mr-3' />
              <span className='text-xs lg:text-sm font-medium'>Teams</span>
            </button>
          </Link>

          <Link to="/upcoming-matches ">
            <button className='group flex flex-col lg:flex-row items-center justify-center lg:justify-start w-full bg-white/10 hover:bg-gradient-to-r hover:from-purple-500 hover:to-blue-500 text-white hover:text-white px-4 py-3 rounded-lg transition-all duration-300 border border-white/20 hover:border-purple-400 hover:shadow-lg hover:shadow-purple-500/25'>
              <Trophy className='w-5 h-5 mb-1 lg:mb-0 lg:mr-3' />
              <span className='text-xs lg:text-sm font-medium'>upcoming Matches</span>
            </button>
          </Link>
          <Link to="/live-matches ">
            <button className='group flex flex-col lg:flex-row items-center justify-center lg:justify-start w-full bg-white/10 hover:bg-gradient-to-r hover:from-purple-500 hover:to-blue-500 text-white hover:text-white px-4 py-3 rounded-lg transition-all duration-300 border border-white/20 hover:border-purple-400 hover:shadow-lg hover:shadow-purple-500/25'>
              <Trophy className='w-5 h-5 mb-1 lg:mb-0 lg:mr-3' />
              <span className='text-xs lg:text-sm font-medium'>live Matches</span>
            </button>
          </Link>

          <Link to="/completed-matches ">
            <button className='group flex flex-col lg:flex-row items-center justify-center lg:justify-start w-full bg-white/10 hover:bg-gradient-to-r hover:from-purple-500 hover:to-blue-500 text-white hover:text-white px-4 py-3 rounded-lg transition-all duration-300 border border-white/20 hover:border-purple-400 hover:shadow-lg hover:shadow-purple-500/25'>
              <Trophy className='w-5 h-5 mb-1 lg:mb-0 lg:mr-3' />
              <span className='text-xs lg:text-sm font-medium'>completed Matches</span>
            </button>
          </Link>
        </div>
      </nav>

      {/* Footer for desktop */}
      <div className='hidden lg:block lg:absolute lg:bottom-0 lg:left-0 lg:right-0 p-4 border-t border-purple-400/30'>
        <div className='text-center text-white/70 text-sm'>
          <p>© 2025 Sports Manager</p>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;