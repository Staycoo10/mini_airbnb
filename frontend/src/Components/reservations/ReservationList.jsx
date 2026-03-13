
import React from 'react';
import ReservationCard from './ReservationCard';

export default function ReservationList({ reservations, onCancel, onGoToApartments }) {
  if (reservations.length === 0) {
    return (
      <div className="text-center py-20 bg-white rounded-2xl border border-gray-200">
        <div className="text-6xl mb-4">✈️</div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">No trips booked... yet!</h2>
        <p className="text-gray-600 mb-6">
          Time to dust off your bags and start planning your next adventure
        </p>
        <button
          onClick={onGoToApartments}
          className="px-6 py-3 bg-gray-900 text-white rounded-lg text-sm font-semibold hover:bg-gray-800 transition-colors"
        >
          Start searching
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      {reservations.map((res) => (
        <ReservationCard key={res.id} reservation={res} onCancel={onCancel} />
      ))}
    </div>
  );
}