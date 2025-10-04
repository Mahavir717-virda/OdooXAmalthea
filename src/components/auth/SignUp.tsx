import React, { useState, useEffect } from 'react';
import { Country } from '../../types';

type RestCountry = {
  name?: { common?: string } | string;
  cca2?: string;
  cca3?: string;
  currencies?: Record<string, unknown>;
};

export const SignUp: React.FC<{ onSwitch: () => void }> = ({ onSwitch }) => {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [country, setCountry] = useState('');
  const [countries, setCountries] = useState<Country[]>([]);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    loadCountries();
  }, []);

  const loadCountries = async () => {
    try {
      const response = await fetch("https://restcountries.com/v3.1/all?fields=name,currencies,cca2");
      const data = await response.json();

      const countryList: Country[] = Array.isArray(data)
        ? (data as RestCountry[]).map((c) => ({
            name: (typeof c.name === 'string' ? c.name : c?.name?.common) || 'Unknown',
            code: c?.cca2 || c?.cca3 || 'UN',
            currency: Object.keys(c?.currencies || {})[0] || 'USD',
          }))
          .filter((x) => x.name && x.code)
          .sort((a, b) => a.name.localeCompare(b.name))
        : [];

      setCountries(countryList.length
        ? countryList
        : [
          { code: 'IN', name: 'India', currency: 'INR' },
          { code: 'US', name: 'United States', currency: 'USD' },
        ]);
    } catch (err) {
      console.error('Error fetching countries:', err);
      setCountries([
        { code: 'IN', name: 'India', currency: 'INR' },
        { code: 'US', name: 'United States', currency: 'USD' },
      ]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    if (!country) {
      setError('Please select a country');
      return;
    }

    setIsLoading(true);

    try {
      // Payload with full data
      const payload = { fullName, email, password, country };

      const response = await fetch('http://localhost/expense_management/Signup.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
        mode: 'cors'
      });

      const result = await (async () => {
        try {
          return await response.json();
        } catch {
          const text = await response.text();
          throw new Error(text || 'Invalid server response');
        }
      })();

      if (result.status === 'success') {
        alert(result.message);
        onSwitch(); // go to Sign In
      } else {
        setError(result.message || 'Registration failed');
      }
    } catch (err) {
      console.error(err);
      setError('Something went wrong while connecting to the server.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-gray-800 rounded-lg shadow-2xl p-8 border-2 border-gray-700">
          <h2 className="text-3xl font-bold text-white mb-2 text-center">Create Account</h2>
          <p className="text-gray-400 text-center mb-6">Sign up to start managing expenses</p>

          {error && (
            <div className="bg-red-900/50 border-2 border-red-500 text-red-200 p-3 rounded-lg mb-4">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-gray-300 text-sm font-semibold mb-2">Full Name</label>
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full px-4 py-3 bg-gray-700 border-2 border-gray-600 rounded-lg text-white placeholder-gray-400 focus:border-blue-500 focus:outline-none transition-colors"
                placeholder="Enter your full name"
                required
              />
            </div>

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
              <label className="block text-gray-300 text-sm font-semibold mb-2">Country</label>
              <select
                value={country}
                onChange={(e) => setCountry(e.target.value)}
                className="w-full px-4 py-3 bg-gray-700 border-2 border-gray-600 rounded-lg text-white focus:border-blue-500 focus:outline-none transition-colors"
                required
              >
                <option value="">Select your country</option>
                {countries.map((c) => (
                  <option key={c.code} value={c.name}>
                    {c.name} ({c.currency})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-gray-300 text-sm font-semibold mb-2">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 bg-gray-700 border-2 border-gray-600 rounded-lg text-white placeholder-gray-400 focus:border-blue-500 focus:outline-none transition-colors"
                placeholder="Create a password"
                required
              />
            </div>

            <div>
              <label className="block text-gray-300 text-sm font-semibold mb-2">Confirm Password</label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full px-4 py-3 bg-gray-700 border-2 border-gray-600 rounded-lg text-white placeholder-gray-400 focus:border-blue-500 focus:outline-none transition-colors"
                placeholder="Confirm your password"
                required
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed border-2 border-blue-500"
            >
              {isLoading ? 'Creating Account...' : 'Sign Up'}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-gray-400">
              Already have an account?{' '}
              <button
                onClick={onSwitch}
                className="text-blue-400 hover:text-blue-300 font-semibold transition-colors"
              >
                Sign In
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
