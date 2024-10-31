import React from 'react';
import PacManGame from './PacManGame.js';

const SoulEaterGameComponent = ({ onScoreUpdate }) => {
  return (
    <div className="w-full h-full flex flex-col items-center justify-center">
      <div className="w-full max-w-[1000px] bg-black/80 backdrop-blur-sm rounded-xl p-6 
                    border-2 border-[#00C1A0] shadow-lg shadow-[#00C1A0]/20">
        <div className="text-center mb-6">
          <div className="flex justify-center items-center gap-4 mb-2">
            <div className="bg-black/60 px-4 py-2 rounded-lg border border-[#00C1A0]/30">
              <span className="text-[#00C1A0]">Contrôles</span>
              <div className="text-white">↑ ↓ ← →</div>
            </div>
            
            <div className="bg-black/60 px-4 py-2 rounded-lg border border-[#00C1A0]/30">
              <span className="text-[#00C1A0]">Objectif</span>
              <div className="text-white">Mangez toutes les âmes</div>
            </div>
          </div>
        </div>
        
        <PacManGame onScoreUpdate={onScoreUpdate} />
      </div>
    </div>
  );
};

export default SoulEaterGameComponent;