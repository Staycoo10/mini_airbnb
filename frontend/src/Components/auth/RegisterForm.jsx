
import React from 'react';

export default function RegisterForm({ onSubmit, onSwitchToLogin }) {
  return (
    <div>
      <form onSubmit={onSubmit} className="space-y-4">
        <div>
          <label className="block mb-2 text-sm font-semibold text-gray-900">Full Name</label>
          <input name="name" required className="w-full px-4 py-3 border border-gray-300 rounded-lg text-base focus:outline-none focus:border-gray-900" placeholder="John Doe" />
        </div>
        <div>
          <label className="block mb-2 text-sm font-semibold text-gray-900">Email</label>
          <input name="email" type="email" required className="w-full px-4 py-3 border border-gray-300 rounded-lg text-base focus:outline-none focus:border-gray-900" placeholder="your@email.com" />
        </div>
        <div>
          <label className="block mb-2 text-sm font-semibold text-gray-900">IDNP</label>
          <input name="idnp" maxLength="13" required className="w-full px-4 py-3 border border-gray-300 rounded-lg text-base focus:outline-none focus:border-gray-900" placeholder="1234567890123" />
        </div>
        <div>
          <label className="block mb-2 text-sm font-semibold text-gray-900">Password</label>
          <input name="password" type="password" required className="w-full px-4 py-3 border border-gray-300 rounded-lg text-base focus:outline-none focus:border-gray-900" placeholder="••••••••" />
        </div>
        <div>
          <label className="block mb-2 text-sm font-semibold text-gray-900">Account Type</label>
          <select name="role" className="w-full px-4 py-3 border border-gray-300 rounded-lg text-base focus:outline-none focus:border-gray-900 bg-white">
            <option value="user">User</option>
            <option value="admin">Admin</option>
          </select>
        </div>
        <button type="submit" className="w-full py-3.5 bg-gradient-to-r from-airbnb-primary to-airbnb-dark text-white rounded-lg text-base font-semibold hover:shadow-lg transition-shadow mt-2">
          Sign up
        </button>
      </form>
      <div className="text-center mt-6 text-sm text-gray-600">
        Already have an account?{' '}
        <button onClick={onSwitchToLogin} className="text-airbnb-primary font-semibold underline hover:text-airbnb-dark">
          Log in
        </button>
      </div>
    </div>
  );
}
