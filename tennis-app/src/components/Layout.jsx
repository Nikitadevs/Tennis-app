import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import BackgroundPattern from './BackgroundPattern';
import Tooltip from './Tooltip';
import { useAuth } from './AuthContext';
import Toast from './Toast';

const Layout = ({ children }) => {
    const [isDark, setIsDark] = useState(() => {
        if (typeof window !== 'undefined') {
            return localStorage.getItem('theme') === 'dark' ||
                (!localStorage.getItem('theme') && window.matchMedia('(prefers-color-scheme: dark)').matches);
        }
        return false;
    });

    const [showScrollTop, setShowScrollTop] = useState(false);
    const [navShadow, setNavShadow] = useState(false);
    const { user, logout } = useAuth();
    const [showLogoutToast, setShowLogoutToast] = useState(false);
    const dropdownRef = useRef(null);
    const [dropdownOpen, setDropdownOpen] = useState(false);

    const location = useLocation();
    const navigate = useNavigate();

    useEffect(() => {
        document.documentElement.classList.toggle('dark', isDark);
        localStorage.setItem('theme', isDark ? 'dark' : 'light');
    }, [isDark]);

    useEffect(() => {
        const onScroll = () => {
            setShowScrollTop(window.scrollY > 200);
            setNavShadow(window.scrollY > 8);
        };
        window.addEventListener('scroll', onScroll);
        return () => window.removeEventListener('scroll', onScroll);
    }, []);

    useEffect(() => {
        function handleClickOutside(event) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setDropdownOpen(false);
            }
        }
        if (dropdownOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        } else {
            document.removeEventListener('mousedown', handleClickOutside);
        }
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [dropdownOpen]);

    const handleLogout = () => {
        logout();
        setShowLogoutToast(true);
        setTimeout(() => setShowLogoutToast(false), 1500);
        navigate('/');
    };

    const NAV_ITEMS = [
        { path: '/', label: 'Home', icon: '🏠' },
        { path: '/matches', label: 'Matches', icon: '🎾' },
        { path: '/profile', label: 'Profile', icon: '👤' },
        { path: '/settings', label: 'Settings', icon: '⚙️' }
    ];

    return (
        <div className="min-h-screen bg-gradient-to-br from-green-50 via-green-100 to-white dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 transition-colors duration-500">
            <BackgroundPattern />
            
            <nav className={`sticky top-0 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md z-40 transition-colors duration-500 ${navShadow ? 'shadow-md' : ''}`}>
                <div className="max-w-6xl mx-auto px-4">
                    <div className="flex items-center justify-between h-16">
                        <div className="flex items-center space-x-8">
                            {NAV_ITEMS.map(item => (
                                <Tooltip key={item.path} content={item.label}>
                                    <Link
                                        to={item.path}
                                        className={`inline-flex items-center px-3 py-2 rounded-lg transition-all duration-200 ${
                                            location.pathname === item.path
                                                ? 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200'
                                                : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                                        }`}
                                    >
                                        <span className="text-xl" aria-hidden="true">{item.icon}</span>
                                        <span className="ml-2 hidden sm:inline">{item.label}</span>
                                    </Link>
                                </Tooltip>
                            ))}
                        </div>
                        {user ? (
                          <div className="relative" ref={dropdownRef}>
                            <button
                              className="flex items-center gap-2 px-2 py-1 rounded-lg hover:bg-green-100 dark:hover:bg-green-900/30 focus:outline-none focus:ring-2 focus:ring-green-400"
                              onClick={() => setDropdownOpen(v => !v)}
                              aria-haspopup="true"
                              aria-expanded={dropdownOpen}
                            >
                              <img src={user.avatar} alt={user.name} className="w-8 h-8 rounded-full border-2 border-green-300" />
                              <span className="font-medium text-green-900 dark:text-green-200 hidden sm:inline">{user.name}</span>
                              <svg className={`w-4 h-4 ml-1 transition-transform ${dropdownOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" /></svg>
                            </button>
                            {dropdownOpen && (
                              <div className="absolute right-0 mt-2 w-44 bg-white dark:bg-gray-900 rounded-lg shadow-lg py-2 z-50 animate-fade-in border border-green-100 dark:border-green-800">
                                <Link to="/profile" className="block px-4 py-2 text-green-900 dark:text-green-200 hover:bg-green-50 dark:hover:bg-green-800 transition-colors">Profile</Link>
                                <Link to="/settings" className="block px-4 py-2 text-green-900 dark:text-green-200 hover:bg-green-50 dark:hover:bg-green-800 transition-colors">Settings</Link>
                                <button
                                  className="w-full text-left px-4 py-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900 transition-colors"
                                  onClick={handleLogout}
                                >Log Out</button>
                              </div>
                            )}
                          </div>
                        ) : (
                          <button
                            className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg font-semibold shadow transition-colors duration-200"
                            aria-label="Log in"
                            onClick={() => navigate('/login')}
                          >
                            Log In
                          </button>
                        )}
                    </div>
                </div>
            </nav>

            <main className="max-w-6xl mx-auto px-4 py-8 min-h-[calc(100vh-4rem)]">
                {children}
            </main>

            {/* Floating Action Button for New Match (mobile only) */}
            <button
                className="fixed bottom-6 right-6 z-50 bg-green-500 hover:bg-green-600 text-white rounded-full shadow-lg p-4 flex items-center justify-center transition-all duration-200 tactile md:hidden"
                style={{ boxShadow: '0 4px 24px 0 rgba(34,197,94,0.18)' }}
                aria-label="Start a new match"
                onClick={() => navigate('/matches')}
            >
                <span className="text-2xl" aria-hidden="true">🎾</span>
            </button>

            {/* Scroll to Top Button */}
            {showScrollTop && (
                <button
                    className="fixed bottom-24 right-6 z-50 bg-white/90 dark:bg-gray-900/90 text-green-600 dark:text-green-300 rounded-full shadow-lg p-3 border border-green-200 dark:border-green-800 hover:bg-green-100 dark:hover:bg-green-800 transition-all duration-200 tactile"
                    aria-label="Scroll to top"
                    onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                >
                    <span className="text-xl" aria-hidden="true">⬆</span>
                </button>
            )}

            <footer className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-md transition-colors duration-500">
                <div className="max-w-6xl mx-auto px-4 py-6 text-center text-gray-600 dark:text-gray-400">
                    <p className="text-sm">
                        Built with ❤️ for tennis enthusiasts
                    </p>
                </div>
            </footer>

            <Toast message="Logged out!" show={showLogoutToast} onClose={() => setShowLogoutToast(false)} />
        </div>
    );
};

export default Layout;