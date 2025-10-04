import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export const SignIn: React.FC<{ onSwitch: () => void; onForgotPassword: () => void }> = ({
  onSwitch,
  onForgotPassword
}) => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  setError('');
  setIsLoading(true);

  try {
    const res = await fetch("http://localhost:5001/api/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password })
    });

    const data = await res.json();

    if (!data.success) {
      throw new Error(data.message);
    }

    // Optional: store user info in localStorage or context
    localStorage.setItem('token', data.token);
    localStorage.setItem('user', JSON.stringify(data.user));
    navigate('/dashboard');
  } catch (err: any) {
    setError(err.message || 'Failed to sign in');
  } finally {
    setIsLoading(false);
  }
};

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-gray-800 rounded-lg shadow-2xl p-8 border-2 border-gray-700">
          <h2 className="text-3xl font-bold text-white mb-2 text-center">Welcome Back</h2>
          <p className="text-gray-400 text-center mb-6">Sign in to your account</p>

          {error && (
            <div className="bg-red-900/50 border-2 border-red-500 text-red-200 p-3 rounded-lg mb-4">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-gray-300 text-sm font-semibold mb-2">Email Address</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 bg-gray-700 border-2 border-gray-600 rounded-lg text-white placeholder-gray-400 focus:border-blue-500 focus:outline-none transition-colors"
                placeholder="Enter your email"
                required
              />
            </div>

            <div>
              <label className="block text-gray-300 text-sm font-semibold mb-2">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 bg-gray-700 border-2 border-gray-600 rounded-lg text-white placeholder-gray-400 focus:border-blue-500 focus:outline-none transition-colors"
                placeholder="Enter your password"
                required
              />
            </div>

            <div className="flex justify-end">
              <button
                type="button"
                onClick={onForgotPassword}
                className="text-blue-400 hover:text-blue-300 text-sm font-semibold transition-colors"
              >
                Forgot password?
              </button>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed border-2 border-blue-500"
            >
              {isLoading ? 'Signing In...' : 'Sign In'}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-gray-400">
              Don't have an account?{' '}
              <button
                onClick={onSwitch}
                className="text-blue-400 hover:text-blue-300 font-semibold transition-colors"
              >
                Sign Up
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};