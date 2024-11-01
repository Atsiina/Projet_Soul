import React from 'react';
import PacManGame from './PacManGame.js';

const SoulEaterGameComponent = ({ onScoreUpdate }) => {
  return (
    <div className="w-full h-full flex flex-col items-center justify-center">
      <div className="w-full max-w-[1800px] bg-black/80 backdrop-blur-sm rounded-xl p-6 
                    border-2 border-[#00C1A0] shadow-lg shadow-[#00C1A0]/20">
        <div className="text-center mb-6">
          <div className="flex justify-center items-stretch gap-4 mb-2">
            <div className="bg-black/60 px-4 py-2 rounded-lg border border-[#00C1A0]/30 flex flex-col justify-between">
              <div>
                <span className="text-[#00C1A0] text-xl block mb-2">Contrôles</span>
                <div className="text-white text-xl">↑ ↓ ← →</div>
                <div className="text-white text-xl">Touches directionnelles</div>
              </div>
              <div className="text-white text-lg mt-auto">Appuyez sur "Echap" pour mettre en pause</div>
            </div>
            
            <div className="bg-black/60 px-4 py-2 rounded-lg border border-[#00C1A0]/30 flex flex-col justify-between">
              <div>
                <span className="text-[#00C1A0] text-xl block mb-2">Objectif</span>
                <div className="text-white text-xl">Survivre</div>
                <div className="text-white text-xl">Mangez le plus d'âmes</div>
              </div>
              <div className="text-white text-lg mt-auto">Évitez les fantômes ou mangez-les quand ils sont vulnérables</div>
            </div>

            <div className="bg-black/60 px-4 py-2 rounded-lg border border-[#00C1A0]/30 flex flex-col">
              <span className="text-[#00C1A0] text-xl block mb-2">Points</span>
              <div className="flex flex-col gap-2">
                <div>
                  <img 
                    src="/images/Âmichettes Charly/Amichette_Verte.gif" 
                    alt="âme" 
                    className="w-4 h-4 inline mr-1"
                  />
                  <span className="text-white text-lg">Âme: 10 pts</span>
                </div>
                <div>
                  <img 
                    src="/images/Âmichettes Charly/Amichette_Doré.gif" 
                    alt="super âme" 
                    className="w-4 h-4 inline mr-1"
                  />
                  <span className="text-white text-lg">Super Âme: 50 pts</span>
                </div>
                <div>
                  <span className="text-blue-400 mr-1">👻</span>
                  <span className="text-white text-lg">Fantôme: 200 pts</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="mt-16">
          <PacManGame onScoreUpdate={onScoreUpdate} />
        </div>
      </div>
    </div>
  );
};

export default SoulEaterGameComponent;