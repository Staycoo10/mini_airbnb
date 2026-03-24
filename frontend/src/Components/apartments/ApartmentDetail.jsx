import React, { useState, useEffect, useCallback } from 'react';
import api from '../../services/api';

const GRADIENTS = [
  ['#FF385C', '#E31C5F'],
  ['#7B61FF', '#5B3FE0'],
  ['#00A699', '#007A70'],
  ['#FC642D', '#E0531F'],
  ['#1B4965', '#2D6E9E'],
];

export default function ApartmentDetail({ apartment: initialApartment, user, onBack, onReserve }) {
  const [apartment, setApartment] = useState(initialApartment);
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
    // fetch detalii complete cu owner_name
    api.call(`/apartments/${apartment.id}`)
      .then(data => setApartment(data))
      .catch(() => {});
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
                </div>
              ))}
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
            <p className="text-sm text-gray-500 mb-1">📍 {apartment.location}</p>
            {apartment.owner_name && (
              <div className="flex items-center gap-2 mb-4">
                <div className="w-6 h-6 rounded-full bg-gradient-to-br from-[#FF385C] to-[#E31C5F] flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                  {apartment.owner_name.charAt(0).toUpperCase()}
                </div>
                <span className="text-sm text-gray-500">Hosted by <span className="font-medium text-gray-700">{apartment.owner_name}</span></span>
              </div>
            )}
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
          className="fixed inset-0 z-[9999] h-screen flex flex-col items-center justify-center modal-backdrop"
          style={{ background: 'rgba(0,0,0,0.95)' }}
          onClick={() => setLightbox(null)}
        >
          {/* Close */}
          <button
            onClick={() => setLightbox(null)}
            className="absolute top-5 right-5 w-10 h-10 bg-white/20 hover:bg-white/40 text-white rounded-full flex items-center justify-center text-xl transition-all"
          >×</button>

          {/* Counter */}
          <div className="absolute top-5 left-1/2 -translate-x-1/2 bg-white/20 text-white text-sm px-4 py-1.5 rounded-full backdrop-blur-sm">
            {lightbox + 1} / {allImages.length}
          </div>

          {/* Nav + image */}
          <div className="flex items-center gap-4 w-full h-full px-6 py-20" onClick={e => e.stopPropagation()}>
            <button
              onClick={() => setLightbox((lightbox - 1 + allImages.length) % allImages.length)}
              disabled={allImages.length <= 1}
              className="flex-shrink-0 w-11 h-11 bg-white/20 hover:bg-white/40 text-white rounded-full flex items-center justify-center text-xl transition-all disabled:opacity-0"
            >←</button>

            <div className="flex-1 h-full flex items-center justify-center">
              <img
                src={allImages[lightbox].url}
                alt=""
                style={{ maxHeight: '100%', maxWidth: '100%', objectFit: 'contain', borderRadius: '12px' }}
              />
            </div>

            <button
              onClick={() => setLightbox((lightbox + 1) % allImages.length)}
              disabled={allImages.length <= 1}
              className="flex-shrink-0 w-11 h-11 bg-white/20 hover:bg-white/40 text-white rounded-full flex items-center justify-center text-xl transition-all disabled:opacity-0"
            >→</button>
          </div>

          {/* Thumbnails */}
          {allImages.length > 1 && (
            <div className="absolute bottom-5 left-1/2 -translate-x-1/2 flex gap-2" onClick={e => e.stopPropagation()}>
              {allImages.map((img, i) => (
                <img key={img.id} src={img.url} alt=""
                  onClick={() => setLightbox(i)}
                  className={`w-14 h-10 object-cover rounded-lg cursor-pointer transition-all ${
                    i === lightbox ? 'ring-2 ring-white opacity-100' : 'opacity-40 hover:opacity-70'
                  }`}
                />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}