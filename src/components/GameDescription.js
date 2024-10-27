import React from 'react';

const GameDescription = ({ mainColor, soulImage, children }) => {
  return (
    <section className="w-full max-w-6xl mx-auto mt-12 px-4">
      <div 
        className="backdrop-blur-md p-8 rounded-xl shadow-lg border"
        style={{
          background: `linear-gradient(to bottom, rgba(0,0,0,0.9), ${mainColor}50)`,
          borderColor: `${mainColor}20`
        }}
      >
        <div className="flex items-center gap-4 mb-8">
          <img 
            src={soulImage}
            alt="Soul Icon"
            className="w-16 h-16 object-contain -translate-y-2.5"
          />
          <h2 className="text-5xl text-white font-bold">Description</h2>
        </div>

        <div className="space-y-8 text-white text-2xl leading-relaxed description-content">
          {children}
        </div>
      </div>
    </section>
  );
};

export default GameDescription;