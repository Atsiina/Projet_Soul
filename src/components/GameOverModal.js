import React, { useState, useEffect } from 'react';

const GameOverModal = ({ score, onSubmit, onClose }) => {
  const [pseudo, setPseudo] = useState('');
  const [isValid, setIsValid] = useState(false);

  useEffect(() => {
    setIsValid(pseudo.length >= 3 && pseudo.length <= 15);
  }, [pseudo]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isValid) {
      onSubmit({
        player: pseudo,
        score: score,
        date: new Date().toISOString()
      });
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80">
      <div className="relative bg-gradient-to-b from-black/90 to-[#00755E]/30 
                    backdrop-blur-md p-8 rounded-2xl shadow-2xl 
                    border border-[#00755E]/30 max-w-md w-full mx-4">
        <div className="absolute inset-0 rounded-2xl bg-gradient-to-b from-[#00C1A0]/10 to-transparent" />
        
        <div className="relative z-10 space-y-6">
          <div className="text-center">
            <h2 className="text-4xl font-bold text-[#00C1A0] mb-2">Game Over</h2>
            <div className="flex items-center justify-center gap-4">
              <img 
                src="/images/Âmichettes Charly/Amichette_Doré.gif"
                alt="Score"
                className="w-12 h-12"
              />
              <p className="text-3xl font-bold text-yellow-500">
                {score.toLocaleString()} points
              </p>
              <img 
                src="/images/Âmichettes Charly/Amichette_Doré.gif"
                alt="Score"
                className="w-12 h-12"
              />
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="block text-[#00C1A0] text-lg">
                Entre ton pseudo pour sauvegarder ton score
              </label>
              <input
                type="text"
                value={pseudo}
                onChange={(e) => setPseudo(e.target.value)}
                className="w-full px-4 py-3 bg-black/50 border-2 border-[#00C1A0]/50 
                         rounded-xl text-white text-xl
                         focus:border-[#00C1A0] focus:outline-none
                         transition-all duration-300"
                placeholder="Ton pseudo..."
                autoFocus
              />
              <p className="text-sm text-[#00C1A0]/80">
                Entre 3 et 15 caractères
              </p>
            </div>

            <div className="flex gap-4">
              <button
                type="submit"
                disabled={!isValid}
                className={`flex-1 px-6 py-3 rounded-xl text-xl font-bold
                          transition-all duration-300
                          ${isValid 
                            ? 'bg-[#00C1A0] text-black hover:bg-[#00D9B5]' 
                            : 'bg-[#00C1A0]/30 text-[#00C1A0]/50 cursor-not-allowed'}`}
              >
                Sauvegarder
              </button>
              <button
                type="button"
                onClick={onClose}
                className="flex-1 px-6 py-3 rounded-xl text-xl font-bold
                         border-2 border-[#00C1A0] text-[#00C1A0]
                         hover:bg-[#00C1A0]/20 transition-all duration-300"
              >
                Annuler
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default GameOverModal;