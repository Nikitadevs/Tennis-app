import React, { useState, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Toast from '../components/Toast';
import { useAuth } from '../components/AuthContext';

const LogIn = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [remember, setRemember] = useState(false);
  const [error, setError] = useState('');
  const [toast, setToast] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const errorRef = useRef(null);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Please enter your email and password.');
      setTimeout(() => errorRef.current?.focus(), 100);
      return;
    }
    setError('');
    setLoading(true);
    setToast(true);
    setTimeout(() => {
      login('User', email); // You can replace 'User' with a real name if available
      if (remember) {
        localStorage.setItem('rememberMe', 'true');
      } else {
        localStorage.removeItem('rememberMe');
      }
      setToast(false);
      setLoading(false);
      navigate('/');
    }, 900);
  };

  return (
    <div className="w-full max-w-md mx-auto p-6 bg-white dark:bg-gray-900 rounded-2xl shadow-xl mt-16 animate-slide-fade-in">
      <h1 className="text-2xl font-bold text-green-900 dark:text-green-200 mb-6 text-center">Log In</h1>
      <form className="flex flex-col gap-4" onSubmit={handleSubmit} aria-describedby={error ? 'login-error' : undefined}>
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
              onChange={e => setPassword(e.target.value)}
              type={showPassword ? 'text' : 'password'}
              autoComplete="current-password"
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
        </label>
        <div className="flex items-center gap-2">
          <input
            id="remember"
            type="checkbox"
            checked={remember}
            onChange={e => setRemember(e.target.checked)}
            className="accent-green-600"
          />
          <label htmlFor="remember" className="text-sm text-green-800 dark:text-green-200 select-none">Remember me</label>
        </div>
        {error && <span id="login-error" ref={errorRef} className="text-red-600 text-sm mt-1" role="alert" tabIndex={-1}>{error}</span>}
        <button
          className={`mt-2 px-4 py-2 bg-green-600 text-white rounded-lg font-semibold shadow hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-400 transition tactile flex items-center justify-center gap-2 ${loading ? 'opacity-60 cursor-not-allowed' : ''}`}
          type="submit"
          disabled={loading}
          aria-busy={loading}
        >
          {loading ? <span className="animate-spin inline-block w-5 h-5 border-2 border-white border-t-transparent rounded-full"></span> : 'Log In'}
        </button>
      </form>
      <div className="flex justify-between mt-6 text-sm">
        <Link to="/signup" className="text-green-700 hover:underline">Sign Up</Link>
        <Link to="/reset-password" className="text-green-700 hover:underline">Forgot Password?</Link>
      </div>
      <Toast message="Logged in!" show={toast} onClose={() => setToast(false)} />
    </div>
  );
};

export default LogIn;
