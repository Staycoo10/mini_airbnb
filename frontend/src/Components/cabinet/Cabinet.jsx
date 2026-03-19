import React, { useState, useEffect, useCallback, useRef } from 'react';
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
  const [importing, setImporting] = useState(false);
  const [exporting, setExporting] = useState(false);
  const [importResult, setImportResult] = useState(null);
  const fileInputRef = useRef(null);

  const loadMyApartments = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await api.call('/apartments/my-apartments');
      setMyApartments(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err.message);
      onShowMessage('Failed to load apartments: ' + err.message, 'error');
    } finally {
      setLoading(false);
    }
  }, [onShowMessage]);

  useEffect(() => {
    if (user.role === 'admin') loadMyApartments();
    else setLoading(false);
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

  // ── EXPORT ──────────────────────────────────────────────────────
  const handleExport = async () => {
    setExporting(true);
    try {
      // Folosim fetch direct ca sa putem descarca fisierul blob
      // owner_id filter — exporta doar apartamentele proprii
      const response = await fetch(`http://localhost:3000/api/apartments/export?owner_id=${user.id}`, {
        credentials: 'include',
      });

      if (!response.ok) {
        const err = await response.json();
        throw new Error(err.message || 'Export failed');
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `my_apartments_${new Date().toISOString().split('T')[0]}.csv`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
      onShowMessage('Apartments exported successfully! 📥');
    } catch (err) {
      onShowMessage(err.message, 'error');
    } finally {
      setExporting(false);
    }
  };

  // ── IMPORT ──────────────────────────────────────────────────────
  const handleImport = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    e.target.value = '';

    if (!file.name.endsWith('.csv')) {
      onShowMessage('Only CSV files are accepted', 'error');
      return;
    }

    setImporting(true);
    setImportResult(null);
    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('http://localhost:3000/api/apartments/import', {
        method: 'POST',
        credentials: 'include',
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Import failed');
      }

      setImportResult(data.results);
      onShowMessage(`Imported ${data.results.imported} apartments! ✨`);
      loadMyApartments();
    } catch (err) {
      onShowMessage(err.message, 'error');
    } finally {
      setImporting(false);
    }
  };

  const initials = user.name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2);

  return (
    <div className="page-fade-in max-w-4xl mx-auto">

      {/* Profile card */}
      <div className="bg-white rounded-2xl border border-gray-100 p-8 mb-6 flex items-center gap-6" style={{ boxShadow: 'var(--card-shadow)' }}>
        <div className="w-20 h-20 rounded-full flex items-center justify-center text-2xl font-bold text-white flex-shrink-0"
          style={{ background: 'linear-gradient(135deg, #FF385C, #E31C5F)' }}>
          {initials}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-3 flex-wrap">
            <h1 className="text-2xl font-semibold text-gray-900" style={{ fontFamily: "'DM Serif Display', serif" }}>
              {user.name}
            </h1>
            {user.role === 'admin' && (
              <span className="text-xs bg-amber-100 text-amber-700 font-semibold px-2.5 py-1 rounded-lg">Host / Admin</span>
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

      {user.role === 'admin' && (
        <>
          {/* ── Import / Export card ── */}
          <div className="bg-white rounded-2xl border border-gray-100 p-6 mb-6" style={{ boxShadow: 'var(--card-shadow)' }}>
            <h2 className="text-lg font-semibold text-gray-900 mb-1" style={{ fontFamily: "'DM Serif Display', serif" }}>
              Import & Export
            </h2>
            <p className="text-sm text-gray-400 mb-5">
              Manage your listings in bulk via CSV files.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

              {/* Export */}
              <div className="border border-gray-100 rounded-xl p-5 bg-gray-50">
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-2xl">📥</span>
                  <div>
                    <p className="font-semibold text-gray-900 text-sm">Export listings</p>
                    <p className="text-xs text-gray-400">Download your apartments as CSV</p>
                  </div>
                </div>
                <button
                  onClick={handleExport}
                  disabled={exporting}
                  className="w-full mt-3 py-2.5 bg-gray-900 text-white rounded-xl text-sm font-semibold hover:bg-gray-700 transition-colors disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {exporting ? (
                    <><div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> Exporting...</>
                  ) : (
                    'Download CSV'
                  )}
                </button>
              </div>

              {/* Import */}
              <div className="border border-gray-100 rounded-xl p-5 bg-gray-50">
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-2xl">📤</span>
                  <div>
                    <p className="font-semibold text-gray-900 text-sm">Import listings</p>
                    <p className="text-xs text-gray-400">Upload a CSV to add apartments in bulk</p>
                  </div>
                </div>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".csv"
                  onChange={handleImport}
                  className="hidden"
                />
                <button
                  onClick={() => fileInputRef.current.click()}
                  disabled={importing}
                  className="w-full mt-3 py-2.5 bg-[#FF385C] text-white rounded-xl text-sm font-semibold hover:bg-[#E31C5F] transition-colors disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {importing ? (
                    <><div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> Importing...</>
                  ) : (
                    'Upload CSV'
                  )}
                </button>
                {/* Format hint */}
                <p className="text-xs text-gray-400 mt-2 text-center">
                  Columns: <code className="bg-gray-200 px-1 rounded">title, description, price, location</code>
                </p>
              </div>
            </div>

            {/* Import result */}
            {importResult && (
              <div className="mt-4 p-4 bg-emerald-50 border border-emerald-100 rounded-xl page-fade-in">
                <p className="text-sm font-semibold text-emerald-700 mb-2">Import complete</p>
                <div className="flex gap-4 text-sm">
                  <span className="text-gray-600">Total: <strong>{importResult.total}</strong></span>
                  <span className="text-emerald-600">Imported: <strong>{importResult.imported}</strong></span>
                  {importResult.failed > 0 && (
                    <span className="text-red-500">Failed: <strong>{importResult.failed}</strong></span>
                  )}
                </div>
                {importResult.errors?.length > 0 && (
                  <div className="mt-3 space-y-1">
                    {importResult.errors.map((e, i) => (
                      <p key={i} className="text-xs text-red-500">
                        Row {e.row}: {Array.isArray(e.errors) ? e.errors.join(', ') : e.error}
                      </p>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* ── My Listings ── */}
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
                <p className="text-gray-400 text-sm">Add your first property from Stays or import a CSV.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {myApartments.map((apt) => {
                  const [g1, g2] = GRADIENTS[apt.id % 5];
                  return (
                    <div key={apt.id}
                      className="bg-white rounded-2xl border border-gray-100 flex items-center gap-4 p-4 transition-all hover:border-gray-200"
                      style={{ boxShadow: 'var(--card-shadow)' }}
                    >
                      <div className="w-14 h-14 rounded-xl flex items-center justify-center text-2xl flex-shrink-0"
                        style={{ background: `linear-gradient(135deg, ${g1}, ${g2})` }}>
                        🏠
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-semibold text-gray-900 truncate">{apt.title}</span>
                          <span className={`text-xs font-medium px-2 py-0.5 rounded-md ${
                            apt.is_available ? 'bg-emerald-50 text-emerald-700' : 'bg-gray-100 text-gray-500'
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
                        ) : '🗑️ Delete'}
                      </button>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </>
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