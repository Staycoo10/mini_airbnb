import React from 'react';

export default function Header({ user, currentPage, onPageChange, onLogout }) {
  return (
    <header className="bg-white border-b border-gray-100 sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-6 py-3 flex items-center justify-between">
        {/* Logo */}
        <div
          className="flex items-center gap-2 cursor-pointer group"
          onClick={() => onPageChange('apartments')}
        >
          <svg viewBox="0 0 32 32" className="w-8 h-8 text-[#FF385C] fill-current">
            <path d="M16 1C10.477 1 6 5.477 6 11c0 7.5 10 20 10 20S26 18.5 26 11c0-5.523-4.477-10-10-10zm0 13.5a3.5 3.5 0 110-7 3.5 3.5 0 010 7z"/>
          </svg>
          <span
            className="text-xl font-bold tracking-tight text-[#FF385C] group-hover:opacity-80 transition-opacity"
            style={{ fontFamily: "'DM Serif Display', serif" }}
          >
            mini<span className="text-gray-900">airbnb</span>
          </span>
        </div>

        {/* Navigation */}
        <nav className="flex gap-1">
          <button
            onClick={() => onPageChange('apartments')}
            className={`px-5 py-2 rounded-full text-sm font-medium transition-all ${
              currentPage === 'apartments'
                ? 'bg-gray-900 text-white shadow-sm'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            Stays
          </button>
          <button
            onClick={() => onPageChange('reservations')}
            className={`px-5 py-2 rounded-full text-sm font-medium transition-all ${
              currentPage === 'reservations'
                ? 'bg-gray-900 text-white shadow-sm'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            My Trips
          </button>
          {user.role === 'admin' && (
            <button
              onClick={() => onPageChange('cabinet')}
              className={`px-5 py-2 rounded-full text-sm font-medium transition-all ${
                currentPage === 'cabinet'
                  ? 'bg-gray-900 text-white shadow-sm'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              Cabinet
            </button>
          )}
        </nav>

        {/* User */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-3 py-1.5 bg-gray-50 border border-gray-200 rounded-full">
            <div className="w-6 h-6 rounded-full bg-gradient-to-br from-[#FF385C] to-[#E31C5F] flex items-center justify-center text-white text-xs font-bold">
              {user.name.charAt(0).toUpperCase()}
            </div>
            <span className="text-sm font-medium text-gray-900">{user.name}</span>
            {user.role === 'admin' && (
              <span className="text-xs bg-amber-100 text-amber-700 font-semibold px-1.5 py-0.5 rounded-md">Admin</span>
            )}
          </div>
          <button
            onClick={onLogout}
            className="px-4 py-2 text-sm font-medium text-gray-600 border border-gray-200 rounded-full hover:border-gray-400 hover:text-gray-900 transition-all"
          >
            Log out
          </button>
        </div>
      </div>
    </header>
  );
}