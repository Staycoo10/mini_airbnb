    
import React from 'react';

export default function LoginForm({ onSubmit, onSwitchToRegister }) {
  return (
    <div>
      <form onSubmit={onSubmit} className="space-y-5">
        <div>
          <label className="block mb-2 text-sm font-semibold text-gray-900">
            Email
          </label>
          <input
            name="email"
            type="email"
            required
            className="w-full px-4 py-3 border border-gray-300 rounded-lg text-base focus:outline-none focus:border-gray-900 transition-colors"
            placeholder="your@email.com"
          />
        </div>
        <div>
          <label className="block mb-2 text-sm font-semibold text-gray-900">
            Password
          </label>
          <input
            name="password"
            type="password"
            required
            className="w-full px-4 py-3 border border-gray-300 rounded-lg text-base focus:outline-none focus:border-gray-900 transition-colors"
            placeholder="••••••••"
          />
        </div>
        <button
          type="submit"
          className="w-full py-3.5 bg-gradient-to-r from-airbnb-primary to-airbnb-dark text-white rounded-lg text-base font-semibold hover:shadow-lg transition-shadow"
        >
          Log in
        </button>
      </form>
      <div className="text-center mt-6 text-sm text-gray-600">
        Don't have an account?{' '}
        <button
          onClick={onSwitchToRegister}
          className="text-airbnb-primary font-semibold underline hover:text-airbnb-dark"
        >
          Sign up
        </button>
      </div>
    </div>
  );
}