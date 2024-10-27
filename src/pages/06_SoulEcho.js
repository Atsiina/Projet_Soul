import React, { useState, useEffect } from 'react';
import GameTitle from '../components/GameTitle';
import GameDescription from '../components/GameDescription';

const SoulEchoPage = () => {
  const gameColors = {
    main: '#A349A4',
    light: '#B66DB7',
    dark: '#822683',
    gradient: 'linear-gradient(135deg, #B66DB7, #A349A4, #822683)'
  };

  // États du jeu
  const [sequence, setSequence] = useState([]);
  const [playerSequence, setPlayerSequence] = useState([]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [gameState, setGameState] = useState('waiting'); // waiting, playing, watching, gameover
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [bubbles, setBubbles] = useState([]);

  // Configuration des zones de jeu
  const gameTiles = [
    { id: 0, color: '#B66DB7', soundKey: 'Q' },
    { id: 1, color: '#A349A4', soundKey: 'W' },
    { id: 2, color: '#822683', soundKey: 'E' },
    { id: 3, color: '#9B2B9C', soundKey: 'R' }
  ];

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

  const startGame = () => {
    setSequence([Math.floor(Math.random() * 4)]);
    setPlayerSequence([]);
    setScore(0);
    setGameState('watching');
    setIsPlaying(true);
    playSequence([Math.floor(Math.random() * 4)]);
  };

  const playSequence = async (seq) => {
    setGameState('watching');
    for (let i = 0; i < seq.length; i++) {
      await new Promise(resolve => setTimeout(resolve, 1000));
      highlightTile(seq[i]);
      await new Promise(resolve => setTimeout(resolve, 500));
    }
    setGameState('playing');
  };

  const highlightTile = (index) => {
    const tile = document.getElementById(`tile-${index}`);
    if (tile) {
      tile.style.filter = 'brightness(1.5)';
      setTimeout(() => {
        tile.style.filter = 'brightness(1)';
      }, 300);
    }
  };

  const handleTileClick = async (tileId) => {
    if (gameState !== 'playing') return;

    const newPlayerSequence = [...playerSequence, tileId];
    setPlayerSequence(newPlayerSequence);
    highlightTile(tileId);

    if (newPlayerSequence[newPlayerSequence.length - 1] !== sequence[newPlayerSequence.length - 1]) {
      setGameState('gameover');
      if (score > highScore) setHighScore(score);
      return;
    }

    if (newPlayerSequence.length === sequence.length) {
      setScore(score + 1);
      const newSequence = [...sequence, Math.floor(Math.random() * 4)];
      setSequence(newSequence);
      setPlayerSequence([]);
      await new Promise(resolve => setTimeout(resolve, 1000));
      playSequence(newSequence);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center pt-12 relative z-10">
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

      {/* Titre avec les âmichettes */}
      <GameTitle 
        title="Écho de l'Âme"
        type="BONUS"
        colors={gameColors}
        soulImage="/images/Âmichettes Charly/Amichette_Mauve.gif"
      />

      {/* Overlay Coming Soul - Version bande horizontale */}
      <div className="fixed top-80 left-0 right-0 flex items-center justify-center z-50 h-[300px]"
     style={{
       background: 'rgba(0, 0, 0, 0.6)',
       backdropFilter: 'blur(3px)',
       width: '100%'
     }}>
      <div className="py-10 w-full text-center">
        <h2 className="text-[120px] font-black tracking-[0.10em] opacity-90 leading-none flex items-center justify-center" 
          style={{
          background: gameColors.gradient,
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          textShadow: `0 0 30px ${gameColors.light}50`,
          letterSpacing: '0.08em',
          fontWeight: 900
        }}>
      COMING S
        <span className="inline-flex items-center" 
          style={{ 
          marginLeft: '-38px', 
          marginRight: '-28px',
          marginTop: '-25px'
        }}>
  <img 
    src="/images/Âmichettes Charly/Amichette_Mauve.gif"
    alt="O"
    className="w-[120px] h-[120px] object-contain"
  />
</span>
          UL
        </h2>
      </div>
    </div>

      {/* Zone de jeu */}
      <div className="relative w-[600px] h-[600px] mb-12">
        <div className="absolute inset-0 grid grid-cols-2 gap-4 p-4">
          {gameTiles.map((tile) => (
            <button
              key={tile.id}
              id={`tile-${tile.id}`}
              onClick={() => handleTileClick(tile.id)}
              disabled={gameState !== 'playing'}
              className="w-full h-full rounded-2xl transition-all duration-300 
                       flex items-center justify-center text-4xl font-bold
                       hover:brightness-125 disabled:opacity-50"
              style={{
                background: tile.color,
                boxShadow: `0 0 20px ${tile.color}50`
              }}
            >
              {tile.soundKey}
            </button>
          ))}
        </div>
      </div>

      {/* Score et contrôles */}
      <div className="text-center space-y-8">
        <div className="text-4xl font-bold" style={{ color: gameColors.light }}>
          Score: {score} | Meilleur: {highScore}
        </div>

        {gameState === 'waiting' && (
          <button
            onClick={startGame}
            className="px-8 py-4 rounded-xl text-3xl font-bold transition-all duration-300
                     hover:bg-opacity-30 border-2"
            style={{
              backgroundColor: `${gameColors.main}20`,
              borderColor: gameColors.light,
              color: gameColors.light
            }}
          >
            Commencer
          </button>
        )}

        {gameState === 'gameover' && (
          <button
            onClick={startGame}
            className="px-8 py-4 rounded-xl text-3xl font-bold transition-all duration-300
                     hover:bg-opacity-30 border-2"
            style={{
              backgroundColor: `${gameColors.main}20`,
              borderColor: gameColors.light,
              color: gameColors.light
            }}
          >
            Rejouer
          </button>
        )}
      </div>

      {/* Description */}
      <GameDescription
        mainColor="#A349A4"
        soulImage="/images/Âmichettes Charly/Amichette_Mauve.gif"
      >
        <p>
          <strong>Écho de l'Âme</strong> est un mini-jeu bonus de mémoire et de réflexes.
          Reproduisez la séquence de sons qui s'allument en appuyant sur les bonnes touches.
        </p>
        
        <div className="space-y-6 pl-8">
          <p>
            <strong>Comment jouer :</strong>
          </p>
          <ul className="list-disc space-y-4">
            <li>
              Observez attentivement la séquence qui s'illumine
            </li>
            <li>
              Reproduisez la séquence en cliquant sur les boutons dans le bon ordre
            </li>
            <li>
              La séquence s'allonge à chaque fois que vous réussissez
            </li>
            <li>
              Utilisez les touches Q, W, E, R du clavier ou cliquez sur les boutons
            </li>
          </ul>
        </div>
      </GameDescription>

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

export default SoulEchoPage;