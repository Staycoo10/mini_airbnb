import React from 'react';

const GRADIENTS = [
  ['#FF385C', '#E31C5F'],
  ['#7B61FF', '#5B3FE0'],
  ['#00A699', '#007A70'],
  ['#FC642D', '#E0531F'],
  ['#1B4965', '#2D6E9E'],
];

const EMOJIS = ['🏠', '🏡', '🏢', '🛖', '🏘️'];

export default function ApartmentCard({ apartment, isAdmin, onReserve, onDelete }) {
  const [g1, g2] = GRADIENTS[apartment.id % 5];
  const emoji = EMOJIS[apartment.id % 5];
  const [imgError, setImgError] = React.useState(false);

  return (
    <div className="apt-card bg-white rounded-2xl overflow-hidden border border-gray-100" style={{ boxShadow: 'var(--card-shadow)' }}>
      {/* Image area */}
      <div className="relative h-52 overflow-hidden">
        {apartment.image_url && !imgError ? (
          <img
            src={apartment.image_url}
            alt={apartment.title}
            className="w-full h-full object-cover"
            onError={() => setImgError(true)}
          />
        ) : (
          <div
            className="w-full h-full flex items-center justify-center text-5xl select-none"
            style={{ background: `linear-gradient(135deg, ${g1}, ${g2})` }}
          >
            {emoji}
          </div>
        )}
        {/* Status badge */}
        <div className={`absolute top-3 right-3 px-2.5 py-1 text-xs font-semibold rounded-lg backdrop-blur-sm ${
          apartment.is_available
            ? 'bg-white/80 text-emerald-700'
            : 'bg-black/40 text-white'
        }`}>
          {apartment.is_available ? '● Available' : '○ Booked'}
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        <h3 className="text-base font-semibold text-gray-900 leading-tight line-clamp-1 mb-1" style={{ fontFamily: "'DM Serif Display', serif" }}>
          {apartment.title}
        </h3>
        <p className="text-xs text-gray-500 mb-2 flex items-center gap-1">
          <span>📍</span> {apartment.location}
        </p>
        <p className="text-sm text-gray-600 line-clamp-2 leading-relaxed mb-3">
          {apartment.description}
        </p>

        <div className="flex items-center justify-between pt-3 border-t border-gray-100">
          <div>
            <span className="text-lg font-bold text-gray-900">${apartment.price}</span>
            <span className="text-sm text-gray-400 ml-1">/ night</span>
          </div>
          <div className="flex gap-2">
            {apartment.is_available && (
              <button
                onClick={() => onReserve(apartment.id, apartment.title, apartment.price)}
                className="px-4 py-2 bg-[#FF385C] text-white rounded-lg text-sm font-semibold hover:bg-[#E31C5F] transition-colors"
              >
                Reserve
              </button>
            )}
            {isAdmin && onDelete && (
              <button
                onClick={() => onDelete(apartment.id)}
                className="w-9 h-9 flex items-center justify-center border border-gray-200 rounded-lg text-gray-400 hover:text-red-500 hover:border-red-200 transition-all"
              >
                🗑️
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}