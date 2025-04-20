import React, { useState, useEffect, Suspense, lazy } from 'react';
import { Routes, Route, useLocation, Link, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import KeyboardFocusManager from './components/KeyboardFocusManager';
import { useAuth } from './components/AuthContext';

const Home = lazy(() => import('./pages/Home'));
const Matches = lazy(() => import('./pages/Matches'));
const Profile = lazy(() => import('./pages/Profile'));
const Settings = lazy(() => import('./pages/Settings'));
const LogIn = lazy(() => import('./pages/LogIn'));
const SignUp = lazy(() => import('./pages/SignUp'));
const ResetPassword = lazy(() => import('./pages/ResetPassword'));

function usePageLoading() {
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    const start = () => setLoading(true);
    const end = () => setTimeout(() => setLoading(false), 350);
    window.addEventListener('navigation-start', start);
    window.addEventListener('navigation-end', end);
    return () => {
      window.removeEventListener('navigation-start', start);
      window.removeEventListener('navigation-end', end);
    };
  }, []);
  return loading;
}

const LoadingSpinner = () => (
  <div className="fixed inset-0 flex items-center justify-center bg-black/20 backdrop-blur-sm z-50" role="status" aria-live="polite">
    <div className="relative flex flex-col items-center">
      <img
        src="/tennis-ball.svg"
        alt="Loading tennis ball"
        className="w-12 h-12 animate-bounce mb-2 drop-shadow-lg"
        style={{ filter: 'drop-shadow(0 0 8px #4ade80)' }}
      />
      <div className="w-8 h-8 border-4 border-green-400 border-t-transparent rounded-full animate-spin absolute top-2 left-2 opacity-70"></div>
      <span className="sr-only">Loading...</span>
    </div>
  </div>
);

const NotFound = () => (
  <div className="text-center mt-24" role="alert" aria-label="Page not found">
    <div className="flex flex-col items-center">
      <img src="/tennis-ball.svg" alt="Tennis ball" className="w-16 h-16 mb-4 animate-bounce" />
      <h1 className="text-5xl font-bold text-red-600 mb-2">404</h1>
      <p className="mb-4 text-lg text-gray-600 dark:text-gray-400">Sorry, this page is out!</p>
      <Link to="/" className="inline-block px-6 py-2 bg-green-600 text-white rounded shadow hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-400 transition">
        Go Home
      </Link>
    </div>
  </div>
);

const SkipToContent = () => (
  <a
    href="#main-content"
    className="absolute left-2 top-2 z-50 bg-white text-green-700 px-3 py-1 rounded shadow focus:translate-y-0 -translate-y-12 focus:outline-none focus:ring-2 focus:ring-green-400 transition"
    tabIndex={0}
  >
    Skip to main content
  </a>
);

function RequireAuth({ children }) {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  return children;
}

const App = () => {
  const loading = usePageLoading();
  
  return (
    <>
      <SkipToContent />
      <Layout>
        <KeyboardFocusManager />
        {loading && <LoadingSpinner />}
        <main id="main-content" tabIndex={-1} className="outline-none">
          <Suspense fallback={<LoadingSpinner />}>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/matches" element={<Matches />} />
              <Route path="/profile" element={<RequireAuth><Profile /></RequireAuth>} />
              <Route path="/settings" element={<RequireAuth><Settings /></RequireAuth>} />
              <Route path="/login" element={<LogIn />} />
              <Route path="/signup" element={<SignUp />} />
              <Route path="/reset-password" element={<ResetPassword />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Suspense>
        </main>
      </Layout>
    </>
  );
};

export default App;
