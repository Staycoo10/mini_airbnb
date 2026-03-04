import React from 'react';

export default function Message({ text, type }) {
  if (!text) return null;

  const bgColor = type === 'error' ? 'bg-red-50' : 'bg-green-50';
  const textColor = type === 'error' ? 'text-red-600' : 'text-green-600';
  const borderColor = type === 'error' ? 'border-red-200' : 'border-green-200';

  return (
    <div className="max-w-7xl mx-auto px-6 py-4">
      <div className={`${bgColor} ${textColor} ${borderColor} border rounded-xl px-5 py-4 text-sm font-medium shadow-sm`}>
        {text}
      </div>
    </div>
  );
}