import React from 'react';
import { Link } from 'react-router-dom';
import { Users, Shield, Trophy } from 'lucide-react';

const Sidebar = () => {

  return (
    <div className='lg:h-screen lg:max-w-[280px] bg-gradient-to-b from-slate-900 via-purple-900 to-slate-900 shadow-lg'>
      {/* Header */}
      <div className='p-4 border-b border-purple-400/30'>
        <h2 className='text-white text-xl font-bold text-center lg:text-left'>
          Sports Manager
        </h2>
      </div>

      {/* Navigation */}
      <nav className='p-4'>
        <div className='grid grid-cols-2 gap-3 lg:flex lg:flex-col lg:space-y-3'>
          
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

          <Link to="/matches">
            <button className='group flex flex-col lg:flex-row items-center justify-center lg:justify-start w-full bg-white/10 hover:bg-gradient-to-r hover:from-purple-500 hover:to-blue-500 text-white hover:text-white px-4 py-3 rounded-lg transition-all duration-300 border border-white/20 hover:border-purple-400 hover:shadow-lg hover:shadow-purple-500/25'>
              <Trophy className='w-5 h-5 mb-1 lg:mb-0 lg:mr-3' />
              <span className='text-xs lg:text-sm font-medium'>Matches</span>
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