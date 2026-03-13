import React from 'react';

export default function ReservationCard({ reservation, onCancel }) {
  const start = new Date(reservation.start_date);
  const end = new Date(reservation.end_date);
  const nights = Math.ceil((end - start) / (1000 * 60 * 60 * 24));

  const formatDate = (date) =>
    date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

  const isUpcoming = start > new Date();
  const isPast = end < new Date();

  const statusConfig = {
    upcoming: { label: 'Upcoming', classes: 'bg-blue-50 text-blue-700 border-blue-100' },
    past: { label: 'Completed', classes: 'bg-gray-50 text-gray-500 border-gray-100' },
    active: { label: 'Active now', classes: 'bg-emerald-50 text-emerald-700 border-emerald-100' },
  };

  const status = isUpcoming ? 'upcoming' : isPast ? 'past' : 'active';
  const { label, classes } = statusConfig[status];

  return (
    <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden flex" style={{ boxShadow: 'var(--card-shadow)' }}>
      {/* Color strip */}
      <div
        className="w-2 flex-shrink-0"
        style={{
          background: isUpcoming ? '#3B82F6' : isPast ? '#D1D5DB' : '#10B981'
        }}
      />

      <div className="flex-1 p-5">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 min-w-0">
            {/* Title & status */}
            <div className="flex items-center gap-2 flex-wrap mb-1">
              <h3 className="text-base font-semibold text-gray-900 truncate" style={{ fontFamily: "'DM Serif Display', serif" }}>
                {reservation.apartment_title || reservation.title || 'Apartment'}
              </h3>
              <span className={`text-xs font-medium px-2 py-0.5 rounded-md border ${classes}`}>
                {label}
              </span>
            </div>

            {/* Dates */}
            <div className="flex items-center gap-2 text-sm text-gray-600 mb-3">
              <span>{formatDate(start)}</span>
              <span className="text-gray-300">→</span>
              <span>{formatDate(end)}</span>
              <span className="text-gray-400">·</span>
              <span>{nights} night{nights !== 1 ? 's' : ''}</span>
            </div>

            {/* Price */}
            <div className="text-sm font-semibold text-gray-900">
              Total: ${parseFloat(reservation.total_price || 0).toFixed(2)}
            </div>
          </div>

          {/* Cancel button - only for upcoming */}
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