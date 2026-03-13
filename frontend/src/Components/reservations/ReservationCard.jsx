
import React from 'react';

export default function CreateApartmentForm({ onSubmit, onCancel }) {
  return (
    <div className="bg-white rounded-2xl p-8 mb-8 shadow-md border border-gray-200">
      <h2 className="text-2xl font-bold mb-6 text-gray-900">List your space</h2>
      <form onSubmit={onSubmit} className="space-y-5">
        <div>
          <label className="block mb-2 text-sm font-semibold text-gray-900">Title</label>
          <input name="title" required className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-gray-900" placeholder="Cozy apartment in the city center" />
        </div>
        <div>
          <label className="block mb-2 text-sm font-semibold text-gray-900">Description</label>
          <textarea name="description" required rows="4" className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-gray-900 resize-y" placeholder="Describe your place..."></textarea>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block mb-2 text-sm font-semibold text-gray-900">Price per night</label>
            <input name="price" type="number" step="0.01" required className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-gray-900" placeholder="50.00" />
          </div>
          <div>
            <label className="block mb-2 text-sm font-semibold text-gray-900">Location</label>
            <input name="location" required className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-gray-900" placeholder="Chisinau" />
          </div>
        </div>
        <div className="flex gap-3 pt-2">
          <button type="submit" className="flex-1 py-3.5 bg-gradient-to-r from-airbnb-primary to-airbnb-dark text-white rounded-lg font-semibold hover:shadow-lg transition-shadow">
            Publish listing
          </button>
          <button type="button" onClick={onCancel} className="px-6 py-3.5 border border-gray-300 rounded-lg font-semibold text-gray-900 hover:bg-gray-50 transition-colors">
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}