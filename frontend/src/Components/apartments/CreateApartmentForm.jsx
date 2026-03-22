import React, { useState } from 'react';

export default function CreateApartmentForm({ onSubmit, onCancel }) {
  const [imageUrls, setImageUrls] = useState(['']);

  const addImageField = () => setImageUrls(prev => [...prev, '']);

  const updateUrl = (i, val) => {
    setImageUrls(prev => prev.map((u, idx) => idx === i ? val : u));
  };

  const removeUrl = (i) => {
    setImageUrls(prev => prev.length === 1 ? [''] : prev.filter((_, idx) => idx !== i));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // filtram url-urile goale si le punem pe form ca data-attribute
    const validUrls = imageUrls.filter(u => u.trim());
    // adaugam hidden input cu toate url-urile
    e.target._imageUrls = validUrls;
    onSubmit(e);
  };

  return (
    <div className="bg-white rounded-2xl p-8 mb-8 border border-gray-100 page-fade-in" style={{ boxShadow: 'var(--card-shadow)' }}>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-semibold text-gray-900" style={{ fontFamily: "'DM Serif Display', serif" }}>
          List your space
        </h2>
        <button type="button" onClick={onCancel}
          className="w-8 h-8 flex items-center justify-center rounded-full text-gray-400 hover:bg-gray-100 hover:text-gray-700 transition-all text-lg">
          ×
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="block mb-1.5 text-sm font-semibold text-gray-800">Title</label>
          <input name="title" required
            className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm bg-gray-50 focus:bg-white transition-colors"
            placeholder="Cozy apartment in the city center" />
        </div>

        <div>
          <label className="block mb-1.5 text-sm font-semibold text-gray-800">Description</label>
          <textarea name="description" required rows="3"
            className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm bg-gray-50 focus:bg-white transition-colors resize-none"
            placeholder="Describe your place..." />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block mb-1.5 text-sm font-semibold text-gray-800">Price / night ($)</label>
            <input name="price" type="number" step="0.01" min="1" required
              className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm bg-gray-50 focus:bg-white transition-colors"
              placeholder="50.00" />
          </div>
          <div>
            <label className="block mb-1.5 text-sm font-semibold text-gray-800">Location</label>
            <input name="location" required
              className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm bg-gray-50 focus:bg-white transition-colors"
              placeholder="Chisinau, Moldova" />
          </div>
        </div>

        {/* Multiple images */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-sm font-semibold text-gray-800">
              Photos <span className="text-gray-400 font-normal">(optional)</span>
            </label>
            <button type="button" onClick={addImageField}
              className="text-xs text-[#FF385C] font-semibold hover:text-[#E31C5F] transition-colors flex items-center gap-1">
              + Add another photo
            </button>
          </div>

          <div className="space-y-3">
            {imageUrls.map((url, i) => (
              <div key={i} className="space-y-2">
                <div className="flex gap-2">
                  <input
                    type="url"
                    value={url}
                    onChange={e => updateUrl(i, e.target.value)}
                    className="flex-1 px-4 py-3 border border-gray-200 rounded-xl text-sm bg-gray-50 focus:bg-white transition-colors"
                    placeholder={`https://images.unsplash.com/... ${i === 0 ? '(main photo)' : ''}`}
                  />
                  {imageUrls.length > 1 && (
                    <button type="button" onClick={() => removeUrl(i)}
                      className="w-10 h-10 flex items-center justify-center rounded-xl border border-gray-200 text-gray-400 hover:text-red-500 hover:border-red-200 transition-all flex-shrink-0">
                      ×
                    </button>
                  )}
                </div>
                {/* Preview */}
                {url.trim() && (
                  <img src={url} alt=""
                    className="h-24 w-full object-cover rounded-xl"
                    onError={e => e.target.style.display = 'none'}
                    onLoad={e => e.target.style.display = 'block'}
                  />
                )}
              </div>
            ))}
          </div>

          {/* Thumbnail preview strip */}
          {imageUrls.filter(u => u.trim()).length > 1 && (
            <div className="flex gap-2 mt-3 overflow-x-auto pb-1">
              {imageUrls.filter(u => u.trim()).map((url, i) => (
                <img key={i} src={url} alt=""
                  className="w-16 h-12 object-cover rounded-lg flex-shrink-0 opacity-80"
                  onError={e => e.target.style.display = 'none'} />
              ))}
            </div>
          )}
        </div>

        <div className="flex gap-3 pt-2">
          <button type="submit"
            className="flex-1 py-3.5 bg-[#FF385C] text-white rounded-xl text-sm font-semibold hover:bg-[#E31C5F] transition-colors shadow-sm">
            Publish listing
          </button>
          <button type="button" onClick={onCancel}
            className="px-6 py-3.5 border border-gray-200 rounded-xl text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-colors">
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}