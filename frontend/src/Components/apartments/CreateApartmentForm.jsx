import React, { useState } from 'react';

export default function CreateApartmentForm({ onSubmit, onCancel }) {
  const [imageUrl, setImageUrl] = useState('');
  const [imageError, setImageError] = useState(false);

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

      <form onSubmit={onSubmit} className="space-y-5">
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

        {/* Image URL */}
        <div>
          <label className="block mb-1.5 text-sm font-semibold text-gray-800">
            Photo URL <span className="text-gray-400 font-normal">(optional)</span>
          </label>
          <input
            name="image_url"
            type="url"
            value={imageUrl}
            onChange={e => { setImageUrl(e.target.value); setImageError(false); }}
            className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm bg-gray-50 focus:bg-white transition-colors"
            placeholder="https://images.unsplash.com/..."
          />
          {/* Preview */}
          {imageUrl && !imageError && (
            <div className="mt-3 rounded-xl overflow-hidden h-40 bg-gray-100">
              <img
                src={imageUrl}
                alt="Preview"
                className="w-full h-full object-cover"
                onError={() => setImageError(true)}
              />
            </div>
          )}
          {imageUrl && imageError && (
            <p className="mt-2 text-xs text-red-500">Could not load image — check the URL.</p>
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