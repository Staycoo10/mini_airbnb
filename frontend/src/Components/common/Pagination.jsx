import React from 'react';

export default function Pagination({ currentPage, totalPages, onPageChange }) {
  if (totalPages <= 1) return null;

  const pages = [];
  for (let i = 1; i <= totalPages; i++) {
    if (i === 1 || i === totalPages || (i >= currentPage - 2 && i <= currentPage + 2)) {
      pages.push(i);
    }
  }

  const withDots = [];
  for (let i = 0; i < pages.length; i++) {
    withDots.push(pages[i]);
    if (pages[i + 1] && pages[i + 1] - pages[i] > 1) withDots.push('...');
  }

  return (
    <div className="flex items-center justify-center gap-1 mt-10">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="w-9 h-9 flex items-center justify-center rounded-xl border border-gray-200 text-gray-500 hover:bg-gray-50 hover:border-gray-300 transition-all disabled:opacity-30 disabled:cursor-not-allowed text-sm"
      >←</button>

      {withDots.map((page, i) =>
        page === '...' ? (
          <span key={`dot-${i}`} className="w-9 h-9 flex items-center justify-center text-gray-400 text-sm">…</span>
        ) : (
          <button
            key={page}
            onClick={() => onPageChange(page)}
            className={`w-9 h-9 flex items-center justify-center rounded-xl text-sm font-medium transition-all ${
              page === currentPage
                ? 'bg-gray-900 text-white shadow-sm'
                : 'border border-gray-200 text-gray-600 hover:bg-gray-50 hover:border-gray-300'
            }`}
          >{page}</button>
        )
      )}

      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="w-9 h-9 flex items-center justify-center rounded-xl border border-gray-200 text-gray-500 hover:bg-gray-50 hover:border-gray-300 transition-all disabled:opacity-30 disabled:cursor-not-allowed text-sm"
      >→</button>
    </div>
  );
}