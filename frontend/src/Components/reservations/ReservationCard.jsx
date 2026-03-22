import React from 'react';

export default function ReservationCard({ reservation, onCancel }) {
  const start = new Date(reservation.start_date);
  const end = new Date(reservation.end_date);
  const nights = Math.ceil((end - start) / (1000 * 60 * 60 * 24));

  const formatDate = (date) =>
    date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

  const isCancelled = reservation.status === 'cancelled';
  const isUpcoming  = !isCancelled && start > new Date();
  const isPast      = !isCancelled && end < new Date();
  const isActive    = !isCancelled && !isUpcoming && !isPast;

  const statusConfig = isCancelled
    ? { label: 'Cancelled', classes: 'bg-gray-100 text-gray-400 border-gray-100', bar: '#E5E7EB' }
    : isUpcoming
      ? { label: 'Upcoming',   classes: 'bg-blue-50 text-blue-700 border-blue-100',     bar: '#3B82F6' }
      : isPast
        ? { label: 'Completed', classes: 'bg-gray-50 text-gray-500 border-gray-100',     bar: '#D1D5DB' }
        : { label: 'Active now',classes: 'bg-emerald-50 text-emerald-700 border-emerald-100', bar: '#10B981' };

  return (
    <div className={`bg-white rounded-2xl border overflow-hidden flex ${
      isCancelled ? 'border-gray-100 opacity-60' : 'border-gray-100'
    }`} style={{ boxShadow: 'var(--card-shadow)' }}>
      <div className="w-1.5 flex-shrink-0" style={{ background: statusConfig.bar }} />

      <div className="flex-1 p-5">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap mb-1">
              <h3 className={`text-base font-semibold truncate ${isCancelled ? 'text-gray-400 line-through' : 'text-gray-900'}`}
                style={{ fontFamily: "'DM Serif Display', serif" }}>
                {reservation.apartment_title || reservation.title || 'Apartment'}
              </h3>
              <span className={`text-xs font-medium px-2 py-0.5 rounded-md border ${statusConfig.classes}`}>
                {statusConfig.label}
              </span>
            </div>

            <div className={`flex items-center gap-2 text-sm mb-3 ${isCancelled ? 'text-gray-400' : 'text-gray-600'}`}>
              <span>{formatDate(start)}</span>
              <span className="text-gray-300">→</span>
              <span>{formatDate(end)}</span>
              <span className="text-gray-300">·</span>
              <span>{nights} night{nights !== 1 ? 's' : ''}</span>
            </div>

            <div className={`text-sm font-semibold ${isCancelled ? 'text-gray-400' : 'text-gray-900'}`}>
              Total: ${parseFloat(reservation.total_price || 0).toFixed(2)}
            </div>
          </div>

          {isUpcoming && (
            <button
              onClick={() => onCancel(reservation.id)}
              className="flex-shrink-0 px-4 py-2 text-sm font-medium text-red-600 border border-red-200 rounded-lg hover:bg-red-50 transition-all"
            >
              Cancel
            </button>
          )}
        </div>
      </div>
    </div>
  );
}