import React, { useState, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Toast from '../components/Toast';

const ResetPassword = () => {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [toast, setToast] = useState(false);
  const [loading, setLoading] = useState(false);
  const errorRef = useRef(null);
  const navigate = useNavigate();

  const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateEmail(email)) {
      setError('Please enter a valid email address.');
      setTimeout(() => errorRef.current?.focus(), 100);
      return;
    }
    setError('');
    setLoading(true);
    setToast(true);
    setTimeout(() => {
      setToast(false);
      setLoading(false);
      navigate('/login');
    }, 1500);
  };

  return (
    <div className="w-full max-w-md mx-auto p-6 bg-white dark:bg-gray-900 rounded-2xl shadow-xl mt-16 animate-slide-fade-in">
      <h1 className="text-2xl font-bold text-green-900 dark:text-green-200 mb-6 text-center">Reset Password</h1>
      <form className="flex flex-col gap-4" onSubmit={handleSubmit} aria-describedby={error ? 'reset-error' : undefined}>
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
        {error && <span id="reset-error" ref={errorRef} className="text-red-600 text-sm mt-1" role="alert" tabIndex={-1}>{error}</span>}
        <button
          className={`mt-2 px-4 py-2 bg-green-600 text-white rounded-lg font-semibold shadow hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-400 transition tactile flex items-center justify-center gap-2 ${loading ? 'opacity-60 cursor-not-allowed' : ''}`}
          type="submit"
          disabled={loading}
          aria-busy={loading}
        >
          {loading ? <span className="animate-spin inline-block w-5 h-5 border-2 border-white border-t-transparent rounded-full"></span> : 'Send Reset Link'}
        </button>
      </form>
      <div className="flex justify-between mt-6 text-sm">
        <Link to="/login" className="text-green-700 hover:underline">Log In</Link>
        <Link to="/signup" className="text-green-700 hover:underline">Sign Up</Link>
      </div>
      <Toast message="Reset link sent!" show={toast} onClose={() => setToast(false)} />
    </div>
  );
};

export default ResetPassword;
