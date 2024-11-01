import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useThemeColors } from '../context/ColorContext';
import GameTitle from '../components/GameTitle';
import ScrollbarTheme from '../components/ScrollbarTheme';

const WheelPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { setThemeColors } = useThemeColors();
  const [isSpinning, setIsSpinning] = useState(false);
  const [selectedGame, setSelectedGame] = useState(null);
  const [showDescription, setShowDescription] = useState(false);
  const [wheelBubbles, setWheelBubbles] = useState([]);
  const [finalBubble, setFinalBubble] = useState(null);
  const [animationPhase, setAnimationPhase] = useState('idle');

  const games = [
    {
      name: "Quête des âmes",
      type: "BONUS",
      path: '/games/quete-des-ames',
      soulImage: '/images/Âmichettes Charly/Amichette_Bleu.gif',
      colors: {
        main: '#00A2E8',
        light: '#33B5ED',
        dark: '#0081BA',
        gradient: 'linear-gradient(135deg, #33B5ED, #00A2E8, #0081BA)'
      }
    },
    {
      name: "Écho de l'Âme",
      type: "BONUS",
      path: '/games/echo-de-lame',
      soulImage: '/images/Âmichettes Charly/Amichette_Mauve.gif',
      colors: {
        main: '#A349A4',
        light: '#B66DB7',
        dark: '#822683',
        gradient: 'linear-gradient(135deg, #B66DB7, #A349A4, #822683)'
      }
    },
    {
      name: "Chi-Soul-Mi",
      type: "MALUS",
      path: '/games/chi-soul-mi',
      soulImage: '/images/Âmichettes Charly/Amichette_Rouge.gif',
      colors: {
        main: '#8F0016',
        light: '#B30025',
        dark: '#6B0011',
        gradient: 'linear-gradient(135deg, #B30025, #8F0016, #6B0011)'
      }
    },
    {
      name: "Les Reliques Perdues",
      type: "BONUS",
      path: '/games/reliques-perdues',
      soulImage: '/images/Âmichettes Charly/Amichette_Doré.gif',
      colors: {
        main: '#C9880C',
        light: '#E09D0E',
        dark: '#A16C0A',
        gradient: 'linear-gradient(135deg, #E09D0E, #C9880C, #A16C0A)'
      }
    },
    {
      name: "Labyrinthe de l'Esprit",
      type: "MALUS",
      path: '/games/labyrinthe',
      soulImage: '/images/Âmichettes Charly/Amichette_Verte.gif',
      colors: {
        main: '#00C1A0',
        light: '#00D9B5',
        dark: '#00A88B',
        gradient: 'linear-gradient(135deg, #00D9B5, #00C1A0, #00A88B)'
      }
    }
  ];

  const initializeWheelBubbles = () => {
    return games.map((game, index) => {
      const angle = (360 / games.length) * index;
      return {
        id: game.name,
        colors: game.colors,
        game: game,
        baseAngle: angle,
        currentAngle: angle,
        radius: 180,
        baseRadius: 180,
        size: 60,
        opacity: 1,
        wobble: {
          angle: Math.random() * Math.PI * 2,
          speed: 0.001 + Math.random() * 0.002,
          radius: 20
        },
        position: { x: 0, y: 0 },
        forceCenter: false
      };
    });
  };

  useEffect(() => {
    setWheelBubbles(initializeWheelBubbles());
  }, []);

  useEffect(() => {
    let animationFrame;
    let startTime = Date.now();

    const animate = () => {
      const currentTime = Date.now();
      const deltaTime = currentTime - startTime;

      setWheelBubbles(prevBubbles => {
        switch (animationPhase) {
          case 'spinning':
            const progress = Math.min((currentTime - startTime) / 1000, 1);
            return prevBubbles.map(bubble => {
              const targetRadius = 40;
              const spinAngle = progress * 720;
              const wobbleX = Math.cos(bubble.wobble.angle + deltaTime * bubble.wobble.speed) * 
                            (bubble.wobble.radius * (1 - progress));
              const wobbleY = Math.sin(bubble.wobble.angle + deltaTime * bubble.wobble.speed) * 
                            (bubble.wobble.radius * (1 - progress));
              
              return {
                ...bubble,
                radius: bubble.baseRadius + (targetRadius - bubble.baseRadius) * progress,
                currentAngle: bubble.baseAngle + spinAngle,
                position: {
                  x: wobbleX,
                  y: wobbleY
                }
              };
            });

          case 'finalBubble':
            return prevBubbles.map(bubble => {
              if (bubble.id === finalBubble?.id) {
                return {
                  ...bubble,
                  radius: 40,
                  opacity: 1,
                  currentAngle: bubble.baseAngle,
                  forceCenter: true,
                  position: { x: 0, y: 0 }
                };
              }
              const wobbleX = Math.cos(bubble.wobble.angle + deltaTime * bubble.wobble.speed) * bubble.wobble.radius;
              const wobbleY = Math.sin(bubble.wobble.angle + deltaTime * bubble.wobble.speed) * bubble.wobble.radius;
              
              return {
                ...bubble,
                opacity: 0.5,
                currentAngle: bubble.baseAngle + Math.sin(deltaTime * 0.0005) * 5,
                radius: bubble.baseRadius + Math.sin(deltaTime * 0.001) * 10,
                position: {
                  x: wobbleX,
                  y: wobbleY
                }
              };
            });

          default:
            return prevBubbles.map(bubble => {
              const wobbleX = Math.cos(bubble.wobble.angle + deltaTime * bubble.wobble.speed) * bubble.wobble.radius;
              const wobbleY = Math.sin(bubble.wobble.angle + deltaTime * bubble.wobble.speed) * bubble.wobble.radius;
              
              return {
                ...bubble,
                opacity: 1,
                forceCenter: false,
                currentAngle: bubble.baseAngle + Math.sin(deltaTime * 0.0005) * 5,
                radius: bubble.baseRadius + Math.sin(deltaTime * 0.001) * 10,
                position: {
                  x: wobbleX,
                  y: wobbleY
                }
              };
            });
        }
      });

      animationFrame = requestAnimationFrame(animate);
    };

    animate();
    return () => cancelAnimationFrame(animationFrame);
  }, [animationPhase, finalBubble]);

  const spinWheel = () => {
    if (!isSpinning) {
      setIsSpinning(true);
      setShowDescription(false);
      setSelectedGame(null);
      setFinalBubble(null);
      setAnimationPhase('idle');
      
      setWheelBubbles(initializeWheelBubbles());

      setTimeout(() => {
        setAnimationPhase('spinning');
        const selectedIndex = Math.floor(Math.random() * games.length);
        const selectedGame = games[selectedIndex];
        
        setTimeout(() => {
          setFinalBubble(wheelBubbles[selectedIndex]);
          setAnimationPhase('finalBubble');
    
          setTimeout(() => {
            setSelectedGame(selectedGame);
            
            setTimeout(() => {
              setShowDescription(true);
              setThemeColors(selectedGame.colors);
              setIsSpinning(false);
            }, 200);
          }, 300);
        }, 1000);
      }, 50);
    }
  };

  const handleGameStart = (game) => {
    navigate(game.path);
  };

  const calculateBubblePosition = (angle, radius, forceCenter = false, position = { x: 0, y: 0 }) => {
    if (forceCenter) {
      return { x: 275, y: 275 };
    }
    const centerX = 275;
    const centerY = 275;
    const radian = (angle * Math.PI) / 180;
    return {
      x: centerX + Math.cos(radian) * radius + position.x,
      y: centerY + Math.sin(radian) * radius + position.y
    };
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-start pt-6 relative z-10">
      <ScrollbarTheme />
      {/* Titre et GIFs */}
      <div className="flex items-center justify-center gap-12 mb-8 mt-24">
        <img 
          src={selectedGame 
            ? selectedGame.soulImage 
            : "/images/AmongUsTwerk.gif"}
          alt="Soul Animation Left"
          className="w-40 h-40 object-contain transform -scale-x-100"
        />
        <h1 className="text-8xl font-bold text-center transition-colors duration-500">
          <span style={{ 
            color: selectedGame 
              ? selectedGame.colors.light 
              : '#fff'
          }}>
            {selectedGame ? selectedGame.type : "BONUS ou MALUS"}
          </span>
          <span 
            className="block text-7xl mt-2 transition-colors duration-500"
            style={{ 
              color: selectedGame 
                ? selectedGame.colors.main
                : '#fff' 
            }}
          >
            du CUL
          </span>
        </h1>
        <img 
          src={selectedGame 
            ? selectedGame.soulImage 
            : "/images/AmongUsTwerk.gif"}
          alt="Soul Animation Right"
          className="w-40 h-40 object-contain"
        />
      </div>


      {/* Cercle mystique avec bulles */}
      <div className="relative w-[550px] h-[550px] mb-6">
        {/* Lueur d'arrière-plan */}
        <div 
          className="absolute inset-0 rounded-full transition-all duration-1000"
          style={{
            background: selectedGame 
              ? `radial-gradient(circle at center, ${selectedGame.colors.light}20, transparent)`
              : 'radial-gradient(circle at center, rgba(255,255,255,0.05), transparent)',
            boxShadow: selectedGame 
              ? `0 0 50px ${selectedGame.colors.light}20`
              : 'none'
          }}
        />

{/* Conteneur des bulles */}
<div className="absolute inset-0 rounded-full overflow-hidden">
          {wheelBubbles.map(bubble => {
            const pos = calculateBubblePosition(
              bubble.currentAngle, 
              bubble.radius, 
              bubble.forceCenter, 
              bubble.position
            );
            const isSelected = animationPhase === 'finalBubble' && bubble.id === finalBubble?.id;
            
            return (
              <div
                key={bubble.id}
                className="absolute rounded-full transition-all duration-300"
                style={{
                  width: `${bubble.size}px`,
                  height: `${bubble.size}px`,
                  left: `${pos.x}px`,
                  top: `${pos.y}px`,
                  transform: 'translate(-50%, -50%)',
                  background: bubble.colors.gradient,
                  boxShadow: `0 0 ${isSelected ? '30px' : '20px'} ${bubble.colors.light}${isSelected ? '70' : '50'}`,
                  opacity: bubble.opacity ?? 1,
                  transition: isSelected 
                    ? 'all 0.5s ease-out'
                    : 'all 0.3s ease-out',
                  zIndex: isSelected ? 2 : 1
                }}
              />
            );
          })}
        </div>

        {/* Bouton central */}
        <button
          onClick={spinWheel}
          disabled={isSpinning}
          className={`absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 
                     w-32 h-32 rounded-full bg-black/50
                     hover:bg-black/40 
                     transition-all duration-500 group
                     border border-white/20
                     flex items-center justify-center z-10
                     ${isSpinning ? 'opacity-0 invisible' : 'opacity-100 visible'}`}
          style={{
            boxShadow: selectedGame 
              ? `0 0 30px ${selectedGame.colors.main}30`
              : 'none'
          }}
        >
          <span className="text-white/90 text-2xl font-medium">
            Invoquer
          </span>
          <div className="absolute inset-0 rounded-full opacity-50
                       bg-white/5 group-hover:bg-white/10 
                       animate-pulse" />
        </button>
      </div>

      {/* Titre et bouton GO du mini-jeu sélectionné */}
      {selectedGame && showDescription && (
        <div className="flex flex-col items-center gap-4 mt-2">
          <GameTitle
            title={selectedGame.name}
            type={selectedGame.type}
            colors={selectedGame.colors}
            soulImage={selectedGame.soulImage}
          />
          <button
            onClick={() => handleGameStart(selectedGame)}
            className="px-12 py-4 rounded-xl text-3xl font-bold transition-all duration-300
                      transform hover:scale-110 bg-black/30 border-2 border-transparent 
                      hover:border-current -mt-8"
            style={{ 
              color: selectedGame.colors.light,
              textShadow: `0 0 20px ${selectedGame.colors.light}30`
            }}
          >
            GO !
          </button>
        </div>
      )}

      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0) scale(1); }
          50% { transform: translateY(-20px) scale(1.05); }
        }
      `}</style>
      {/* Barre de Défilement */}
      <style jsx>{`
      ::-webkit-scrollbar {
        width: 10px;
      }

      ::-webkit-scrollbar-track {
        background: ${selectedGame ? `${selectedGame.colors.dark}10` : 'rgba(0, 168, 139, 0.1)'};
        border-radius: 5px;
      }

      ::-webkit-scrollbar-thumb {
        background: ${selectedGame ? `${selectedGame.colors.light}30` : 'rgba(0, 217, 181, 0.3)'};
        border-radius: 5px;
      }

      ::-webkit-scrollbar-thumb:hover {
        background: ${selectedGame ? `${selectedGame.colors.light}50` : 'rgba(0, 217, 181, 0.5)'};
      }
    `}</style>
  </div>
  );
};

export default WheelPage;