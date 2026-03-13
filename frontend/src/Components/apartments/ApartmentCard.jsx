
import React from 'react';

export default function ApartmentCard({ apartment, isAdmin, onReserve, onDelete }) {
  const gradients = [
    'from-purple-400 to-pink-600',
    'from-pink-400 to-red-500',
    'from-blue-400 to-cyan-500',
    'from-green-400 to-teal-500',
    'from-yellow-400 to-orange-500'
  ];
  
  const gradient = gradients[apartment.id % 5];

  return (
    <div className="bg-white rounded-2xl overflow-hidden shadow-md border border-gray-200 hover:-translate-y-1 hover:shadow-xl transition-all cursor-pointer">
      {/* Image placeholder */}
      <div className={`h-56 bg-gradient-to-br ${gradient} flex items-center justify-center text-6xl`}>
        🏠
      </div>
      
      {/* Content */}
      <div className="p-5">
        {/* Title and availability */}
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-lg font-semibold text-gray-900 leading-tight line-clamp-2">
            {apartment.title}
          </h3>
          <span className={`ml-2 px-2 py-1 text-xs font-semibold rounded-md whitespace-nowrap ${
            apartment.is_available 
              ? 'bg-green-100 text-green-700' 
              : 'bg-red-100 text-red-700'
          }`}>
            {apartment.is_available ? 'Available' : 'Booked'}
          </span>
        </div>
        
        {/* Description */}
        <p className="text-sm text-gray-600 leading-relaxed line-clamp-2 mb-3">
          {apartment.description}
        </p>
        
        {/* Location */}
        <div className="text-sm text-gray-600 mb-3">
          📍 {apartment.location}
        </div>
        
        {/* Price */}
        <div className="text-xl font-bold text-gray-900 mb-4">
          ${apartment.price}{' '}
          <span className="text-sm font-normal text-gray-600">night</span>
        </div>
        
        {/* Actions */}
        <div className="flex gap-2 pt-4 border-t border-gray-200">
          {apartment.is_available && (
            <button
              onClick={() => onReserve(apartment.id, apartment.title)}
              className="flex-1 py-2.5 bg-airbnb-primary text-white rounded-lg text-sm font-semibold hover:bg-airbnb-dark transition-colors"
            >
              Reserve
            </button>
          )}
          {isAdmin && (
            <button
              onClick={() => onDelete(apartment.id)}
              className="px-4 py-2.5 border border-gray-300 rounded-lg text-sm text-gray-600 hover:bg-gray-50 transition-colors"
            >
              🗑️
            </button>
          )}
        </div>
      </div>
    </div>
  );
}