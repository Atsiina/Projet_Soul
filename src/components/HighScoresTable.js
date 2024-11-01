import React from 'react';
import { Trophy } from 'lucide-react';

const HighScoresTable = ({ scores = [] }) => {
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

  const sortedScores = [...scores].sort((a, b) => b.score - a.score).slice(0, 5);

  return (
    <section className="relative z-10 max-w-4xl mx-auto py-8 px-4">
      <div className="relative bg-gradient-to-b from-black/90 to-[#00755E]/30 backdrop-blur-md p-8 rounded-2xl shadow-2xl border border-[#00755E]/30 overflow-hidden">
        <div className="relative flex items-center gap-4 mb-8">
          <div className="absolute left-0 w-1/3 h-px bg-gradient-to-r from-transparent via-yellow-500 to-transparent" />
          <div className="flex-1" />
          <img 
            src="/images/Âmichettes Charly/Amichette_Doré.gif"
            alt="Soul Icon"
            className="w-16 h-16 object-contain animate-bounce"
          />
          <h2 className="text-4xl text-yellow-500 font-bold tracking-wider">
            Meilleurs Chasseurs d'Âmes
          </h2>
          <img 
            src="/images/Âmichettes Charly/Amichette_Doré.gif"
            alt="Soul Icon"
            className="w-16 h-16 object-contain animate-bounce z-10"
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
                  <span className="text-2xl text-yellow-500 font-bold tracking-wider">SCORE</span>
                </th>
                <th className="py-6 px-8 text-center">
                  <span className="text-2xl text-yellow-500 font-bold tracking-wider">DATE</span>
                </th>
              </tr>
            </thead>
            <tbody>
              {sortedScores.map((score, index) => (
                <tr 
                  key={index}
                  className="border-b border-[#00755E]/20 hover:bg-[#00755E]/10 transition-colors"
                >
                  <td className="py-6 px-4">
                    <div className="flex items-center gap-2">
                      <Trophy className={`w-8 h-8 ${rankConfig[index].trophyColor}`} />
                      <div className={`w-1 h-12 rounded-full ${rankConfig[index].barColor}`} />
                    </div>
                  </td>
                  
                  <td className="py-6 px-12">
                    <span className={`text-4xl font-medium ${rankConfig[index].nameColor}`}>
                      {score.player}
                    </span>
                  </td>
                  
                  <td className="py-6 px-8">
                    <div className="flex justify-center items-center gap-4">
                      <span className="text-4xl font-bold text-[#00C1A0]">
                        {score.score.toLocaleString()}
                      </span>
                      <img 
                        src={rankConfig[index].amichette}
                        alt="âme"
                        className="w-8 h-8 object-contain"
                      />
                    </div>
                  </td>
                  
                  <td className="py-6 px-8 text-center">
                    <span className="text-xl text-white/80">
                      {new Date(score.date).toLocaleDateString('fr-FR', {
                        day: '2-digit',
                        month: '2-digit',
                        year: 'numeric'
                      })}
                    </span>
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

export default HighScoresTable;