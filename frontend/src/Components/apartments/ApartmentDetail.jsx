import React, { useState, useEffect, useCallback } from 'react';
import api from '../../services/api';

const GRADIENTS = [
  ['#FF385C', '#E31C5F'],
  ['#7B61FF', '#5B3FE0'],
  ['#00A699', '#007A70'],
  ['#FC642D', '#E0531F'],
  ['#1B4965', '#2D6E9E'],
];

export default function ApartmentDetail({ apartment, user, onBack, onReserve }) {
  const [images, setImages] = useState([]);
  const [lightbox, setLightbox] = useState(null); // index
  const [newUrl, setNewUrl] = useState('');
  const [addingUrl, setAddingUrl] = useState(false);
  const [previewError, setPreviewError] = useState(false);

  const isOwner = user.role === 'admin';
  const [g1, g2] = GRADIENTS[apartment.id % 5];

  const loadImages = useCallback(async () => {
    try {
      const data = await api.call(`/apartments/${apartment.id}/images`);
      setImages(data);
    } catch {}
  }, [apartment.id]);

  useEffect(() => {
    loadImages();
  }, [loadImages]);

  // Lightbox keyboard nav
  useEffect(() => {
    if (lightbox === null) return;
    const handler = (e) => {
      if (e.key === 'ArrowRight') setLightbox(i => (i + 1) % allImages.length);
      if (e.key === 'ArrowLeft')  setLightbox(i => (i - 1 + allImages.length) % allImages.length);
      if (e.key === 'Escape')     setLightbox(null);
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [lightbox]);

  const handleAddImage = async () => {
    if (!newUrl.trim()) return;
    setAddingUrl(true);
    try {
      await api.call(`/apartments/${apartment.id}/images`, {
        method: 'POST',
        body: JSON.stringify({ url: newUrl.trim() })
      });
      setNewUrl('');
      setPreviewError(false);
      loadImages();
    } catch (err) {
      alert(err.message);
    } finally {
      setAddingUrl(false);
    }
  };

  const handleDeleteImage = async (imageId) => {
    if (!window.confirm('Delete this image?')) return;
    try {
      await api.call(`/apartments/${apartment.id}/images/${imageId}`, { method: 'DELETE' });
      loadImages();
    } catch {}
  };

  // Combine: prima e image_url din apartament (daca exista), restul din tabel
  const allImages = [
    ...(apartment.image_url ? [{ id: 'main', url: apartment.image_url }] : []),
    ...images
  ];

  return (
    <div className="page-fade-in">
      {/* Back button */}
      <button
        onClick={onBack}
        className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-900 transition-colors mb-6 group"
      >
        <span className="group-hover:-translate-x-1 transition-transform">←</span>
        Back to stays
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left — Gallery */}
        <div className="lg:col-span-2">

          {/* Main image / gradient */}
          <div
            className="rounded-2xl overflow-hidden mb-3 cursor-pointer relative"
            style={{ height: '380px' }}
            onClick={() => allImages.length > 0 && setLightbox(0)}
          >
            {allImages.length > 0 ? (
              <img src={allImages[0].url} alt={apartment.title}
                className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-7xl"
                style={{ background: `linear-gradient(135deg, ${g1}, ${g2})` }}>
                🏠
              </div>
            )}
            {allImages.length > 1 && (
              <div className="absolute bottom-3 right-3 bg-black/50 text-white text-xs font-medium px-3 py-1.5 rounded-lg backdrop-blur-sm">
                1 / {allImages.length}
              </div>
            )}
          </div>

          {/* Thumbnail strip */}
          {allImages.length > 1 && (
            <div className="flex gap-2 overflow-x-auto pb-1">
              {allImages.map((img, i) => (
                <div key={img.id} className="relative flex-shrink-0 group">
                  <img
                    src={img.url}
                    alt=""
                    onClick={() => setLightbox(i)}
                    className={`w-20 h-16 object-cover rounded-xl cursor-pointer transition-all ${
                      i === 0 ? 'ring-2 ring-gray-900' : 'opacity-70 hover:opacity-100'
                    }`}
                  />
                  {isOwner && img.id !== 'main' && (
                    <button
                      onClick={() => handleDeleteImage(img.id)}
                      className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-red-500 text-white rounded-full text-xs hidden group-hover:flex items-center justify-center leading-none"
                    >×</button>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* Add image (admin only) */}
          {isOwner && (
            <div className="mt-4 bg-gray-50 border border-gray-100 rounded-2xl p-4">
              <p className="text-sm font-semibold text-gray-700 mb-3">Add photo</p>
              <div className="flex gap-2">
                <input
                  type="url"
                  value={newUrl}
                  onChange={e => { setNewUrl(e.target.value); setPreviewError(false); }}
                  placeholder="https://images.unsplash.com/..."
                  className="flex-1 px-4 py-2.5 border border-gray-200 rounded-xl text-sm bg-white focus:bg-white transition-colors"
                />
                <button
                  onClick={handleAddImage}
                  disabled={!newUrl.trim() || addingUrl}
                  className="px-5 py-2.5 bg-gray-900 text-white rounded-xl text-sm font-semibold hover:bg-gray-700 transition-colors disabled:opacity-40"
                >
                  {addingUrl ? '...' : 'Add'}
                </button>
              </div>
              {newUrl && !previewError && (
                <img src={newUrl} alt="preview"
                  className="mt-3 h-24 w-full object-cover rounded-xl"
                  onError={() => setPreviewError(true)} />
              )}
              {previewError && <p className="mt-2 text-xs text-red-500">Invalid image URL</p>}
            </div>
          )}
        </div>

        {/* Right — Info */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-2xl border border-gray-100 p-6 sticky top-24" style={{ boxShadow: 'var(--card-shadow)' }}>
            <div className="mb-2">
              <span className={`text-xs font-semibold px-2.5 py-1 rounded-lg ${
                apartment.is_available ? 'bg-emerald-50 text-emerald-700' : 'bg-gray-100 text-gray-500'
              }`}>
                {apartment.is_available ? '● Available' : '○ Booked'}
              </span>
            </div>

            <h1 className="text-2xl font-semibold text-gray-900 mt-3 mb-1" style={{ fontFamily: "'DM Serif Display', serif" }}>
              {apartment.title}
            </h1>
            <p className="text-sm text-gray-500 mb-4">📍 {apartment.location}</p>
            <p className="text-sm text-gray-600 leading-relaxed mb-6">{apartment.description}</p>

            <div className="border-t border-gray-100 pt-4 mb-6">
              <span className="text-3xl font-bold text-gray-900">${apartment.price}</span>
              <span className="text-gray-400 text-sm ml-1">/ night</span>
            </div>

            {apartment.is_available ? (
              <button
                onClick={() => onReserve(apartment.id, apartment.title, apartment.price)}
                className="w-full py-3.5 bg-[#FF385C] text-white rounded-xl font-semibold hover:bg-[#E31C5F] transition-colors shadow-sm"
              >
                Reserve
              </button>
            ) : (
              <div className="w-full py-3.5 bg-gray-100 text-gray-400 rounded-xl font-semibold text-center text-sm">
                Not available
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Lightbox */}
      {lightbox !== null && allImages.length > 0 && (
        <div
          className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center modal-backdrop"
          onClick={() => setLightbox(null)}
        >
          {/* Prev */}
          {allImages.length > 1 && (
            <button
              onClick={e => { e.stopPropagation(); setLightbox((lightbox - 1 + allImages.length) % allImages.length); }}
              className="absolute left-4 top-1/2 -translate-y-1/2 w-11 h-11 bg-white/20 hover:bg-white/40 text-white rounded-full flex items-center justify-center text-xl transition-all"
            >←</button>
          )}

          <img
            src={allImages[lightbox].url}
            alt=""
            className="max-w-[90vw] max-h-[85vh] object-contain rounded-xl"
            onClick={e => e.stopPropagation()}
          />

          {/* Next */}
          {allImages.length > 1 && (
            <button
              onClick={e => { e.stopPropagation(); setLightbox((lightbox + 1) % allImages.length); }}
              className="absolute right-4 top-1/2 -translate-y-1/2 w-11 h-11 bg-white/20 hover:bg-white/40 text-white rounded-full flex items-center justify-center text-xl transition-all"
            >→</button>
          )}

          {/* Counter */}
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 bg-white/20 text-white text-sm px-4 py-1.5 rounded-full backdrop-blur-sm">
            {lightbox + 1} / {allImages.length}
          </div>

          {/* Close */}
          <button
            onClick={() => setLightbox(null)}
            className="absolute top-4 right-4 w-9 h-9 bg-white/20 hover:bg-white/40 text-white rounded-full flex items-center justify-center text-lg transition-all"
          >×</button>
        </div>
      )}
    </div>
  );
}