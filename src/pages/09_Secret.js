import React, { useState, useEffect } from 'react';
import AnimatedBackground from '../components/AnimatedBackground';
import SoulEaterGameComponent from '../components/SoulEaterGameComponent';

const SecretPage = () => {
  // État pour les scores
  const [highScores, setHighScores] = useState(() => {
    const savedScores = localStorage.getItem('secretPageScores');
    return savedScores ? JSON.parse(savedScores) : [];
  });

  // État pour le jeu
  const [gameState, setGameState] = useState({
    score: 0,
    isPlaying: false,
    playerPosition: { x: 0, y: 0 },
    souls: [],
  });

  // Fonction pour sauvegarder un score
  const saveScore = (playerName, score) => {
    const newScore = {
      playerName,
      score,
      date: new Date().toISOString()
    };
    
    const newScores = [...highScores, newScore]
      .sort((a, b) => b.score - a.score)
      .slice(0, 10);
    
    setHighScores(newScores);
    localStorage.setItem('secretPageScores', JSON.stringify(newScores));
  };

  // Fonction pour mettre à jour le score depuis le composant de jeu
  const handleScoreUpdate = (newScore) => {
    setGameState(prev => ({
      ...prev,
      score: newScore
    }));
  };

  return (
    <div className="min-h-screen bg-black text-white relative overflow-hidden">
      <AnimatedBackground />

      <header className="relative z-10 pt-8 text-center">
        <div className="max-w-4xl mx-auto">
          <img 
            src="/images/Soul_Eater_Logo_VVert_avec_âmichette.gif"
            alt="Soul Eaters Logo"
            className="w-64 h-64 mx-auto"
          />
        </div>
      </header>

      {/* Zone de jeu avec le composant intégré */}
      <div className="relative z-10 max-w-4xl mx-auto mt-8 bg-black/50 backdrop-blur-sm rounded-xl p-4 border border-[#00C1A0]/30">
        <h2 className="text-3xl text-center mb-4 text-[#00C1A0]">
          Soul Eater
        </h2>
        <div className="aspect-square w-full max-w-2xl mx-auto border-2 border-[#00C1A0] rounded-lg overflow-hidden">
          <SoulEaterGameComponent onScoreUpdate={handleScoreUpdate} />
        </div>
        <div className="mt-4 text-center">
          <p className="text-2xl">Score: {gameState.score}</p>
        </div>
      </div>

      {/* Tableau des scores */}
      <div className="relative z-10 max-w-4xl mx-auto mt-8 mb-8 bg-black/50 backdrop-blur-sm rounded-xl p-4 border border-[#00C1A0]/30">
        <h2 className="text-3xl text-center mb-4 text-[#00C1A0]">
          Hall of Fame
        </h2>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[#00C1A0]/30">
                <th className="px-4 py-2 text-left">Rang</th>
                <th className="px-4 py-2 text-left">Joueur</th>
                <th className="px-4 py-2 text-right">Score</th>
                <th className="px-4 py-2 text-right">Date</th>
              </tr>
            </thead>
            <tbody>
              {highScores.map((score, index) => (
                <tr 
                  key={index}
                  className="border-b border-[#00C1A0]/10 hover:bg-[#00C1A0]/10"
                >
                  <td className="px-4 py-2">{index + 1}</td>
                  <td className="px-4 py-2">{score.playerName}</td>
                  <td className="px-4 py-2 text-right">{score.score}</td>
                  <td className="px-4 py-2 text-right">
                    {new Date(score.date).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default SecretPage;