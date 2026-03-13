
import React from 'react';
import ApartmentCard from './ApartmentCard';

export default function ApartmentList({ apartments, isAdmin, onReserve, onDelete }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {apartments.map((apt) => (
        <ApartmentCard
          key={apt.id}
          apartment={apt}
          isAdmin={isAdmin}
          onReserve={onReserve}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
}