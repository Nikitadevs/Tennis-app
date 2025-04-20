import React, { useEffect, useState } from 'react';

const Confetti = ({ duration = 3000 }) => {
  const [particles, setParticles] = useState([]);
  const colors = ['#22c55e', '#16a34a', '#86efac', '#f59e0b', '#3b82f6'];

  useEffect(() => {
    const particleCount = 100;
    const newParticles = Array.from({ length: particleCount }).map((_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: -20,
      size: Math.random() * 8 + 4,
      color: colors[Math.floor(Math.random() * colors.length)],
      angle: Math.random() * 360,
      speed: Math.random() * 3 + 2,
      rotation: Math.random() * 360,
      rotationSpeed: Math.random() * 10 - 5
    }));

    setParticles(newParticles);

    const timer = setTimeout(() => {
      setParticles([]);
    }, duration);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-50">
      {particles.map((particle) => (
        <div
          key={particle.id}
          className="absolute w-2 h-2 transform -translate-x-1/2 -translate-y-1/2"
          style={{
            left: `${particle.x}%`,
            top: `${particle.y}%`,
            width: `${particle.size}px`,
            height: `${particle.size}px`,
            backgroundColor: particle.color,
            transform: `rotate(${particle.rotation}deg) scale(${Math.random() * 0.5 + 0.5})`,
            animation: `confetti-fall ${particle.speed}s linear forwards, confetti-shake ${particle.rotationSpeed}s ease-in-out infinite alternate`
          }}
        />
      ))}
    </div>
  );
};

export default Confetti;