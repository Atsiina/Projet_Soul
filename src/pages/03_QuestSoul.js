import React, { useState, useEffect } from 'react';
import { useThemeColors } from '../context/ColorContext';
import GameTitle from '../components/GameTitle';
import GameDescription from '../components/GameDescription';

const niveaux = ["Facile", "Normal", "Difficile", "Extrême"];
const niveauxIcons = {
  "Facile": "/images/Âmichettes Charly/Amichette_Bleu.gif",
  "Normal": "/images/Âmichettes Charly/Amichette_Mauve.gif",
  "Difficile": "/images/Âmichettes Charly/Amichette_Rouge.gif",
  "Extrême": "/images/Âmichettes Charly/Amichette_Doré.gif"
};

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
  const { themeColors, setThemeColors } = useThemeColors();
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
  const [showInputs, setShowInputs] = useState(true);
  const [choixArray, setChoixArray] = useState({});

  const currentColors = themeColors || gameColors;

  useEffect(() => {
    setThemeColors(gameColors);
  }, [setThemeColors]);

  const handleInputChange = (event, participant) => {
    const value = event.target.value.split(',').map(num => parseInt(num.trim()));
    if (value.length === 3 && value.every(num => !isNaN(num) && num >= 0 && num <= 6)) {
      setChoix(prevChoix => ({ ...prevChoix, [participant]: value }));
      setChoixArray(prevChoix => ({ ...prevChoix, [participant]: value }));
    }
  };

  const handleSubmit = () => {
    if (Object.keys(choix).length === participants.length) {
      const difficulteResultats = attribuerDifficultes(participants, choix);
      setResultats(difficulteResultats);
      setShowInputs(false);
    }
  };

  const handleReset = () => {
    setChoix({});
    setResultats(null);
    setShowInputs(true);
    setChoixArray({});
  };

  return (
    <div className="min-h-screen flex flex-col items-center pt-12 relative z-10">
      {/* Titre avec âmichettes */}
      <GameTitle 
        title="Quête des âmes"
        type="BONUS"
        colors={gameColors}
        soulImage="/images/Âmichettes Charly/Amichette_Bleu.gif"
      />

      <section className="w-full max-w-6xl mx-auto px-4">
        <GameDescription 
          mainColor="#00A2E8" 
          soulImage="/images/Âmichettes Charly/Amichette_Bleu.gif"
        >
          <p>
            <strong>Quête des âmes</strong> est un mini-jeu bonus où vous devez choisir intelligemment vos quêtes. 
            Chaque joueur doit sélectionner <strong>trois chiffres entre 0 et 6</strong>, séparés par des virgules.
          </p>
          
          <p>
            <strong>Plus vous choisissez le même chiffre que les autres joueurs, plus votre quête sera difficile !</strong> 
          </p>

          <div className="space-y-6 pl-8">
            <p>
              <strong>Les niveaux de difficulté sont déterminés ainsi :</strong>
            </p>
            <ul className="list-disc space-y-4">
              <li>
                Si vous êtes le <strong>seul</strong> à choisir un chiffre : <strong className="text-[#33B5ED]">Facile</strong>
              </li>
              <li>
                Si vous êtes <strong>deux</strong> à choisir le même chiffre : <strong className="text-[#B66DB7]">Normal</strong>
              </li>
              <li>
                Si vous êtes <strong>trois</strong> à choisir le même chiffre : <strong className="text-[#B30025]">Difficile</strong>
              </li>
              <li>
                Si vous êtes <strong>quatre ou plus</strong> à choisir le même chiffre : <strong className="text-[#E09D0E]">Extrême</strong>
              </li>
            </ul>
          </div>

          <div className="bg-black/40 p-6 rounded-lg mt-8">
            <p>
              <strong>Note importante :</strong> Un joueur ne peut pas avoir plus d'une quête Extrême. 
              Si cela arrive, la difficulté sera réduite à Difficile.
            </p>
          </div>
        </GameDescription>
      </section>

      {/* Plus grand espacement après la description */}
      <div className="mt-24">
        {showInputs && (
          <section className="w-full max-w-6xl mx-auto mb-12 px-4">
            <div className="bg-black/40 backdrop-blur-sm rounded-xl p-8 border border-[#00A2E8]/30">
              <h2 
                className="text-3xl font-bold mb-8 text-center font-['Taurunum Ferrum']"
                style={{ color: currentColors.light }}
              >
                Attribution des Quêtes
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                {participants.map(participant => (
                  <div 
                    key={participant}
                    className="bg-black/30 p-6 rounded-lg border border-[#00A2E8]/20 flex flex-col items-center"
                  >
                    <label className="block text-white mb-3 text-2xl font-bold text-center font-sans">
                      {participant}
                    </label>
                    <input
                      type="text"
                      placeholder="ex: 5,6,3"
                      onChange={(e) => handleInputChange(e, participant)}
                      className="w-full bg-black/50 text-white text-xl border border-[#00A2E8]/30 rounded px-4 py-3
                               focus:outline-none focus:border-[#00A2E8] transition-colors text-center font-sans"
                    />
                  </div>
                ))}
              </div>

              <button
                onClick={handleSubmit}
                className="w-full py-4 rounded-lg font-bold text-xl transition-all duration-300
                        border border-[#00A2E8]/30 hover:border-[#00A2E8]
                        bg-gradient-to-r from-[#00A2E8]/20 to-[#0081BA]/20
                        hover:from-[#00A2E8]/30 hover:to-[#0081BA]/30
                        text-white font-sans"
              >
                Attribuer les Difficultés
              </button>
            </div>
          </section>
        )}

        {resultats && (
          <section className="w-full max-w-6xl mx-auto mb-12 px-4">
            <div className="bg-black/40 backdrop-blur-sm rounded-xl p-8 border border-[#00A2E8]/30">
              <h3 className="text-3xl font-bold mb-8 text-white text-center font-['Taurunum Ferrum']">
                Résultats de l'attribution
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
                {Object.entries(resultats).map(([participant, quetes]) => (
                  <div 
                    key={participant}
                    className="bg-black/30 p-6 rounded-lg border border-[#00A2E8]/20"
                  >
                    <div className="flex flex-col items-center gap-6">
                      <span className="text-2xl font-bold text-white text-center font-sans">
                        {participant}
                      </span>
                      <div className="grid grid-cols-3 gap-8 justify-items-center">
                        {quetes.map((quete, index) => (
                          <div key={index} className="flex flex-col items-center gap-2">
                            <img 
                              src={niveauxIcons[quete]}
                              alt={quete}
                              className="w-16 h-16 object-contain"
                              title={quete}
                              style={{
                                filter: 'drop-shadow(0 0 8px rgba(255, 255, 255, 0.3))'
                              }}
                            />
                            <span 
                              className="text-3xl font-bold font-sans"
                              style={{ color: currentColors.light }}
                            >
                              {choixArray[participant] ? choixArray[participant][index] : ''}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <button
                onClick={handleReset}
                className="w-full py-4 rounded-lg font-bold text-xl transition-all duration-300
                        border border-[#00A2E8]/30 hover:border-[#00A2E8]
                        bg-gradient-to-r from-[#00A2E8]/20 to-[#0081BA]/20
                        hover:from-[#00A2E8]/30 hover:to-[#0081BA]/30
                        text-white font-sans"
              >
                Réinitialiser
              </button>
            </div>
          </section>
        )}
      </div>
    </div>
  );
};

export default QuestSoulPage;