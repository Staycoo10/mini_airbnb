import React from 'react';
import ApartmentCard from './ApartmentCard';

export default function ApartmentList({ apartments, isAdmin, onReserve, onDelete, onSelect }) {
  if (apartments.length === 0) {
    return (
      <div className="text-center py-24 bg-white rounded-2xl border border-gray-100">
        <div className="text-6xl mb-4">🏠</div>
        <h2 className="text-2xl font-semibold text-gray-900 mb-2" style={{ fontFamily: "'DM Serif Display', serif" }}>
          No stays listed yet
        </h2>
        <p className="text-gray-500 text-sm">
          {isAdmin ? 'Add your first property to get started.' : 'Check back soon for available stays.'}
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 page-fade-in">
      {apartments.map((apt) => (
        <ApartmentCard
          key={apt.id}
          apartment={apt}
          isAdmin={isAdmin}
          onReserve={onReserve}
          onDelete={onDelete}
          onClick={() => onSelect && onSelect(apt)}
        />
      ))}
    </div>
  );
}