import React from 'react';
import ReservationCard from './ReservationCard';

export default function ReservationList({ reservations, onCancel, onGoToApartments }) {
  if (reservations.length === 0) {
    return (
      <div className="text-center py-24 bg-white rounded-2xl border border-gray-100">
        <div className="text-6xl mb-4">✈️</div>
        <h2 className="text-2xl font-semibold text-gray-900 mb-2" style={{ fontFamily: "'DM Serif Display', serif" }}>
          No trips booked yet
        </h2>
        <p className="text-gray-500 text-sm mb-6">Time to plan your next adventure</p>
        <button onClick={onGoToApartments}
          className="px-6 py-3 bg-gray-900 text-white rounded-xl text-sm font-semibold hover:bg-gray-700 transition-colors">
          Browse stays
        </button>
      </div>
    );
  }

  const now = new Date();
  // folosim `status` din DB — persistent dupa reload
  const active    = reservations.filter(r => r.status === 'active' && new Date(r.start_date) <= now && new Date(r.end_date) >= now);
  const upcoming  = reservations.filter(r => r.status === 'active' && new Date(r.start_date) > now);
  const past      = reservations.filter(r => r.status === 'active' && new Date(r.end_date) < now);
  const cancelled = reservations.filter(r => r.status === 'cancelled');

  const Section = ({ title, items }) => items.length === 0 ? null : (
    <div className="mb-8">
      <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-3">{title}</h2>
      <div className="space-y-3">
        {items.map(res => (
          <ReservationCard key={res.id} reservation={res} onCancel={onCancel} />
        ))}
      </div>
    </div>
  );

  return (
    <div className="page-fade-in">
      <Section title="Active now" items={active} />
      <Section title="Upcoming"   items={upcoming} />
      <Section title="Past trips" items={past} />
      <Section title="Cancelled"  items={cancelled} />
    </div>
  );
}