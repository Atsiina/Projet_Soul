import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useThemeColors } from '../context/ColorContext';
import GameTitle from '../components/GameTitle';

const MiniMenuPage = () => {
  const navigate = useNavigate();
  const [time, setTime] = useState(0);
  const { setThemeColors } = useThemeColors();
  const [bubbles, setBubbles] = useState([]);

  const colorThemes = [
    {
      main: '#8F0016',
      light: '#B30025',
      dark: '#6B0011',
      gradient: 'linear-gradient(135deg, #B30025, #8F0016, #6B0011)'
    },
    {
      main: '#00A2E8',
      light: '#33B5ED',
      dark: '#0081BA',
      gradient: 'linear-gradient(135deg, #33B5ED, #00A2E8, #0081BA)'
    },
    {
      main: '#00C1A0',
      light: '#00D9B5',
      dark: '#00A88B',
      gradient: 'linear-gradient(135deg, #00D9B5, #00C1A0, #00A88B)'
    },
    {
      main: '#C9880C',
      light: '#E09D0E',
      dark: '#A16C0A',
      gradient: 'linear-gradient(135deg, #E09D0E, #C9880C, #A16C0A)'
    },
    {
      main: '#A349A4',
      light: '#B66DB7',
      dark: '#822683',
      gradient: 'linear-gradient(135deg, #B66DB7, #A349A4, #822683)'
    }
  ];

  // Configuration des jeux et de leurs âmichettes
  const games = [
    {
      name: "Chi-Soul-Mi",
      path: '/games/chi-soul-mi',
      position: { x: -250, y: -400 }, 
      colors: {
        main: '#8F0016',
        light: '#B30025',
        dark: '#6B0011',
        gradient: 'linear-gradient(135deg, #B30025, #8F0016, #6B0011)'
      },
      soulImage: '/images/Âmichettes Charly/Amichette_Rouge.gif',
      radius: 180,
      phaseOffset: 0,
      speedMultiplier: 0.15
    },
    {
      name: "Écho de l'Âme",
      path: '/games/echo-de-lame',
      position: { x: 250, y: -400 },
      colors: {
        main: '#A349A4',
        light: '#B66DB7',
        dark: '#822683',
        gradient: 'linear-gradient(135deg, #B66DB7, #A349A4, #822683)'
      },
      soulImage: '/images/Âmichettes Charly/Amichette_Mauve.gif',
      radius: 180,
      phaseOffset: 1.5,
      speedMultiplier: 0.12
    },
    {
      name: "Labyrinthe de l'Esprit",
      path: '/games/labyrinthe',
      position: { x: -300, y: 0 },
      colors: {
        main: '#00C1A0',
        light: '#00D9B5',
        dark: '#00A88B',
        gradient: 'linear-gradient(135deg, #00D9B5, #00C1A0, #00A88B)'
      },
      soulImage: '/images/Âmichettes Charly/Amichette_Verte.gif',
      radius: 180,
      phaseOffset: 2.7,
      speedMultiplier: 0.18
    },
    {
      name: "Quête des âmes",
      path: '/games/quete-des-ames',
      position: { x: 300, y: 0 },
      colors: {
        main: '#00A2E8',
        light: '#33B5ED',
        dark: '#0081BA',
        gradient: 'linear-gradient(135deg, #33B5ED, #00A2E8, #0081BA)'
      },
      soulImage: '/images/Âmichettes Charly/Amichette_Bleu.gif',
      radius: 180,
      phaseOffset: 3.9,
      speedMultiplier: 0.14
    },
    {
      name: "Les Reliques Perdues",
      path: '/games/reliques-perdues',
      position: { x: 0, y: 100 },
      colors: {
        main: '#C9880C',
        light: '#E09D0E',
        dark: '#A16C0A',
        gradient: 'linear-gradient(135deg, #E09D0E, #C9880C, #A16C0A)'
      },
      soulImage: '/images/Âmichettes Charly/Amichette_Doré.gif',
      radius: 180,
      phaseOffset: 5.1,
      speedMultiplier: 0.16
    }
  ];

  // Génération des bulles
  useEffect(() => {
    const generateBubbles = () => {
      return Array.from({ length: 60 }, (_, i) => {
        const size = Math.random() * (200 - 30) + 30;
        const glowIntensity = (200 - size) / 200;
        const colorTheme = colorThemes[Math.floor(Math.random() * colorThemes.length)];
        
        return {
          id: i,
          size: size,
          left: Math.random() * 100,
          top: Math.random() * 300,
          delay: Math.random() * 10,
          duration: Math.random() * (30 - 15) + 15,
          hasGlow: Math.random() > 0.4,
          glowIntensity: glowIntensity,
          colorTheme: colorTheme
        };
      });
    };

    setBubbles(generateBubbles());
  }, []);

  // Animation des âmichettes
  useEffect(() => {
    const interval = setInterval(() => {
      setTime(prev => prev + 0.001);
    }, 16);
    return () => clearInterval(interval);
  }, []);

  // Fonction de navigation et changement de couleur
  const handleGameSelect = (game) => {
    if (game?.colors) {
      setThemeColors(game.colors);
      setTimeout(() => {
        navigate(game.path);
      }, 50);
    } else {
      navigate(game.path);
    }
  };

  // Calculer la position des âmichettes
  const calculateSoulPosition = (baseTime, radius, offset, index, speedMultiplier = 1) => {
    const time = (baseTime * speedMultiplier + offset) * Math.PI;
    const angle = time + (index * (2 * Math.PI / 3));
    const x = radius * Math.cos(angle);
    const y = (radius * 0.5) * Math.sin(2 * angle);
    return { x, y };
  };

  return (
    <div className="min-h-screen bg-black relative overflow-hidden flex items-center justify-center">
      {/* Fond avec bulles multicolores */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        {bubbles.map((bubble) => (
          <div
            key={bubble.id}
            className="absolute rounded-full transition-colors duration-1000"
            style={{
              width: `${bubble.size}px`,
              height: `${bubble.size}px`,
              left: `${bubble.left}%`,
              top: `${bubble.top}%`,
              background: bubble.colorTheme.gradient,
              animation: `float ${bubble.duration}s ease-in-out ${bubble.delay}s infinite`,
              filter: bubble.hasGlow ? `drop-shadow(0 0 ${8 * bubble.glowIntensity}px ${bubble.colorTheme.light}${0.3 * bubble.glowIntensity})` : 'none',
              opacity: bubble.hasGlow ? 0.1 + (bubble.glowIntensity * 0.1) : 0.1
            }}
          />
        ))}
      </div>

      {/* Contenu des mini-jeux */}
      <div className="relative w-[1000px] h-[800px]">
        {games.map((game) => (
          <div
            key={game.path}
            className="absolute"
            style={{
              left: `calc(50% + ${game.position.x}px)`,
              top: `calc(50% + ${game.position.y}px)`,
            }}
          >
            {/* Titre du mini-jeu et bouton */}
            <button
              onClick={() => handleGameSelect(game)}
              className="relative transform -translate-x-1/2 -translate-y-1/2 
                       transition-all duration-300 hover:scale-110 cursor-pointer 
                       p-6 rounded-xl text-center z-20"
            >
              <div
                className="text-4xl font-bold whitespace-nowrap"
                style={{
                  background: game.colors.gradient,
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  textShadow: `0 0 20px ${game.colors.light}30`
                }}
              >
                {game.name}
              </div>
            </button>

            {/* Âmichettes tournantes */}
            {[0, 1, 2].map((index) => {
              const pos = calculateSoulPosition(
                time,
                game.radius,
                game.phaseOffset,
                index,
                game.speedMultiplier
              );

              return (
                <div
                  key={index}
                  className="absolute"
                  style={{
                    transform: `translate(${pos.x}px, ${pos.y}px)`,
                    width: '80px',
                    height: '96px',
                    left: '0px',
                    top: '0px',
                  }}
                >
                  <img
                    src={game.soulImage}
                    alt={`Âmichette ${index + 1}`}
                    style={{
                      width: '80px',
                      height: '96px',
                      filter: `drop-shadow(0 0 10px ${game.colors.light})`,
                      objectFit: 'contain'
                    }}
                  />
                </div>
              );
            })}
          </div>
        ))}
      </div>

      {/* Style pour l'animation des bulles */}
      <style jsx>{`
        @keyframes float {
          0%, 100% {
            transform: translateY(0) translateX(0) scale(1);
          }
          50% {
            transform: translateY(-50px) translateX(20px) scale(1.1);
          }
          75% {
            transform: translateY(-25px) translateX(-20px) scale(1.05);
          }
        }
      `}</style>
    </div>
  );
};

export default MiniMenuPage;