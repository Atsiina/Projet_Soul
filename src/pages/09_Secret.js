import React, { useState, useEffect } from 'react';
import SoulEaterGameComponent from '../components/SoulEaterGameComponent';

const SecretPage = () => {
  const [bubbles, setBubbles] = useState([]);

  useEffect(() => {
    const generateBubbles = () => {
      return Array.from({ length: 60 }, (_, i) => ({
        id: i,
        size: Math.random() * (200 - 30) + 30,
        left: Math.random() * 100,
        top: Math.random() * 300,
        delay: Math.random() * 10,
        duration: Math.random() * (30 - 15) + 15,
        hasGlow: Math.random() > 0.4,
        glowIntensity: (200 - (Math.random() * (200 - 30) + 30)) / 200
      }));
    };

    setBubbles(generateBubbles());
  }, []);

  return (
    <div className="min-h-screen bg-black text-white relative overflow-hidden">
      {/* Bulles d'arrière-plan */}
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
              background: 'linear-gradient(135deg, #00C1A0, #008B71, #00755E)',
              animation: `float ${bubble.duration}s ease-in-out ${bubble.delay}s infinite`,
              filter: bubble.hasGlow ? `drop-shadow(0 0 ${8 * bubble.glowIntensity}px rgba(0, 193, 160, ${0.3 * bubble.glowIntensity}))` : 'none',
              opacity: bubble.hasGlow ? 0.1 + (bubble.glowIntensity * 0.1) : 0.1
            }}
          />
        ))}
      </div>

      {/* Titre */}
      <div className="relative z-10 pt-12 pb-5 text-center">
        <div className="flex items-center justify-center gap-4">
          <img 
            src="/images/Âmichettes Charly/Amichette_Doré.gif" 
            alt="Soul Animation Left" 
            className="w-16 h-16 object-contain"
          />
          <h1 
            className="text-6xl font-bold tracking-wider"
            style={{
              background: 'linear-gradient(to bottom, #00C1A0, #008B71, #00755E)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              textShadow: '0 0 30px rgba(0, 193, 160, 0.3)'
            }}
          >
            Soul Eater Game
          </h1>
          <img 
            src="/images/Âmichettes Charly/Amichette_Doré.gif" 
            alt="Soul Animation Right" 
            className="w-16 h-16 object-contain transform -scale-x-100"
          />
        </div>
      </div>

      {/* Zone de jeu */}
      <div className="relative z-10 flex justify-center items-center px-4 py-8">
        <SoulEaterGameComponent 
          onScoreUpdate={(score) => console.log('Score mis à jour:', score)} 
        />
      </div>

      {/* Styles pour les animations */}
      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0) translateX(0) scale(1); }
          50% { transform: translateY(-50px) translateX(20px) scale(1.1); }
          75% { transform: translateY(-25px) translateX(-20px) scale(1.05); }
        }
      `}</style>
    </div>
  );
};

export default SecretPage;