import React, { useState, useEffect, useCallback } from 'react';
import api from '../../services/api';

const GRADIENTS = [
  ['#FF385C', '#E31C5F'],
  ['#7B61FF', '#5B3FE0'],
  ['#00A699', '#007A70'],
  ['#FC642D', '#E0531F'],
  ['#1B4965', '#2D6E9E'],
];

export default function Cabinet({ user, onShowMessage }) {
  const [myApartments, setMyApartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState(null);
  const [error, setError] = useState(null);

  // definit INAINTE de useEffect
  const loadMyApartments = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await api.call('/apartments/my-apartments');
      console.log('[Cabinet] my-apartments response:', data);
      // backend returneaza array direct
      const list = Array.isArray(data) ? data : [];
      setMyApartments(list);
    } catch (err) {
      console.error('[Cabinet] load error:', err);
      setError(err.message);
      onShowMessage('Failed to load your apartments: ' + err.message, 'error');
    } finally {
      setLoading(false);
    }
  }, [onShowMessage]);

  useEffect(() => {
    if (user.role === 'admin') {
      loadMyApartments();
    } else {
      setLoading(false);
    }
  }, [user.role, loadMyApartments]);

  const handleDelete = async (id, title) => {
    if (!window.confirm(`Delete "${title}"?`)) return;
    setDeletingId(id);
    try {
      await api.call(`/apartments/${id}`, { method: 'DELETE' });
      onShowMessage('Apartment deleted');
      setMyApartments(prev => prev.filter(a => a.id !== id));
    } catch (err) {
      onShowMessage(err.message, 'error');
    } finally {
      setDeletingId(null);
    }
  };

  const initials = user.name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2);

  return (
    <div className="page-fade-in max-w-4xl mx-auto">

      {/* Profile card */}
      <div className="bg-white rounded-2xl border border-gray-100 p-8 mb-8 flex items-center gap-6" style={{ boxShadow: 'var(--card-shadow)' }}>
        <div
          className="w-20 h-20 rounded-full flex items-center justify-center text-2xl font-bold text-white flex-shrink-0"
          style={{ background: 'linear-gradient(135deg, #FF385C, #E31C5F)' }}
        >
          {initials}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-3 flex-wrap">
            <h1 className="text-2xl font-semibold text-gray-900" style={{ fontFamily: "'DM Serif Display', serif" }}>
              {user.name}
            </h1>
            {user.role === 'admin' && (
              <span className="text-xs bg-amber-100 text-amber-700 font-semibold px-2.5 py-1 rounded-lg">
                Host / Admin
              </span>
            )}
          </div>
          <p className="text-gray-400 text-sm mt-1">{user.email}</p>
          {user.role === 'admin' && !loading && (
            <p className="text-gray-500 text-sm mt-2">
              {myApartments.length} listing{myApartments.length !== 1 ? 's' : ''} · {myApartments.filter(a => a.is_available).length} available
            </p>
          )}
        </div>
      </div>

      {/* My listings — admin only */}
      {user.role === 'admin' && (
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900" style={{ fontFamily: "'DM Serif Display', serif" }}>
              My listings
            </h2>
            <button
              onClick={loadMyApartments}
              className="text-sm text-gray-400 hover:text-gray-700 transition-colors px-3 py-1.5 border border-gray-200 rounded-lg hover:border-gray-300"
            >
              ↺ Refresh
            </button>
          </div>

          {error && (
            <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-xl text-sm text-red-600">
              Error: {error}
            </div>
          )}

          {loading ? (
            <div className="flex items-center justify-center py-16">
              <div className="w-7 h-7 border-2 border-[#FF385C] border-t-transparent rounded-full animate-spin" />
            </div>
          ) : myApartments.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-2xl border border-gray-100">
              <div className="text-5xl mb-3">🏠</div>
              <h3 className="text-lg font-semibold text-gray-900 mb-1" style={{ fontFamily: "'DM Serif Display', serif" }}>
                No listings yet
              </h3>
              <p className="text-gray-400 text-sm">Go to Stays to add your first property.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {myApartments.map((apt) => {
                const [g1, g2] = GRADIENTS[apt.id % 5];
                return (
                  <div
                    key={apt.id}
                    className="bg-white rounded-2xl border border-gray-100 flex items-center gap-4 p-4 transition-all hover:border-gray-200"
                    style={{ boxShadow: 'var(--card-shadow)' }}
                  >
                    <div
                      className="w-14 h-14 rounded-xl flex items-center justify-center text-2xl flex-shrink-0"
                      style={{ background: `linear-gradient(135deg, ${g1}, ${g2})` }}
                    >
                      🏠
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-semibold text-gray-900 truncate">{apt.title}</span>
                        <span className={`text-xs font-medium px-2 py-0.5 rounded-md ${
                          apt.is_available
                            ? 'bg-emerald-50 text-emerald-700'
                            : 'bg-gray-100 text-gray-500'
                        }`}>
                          {apt.is_available ? 'Available' : 'Booked'}
                        </span>
                      </div>
                      <div className="flex items-center gap-3 mt-1 text-sm text-gray-400">
                        <span>📍 {apt.location}</span>
                        <span>·</span>
                        <span className="font-medium text-gray-700">${apt.price} / night</span>
                      </div>
                    </div>

                    <button
                      onClick={() => handleDelete(apt.id, apt.title)}
                      disabled={deletingId === apt.id}
                      className="flex-shrink-0 flex items-center gap-2 px-4 py-2 text-sm font-medium text-red-500 border border-red-100 rounded-xl hover:bg-red-50 hover:border-red-200 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
                    >
                      {deletingId === apt.id ? (
                        <div className="w-4 h-4 border-2 border-red-400 border-t-transparent rounded-full animate-spin" />
                      ) : (
                        <>🗑️ Delete</>
                      )}
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {user.role !== 'admin' && (
        <div className="bg-white rounded-2xl border border-gray-100 p-8 text-center" style={{ boxShadow: 'var(--card-shadow)' }}>
          <div className="text-5xl mb-3">🌍</div>
          <h3 className="text-lg font-semibold text-gray-900 mb-1" style={{ fontFamily: "'DM Serif Display', serif" }}>
            Ready to explore?
          </h3>
          <p className="text-gray-400 text-sm">Browse available stays and book your next trip.</p>
        </div>
      )}
    </div>
  );
}