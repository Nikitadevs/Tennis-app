import React, { useState, useEffect } from 'react';
import Toast from '../components/Toast.jsx';
import { setUserName, setUserTheme, getUserAvatar } from '../utils/userUtils';
import { useAuth } from '../components/AuthContext';

const Settings = () => {
  const [name, setName] = useState(() => localStorage.getItem('userName') || 'Your Name');
  const [email, setEmail] = useState(() => localStorage.getItem('userEmail') || '');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [theme, setTheme] = useState(() => localStorage.getItem('theme') || 'light');
  const [toast, setToast] = useState(false);
  const [error, setError] = useState('');
  const [avatar, setAvatar] = useState(getUserAvatar());
  const [saving, setSaving] = useState(false);
  const { logout } = useAuth();
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleted, setDeleted] = useState(false);

  useEffect(() => {
    setAvatar(`https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=40916c&color=fff`);
  }, [name]);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
  }, [theme]);

  const validateEmail = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const handleSave = () => {
    if (!name.trim()) {
      setError('Name cannot be empty.');
      return;
    }
    if (!validateEmail(email)) {
      setError('Please enter a valid email address.');
      return;
    }
    if (showPassword) {
      if (password && password.length < 6) {
        setError('Password must be at least 6 characters.');
        return;
      }
      if (password && password !== confirmPassword) {
        setError('Passwords do not match.');
        return;
      }
    }
    setError('');
    setSaving(true);
    setTimeout(() => {
      setUserName(name);
      setUserTheme(theme);
      localStorage.setItem('userEmail', email);
      setSaving(false);
      setToast(true);
      setTimeout(() => setToast(false), 2000);
    }, 900);
  };

  const handleDeleteAccount = () => {
    setDeleted(true);
    setTimeout(() => {
      localStorage.clear();
      logout();
      setDeleted(false);
      setShowDeleteModal(false);
      window.location.href = '/';
    }, 1200);
  };

  return (
    <div className="w-full max-w-lg mx-auto p-4 md:p-8 bg-white dark:bg-gray-900 rounded-2xl shadow-xl mt-8 flex flex-col gap-8 animate-slide-fade-in">
      {/* Profile Card */}
      <div className="flex flex-col items-center gap-2 bg-green-50 dark:bg-gray-800 rounded-xl p-6 mb-2 shadow">
        <img
          src={avatar}
          alt={name}
          className="w-20 h-20 rounded-full border-4 border-green-300 shadow mb-2 transition-transform duration-300 hover:scale-105"
        />
        <div className="text-center">
          <div className="text-lg font-bold text-green-900 dark:text-green-200">{name}</div>
          <div className="text-sm text-gray-500 dark:text-gray-400">{email || 'No email set'}</div>
        </div>
      </div>
      {/* Account Info Section */}
      <form className="flex flex-col gap-6" onSubmit={e => { e.preventDefault(); handleSave(); }}>
        <div>
          <div className="font-semibold text-green-800 dark:text-green-200 mb-2">Account Info</div>
          <label className="block mb-2 text-sm font-medium text-green-800 dark:text-green-200">Display Name
            <input
              className="block w-full mt-1 p-2 rounded border border-green-200 dark:border-gray-700 bg-green-50 dark:bg-gray-800 text-green-900 dark:text-green-100 focus:outline-none focus:ring-2 focus:ring-green-400"
              value={name}
              onChange={e => setName(e.target.value)}
              aria-label="Display Name"
              aria-invalid={!!error}
              maxLength={32}
              autoFocus
            />
          </label>
          <label className="block mb-2 text-sm font-medium text-green-800 dark:text-green-200">Email
            <input
              className="block w-full mt-1 p-2 rounded border border-green-200 dark:border-gray-700 bg-green-50 dark:bg-gray-800 text-green-900 dark:text-green-100 focus:outline-none focus:ring-2 focus:ring-green-400"
              value={email}
              onChange={e => setEmail(e.target.value)}
              aria-label="Email"
              type="email"
              autoComplete="email"
            />
          </label>
        </div>
        {/* Collapsible Change Password Section */}
        <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
          <button
            type="button"
            className="w-full flex items-center justify-between font-semibold text-green-800 dark:text-green-200 focus:outline-none focus:ring-2 focus:ring-green-400 mb-2"
            onClick={() => setShowPassword(v => !v)}
            aria-expanded={showPassword}
          >
            Change Password
            <span className={`transition-transform ${showPassword ? 'rotate-90' : ''}`}>▶</span>
          </button>
          {showPassword && (
            <div className="flex flex-col gap-2 animate-fade-in">
              <label className="text-sm font-medium text-green-800 dark:text-green-200">New Password
                <input
                  className="block w-full mt-1 p-2 rounded border border-green-200 dark:border-gray-700 bg-green-50 dark:bg-gray-800 text-green-900 dark:text-green-100 focus:outline-none focus:ring-2 focus:ring-green-400"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  aria-label="Password"
                  type="password"
                  autoComplete="new-password"
                  placeholder="Leave blank to keep current password"
                />
              </label>
              <label className="text-sm font-medium text-green-800 dark:text-green-200">Confirm Password
                <input
                  className="block w-full mt-1 p-2 rounded border border-green-200 dark:border-gray-700 bg-green-50 dark:bg-gray-800 text-green-900 dark:text-green-100 focus:outline-none focus:ring-2 focus:ring-green-400"
                  value={confirmPassword}
                  onChange={e => setConfirmPassword(e.target.value)}
                  aria-label="Confirm Password"
                  type="password"
                  autoComplete="new-password"
                  placeholder="Repeat password"
                />
              </label>
            </div>
          )}
        </div>
        {/* Error and Save Button */}
        {error && <span className="text-red-600 text-sm mt-1" role="alert">{error}</span>}
        <button
          className={`mt-2 px-4 py-2 bg-green-600 text-white rounded-lg font-semibold shadow hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-400 transition tactile flex items-center justify-center gap-2 ${saving ? 'opacity-60 cursor-not-allowed' : ''}`}
          type="submit"
          disabled={saving}
        >
          {saving ? (
            <span className="animate-spin inline-block w-5 h-5 border-2 border-white border-t-transparent rounded-full"></span>
          ) : (
            <span className="inline-block flex items-center gap-2">Save Settings {toast && <span className="text-green-300 animate-bounce">✔️</span>}</span>
          )}
        </button>
      </form>
      <div className="mt-8 flex flex-col items-center">
        <button
          className="px-4 py-2 bg-red-600 text-white rounded-lg font-semibold shadow hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-400 transition tactile"
          onClick={() => setShowDeleteModal(true)}
        >
          Delete Account
        </button>
      </div>
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-900 rounded-xl p-8 shadow-xl max-w-xs w-full animate-fade-in">
            <h2 className="text-lg font-bold text-red-700 mb-4">Delete Account?</h2>
            <p className="mb-4 text-gray-700 dark:text-gray-300">This action is <b>permanent</b> and will remove all your data. Are you sure?</p>
            <div className="flex gap-2">
              <button
                className="flex-1 px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600"
                onClick={() => setShowDeleteModal(false)}
              >Cancel</button>
              <button
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg font-semibold hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-400 transition tactile flex items-center justify-center gap-2"
                onClick={handleDeleteAccount}
                disabled={deleted}
              >
                {deleted ? <span className="text-xl animate-bounce">✔️</span> : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
      {/* Save Confirmation Toast */}
      <Toast message={<span className="flex items-center gap-2"><span className="text-lg">✔️</span>Settings saved!</span>} show={toast} onClose={() => setToast(false)} />
    </div>
  );
};

export default Settings;
