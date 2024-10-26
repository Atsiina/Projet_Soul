// 04_ChiSoulMi.js - Partie 1: Configuration et States
import React, { useState, useEffect } from 'react';

const ChiSoulMi = () => {
  // Configuration des couleurs du jeu
  const gameColors = {
    main: '#8F0016',
    light: '#B30025',
    dark: '#6B0011',
    gradient: 'linear-gradient(135deg, #B30025, #8F0016, #6B0011)'
  };

  // Configuration des choix possibles
  const choices = [
    { id: 'scissors', image: '/images/Icône du Chi Soul Mi/Ciseaux.png', label: 'Ciseaux', beats: ['lizard', 'paper'] },
    { id: 'paper', image: '/images/Icône du Chi Soul Mi/Papier.png', label: 'Papier', beats: ['rock', 'spock'] },
    { id: 'rock', image: '/images/Icône du Chi Soul Mi/Pierre.png', label: 'Pierre', beats: ['lizard', 'scissors'] },
    { id: 'lizard', image: '/images/Icône du Chi Soul Mi/Lezard.png', label: 'Lézard', beats: ['paper', 'spock'] },
    { id: 'spock', image: '/images/Icône du Chi Soul Mi/Spock.png', label: 'Spock', beats: ['rock', 'scissors'] }
];

  // États du jeu
  const [player1Name, setPlayer1Name] = useState('Joueur 1');
  const [player2Name, setPlayer2Name] = useState('Joueur 2');
  const [gameState, setGameState] = useState('setup'); // setup, countdown, playing, result
  const [setupTimer, setSetupTimer] = useState(60);
  const [gameTimer, setGameTimer] = useState(5);
  const [player1Ready, setPlayer1Ready] = useState(false);
  const [player2Ready, setPlayer2Ready] = useState(false);
  const [player1Choice, setPlayer1Choice] = useState(null);
  const [player2Choice, setPlayer2Choice] = useState(null);
  const [player1Score, setPlayer1Score] = useState(0);
  const [player2Score, setPlayer2Score] = useState(0);
  const [totalPlayer1Score, setTotalPlayer1Score] = useState(0);
  const [totalPlayer2Score, setTotalPlayer2Score] = useState(0);
  const [round, setRound] = useState(1);
  const [bubbles, setBubbles] = useState([]);
  const [winner, setWinner] = useState(null);
  const [showResult, setShowResult] = useState(false);
// Gestion des bulles d'arrière-plan
useEffect(() => {
    const generateBubbles = () => {
      return Array.from({ length: 60 }, (_, i) => ({
        id: i,
        size: Math.random() * (200 - 30) + 30,
        left: Math.random() * 100,
        top: Math.random() * 300,
        delay: Math.random() * 10,
        duration: Math.random() * (30 - 15) + 15,
        hasGlow: Math.random() > 0.4,
        glowIntensity: (200 - (Math.random() * (200 - 30) + 30)) / 200
      }));
    };

    setBubbles(generateBubbles());
  }, []);

  // Gestion du timer de préparation
  useEffect(() => {
    let interval;
    if (gameState === 'setup' && setupTimer > 0) {
      interval = setInterval(() => setSetupTimer(prev => prev - 1), 1000);
    }
    return () => clearInterval(interval);
  }, [gameState, setupTimer]);

  // Gestion du timer de jeu et détermine le gagnant
  useEffect(() => {
    let interval;
    if (gameState === 'playing' && gameTimer > 0) {
      interval = setInterval(() => setGameTimer(prev => prev - 1), 1000);
    } else if (gameState === 'playing' && gameTimer === 0) {
      determineWinner();
    }
    return () => clearInterval(interval);
  }, [gameState, gameTimer]);

  // Démarrage du jeu quand les deux joueurs sont prêts
  useEffect(() => {
    if (player1Ready && player2Ready) {
      setGameState('playing');
      setGameTimer(5);
    }
  }, [player1Ready, player2Ready]);

  // Fonction pour déterminer le gagnant
  const determineWinner = () => {
    setShowResult(true);
    if (!player1Choice || !player2Choice) {
      setWinner('tie');
      return;
    }

    const p1Choice = choices.find(c => c.id === player1Choice);
    const p2Choice = choices.find(c => c.id === player2Choice);

    if (p1Choice.id === p2Choice.id) {
      setWinner('tie');
    } else if (p1Choice.beats.includes(p2Choice.id)) {
      setWinner('player1');
      setPlayer1Score(prev => prev + 1);
      setTotalPlayer1Score(prev => prev + 1);
    } else {
      setWinner('player2');
      setPlayer2Score(prev => prev + 1);
      setTotalPlayer2Score(prev => prev + 1);
    }

    setTimeout(() => {
      if (round < 3) {
        resetRound();
      } else {
        endGame();
      }
    }, 2000);
  };

  // Fonction pour réinitialiser une manche
  const resetRound = () => {
    setRound(prev => prev + 1);
    setGameTimer(5);
    setPlayer1Choice(null);
    setPlayer2Choice(null);
    setShowResult(false);
    setWinner(null);
    setGameState('playing');
  };

  // Fonction pour terminer le jeu
  const endGame = () => {
    setGameState('setup');
    setRound(1);
    setSetupTimer(60);
    setPlayer1Ready(false);
    setPlayer2Ready(false);
    setShowResult(false);
    setWinner(null);
  };
  return (
    <div className="min-h-screen bg-black text-white relative overflow-hidden">
      {/* Bulles d'arrière-plan */}
      <div className="fixed inset-0 pointer-events-none">
        {bubbles.map((bubble) => (
          <div
            key={bubble.id}
            className="absolute rounded-full transition-all duration-1000"
            style={{
              width: `${bubble.size}px`,
              height: `${bubble.size}px`,
              left: `${bubble.left}%`,
              top: `${bubble.top}%`,
              background: gameColors.gradient,
              animation: `float ${bubble.duration}s ease-in-out ${bubble.delay}s infinite`,
              filter: bubble.hasGlow ? `drop-shadow(0 0 ${8 * bubble.glowIntensity}px ${gameColors.light}${0.3 * bubble.glowIntensity})` : 'none',
              opacity: bubble.hasGlow ? 0.1 + (bubble.glowIntensity * 0.1) : 0.1
            }}
          />
        ))}
      </div>

      {/* Contenu principal */}
      <div className="relative z-10 p-8">
        {/* En-tête avec scores */}
        <div className="flex justify-between items-start mb-12">
          {/* Joueur 1 */}
          <div className="text-center">
            <input
              type="text"
              value={player1Name}
              onChange={(e) => setPlayer1Name(e.target.value)}
              className="bg-transparent text-3xl font-bold mb-4 text-center outline-none border-b-2 border-transparent hover:border-red-500 focus:border-red-500"
              style={{ color: gameColors.light }}
            />
            <div className="text-5xl font-bold mb-2" style={{ color: gameColors.main }}>
              {player1Score}
            </div>
            <div className="text-xl opacity-70">
              Total: {totalPlayer1Score}
            </div>
          </div>

          {/* Timer central */}
          <div className="text-6xl font-bold" style={{ color: gameColors.light }}>
            {gameState === 'setup' ? setupTimer : gameTimer}
          </div>

          {/* Joueur 2 */}
          <div className="text-center">
            <input
              type="text"
              value={player2Name}
              onChange={(e) => setPlayer2Name(e.target.value)}
              className="bg-transparent text-3xl font-bold mb-4 text-center outline-none border-b-2 border-transparent hover:border-red-500 focus:border-red-500"
              style={{ color: gameColors.light }}
            />
            <div className="text-5xl font-bold mb-2" style={{ color: gameColors.main }}>
              {player2Score}
            </div>
            <div className="text-xl opacity-70">
              Total: {totalPlayer2Score}
            </div>
          </div>
        </div>

        {/* Phase de préparation */}
        {gameState === 'setup' && (
          <div className="text-center">
            <h2 className="text-4xl font-bold mb-8" style={{ color: gameColors.light }}>
              Êtes-vous prêts ?
            </h2>
            <div className="flex justify-center gap-12">
              <button
                onClick={() => setPlayer1Ready(true)}
                className={`px-8 py-4 rounded-xl text-2xl font-bold transition-all duration-300
                          ${player1Ready 
                            ? 'bg-green-500/20 border-2 border-green-500' 
                            : 'bg-red-500/20 border-2 border-red-500 hover:bg-red-500/30'}`}
                disabled={player1Ready}
              >
                {player1Name} {player1Ready ? '✓' : 'Prêt ?'}
              </button>
              <button
                onClick={() => setPlayer2Ready(true)}
                className={`px-8 py-4 rounded-xl text-2xl font-bold transition-all duration-300
                          ${player2Ready 
                            ? 'bg-green-500/20 border-2 border-green-500' 
                            : 'bg-red-500/20 border-2 border-red-500 hover:bg-red-500/30'}`}
                disabled={player2Ready}
              >
                {player2Name} {player2Ready ? '✓' : 'Prêt ?'}
              </button>
            </div>
          </div>
        )}

        {/* Phase de jeu */}
        {gameState === 'playing' && (
          <div className="grid grid-cols-2 gap-16">
            {/* Zone Joueur 1 */}
            <div className="space-y-8">
              <h3 className="text-3xl font-bold text-center mb-8" style={{ color: gameColors.light }}>
                {player1Name}
              </h3>
              <div className="grid grid-cols-3 gap-4">
                {choices.map((choice) => (
                  <button
                    key={choice.id}
                    onClick={() => setPlayer1Choice(choice.id)}
                    disabled={showResult || player1Choice}
                    className={`relative p-4 rounded-xl transition-all duration-300 
                              ${player1Choice === choice.id 
                                ? 'bg-red-500/30 border-2 border-red-500' 
                                : 'bg-black/30 border-2 border-transparent hover:border-red-500'}`}
                  >
                    <img 
                      src={choice.image}
                      alt={choice.label}
                      className="w-full h-32 object-contain mb-2"
                    />
                    <div className="text-lg font-medium">{choice.label}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Zone Joueur 2 */}
            <div className="space-y-8">
              <h3 className="text-3xl font-bold text-center mb-8" style={{ color: gameColors.light }}>
                {player2Name}
              </h3>
              <div className="grid grid-cols-3 gap-4">
                {choices.map((choice) => (
                  <button
                    key={choice.id}
                    onClick={() => setPlayer2Choice(choice.id)}
                    disabled={showResult || player2Choice}
                    className={`relative p-4 rounded-xl transition-all duration-300 
                              ${player2Choice === choice.id 
                                ? 'bg-red-500/30 border-2 border-red-500' 
                                : 'bg-black/30 border-2 border-transparent hover:border-red-500'}`}
                  >
                    <img 
                      src={choice.image}
                      alt={choice.label}
                      className="w-full h-32 object-contain mb-2"
                    />
                    <div className="text-lg font-medium">{choice.label}</div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Affichage du résultat */}
        {showResult && (
          <div className="absolute inset-0 bg-black/80 flex items-center justify-center">
            <div className="text-center">
              <h2 className="text-6xl font-bold mb-8" style={{ color: gameColors.light }}>
                {winner === 'tie' 
                  ? 'Égalité !' 
                  : winner === 'player1' 
                    ? `${player1Name} gagne !` 
                    : `${player2Name} gagne !`}
              </h2>
              <div className="text-2xl">
                Manche {round} / 3
              </div>
            </div>
          </div>
        )}

        {/* Bouton nouvelle partie */}
        {(gameState === 'setup' && round === 1) && (
          <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2">
            <button
              onClick={endGame}
              className="px-8 py-4 rounded-xl text-2xl font-bold bg-red-500/20 
                       border-2 border-red-500 hover:bg-red-500/30 transition-all duration-300"
            >
              Nouvelle partie
            </button>
          </div>
        )}
      </div>

      {/* Styles pour les animations */}
      <style jsx>{`
        @keyframes float {
          0%, 100% {
            transform: translateY(0) scale(1);
          }
          50% {
            transform: translateY(-20px) scale(1.05);
          }
        }
      `}</style>
    </div>
  );
};

export default ChiSoulMi;