import React, { useEffect } from 'react';

const Toast = React.memo(({ message, show, onClose, duration = 3000 }) => {
  useEffect(() => {
    if (show) {
      const timer = setTimeout(onClose, duration);
      return () => clearTimeout(timer);
    }
  }, [show, duration, onClose]);

  if (!show) return null;
  
  return (
    <div
      className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 bg-gradient-to-r from-green-600 to-green-500 text-white px-6 py-3 rounded-lg shadow-lg animate-toast-enter backdrop-blur-sm"
      role="status"
      aria-live="polite"
      aria-atomic="true"
    >
      <div className="flex items-center gap-2">
        <span aria-hidden="true">✓</span>
        {message}
      </div>
      <div className="absolute bottom-0 left-0 h-1 bg-white/20 rounded-b-lg animate-toast-progress" style={{ animationDuration: `${duration}ms` }} />
    </div>
  );
});

Toast.displayName = 'Toast';

export default Toast;
