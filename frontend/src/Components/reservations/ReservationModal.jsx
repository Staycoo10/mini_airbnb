import React, { useState } from 'react';

export default function ReservationModal({ apartment, onConfirm, onClose }) {
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const today = new Date().toISOString().split('T')[0];

  const nights = startDate && endDate
    ? Math.max(0, Math.ceil((new Date(endDate) - new Date(startDate)) / (1000 * 60 * 60 * 24)))
    : 0;

  const totalPrice = nights > 0 ? (nights * apartment.price).toFixed(2) : null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!startDate || !endDate || nights <= 0) return;
    onConfirm(apartment.id, apartment.title, startDate, endDate);
  };

  return (
    <div
      className="modal-backdrop fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="modal-content bg-white rounded-2xl w-full max-w-md shadow-2xl">
        {/* Header */}
        <div className="p-6 border-b border-gray-100 flex items-start justify-between">
          <div>
            <h2 className="text-xl font-semibold text-gray-900" style={{ fontFamily: "'DM Serif Display', serif" }}>
              Reserve your stay
            </h2>
            <p className="text-sm text-gray-500 mt-0.5">{apartment.title}</p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-full text-gray-400 hover:bg-gray-100 hover:text-gray-700 transition-all text-xl leading-none"
          >
            ×
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block mb-1.5 text-xs font-semibold text-gray-600 uppercase tracking-wide">
                Check-in
              </label>
              <input
                type="date"
                min={today}
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                required
                className="w-full px-3 py-3 border border-gray-200 rounded-xl text-sm bg-gray-50 focus:bg-white transition-colors"
              />
            </div>
            <div>
              <label className="block mb-1.5 text-xs font-semibold text-gray-600 uppercase tracking-wide">
                Check-out
              </label>
              <input
                type="date"
                min={startDate || today}
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                required
                className="w-full px-3 py-3 border border-gray-200 rounded-xl text-sm bg-gray-50 focus:bg-white transition-colors"
              />
            </div>
          </div>

          {/* Price summary */}
          {totalPrice && (
            <div className="bg-gray-50 rounded-xl p-4 border border-gray-100 page-fade-in">
              <div className="flex justify-between text-sm text-gray-600 mb-2">
                <span>${apartment.price} × {nights} night{nights > 1 ? 's' : ''}</span>
                <span>${totalPrice}</span>
              </div>
              <div className="flex justify-between text-base font-semibold text-gray-900 pt-2 border-t border-gray-200">
                <span>Total</span>
                <span>${totalPrice}</span>
              </div>
            </div>
          )}

          <button
            type="submit"
            disabled={!startDate || !endDate || nights <= 0}
            className="w-full py-3.5 bg-[#FF385C] text-white rounded-xl text-sm font-semibold hover:bg-[#E31C5F] transition-colors shadow-sm disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {totalPrice ? `Confirm — $${totalPrice}` : 'Select dates to continue'}
          </button>
        </form>
      </div>
    </div>
  );
}