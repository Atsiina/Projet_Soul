import React from 'react';
import { useLocation } from 'react-router-dom';

const GameTitle = ({ title, type, colors, soulImage }) => {
  const location = useLocation();
  const isMiniMenu = location.pathname === '/mini-games';

  return (
    <header className="w-full max-w-6xl mx-auto text-center mb-12">
      <div className="flex items-center justify-center gap-8 mb-4">
        {!isMiniMenu && (
          <img 
            src={soulImage}
            alt="Soul Left"
            className="w-24 h-24 object-contain transform -scale-x-100"
          />
        )}
        
        <h1 
          className="text-8xl font-bold"
          style={{
            background: colors.gradient,
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            textShadow: `0 0 30px ${colors.light}30`
          }}
        >
          {title}
        </h1>
        
        {!isMiniMenu && (
          <img 
            src={soulImage}
            alt="Soul Right"
            className="w-24 h-24 object-contain"
          />
        )}
      </div>
      {type && (
        <div 
          className="text-4xl font-bold"
          style={{ color: colors.light }}
        >
          {type}
        </div>
      )}
    </header>
  );
};

export default GameTitle;