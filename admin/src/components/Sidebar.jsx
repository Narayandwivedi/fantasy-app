import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Users, Shield, Trophy, Calendar, Play, CheckCircle, UserCheck, Zap, Home, Target, Award, ChevronLeft, ChevronRight, MessageCircle } from 'lucide-react';

const Sidebar = ({ collapsed, onToggle }) => {
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  const navItems = [
    { path: '/manage-user', label: 'Manage Users', icon: UserCheck },
    { path: '/', label: 'Players', icon: Users },
    { path: '/teams', label: 'Teams', icon: Shield },
    { path: '/upcoming-matches', label: 'Upcoming Matches', icon: Calendar },
    { path: '/live-matches', label: 'Live Matches', icon: Zap },
    { path: '/completed-matches', label: 'Completed Matches', icon: CheckCircle },
    { path: '/manage-contests', label: 'Manage Contests', icon: Award },
    { path: '/chat-support', label: 'Chat Support', icon: MessageCircle }
  ];

  const getNavItemStyles = (path) => {
    const active = isActive(path);
    return `group relative flex flex-col lg:flex-row items-center ${collapsed ? 'justify-center' : 'justify-center lg:justify-start'} w-full px-4 py-3 rounded-xl transition-all duration-300 transform hover:scale-105 ${
      active
        ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg shadow-blue-500/30 border border-blue-400/50'
        : 'bg-white/10 backdrop-blur-sm hover:bg-gradient-to-r hover:from-purple-500/80 hover:to-blue-500/80 text-white/90 hover:text-white border border-white/20 hover:border-purple-400/50 hover:shadow-lg hover:shadow-purple-500/25'
    }`;
  };

  return (
    <div className={`relative lg:h-screen ${collapsed ? 'lg:max-w-[80px]' : 'lg:max-w-[320px]'} bg-gradient-to-b from-slate-900 via-purple-900 to-slate-900 shadow-2xl border-r border-purple-500/20 backdrop-blur-sm transition-all duration-300`}>
      {/* Animated background overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-purple-500/10 pointer-events-none"></div>

      {/* Toggle Button */}
      <button
        onClick={onToggle}
        className="hidden lg:block absolute -right-3 top-6 z-10 bg-gradient-to-r from-purple-500 to-blue-500 text-white p-2 rounded-full shadow-lg hover:scale-110 transition-all duration-200 hover:shadow-xl"
        title={collapsed ? "Expand Sidebar" : "Collapse Sidebar"}
      >
        {collapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
      </button>

      {/* Header */}
      <div className='relative p-6 border-b border-purple-400/30'>
        <div className={`flex items-center ${collapsed ? 'justify-center' : 'justify-center lg:justify-start'} space-x-4`}>
          <div className='relative'>
            <div className='bg-gradient-to-r from-purple-500 to-blue-500 p-3 rounded-2xl shadow-lg'>
              <Trophy className='w-7 h-7 text-white' />
            </div>
            <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-slate-900 animate-pulse"></div>
          </div>
          {!collapsed && (
            <div className='hidden lg:block'>
              <h2 className='text-white text-2xl font-bold tracking-tight'>
                Sports Manager
              </h2>
              <p className='text-purple-300 text-sm font-medium'>Admin Dashboard</p>
            </div>
          )}
        </div>
      </div>

      {/* Navigation */}
      <nav className='relative p-6'>
        <div className='grid grid-cols-2 gap-3 lg:flex lg:flex-col lg:space-y-3'>
          {navItems.map((item) => {
            const IconComponent = item.icon;
            const active = isActive(item.path);
            
            return (
              <Link key={item.path} to={item.path.trim()}>
                <div className={getNavItemStyles(item.path)}>
                  {/* Active indicator */}
                  {active && (
                    <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-white rounded-r-full shadow-lg shadow-white/25 hidden lg:block"></div>
                  )}
                  
                  {/* Icon with animation */}
                  <div className={`relative ${active ? 'scale-110' : 'group-hover:scale-110'} transition-transform duration-200`}>
                    <IconComponent className={`w-5 h-5 ${collapsed ? '' : 'mb-1 lg:mb-0 lg:mr-3'} ${
                      active ? 'text-white' : 'text-white/80 group-hover:text-white'
                    }`} />
                  </div>
                  
                  {/* Label */}
                  {!collapsed && (
                    <span className={`text-xs lg:text-sm font-semibold transition-all duration-200 ${
                      active ? 'text-white' : 'text-white/80 group-hover:text-white'
                    }`}>
                      {item.label}
                    </span>
                  )}

                  {/* Hover effect overlay */}
                  <div className="absolute inset-0 bg-gradient-to-r from-white/0 to-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl"></div>
                </div>
              </Link>
            );
          })}
        </div>

        {/* Quick Stats - Desktop Only */}
        {!collapsed && (
          <div className="hidden lg:block mt-8 p-4 bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10">
            <h3 className="text-white/80 text-sm font-semibold mb-3">Quick Stats</h3>
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="text-white/60">Active Matches</span>
                <span className="text-green-400 font-bold">3</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-white/60">Total Teams</span>
                <span className="text-blue-400 font-bold">12</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-white/60">Players</span>
                <span className="text-purple-400 font-bold">156</span>
              </div>
            </div>
          </div>
        )}
      </nav>

      {/* Footer for desktop */}
      {!collapsed && (
        <div className='hidden lg:block absolute bottom-0 left-0 right-0 p-6 border-t border-purple-400/30 bg-gradient-to-t from-slate-900/80 to-transparent backdrop-blur-sm'>
          <div className='text-center text-white/60 text-sm'>
            <p className="font-medium">© 2025 Sports Manager</p>
            <p className="text-xs text-white/40 mt-1">Admin Panel v2.0</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Sidebar;