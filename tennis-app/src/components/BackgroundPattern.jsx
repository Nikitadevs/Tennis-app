import React from 'react';

const BackgroundPattern = () => {
    return (
        <div className="fixed inset-0 -z-10 opacity-[0.03] dark:opacity-[0.02]">
            <svg width="100%" height="100%">
                <pattern id="tennis-pattern" x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse">
                    <circle cx="20" cy="20" r="8" fill="currentColor" className="text-green-800 dark:text-green-200" />
                    <path d="M20 12C20 16.4183 16.4183 20 12 20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="text-green-700 dark:text-green-300" />
                    <path d="M20 28C20 23.5817 16.4183 20 12 20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeDasharray="2 2" className="text-green-700 dark:text-green-300" />
                </pattern>
                <rect x="0" y="0" width="100%" height="100%" fill="url(#tennis-pattern)" />
            </svg>
        </div>
    );
};

export default BackgroundPattern;