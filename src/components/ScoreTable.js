import React, { useState } from 'react';
import { Plus, Minus, Trophy } from 'lucide-react';

const ScoreTable = ({ scores = [], updateSouls, isAdmin }) => {
  const [isAnimating, setIsAnimating] = useState(false);
  const [positions, setPositions] = useState({});
  
  // Liste des joueurs avec leurs scores à 0
  const defaultScores = [
    { id: 1, nickname: "Zaza", souls: 0 },
    { id: 2, nickname: "Charly", souls: 0 },
    { id: 3, nickname: "Gray", souls: 0 },
    { id: 4, nickname: "Akuma", souls: 0 },
    { id: 5, nickname: "Quasibrother", souls: 0 },
    { id: 6, nickname: "Shishi", souls: 0 },
    { id: 7, nickname: "Evil Heart", souls: 0 },
    { id: 8, nickname: "Atsina", souls: 0 },
    { id: 9, nickname: "Billy", souls: 0 },
    { id: 10, nickname: "Logy", souls: 0 }
  ];

  const sortedScores = React.useMemo(() => {
    return [...defaultScores].sort((a, b) => b.souls - a.souls);
  }, []);

  const handleUpdateSouls = async (playerId, increment) => {
    if (isAnimating) return;
    
    const newPositions = {};
    sortedScores.forEach((player) => {
      const element = document.getElementById(`row-${player.id}`);
      if (element) {
        newPositions[player.id] = element.getBoundingClientRect().top;
      }
    });
    
    setPositions(newPositions);
    setIsAnimating(true);

    try {
      await updateSouls(playerId, increment);
    } catch (error) {
      console.error('Erreur lors de la mise à jour:', error);
    }

    setTimeout(() => {
      setIsAnimating(false);
      setPositions({});
    }, 600);
  };

  const getTransitionStyle = (playerId) => {
    if (!isAnimating || !positions[playerId]) return {};

    const element = document.getElementById(`row-${playerId}`);
    if (!element) return {};

    const currentTop = element.getBoundingClientRect().top;
    const previousTop = positions[playerId];
    const diff = currentTop - previousTop;

    return {
      transform: `translateY(${-diff}px)`,
      transition: 'transform 600ms cubic-bezier(0.4, 0.0, 0.2, 1)'
    };
  };

  // Configuration des rangs
  const rankConfig = {
    0: { 
      trophyColor: 'text-yellow-500',
      barColor: 'bg-yellow-500',
      nameColor: 'text-yellow-500',
      amichette: '/images/Âmichettes Charly/Amichette_Doré.gif'
    },
    1: { 
      trophyColor: 'text-red-500',
      barColor: 'bg-red-500',
      nameColor: 'text-red-500',
      amichette: '/images/Âmichettes Charly/Amichette_Rouge.gif'
    },
    2: { 
      trophyColor: 'text-purple-500',
      barColor: 'bg-purple-500',
      nameColor: 'text-purple-500',
      amichette: '/images/Âmichettes Charly/Amichette_Mauve.gif'
    },
    3: { 
      trophyColor: 'text-blue-500',
      barColor: 'bg-blue-500',
      nameColor: 'text-blue-500',
      amichette: '/images/Âmichettes Charly/Amichette_Bleu.gif'
    },
    4: { 
      trophyColor: 'text-[#00C1A0]',
      barColor: 'bg-[#00C1A0]',
      nameColor: 'text-[#00C1A0]',
      amichette: '/images/Âmichettes Charly/Amichette_Verte.gif'
    }
  };

  const getExcessSouls = (souls) => {
    const excess = souls - 15;
    if (excess <= 0) return null;
    return excess > 999 ? '999+' : `+${excess}`;
  };

  return (
    <section className="relative z-10 max-w-6xl mx-auto py-16 px-4">
      <div className="relative bg-gradient-to-b from-black/90 to-[#00755E]/30 backdrop-blur-md p-8 rounded-2xl shadow-2xl border border-[#00755E]/30 overflow-hidden">
        {/* En-tête avec couleur or */}
        <div className="relative flex items-center gap-4 mb-8">
          <div className="absolute left-0 w-1/3 h-px bg-gradient-to-r from-transparent via-yellow-500 to-transparent" />
          <div className="flex-1" />
          <img 
            src="/images/Âmichettes Charly/Amichette_Doré.gif"
            alt="Soul Icon"
            className="w-16 h-16 object-contain animate-bounce"
          />
          <h2 className="text-4xl text-yellow-500 font-bold tracking-wider">
            Classement de la Récolte
          </h2>
          <img 
            src="/images/Âmichettes Charly/Amichette_Doré.gif"
            alt="Soul Icon"
            className="w-16 h-16 object-contain animate-bounce"
          />
          <div className="flex-1" />
          <div className="absolute right-0 w-1/3 h-px bg-gradient-to-l from-transparent via-yellow-500 to-transparent" />
        </div>

        <div className="relative">
          <div className="absolute inset-0 border-2 border-[#00C1A0]/20 rounded-xl" />
          <div className="absolute inset-0 border-2 border-[#00C1A0]/10 rounded-xl transform scale-[1.02]" />
          
          <table className="w-full">
            <thead>
              <tr className="border-b-2 border-[#00C1A0]/30">
                <th className="py-6 px-4 text-left w-32">
                  <span className="text-2xl text-yellow-500 font-bold tracking-wider">RANG</span>
                </th>
                <th className="py-6 px-12 text-left">
                  <span className="text-2xl text-yellow-500 font-bold tracking-wider">EATER</span>
                </th>
                <th className="py-6 px-8 text-center">
                  <span className="text-2xl text-yellow-500 font-bold tracking-wider">ÂMES COLLECTÉES</span>
                </th>
                <th className="py-6 px-8 text-center">
                  <span className="text-2xl text-yellow-500 font-bold tracking-wider">ACTIONS</span>
                </th>
              </tr>
            </thead>
            <tbody className="relative">
              {sortedScores.map((player, index) => (
                <tr 
                  key={player.id}
                  id={`row-${player.id}`}
                  className="border-b border-[#00755E]/20 hover:bg-[#00755E]/10"
                  style={getTransitionStyle(player.id)}
                >
                  <td className="py-6 px-4">
                    <div className="flex items-center gap-2">
                      {index < 5 ? (
                        <Trophy className={`w-8 h-8 ${rankConfig[index].trophyColor}`} />
                      ) : (
                        <span className="text-2xl text-gray-400 font-medium w-8">{index + 1}</span>
                      )}
                      <div className={`w-1 h-12 rounded-full ${
                        index < 5 ? rankConfig[index].barColor : 'bg-[#00755E]/30'
                      }`} />
                    </div>
                  </td>
                  
                  <td className="py-6 px-12">
                    <span className={`text-4xl font-medium ${
                      index < 5 ? rankConfig[index].nameColor : 'text-white'
                    }`}>
                      {player.nickname}
                    </span>
                  </td>
                  
                  <td className="py-6 px-8">
                    <div className="flex flex-wrap justify-center items-center gap-2">
                      <div className="flex items-center">
                        <span className="text-4xl font-bold text-[#00C1A0] mr-6">
                          {player.souls}
                        </span>
                        <div className="flex items-center flex-nowrap">
                          {[...Array(Math.min(player.souls, 15))].map((_, i) => (
                            <img 
                              key={i}
                              src={index < 5 ? rankConfig[index].amichette : '/images/Âmichettes Charly/Amichette_Verte.gif'}
                              alt="âme"
                              className="w-6 object-contain -ml-1 first:ml-0"
                            />
                          ))}
                          {getExcessSouls(player.souls) && (
                            <span className="text-lg text-[#00C1A0] ml-1">
                              {getExcessSouls(player.souls)}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </td>
                  
                  <td className="py-6 px-8">
                    <div className="flex justify-center gap-4">
                      <button
                        onClick={() => handleUpdateSouls(player.id, 1)}
                        disabled={isAnimating}
                        className={`group relative p-2 rounded-lg bg-[#00755E]/20 
                          ${isAnimating ? 'opacity-50 cursor-not-allowed' : 'hover:bg-[#00755E]/40'} 
                          transition-all duration-300`}
                      >
                        <Plus className="w-6 h-6 text-[#00C1A0] group-hover:text-white transition-colors" />
                      </button>
                      <button
                        onClick={() => handleUpdateSouls(player.id, -1)}
                        disabled={isAnimating}
                        className={`group relative p-2 rounded-lg bg-[#00755E]/20 
                          ${isAnimating ? 'opacity-50 cursor-not-allowed' : 'hover:bg-[#00755E]/40'} 
                          transition-all duration-300`}
                      >
                        <Minus className="w-6 h-6 text-[#00C1A0] group-hover:text-white transition-colors" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
};

export default ScoreTable;
