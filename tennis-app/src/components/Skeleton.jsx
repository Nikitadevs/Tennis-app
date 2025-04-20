import React from 'react';

const Skeleton = ({ className = '', variant = 'rectangular', animation = 'pulse' }) => {
  const baseClasses = 'bg-gray-200 dark:bg-gray-700 rounded';
  const animationClasses = {
    pulse: 'animate-pulse',
    wave: 'skeleton-wave'
  };

  const variantClasses = {
    rectangular: '',
    circular: 'rounded-full',
    text: 'h-4 w-3/4'
  };

  return (
    <div 
      className={`${baseClasses} ${animationClasses[animation]} ${variantClasses[variant]} ${className}`}
      role="presentation"
      aria-hidden="true"
    />
  );
};

export default Skeleton;