import React, { useState, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Toast from '../components/Toast';

const SignUp = () => {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [toast, setToast] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState('');
  const errorRef = useRef(null);
  const navigate = useNavigate();

  const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const getPasswordStrength = (pwd) => {
    if (!pwd) return '';
    if (pwd.length < 6) return 'Weak';
    if (/^(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*]).{8,}$/.test(pwd)) return 'Strong';
    if (pwd.length >= 8) return 'Medium';
    return 'Weak';
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
    setPasswordStrength(getPasswordStrength(e.target.value));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('Name cannot be empty.');
      setTimeout(() => errorRef.current?.focus(), 100);
      return;
    }
    if (!validateEmail(email)) {
      setError('Please enter a valid email address.');
      setTimeout(() => errorRef.current?.focus(), 100);
      return;
    }
    if (!password || password.length < 6) {
      setError('Password must be at least 6 characters.');
      setTimeout(() => errorRef.current?.focus(), 100);
      return;
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      setTimeout(() => errorRef.current?.focus(), 100);
      return;
    }
    setError('');
    setLoading(true);
    setToast(true);
    setTimeout(() => {
      setToast(false);
      setLoading(false);
      navigate('/');
    }, 1200);
  };

  return (
    <div className="w-full max-w-md mx-auto p-6 bg-white dark:bg-gray-900 rounded-2xl shadow-xl mt-16 animate-slide-fade-in">
      <h1 className="text-2xl font-bold text-green-900 dark:text-green-200 mb-6 text-center">Sign Up</h1>
      <form className="flex flex-col gap-4" onSubmit={handleSubmit} aria-describedby={error ? 'signup-error' : undefined}>
        <label className="font-medium text-green-800 dark:text-green-200">Name
          <input
            className="block w-full mt-1 p-2 rounded border border-green-200 dark:border-gray-700 bg-green-50 dark:bg-gray-800 text-green-900 dark:text-green-100 focus:outline-none focus:ring-2 focus:ring-green-400"
            value={name}
            onChange={e => setName(e.target.value)}
            type="text"
            autoComplete="name"
            required
            aria-required="true"
            aria-label="Name"
          />
        </label>
        <label className="font-medium text-green-800 dark:text-green-200">Email
          <input
            className="block w-full mt-1 p-2 rounded border border-green-200 dark:border-gray-700 bg-green-50 dark:bg-gray-800 text-green-900 dark:text-green-100 focus:outline-none focus:ring-2 focus:ring-green-400"
            value={email}
            onChange={e => setEmail(e.target.value)}
            type="email"
            autoComplete="email"
            required
            aria-required="true"
            aria-label="Email"
          />
        </label>
        <label className="font-medium text-green-800 dark:text-green-200">Password
          <div className="relative">
            <input
              className="block w-full mt-1 p-2 pr-10 rounded border border-green-200 dark:border-gray-700 bg-green-50 dark:bg-gray-800 text-green-900 dark:text-green-100 focus:outline-none focus:ring-2 focus:ring-green-400"
              value={password}
              onChange={handlePasswordChange}
              type={showPassword ? 'text' : 'password'}
              autoComplete="new-password"
              required
              aria-required="true"
              aria-label="Password"
            />
            <button
              type="button"
              tabIndex={0}
              aria-label={showPassword ? 'Hide password' : 'Show password'}
              className="absolute right-2 top-1/2 -translate-y-1/2 text-green-700 dark:text-green-200 text-sm focus:outline-none"
              onClick={() => setShowPassword(v => !v)}
            >
              {showPassword ? 'Hide' : 'Show'}
            </button>
          </div>
          {password && (
            <div className={`text-xs mt-1 ${passwordStrength === 'Strong' ? 'text-green-600' : passwordStrength === 'Medium' ? 'text-yellow-600' : 'text-red-600'}`}
                 aria-live="polite">
              Password strength: {passwordStrength}
            </div>
          )}
        </label>
        <label className="font-medium text-green-800 dark:text-green-200">Confirm Password
          <div className="relative">
            <input
              className="block w-full mt-1 p-2 pr-10 rounded border border-green-200 dark:border-gray-700 bg-green-50 dark:bg-gray-800 text-green-900 dark:text-green-100 focus:outline-none focus:ring-2 focus:ring-green-400"
              value={confirmPassword}
              onChange={e => setConfirmPassword(e.target.value)}
              type={showConfirmPassword ? 'text' : 'password'}
              autoComplete="new-password"
              required
              aria-required="true"
              aria-label="Confirm Password"
            />
            <button
              type="button"
              tabIndex={0}
              aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
              className="absolute right-2 top-1/2 -translate-y-1/2 text-green-700 dark:text-green-200 text-sm focus:outline-none"
              onClick={() => setShowConfirmPassword(v => !v)}
            >
              {showConfirmPassword ? 'Hide' : 'Show'}
            </button>
          </div>
        </label>
        {error && <span id="signup-error" ref={errorRef} className="text-red-600 text-sm mt-1" role="alert" tabIndex={-1}>{error}</span>}
        <button
          className={`mt-2 px-4 py-2 bg-green-600 text-white rounded-lg font-semibold shadow hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-400 transition tactile flex items-center justify-center gap-2 ${loading ? 'opacity-60 cursor-not-allowed' : ''}`}
          type="submit"
          disabled={loading}
          aria-busy={loading}
        >
          {loading ? <span className="animate-spin inline-block w-5 h-5 border-2 border-white border-t-transparent rounded-full"></span> : 'Sign Up'}
        </button>
      </form>
      <div className="flex justify-between mt-6 text-sm">
        <Link to="/login" className="text-green-700 hover:underline">Log In</Link>
        <Link to="/reset-password" className="text-green-700 hover:underline">Forgot Password?</Link>
      </div>
      <Toast message="Account created!" show={toast} onClose={() => setToast(false)} />
    </div>
  );
};

export default SignUp;
