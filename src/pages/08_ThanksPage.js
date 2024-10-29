import React, { useState, useEffect, useMemo } from 'react';

const ThanksPage = () => {
  const [bubbles, setBubbles] = useState([]);
  const [randomNonGlowingIndex] = useState(() => Math.floor(Math.random() * 17));

  // Configuration des positions pour 17 âmichettes
  const initialPositions = [
    // Haut
    { x: 15, y: 15 }, { x: 40, y: 10 }, { x: 65, y: 15 }, { x: 85, y: 20 },
    // Milieu haut
    { x: 10, y: 35 }, { x: 35, y: 30 }, { x: 60, y: 35 }, { x: 85, y: 40 },
    // Centre gauche et droite
    { x: 20, y: 50 }, { x: 80, y: 50 },
    // Milieu bas
    { x: 15, y: 65 }, { x: 40, y: 70 }, { x: 65, y: 65 }, { x: 90, y: 70 },
    // Bas
    { x: 20, y: 85 }, { x: 70, y: 85 },
    // Position spéciale sous le texte
    { x: 50, y: 60 }
  ];

  // Liste des PP Discord (ImRegret retiré)
  const allProfiles = [
    { id: 1, image: '/images/PP Discord/PP_AKuma.png', name: 'AKuma' },
    { id: 2, image: '/images/PP Discord/PP_Aled.png', name: 'Aled' },
    { id: 3, image: '/images/PP Discord/PP_Atsina.png', name: 'Atsina' },
    { id: 4, image: '/images/PP Discord/PP_Bloawn.png', name: 'Bloawn' },
    { id: 5, image: '/images/PP Discord/PP_Charly.png', name: 'Charly' },
    { id: 6, image: '/images/PP Discord/PP_EvilHeart.png', name: 'Evil Heart' },
    { id: 7, image: '/images/PP Discord/PP_Gray.png', name: 'Gray' },
    { id: 9, image: '/images/PP Discord/PP_Kheos.png', name: 'Kheos' },
    { id: 10, image: '/images/PP Discord/PP_Logy.png', name: 'Logy' },
    { id: 11, image: '/images/PP Discord/PP_Looping.png', name: 'Looping' },
    { id: 12, image: '/images/PP Discord/PP_Niyukie.png', name: 'Niyukie' },
    { id: 13, image: '/images/PP Discord/PP_PeaceAndLové.png', name: 'Peace And Lové' },
    { id: 14, image: '/images/PP Discord/PP_Quasibrother.png', name: 'Quasibrother' },
    { id: 15, image: '/images/PP Discord/PP_Quideo.png', name: 'Quideo' },
    { id: 16, image: '/images/PP Discord/PP_Shishi.png', name: 'Shishi' },
    { id: 17, image: '/images/PP Discord/PP_Slayen.png', name: 'Slayen' },
    { id: 18, image: '/images/PP Discord/PP_Zaza.png', name: 'Zaza' }
  ].sort(() => Math.random() - 0.5);

  const soulTypes = {
    verte: '/images/Âmichettes Charly/Amichette_Verte_Vide.gif',
    rouge: '/images/Âmichettes Charly/Amichette_Rouge_Vide.gif',
    bleue: '/images/Âmichettes Charly/Amichette_Bleu_Vide.gif',
    mauve: '/images/Âmichettes Charly/Amichette_Mauve_Vide.gif',
    doree: '/images/Âmichettes Charly/Amichette_Doré_Vide.gif'
  };

  // Définition des couleurs de lueur pour chaque type
  const glowColors = {
    verte: '#00ff00',
    rouge: '#ff0000',
    bleue: '#0000ff',
    mauve: '#ff00ff',
    doree: '#ffd700'
  };

  // Distribution des couleurs d'âmichettes
  const distributedSoulTypes = useMemo(() => {
    const colorPool = [
      ...Array(3).fill('verte'),
      ...Array(3).fill('rouge'),
      ...Array(4).fill('bleue'),
      ...Array(4).fill('mauve'),
      ...Array(3).fill('doree')
    ].sort(() => Math.random() - 0.5);

    return colorPool.map(color => ({
      type: color,
      path: soulTypes[color],
      glowColor: glowColors[color]
    }));
  }, []);

  // Génération des bulles d'arrière-plan
  useEffect(() => {
    const generateBubbles = () => {
      return Array.from({ length: 60 }, (_, i) => {
        const size = Math.random() * (200 - 30) + 30;
        const glowIntensity = (200 - size) / 200;
        const colorTheme = {
          main: '#00C1A0',
          light: '#00D9B5',
          dark: '#00A88B',
          gradient: 'linear-gradient(135deg, #00D9B5, #00C1A0, #00A88B)'
        };
        
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

  return (
    <div className="min-h-screen bg-black relative">
      {/* Bulles d'arrière-plan */}
      <div className="absolute inset-0 pointer-events-none">
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

      {/* Texte central */}
      <div className="relative flex items-center justify-center z-10 pt-20">
        <div className="text-center text-white max-w-4xl px-4">
          <h1 className="text-6xl font-bold mb-8 font-['Taurunum Ferrum']">
            Merci à tous
          </h1>
          <p className="text-3xl font-['BreeSerif-Regular']">
            Cette aventure extraordinaire n'aurait jamais été possible sans votre participation 
            et votre enthousiasme débordant. Chacun d'entre vous a contribué à faire de Soul On-Lan 
            un moment vraiment magique et inoubliable ! Votre présence et votre énergie ont donné 
            vie à cet événement d'une manière unique.
          </p>
        </div>
      </div>

      {/* Âmichettes avec PP */}
      <div className="absolute inset-0 pointer-events-none">
        {allProfiles.slice(0, 17).map((profile, index) => {
          const position = initialPositions[index];
          const delay = index * 0.2;
          const isNonGlowing = index === randomNonGlowingIndex;
          const soulType = distributedSoulTypes[index];

          return (
            <div
              key={profile.id}
              className="absolute transform -translate-x-1/2 -translate-y-1/2 will-change-transform z-20"
              style={{
                left: `${position.x}%`,
                top: `${position.y}%`,
                width: '80px',
                height: '96px',
                animation: `snakeFloat 6s ease-in-out ${delay}s infinite`
              }}
            >
              <div 
                className={`relative amichette-container ${isNonGlowing ? 'dark' : 'glow'} pointer-events-auto`}
                style={{ '--glow-color': soulType.glowColor }}
              >
                {/* Texte "HELP ME!" */}
                {isNonGlowing && (
                  <div 
                    className="help-text absolute top-20 -right-14 opacity-0 transition-opacity duration-300 z-30 font-['BreeSerif-Regular']"
                    style={{ 
                      color: soulType.glowColor,
                      textShadow: `0 0 10px ${soulType.glowColor}, 0 0 20px ${soulType.glowColor}`,
                      transform: 'rotate(30deg)',
                      transformOrigin: 'center',
                      fontSize: '0.9rem'
                    }}
                  >
                    HELP ME!
                  </div>
                )}

                {/* PP Discord */}
                <div className="absolute bottom-[4%] left-1/2 transform -translate-x-1/2 w-[67%] aspect-square overflow-visible z-20">
                  <div className="pp-wrapper w-full h-full rounded-full transition-all duration-300">
                    <img
                      src={profile.image}
                      alt={profile.name}
                      className="w-full h-full object-cover rounded-full"
                      title={profile.name}
                    />
                  </div>
                </div>

                {/* Âmichette vide */}
                <img
                  src={soulType.path}
                  alt="Âmichette"
                  className="w-full h-full object-contain relative z-10"
                />
              </div>
            </div>
          );
        })}
      </div>

      <style jsx>{`
        @font-face {
          font-family: 'BreeSerif-Regular';
          src: url('/fonts/BreeSerif-Regular.ttf') format('truetype');
        }

        @keyframes snakeFloat {
          0%, 100% {
            transform: translate(-50%, -50%) translateY(0);
          }
          25% {
            transform: translate(-50%, -50%) translateY(-15px) translateX(5px);
          }
          50% {
            transform: translate(-50%, -50%) translateY(0) translateX(-5px);
          }
          75% {
            transform: translate(-50%, -50%) translateY(15px) translateX(5px);
          }
        }

        @keyframes float {
          0%, 100% {
            transform: translateY(0) scale(1);
          }
          50% {
            transform: translateY(-20px) scale(1.05);
          }
        }

        .amichette-container {
          position: relative;
        }

        .amichette-container.glow:hover .pp-wrapper {
          filter: drop-shadow(0 0 20px var(--glow-color))
                 drop-shadow(0 0 40px var(--glow-color));
        }

        .amichette-container.dark:hover .pp-wrapper {
          filter: brightness(0.3);
        }
        
        .pp-wrapper {
          transition: all 0.3s ease;
        }

        .amichette-container.dark:hover .help-text {
          opacity: 1;
          animation: fadeInOutRotated 2s ease-in-out infinite;
        }

        @keyframes fadeInOutRotated {
          0% {
            opacity: 0;
            transform: rotate(30deg) translateY(5px);
          }
          50% {
            opacity: 1;
            transform: rotate(30deg) translateY(0);
          }
          100% {
            opacity: 0;
            transform: rotate(30deg) translateY(-5px);
          }
        }
      `}</style>
    </div>
  );
};

export default ThanksPage;