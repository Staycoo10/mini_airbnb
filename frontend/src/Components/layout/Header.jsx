import React from 'react';
export default function Header({ user, currentPage, onPageChange, onLogout }) {
  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        {/* Logo */}
        <div 
          className="flex items-center gap-2 cursor-pointer"
          onClick={() => onPageChange('apartments')}
        >
          <span className="text-3xl">🏠</span>
          <span className="text-xl font-bold text-airbnb-primary">mini-airbnb</span>
        </div>
        
        {/* Navigation */}
        <nav className="flex gap-2">
          <button
            onClick={() => onPageChange('apartments')}
            className={`px-4 py-2 rounded-full text-sm font-semibold transition-colors ${
              currentPage === 'apartments' 
                ? 'bg-gray-100 text-gray-900' 
                : 'text-gray-700 hover:bg-gray-50'
            }`}
          >
            Stays
          </button>
          <button
            onClick={() => onPageChange('reservations')}
            className={`px-4 py-2 rounded-full text-sm font-semibold transition-colors ${
              currentPage === 'reservations' 
                ? 'bg-gray-100 text-gray-900' 
                : 'text-gray-700 hover:bg-gray-50'
            }`}
          >
            Trips
          </button>
        </nav>

        {/* User Menu */}
        <div className="flex items-center gap-3">
          <div className="px-3 py-2 bg-gray-100 rounded-full text-sm font-semibold text-gray-900">
            {user.name} {user.role === 'admin' && '👑'}
          </div>
          <button
            onClick={onLogout}
            className="px-4 py-2 border border-gray-300 rounded-full text-sm font-semibold text-gray-900 hover:shadow-md transition-shadow"
          >
            Log out
          </button>
        </div>
      </div>
    </header>
  );
}