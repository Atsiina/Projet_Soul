import React, { useState, useEffect } from 'react';

const AnimatedBackground = () => {
  const [bubbles, setBubbles] = useState([]);

  useEffect(() => {
    const generateBubbles = () => {
      const newBubbles = Array.from({ length: 60 }, (_, i) => {
        const size = Math.random() * (200 - 30) + 30;
        const glowIntensity = (200 - size) / 150;
        
        return {
          id: i,
          size: size,
          left: Math.random() * 100,
          top: Math.random() * 300,
          delay: Math.random() * 10,
          // Ajustons la vitesse ici - actuellement entre 2 et 5 secondes
          // Changeons pour avoir un mouvement plus naturel
          duration: Math.random() * (15 - 10) + 10, // Maintenant entre 10 et 15 secondes
          hasGlow: Math.random() > 0.4,
          glowIntensity: glowIntensity
        };
      });
      setBubbles(newBubbles);
    };

    generateBubbles();
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none">
      {bubbles.map((bubble) => (
        <div
          key={bubble.id}
          className="absolute rounded-full transition-all duration-1000"
          style={{
            width: `${bubble.size}px`,
            height: `${bubble.size}px`,
            left: `${bubble.left}%`,
            top: `${bubble.top}%`,
            background: `linear-gradient(135deg, #00C1A0, #008B71, #00755E)`,
            animation: `float ${bubble.duration}s ease-in-out ${bubble.delay}s infinite`,
            filter: bubble.hasGlow ? `drop-shadow(0 0 ${12 * bubble.glowIntensity}px rgba(0, 193, 160, ${0.5 * bubble.glowIntensity}))` : 'none',
            opacity: bubble.hasGlow ? 0.15 + (bubble.glowIntensity * 0.15) : 0.1
          }}
        />
      ))}
      <style jsx>{`
        @keyframes float {
          0%, 100% {
            transform: translateY(0) translateX(0) scale(1);
          }
          50% {
            transform: translateY(-50px) translateX(20px) scale(1.1);
          }
          75% {
            transform: translateY(-25px) translateX(-20px) scale(1.05);
          }
        }
      `}</style>
    </div>
  );
};

export default AnimatedBackground;