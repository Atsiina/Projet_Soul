import React, { useState, useEffect } from 'react';
import GameTitle from '../components/GameTitle';
import GameDescription from '../components/GameDescription';

const LabyrinthSpiritPage = () => {
  const gameColors = {
    main: '#00C1A0',
    light: '#00D9B5',
    dark: '#00A88B',
    gradient: 'linear-gradient(135deg, #00D9B5, #00C1A0, #00A88B)'
  };

  // États du jeu
  const [currentLevel, setCurrentLevel] = useState(1);
  const [timeLeft, setTimeLeft] = useState(300);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [playerPosition, setPlayerPosition] = useState({ x: 0, y: 0 });
  const [score, setScore] = useState(0);
  const [bubbles, setBubbles] = useState([]);

  // Génération des bulles d'arrière-plan
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

  // Timer du jeu
  useEffect(() => {
    let interval;
    if (isPlaying && !isPaused && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft(prev => prev - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      endGame();
    }
    return () => clearInterval(interval);
  }, [isPlaying, isPaused, timeLeft]);

  // Formatage du temps
  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  // Fonctions de contrôle du jeu
  const startGame = () => {
    setIsPlaying(true);
    setIsPaused(false);
    setTimeLeft(300);
    setCurrentLevel(1);
    setScore(0);
    setPlayerPosition({ x: 0, y: 0 });
  };

  const pauseGame = () => {
    setIsPaused(!isPaused);
  };

  const endGame = () => {
    setIsPlaying(false);
    setIsPaused(false);
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
        title="Labyrinthe de l'Esprit"
        type="MALUS"
        colors={gameColors}
        soulImage="/images/Âmichettes Charly/Amichette_Verte.gif"
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
    src="/images/Âmichettes Charly/Amichette_Verte.gif"
    alt="O"
    className="w-[120px] h-[120px] object-contain"
  />
</span>
          UL
        </h2>
      </div>
    </div>

      {/* Zone de jeu */}
      <div className="w-full max-w-4xl mx-auto mb-12">
        <div className="bg-black/40 backdrop-blur-sm rounded-xl p-8 border-2 transition-all duration-300"
             style={{ borderColor: `${gameColors.main}30` }}>
          {/* Informations de jeu */}
          <div className="flex justify-between items-center mb-8">
            <div className="text-3xl font-bold" style={{ color: gameColors.light }}>
              Niveau {currentLevel}
            </div>
            <div className="text-4xl font-bold" style={{ color: gameColors.light }}>
              {formatTime(timeLeft)}
            </div>
            <div className="text-3xl font-bold" style={{ color: gameColors.light }}>
              Score: {score}
            </div>
          </div>

          {/* Zone de labyrinthe */}
          <div className="w-full aspect-square bg-black/30 rounded-lg mb-8">
            {/* Le labyrinthe sera implémenté ici */}
          </div>

          {/* Contrôles */}
          <div className="flex justify-center gap-4">
            {!isPlaying ? (
              <button
                onClick={startGame}
                className="px-8 py-4 rounded-xl text-3xl font-bold transition-all duration-300
                         border-2 hover:bg-opacity-30"
                style={{
                  backgroundColor: `${gameColors.main}20`,
                  borderColor: gameColors.light,
                  color: gameColors.light
                }}
              >
                Commencer
              </button>
            ) : (
              <button
                onClick={pauseGame}
                className="px-8 py-4 rounded-xl text-3xl font-bold transition-all duration-300
                         border-2 hover:bg-opacity-30"
                style={{
                  backgroundColor: isPaused ? `${gameColors.main}20` : `${gameColors.dark}40`,
                  borderColor: gameColors.light,
                  color: gameColors.light
                }}
              >
                {isPaused ? 'Reprendre' : 'Pause'}
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Description */}
      <GameDescription
        mainColor="#00C1A0"
        soulImage="/images/Âmichettes Charly/Amichette_Verte.gif"
      >
        <p>
          <strong>Labyrinthe de l'Esprit</strong> est un mini-jeu malus qui mettra à l'épreuve
          votre sens de l'orientation et votre rapidité.
        </p>
        
        <div className="space-y-6 pl-8">
          <p>
            <strong>Comment jouer :</strong>
          </p>
          <ul className="list-disc space-y-4">
            <li>
              Naviguez dans le labyrinthe en utilisant les touches directionnelles
            </li>
            <li>
              Collectez les âmes dispersées dans le labyrinthe
            </li>
            <li>
              Évitez les pièges qui vous ralentissent
            </li>
            <li>
              Atteignez la sortie avant la fin du temps imparti
            </li>
          </ul>
        </div>

        <div className="bg-black/40 p-6 rounded-lg mt-8">
          <p>
            <strong>Astuce :</strong> Les murs du labyrinthe changent à chaque niveau.
            Restez attentif aux nouveaux chemins qui s'ouvrent à vous !
          </p>
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

export default LabyrinthSpiritPage;