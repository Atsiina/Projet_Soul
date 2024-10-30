import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';

const ThanksPage = () => {
  const navigate = useNavigate();
  const [bubbles, setBubbles] = useState([]);
  const [randomNonGlowingIndex] = useState(() => Math.floor(Math.random() * 17));
  const [isSecretActive, setIsSecretActive] = useState(false);
  const [fleeingAnimations, setFleeingAnimations] = useState({});
  const [blinkRate, setBlinkRate] = useState(1000);
  const [showSecretTab, setShowSecretTab] = useState(false);
  const [tabText, setTabText] = useState('');
  const [isDarkAmichetteVisible, setIsDarkAmichetteVisible] = useState(true);
  const [animationComplete, setAnimationComplete] = useState(false);

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

  // Configuration des positions pour 17 âmichettes
  const initialPositions = [
    // Haut
    { x: 15, y: 15 }, { x: 30, y: 10 }, { x: 70, y: 8 }, { x: 85, y: 20 },
    // Milieu haut
    { x: 10, y: 35 }, { x: 23, y: 30 }, { x: 75, y: 30 }, { x: 85, y: 40 },
    // Centre gauche et droite
    { x: 18, y: 50 }, { x: 78, y: 55 },
    // Milieu bas
    { x: 8, y: 65 }, { x: 25, y: 70 }, { x: 55, y: 75 }, { x: 87, y: 70 },
    // Bas
    { x: 15, y: 82 }, { x: 70, y: 80 },
    // Position spéciale sous le texte
    { x: 38, y: 80 }
  ];

  const { distributedSoulTypes, soulTypes } = useMemo(() => {
    const soulTypesConfig = {
      verte: {
        path: '/images/Âmichettes Charly/Amichette_Verte_Vide.gif',
        colors: {
          main: '#00ff00',
          light: '#50ff50',
          dark: '#008000'
        }
      },
      rouge: {
        path: '/images/Âmichettes Charly/Amichette_Rouge_Vide.gif',
        colors: {
          main: '#ff0000',
          light: '#ff5050',
          dark: '#800000'
        }
      },
      bleue: {
        path: '/images/Âmichettes Charly/Amichette_Bleu_Vide.gif',
        colors: {
          main: '#0000ff',
          light: '#5050ff',
          dark: '#000080'
        }
      },
      mauve: {
        path: '/images/Âmichettes Charly/Amichette_Mauve_Vide.gif',
        colors: {
          main: '#ff00ff',
          light: '#ff50ff',
          dark: '#800080'
        }
      },
      doree: {
        path: '/images/Âmichettes Charly/Amichette_Doré_Vide.gif',
        colors: {
          main: '#ffd700',
          light: '#ffed4a',
          dark: '#c7a600'
        }
      }
    };

    const colorPool = [
      ...Array(3).fill('verte'),
      ...Array(3).fill('rouge'),
      ...Array(4).fill('bleue'),
      ...Array(4).fill('mauve'),
      ...Array(3).fill('doree')
    ];

    const neighbors = {
      0: [1, 4], 1: [0, 2], 2: [1, 3], 3: [2, 7],
      4: [0, 5], 5: [4, 6], 6: [5, 7], 7: [3, 6],
      8: [4, 9], 9: [8, 7], 10: [8, 11], 11: [10, 12],
      12: [11, 13], 13: [12, 14], 14: [10, 15],
      15: [14, 16], 16: [12, 15]
    };

    const isColorValid = (index, color, distributed) => {
      const neighborIndices = neighbors[index] || [];
      return !neighborIndices.some(neighborIndex => 
        neighborIndex < distributed.length && distributed[neighborIndex]?.type === color
      );
    };

    const distributedColors = [];
    const remainingColors = [...colorPool];

    for (let i = 0; i < 17; i++) {
      let validColors = remainingColors.filter(color => 
        isColorValid(i, color, distributedColors)
      );

      if (validColors.length === 0) {
        validColors = remainingColors;
      }

      const randomIndex = Math.floor(Math.random() * validColors.length);
      const selectedColor = validColors[randomIndex];
      const colorIndex = remainingColors.indexOf(selectedColor);
      remainingColors.splice(colorIndex, 1);

      distributedColors.push({
        type: selectedColor,
        path: soulTypesConfig[selectedColor].path,
        colors: soulTypesConfig[selectedColor].colors
      });
    }

    return {
      distributedSoulTypes: distributedColors,
      soulTypes: soulTypesConfig
    };
  }, []);

  const calculateFleeDirection = useCallback((amichettePos, clickPos) => {
    const dx = amichettePos.x - clickPos.x;
    const dy = amichettePos.y - clickPos.y;
    const angle = Math.atan2(dy, dx);
    const strength = 500;
    return {
      x: Math.cos(angle) * strength,
      y: Math.sin(angle) * strength
    };
  }, []);

  const handleDarkAmichetteClick = useCallback((event, position) => {
    if (isSecretActive) return;

    setIsSecretActive(true);
    const clickPos = {
      x: (event.clientX / window.innerWidth) * 100,
      y: (event.clientY / window.innerHeight) * 100
    };

    const newFleeingAnimations = {};
    initialPositions.forEach((pos, index) => {
      if (index !== randomNonGlowingIndex) {
        const direction = calculateFleeDirection(pos, clickPos);
        newFleeingAnimations[index] = direction;
      }
    });
    setFleeingAnimations(newFleeingAnimations);

    // Nouvelle séquence d'animation modifiée
    setTimeout(() => {
      setAnimationComplete(true);
      setShowSecretTab(true);
      
      // L'amichette sombre disparaît après que le texte soit écrit
      setTimeout(() => {
        setIsDarkAmichetteVisible(false);
      }, 1500);
    }, 2000);
  }, [isSecretActive, randomNonGlowingIndex, calculateFleeDirection, initialPositions]);

  useEffect(() => {
    if (showSecretTab) {
      const text = "Soul Eater";
      let index = 0;
      const writeInterval = setInterval(() => {
        if (index <= text.length) {
          setTabText(text.slice(0, index));
          index++;
        } else {
          clearInterval(writeInterval);
          const tab = document.getElementById('secret-tab');
          if (tab) {
            tab.classList.add('tab-blink');
          }
        }
      }, 150);

      return () => clearInterval(writeInterval);
    }
  }, [showSecretTab]);

  useEffect(() => {
    const generateBubbles = () => {
      return Array.from({ length: 60 }, (_, i) => {
        const size = Math.random() * (200 - 30) + 30;
        const glowIntensity = (200 - size) / 150;
        const randomSoulType = distributedSoulTypes[Math.floor(Math.random() * distributedSoulTypes.length)];
        
        return {
          id: i,
          size: size,
          left: Math.random() * 100,
          top: Math.random() * 300,
          delay: Math.random() * 10,
          duration: Math.random() * (15 - 10) + 10,
          hasGlow: Math.random() > 0.4,
          glowIntensity: glowIntensity,
          colorTheme: randomSoulType.colors,
        };
      });
    };

    setBubbles(generateBubbles());
  }, [distributedSoulTypes]);

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
              background: `linear-gradient(135deg, ${bubble.colorTheme.light}, ${bubble.colorTheme.main}, ${bubble.colorTheme.dark})`,
              animation: `float ${bubble.duration}s ease-in-out ${bubble.delay}s infinite`,
              filter: bubble.hasGlow ? `drop-shadow(0 0 ${12 * bubble.glowIntensity}px ${bubble.colorTheme.light}${0.5 * bubble.glowIntensity})` : 'none',
              opacity: bubble.hasGlow ? 0.15 + (bubble.glowIntensity * 0.15) : 0.1
            }}
          />
        ))}
      </div>

      {/* Texte central */}
      <div className="relative flex items-center justify-center z-10 pt-40">
        <div className="text-center text-white max-w-4xl px-4">
          <h1 
            className="text-5xl font-bold mb-6 font-['Taurunum Ferrum']"
            style={{
              background: 'linear-gradient(135deg, #00D9B5, #00C1A0, #00A88B)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              textShadow: '0 0 30px rgba(0, 193, 160, 0.3)'
            }}
          >
            Merci à vous tous,
          </h1>
          <div className="text-2xl font-['BreeSerif-Regular'] space-y-4">
            <p>
              Depuis les premiers jours dans notre guilde, sur tous les autres jeux qui nous ont réunis… jusqu'à aujourd'hui, où nous nous retrouvons pour cette <strong>Soul On-Lan</strong>, vous avez été une présence précieuse et irremplaçable. Notre chemin ensemble est jalonné de rencontres uniques, de moments inoubliables, de dramas, mais surtout d'une sincère amitié. Sur chaque jeu, chaque serveur, et même ici sur Discord, vous avez toujours été là, avec votre énergie, votre humour, et cette passion qui rend chaque instant avec vous si spécial.
            </p>
            <p>
              Ce moment que nous partageons aujourd'hui existe <strong>grâce à vous et pour vous</strong>. Votre présence, vos rires, et cette incroyable diversité de personnalités qui ont créé tant de souvenirs font de notre lien <strong>un véritable trésor</strong>, qui va bien au-delà des écrans.
            </p>
            <p>
              Merci d'être là, d'être vous-mêmes, et de rendre chaque partie mémorable. Que cet événement soit à la hauteur de tout ce que vous m'apportez depuis des années !
            </p>
            <p className="font-bold">
            Vous êtes les âmes inestimables de notre aventure.
            </p>
          </div>
        </div>
      </div>

      {/* Âmichettes avec PP */}
      <div className="absolute inset-0 pointer-events-none">
        {allProfiles.slice(0, 17).map((profile, index) => {
          const position = initialPositions[index];
          const delay = index * 0.2;
          const isNonGlowing = index === randomNonGlowingIndex;
          const soulType = distributedSoulTypes[index];
          const fleeingAnimation = fleeingAnimations[index];

          if (isNonGlowing && !isDarkAmichetteVisible) return null;
          if (!isNonGlowing && animationComplete) return null;

          const originalPath = soulType.path;
          const originalImage = profile.image;

          return (
            <div
              key={profile.id}
              className={`absolute transform -translate-x-1/2 -translate-y-1/2 will-change-transform z-20`}
              style={{
                left: `${position.x}%`,
                top: `${position.y}%`,
                width: '60px',
                height: '72px',
                animation: isSecretActive && !isNonGlowing
                  ? 'flee 2s forwards'
                  : `snakeFloat 6s ease-in-out ${delay}s infinite`,
                '--flee-x': fleeingAnimation ? `${fleeingAnimation.x}%` : '0%',
                '--flee-y': fleeingAnimation ? `${fleeingAnimation.y}%` : '0%'
              }}
            >
              <div 
                className={`relative amichette-container ${isNonGlowing ? 'dark' : 'glow'} pointer-events-auto`}
                style={{ 
                  '--glow-color': soulType.colors.main,
                  opacity: isNonGlowing && isSecretActive ? `var(--blink-opacity, 1)` : 1
                }}
                onClick={isNonGlowing && !isSecretActive ? (e) => handleDarkAmichetteClick(e, position) : undefined}
              >
                {/* PP Discord en arrière-plan - maintenant avec image fixe */}
                <div className="absolute top-[78%] left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[65%] aspect-square overflow-visible">
                  <div className="pp-wrapper w-full h-full rounded-full transition-all duration-300">
                    <img
                      src={originalImage}
                      alt={profile.name}
                      className="w-full h-full object-cover rounded-full"
                      title={profile.name}
                    />
                  </div>
                </div>

                {/* Âmichette vide par dessus - maintenant avec image fixe */}
                <img
                  src={originalPath}
                  alt="Âmichette"
                  className="w-full h-full object-contain relative z-10"
                />

                {/* Texte "HELP ME!" */}
                {isNonGlowing && (
                  <div 
                    className="help-text absolute top-12 -right-14 opacity-0 transition-opacity duration-300 z-30 font-['BreeSerif-Regular']"
                    style={{ 
                      color: soulType.colors.main,
                      textShadow: `0 0 10px ${soulType.colors.main}, 0 0 20px ${soulType.colors.main}`,
                      transform: 'rotate(30deg)',
                      transformOrigin: 'center',
                      fontSize: '0.9rem'
                    }}
                  >
                    HELP ME!
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Bouton Secret ajusté avec les nouveaux styles */}
      {showSecretTab && (
        <div 
          id="secret-tab"
          className="nav-link"
          style={{
            position: 'fixed',
            top: '2.10rem',
            left: '50%',
            transform: 'translateX(400px)',
            color: '#fff',
            padding: '0.25rem 0.75rem',
            fontSize: '1.30rem',
            lineHeight: '1.5rem',
            fontWeight: '100',
            cursor: 'pointer',
            border: '2px solid rgba(255, 255, 255, 0.2)',
            borderRadius: '0.35rem',
            background: 'rgba(0, 0, 0, 0.5)',
            backdropFilter: 'blur(10px)',
            boxShadow: '0 0 10px rgba(255, 255, 255, 0.3)',
            textTransform: 'uppercase',
            zIndex: 50,
            height: '2.25rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            letterSpacing: '0.025em',
            transition: 'all 0.2s ease-in-out',
            opacity: 0,
            animation: 'fadeIn 1.5s forwards'
          }}
          onClick={() => navigate('/secret')}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.1)';
            e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.3)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = 'rgba(0, 0, 0, 0.5)';
            e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.2)';
          }}
        >
          {tabText}
        </div>
      )}

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
            transform: translateY(0) translateX(0) scale(1);
          }
          50% {
            transform: translateY(-50px) translateX(20px) scale(1.1);
          }
          75% {
            transform: translateY(-25px) translateX(-20px) scale(1.05);
          }
        }

        @keyframes flee {
          0% {
            transform: translate(-50%, -50%);
            opacity: 1;
          }
          100% {
            transform: translate(
              calc(-50% + var(--flee-x)), 
              calc(-50% + var(--flee-y))
            );
            opacity: 0;
            visibility: hidden;
          }
        }

        @keyframes fadeIn {
          0% {
            opacity: 0;
            transform: translateX(400px) translateY(20px);
          }
          100% {
            opacity: 1;
            transform: translateX(400px) translateY(0);
          }
        }

        @keyframes blink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.2; }
        }

        .nav-link {
          transition: all 0.3s ease;
        }

        .nav-link:hover {
          border-color: rgba(255, 255, 255, 0.4);
          box-shadow: 0 0 20px rgba(255, 255, 255, 0.4);
        }

        .tab-blink {
          animation: tabBlink 0.5s ease-in-out 3;
        }

        @keyframes tabBlink {
          0%, 100% { 
            border-color: rgba(255, 255, 255, 0.2);
            box-shadow: 0 0 10px rgba(255, 255, 255, 0.3);
          }
          50% { 
            border-color: rgba(255, 255, 255, 0.8);
            box-shadow: 0 0 30px rgba(255, 255, 255, 0.6);
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