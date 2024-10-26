import React, { useState, useEffect } from 'react';
import { useThemeColors } from '../context/ColorContext';

// Configuration des niveaux et leurs icônes associées
const niveaux = ["Facile", "Normal", "Difficile", "Extrême"];
const niveauxIcons = {
  "Facile": "/images/Quete_Facile.png",
  "Normal": "/images/Quete_Normal.png",
  "Difficile": "/images/Quete_Difficile.png",
  "Extrême": "/images/Quete_Extreme.png"
};

// Fonction d'attribution des difficultés
function attribuerDifficultes(participants, choix) {
  const difficultes = {};
  participants.forEach(participant => {
    difficultes[participant] = [];
  });
  
  for (let i = 0; i < 3; i++) {
    const compteur = {};
    
    participants.forEach(p => {
      const valeur = choix[p][i];
      compteur[valeur] = (compteur[valeur] || 0) + 1;
    });
    
    participants.forEach(participant => {
      let niveau = compteur[choix[participant][i]] - 1;
      niveau = Math.min(niveau, 3);
      if (niveau === 3 && difficultes[participant].includes("Extrême")) {
        niveau = 2;
      }
      difficultes[participant].push(niveaux[niveau]);
    });
  }
  return difficultes;
}

const QuestSoulPage = () => {
  const { setThemeColors } = useThemeColors();
  const gameColors = {
    main: '#00A2E8',
    light: '#33B5ED',
    dark: '#0081BA',
    gradient: 'linear-gradient(135deg, #33B5ED, #00A2E8, #0081BA)'
  };

  const participants = [
    "Charly", "Zaza", "Quasibrother", "Aled", "Logy", 
    "Evil Heart", "Akuma", "Gray", "Shishi"
  ];
  
  const [choix, setChoix] = useState({});
  const [resultats, setResultats] = useState(null);

  useEffect(() => {
    setThemeColors(gameColors);
    return () => setThemeColors(null);
  }, [setThemeColors]);

  const handleInputChange = (event, participant) => {
    const value = event.target.value.split(',').map(num => parseInt(num.trim()));
    if (value.length === 3 && value.every(num => !isNaN(num) && num >= 0 && num <= 6)) {
      setChoix(prevChoix => ({ ...prevChoix, [participant]: value }));
    }
  };

  const handleSubmit = () => {
    if (Object.keys(choix).length === participants.length) {
      const difficulteResultats = attribuerDifficultes(participants, choix);
      setResultats(difficulteResultats);
    }
  };
  return (
    <div className="min-h-screen flex flex-col items-center pt-12 relative z-10">
      {/* En-tête du mini-jeu */}
      <header className="w-full max-w-6xl mx-auto text-center mb-12">
        <h1 
          className="text-8xl font-bold mb-4"
          style={{
            background: gameColors.gradient,
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            textShadow: `0 0 30px ${gameColors.light}30`
          }}
        >
          Quête des âmes
        </h1>
        <div 
          className="text-4xl font-bold mb-8"
          style={{ color: gameColors.light }}
        >
          BONUS
        </div>
      </header>

      {/* Section d'attribution des quêtes */}
      <section className="w-full max-w-6xl mx-auto mb-12 px-4">
        <div className="bg-black/40 backdrop-blur-sm rounded-xl p-8 border border-[#00A2E8]/30">
          <h2 
            className="text-3xl font-bold mb-8 text-center"
            style={{ color: gameColors.light }}
          >
            Attribution des Quêtes
          </h2>
          
          {/* Grille des entrées des participants */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {participants.map(participant => (
              <div 
                key={participant}
                className="bg-black/30 p-6 rounded-lg border border-[#00A2E8]/20 flex flex-col items-center"
              >
                <label className="block text-white mb-3 text-2xl font-bold text-center">
                  {participant}
                </label>
                <input
                  type="text"
                  placeholder="ex: 5,6,3"
                  onChange={(e) => handleInputChange(e, participant)}
                  className="w-full bg-black/50 text-white text-xl border border-[#00A2E8]/30 rounded px-4 py-3
                           focus:outline-none focus:border-[#00A2E8] transition-colors text-center"
                />
              </div>
            ))}
          </div>

          {/* Bouton de soumission */}
          <button
            onClick={handleSubmit}
            className="w-full py-4 rounded-lg font-bold text-xl transition-all duration-300
                     border border-[#00A2E8]/30 hover:border-[#00A2E8]
                     bg-gradient-to-r from-[#00A2E8]/20 to-[#0081BA]/20
                     hover:from-[#00A2E8]/30 hover:to-[#0081BA]/30
                     text-white"
          >
            Attribuer les Difficultés
          </button>

          {/* Résultats */}
          {resultats && (
            <div className="mt-12">
              <h3 className="text-3xl font-bold mb-8 text-white text-center">
                Résultats de l'attribution
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {Object.entries(resultats).map(([participant, quetes]) => (
                  <div 
                    key={participant}
                    className="bg-black/30 p-6 rounded-lg border border-[#00A2E8]/20"
                  >
                    <div className="flex flex-col items-center gap-6">
                      <span className="text-2xl font-bold text-white text-center">
                        {participant}
                      </span>
                      <div className="flex gap-8 justify-center">
                        {quetes.map((quete, index) => (
                          <img 
                            key={index}
                            src={`/images/${quete === "Extrême" ? "Quete_Extreme" : `Quete_${quete}`}.png`}
                            alt={quete}
                            className="w-16 h-16 object-contain"
                            title={quete}
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default QuestSoulPage;