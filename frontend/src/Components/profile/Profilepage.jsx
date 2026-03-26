import React from 'react';

export default function ProfilePage({ user, onGoBack }) {
  const initials = user.name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2);
  const isAdmin = user.role === 'admin';

  const InfoRow = ({ label, value }) => (
    <div className="flex items-center justify-between py-4 border-b border-gray-100 last:border-0">
      <span className="text-sm text-gray-500">{label}</span>
      <span className="text-sm font-medium text-gray-900">{value}</span>
    </div>
  );

  return (
    <div className="page-fade-in max-w-3xl mx-auto">
      <button onClick={onGoBack}
        className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-900 transition-colors mb-8 group">
        <span className="group-hover:-translate-x-1 transition-transform">←</span>
        Back
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

        {/* Avatar card */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-2xl border border-gray-100 p-8 flex flex-col items-center text-center sticky top-24"
            style={{ boxShadow: 'var(--card-shadow)' }}>
            <div className="w-24 h-24 rounded-full flex items-center justify-center text-3xl font-bold text-white mb-4"
              style={{ background: 'linear-gradient(135deg, #FF385C, #E31C5F)' }}>
              {initials}
            </div>
            <h2 className="text-xl font-semibold text-gray-900 mb-1"
              style={{ fontFamily: "'DM Serif Display', serif" }}>
              {user.name}
            </h2>
            <span className={`text-xs font-semibold px-3 py-1 rounded-full ${
              isAdmin ? 'bg-amber-100 text-amber-700' : 'bg-blue-50 text-blue-700'
            }`}>
              {isAdmin ? '👑 Host / Admin' : '🌍 Guest'}
            </span>
          </div>
        </div>

        {/* Info */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-2xl border border-gray-100 p-6"
            style={{ boxShadow: 'var(--card-shadow)' }}>
            <h3 className="text-lg font-semibold text-gray-900 mb-4"
              style={{ fontFamily: "'DM Serif Display', serif" }}>
              Account info
            </h3>
            <InfoRow label="Full name" value={user.name} />
            <InfoRow label="Email" value={user.email} />
            <InfoRow label="Account ID" value={`#${user.id}`} />
            <InfoRow label="Role" value={isAdmin ? 'Host / Admin' : 'Guest'} />
          </div>

          <div className="bg-white rounded-2xl border border-gray-100 p-6"
            style={{ boxShadow: 'var(--card-shadow)' }}>
            <h3 className="text-lg font-semibold text-gray-900 mb-4"
              style={{ fontFamily: "'DM Serif Display', serif" }}>
              Permissions
            </h3>
            <div className="space-y-1">
              {[
                { label: 'Browse stays', allowed: true },
                { label: 'Make reservations', allowed: true },
                { label: 'Cancel reservations', allowed: true },
                { label: 'List properties', allowed: isAdmin },
                { label: 'Manage own listings', allowed: isAdmin },
                { label: 'Import / Export CSV', allowed: isAdmin },
              ].map(({ label, allowed }) => (
                <div key={label} className="flex items-center justify-between py-3 border-b border-gray-50 last:border-0">
                  <span className="text-sm text-gray-600">{label}</span>
                  <span className={`text-xs font-semibold px-2.5 py-1 rounded-lg ${
                    allowed ? 'bg-emerald-50 text-emerald-700' : 'bg-gray-100 text-gray-400'
                  }`}>
                    {allowed ? '✓ Allowed' : '✕ Not allowed'}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {!isAdmin && (
            <div className="rounded-2xl p-6 text-white"
              style={{ background: 'linear-gradient(135deg, #FF385C, #E31C5F)' }}>
              <h3 className="text-lg font-semibold mb-1" style={{ fontFamily: "'DM Serif Display', serif" }}>
                Become a Host
              </h3>
              <p className="text-white/80 text-sm">
                Want to list your own properties? Register a new account with the Host / Admin role.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}