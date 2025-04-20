import { useEffect } from 'react';

const KeyboardFocusManager = () => {
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Add visible focus ring only when using keyboard
      if (e.key === 'Tab') {
        document.body.classList.add('keyboard-focus');
      }
    };

    const handleMouseDown = () => {
      // Remove visible focus ring when using mouse
      document.body.classList.remove('keyboard-focus');
    };

    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('mousedown', handleMouseDown);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('mousedown', handleMouseDown);
    };
  }, []);

  return null;
};

export default KeyboardFocusManager;