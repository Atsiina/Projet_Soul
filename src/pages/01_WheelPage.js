import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useThemeColors } from '../context/ColorContext';

const gameColors = {
  questDesAmes: {
    main: '#00A2E8',
    light: '#33B5ED',
    dark: '#0081BA',
    gradient: 'linear-gradient(135deg, #33B5ED, #00A2E8, #0081BA)'
  },
  echoDeLAme: {
    main: '#A349A4',
    light: '#B66DB7',
    dark: '#822683',
    gradient: 'linear-gradient(135deg, #B66DB7, #A349A4, #822683)'
  },
  chiSoulMi: {
    main: '#8F0016',
    light: '#B30025',
    dark: '#6B0011',
    gradient: 'linear-gradient(135deg, #B30025, #8F0016, #6B0011)'
  },
  reliquesPerdues: {
    main: '#C9880C',
    light: '#E09D0E',
    dark: '#A16C0A',
    gradient: 'linear-gradient(135deg, #E09D0E, #C9880C, #A16C0A)'
  },
  labyrintheDeLEsprit: {
    main: '#00C1A0',
    light: '#00D9B5',
    dark: '#00A88B',
    gradient: 'linear-gradient(135deg, #00D9B5, #00C1A0, #00A88B)'
  }
};

const games = [
  {
    id: 'questDesAmes',
    name: "Quête des âmes",
    type: "BONUS",
    colors: gameColors.questDesAmes,
    path: '/games/quete-des-ames',
    shortDesc: "Les esprits vous confient trois quêtes mystérieuses pour prouver votre valeur...",
    preparation: [
      "Pour chaque quête, murmurez un chiffre entre 0 et 6 au Maître du Jeu",
      "Chaque participant reçoit 3 quêtes secrètes par message privé du Maître du Jeu"
    ],
    rules: {
      title: "RÈGLE DU DESTIN",
      content: "À chaque fois qu'un chiffre a déjà été murmuré par un autre participant, la difficulté de la quête s'intensifie :",
      details: [
        "Facile devient Normal",
        "Normal devient Difficile",
        "Difficile devient Extrême"
      ]
    },
    warning: "Les forces obscures ne permettent qu'une seule quête Extrême par lot de trois."
  },

  {
    id: 'echoDeLAme',
    name: "Écho de l'Âme",
    type: "BONUS",
    colors: gameColors.echoDeLAme,
    path: '/games/echo-de-lame',
    shortDesc: "Les mots ont du pouvoir, et certains résonnent plus que d'autres...",
    preparation: [
      "Vous recevrez l'une des trois listes de mots mystiques existantes",
      "Lire ce que chaque mot demande de faire"
    ],
    rules: {
      title: "RÈGLE DE RÉSONANCE",
      content: "Quand un mot de votre liste résonne comme un écho, votre âme doit réagir immédiatement :",
      details: [
        "Par un chant",
        "Par des paroles",
        "Par des gestes",
        "Ou par bien d'autres manifestations..."
      ]
    },
    warning: "Restez vigilant, car les mots peuvent surgir à tout moment."
  },
  {
    id: 'chiSoulMi',
    name: "Chi-Soul-Mi",
    type: "MALUS",
    colors: gameColors.chiSoulMi,
    path: '/games/chi-soul-mi',
    shortDesc: "Un duel d'âmes où le hasard et la stratégie s'entremêlent...",
    preparation: [],
    rules: {
      title: "RÈGLES DU DUEL",
      content: "",
      details: [
        "Les duels se jouent en 3 manches",
        "Les adversaires choisissent ensemble une liste de jeux possibles et le nombre d'âmes à parier",
        "Le vainqueur du Chi-Soul-Mi invoque le jeu de son choix",
        "Si le participant n'a pas fait tous les duels qui lui était possible de faire il à -15 âmes par duel non joué"
      ]
    },
    warning: "Si le duel finit en 3-0, le gagnant peut prendre la totalité des âmes de l'adversaire... Choisissez vos jeux avec sagesse."
  },
  {
    id: 'reliquesPerdues',
    name: "Les Reliques Perdues",
    type: "BONUS",
    colors: gameColors.reliquesPerdues,
    path: '/games/reliques-perdues',
    shortDesc: "Les âmes anciennes ont laissé derrière elles des reliques puissantes. Saurez-vous les retrouver avant les autres ?",
    preparation: [
      "Le Maître du Jeu cache des indices dans les différents canaux Discord ou dans les messages passés des participants",
      "Chaque participant reçoit une description d'une relique à retrouver"
    ],
    rules: {
      title: "RÈGLES DE RECHERCHE",
      content: "",
      details: [
        "Chaque indice trouvé permet de se rapprocher de la relique",
        "Le premier participant à trouver la relique gagne un avantage pour la prochaine épreuve",
        "Des pièges mystiques peuvent détourner les plus impatients"
      ]
    },
    warning: "Certaines reliques sont maudites... Prudence lors de votre quête !"
  },
  {
    id: 'labyrintheDeLEsprit',
    name: "Labyrinthe de l'Esprit",
    type: "MALUS",
    colors: gameColors.labyrintheDeLEsprit,
    path: '/games/labyrinthe',
    shortDesc: "Votre esprit est perdu dans un labyrinthe mystique. Seule la logique pourra vous guider vers la sortie...",
    preparation: [
      "Le Maître du Jeu crée un \"labyrinthe\" sous forme d'énigmes, chaque sortie d'énigme menant à une nouvelle salle (ou sortie)",
      "Chaque joueur commence dans une salle différente et reçoit sa première énigme par message privé"
    ],
    rules: {
      title: "RÈGLES DU LABYRINTHE",
      content: "",
      details: [
        "Chaque joueur a 3 minutes pour résoudre son énigme",
        "Une mauvaise réponse ajoute un obstacle, ralentissant le joueur",
        "Le premier joueur à trouver la sortie remporte une récompense mystique"
      ]
    },
    warning: "Ne vous égarez pas trop longtemps, ou les murs du labyrinthe commenceront à se resserrer..."
  }
];

const WheelPage = () => {
  const navigate = useNavigate();
  const { setThemeColors } = useThemeColors();
  const [isSpinning, setIsSpinning] = useState(false);
  const [selectedGame, setSelectedGame] = useState(null);
  const [showDescription, setShowDescription] = useState(false);
  const [wheelBubbles, setWheelBubbles] = useState([]);
  const [finalBubble, setFinalBubble] = useState(null);
  const [animationPhase, setAnimationPhase] = useState('idle');

  const calculateBubblePosition = (angle, radius, forceCenter = false) => {
    if (forceCenter) {
      return { x: 300, y: 300 };
    }
    const centerX = 300;
    const centerY = 300;
    const radian = (angle * Math.PI) / 180;
    return {
      x: centerX + Math.cos(radian) * radius,
      y: centerY + Math.sin(radian) * radius
    };
  };

  useEffect(() => {
    const generateWheelBubbles = () => {
      return games.map((game, index) => {
        const angle = (360 / games.length) * index;
        return {
          id: game.id,
          colors: game.colors,
          game: game,
          baseAngle: angle,
          currentAngle: angle,
          radius: 180,
          baseRadius: 180,
          size: 60,
          wobble: {
            angle: Math.random() * Math.PI * 2,
            speed: 0.001 + Math.random() * 0.002,
            radius: 20
          }
        };
      });
    };

    setWheelBubbles(generateWheelBubbles());
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
              
              return {
                ...bubble,
                radius: bubble.baseRadius + (targetRadius - bubble.baseRadius) * progress,
                currentAngle: bubble.baseAngle + spinAngle
              };
            });

          case 'finalBubble':
            return prevBubbles.map(bubble => ({
              ...bubble,
              radius: bubble.id === finalBubble?.id ? 40 : bubble.radius,
              opacity: bubble.id === finalBubble?.id ? 1 : 0,
              currentAngle: bubble.id === finalBubble?.id ? bubble.baseAngle : bubble.currentAngle,
              forceCenter: bubble.id === finalBubble?.id
            }));

          default:
            return prevBubbles.map(bubble => {
              const wobbleX = Math.cos(bubble.wobble.angle + deltaTime * bubble.wobble.speed) * bubble.wobble.radius;
              const wobbleY = Math.sin(bubble.wobble.angle + deltaTime * bubble.wobble.speed) * bubble.wobble.radius;
              
              return {
                ...bubble,
                currentAngle: bubble.baseAngle + Math.sin(deltaTime * 0.0005) * 5,
                radius: bubble.baseRadius + Math.sin(deltaTime * 0.001) * 10
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
    if (animationPhase === 'idle') {
      setAnimationPhase('spinning');
      const selectedIndex = Math.floor(Math.random() * games.length);
      const selectedGame = games[selectedIndex];
  
      // Phase de convergence (1s)
      setTimeout(() => {
        setFinalBubble(wheelBubbles[selectedIndex]);
        setAnimationPhase('finalBubble');
  
        // Phase de bulle finale (0.3s)
        setTimeout(() => {
          setSelectedGame(selectedGame);
          setThemeColors(selectedGame.colors);
          setAnimationPhase('complete');
          
          // Affichage du titre (0.2s)
          setTimeout(() => {
            setShowDescription(true);
            setAnimationPhase('idle');
          }, 200);
        }, 300);
      }, 1000);
    }
  };

return (
    <div 
      className="min-h-screen flex flex-col items-center justify-start pt-12 relative z-10 transition-all duration-1000"
      style={{
        backgroundColor: selectedGame ? `${selectedGame.colors.dark}10` : 'transparent',
        backgroundImage: selectedGame ? `radial-gradient(circle at center, ${selectedGame.colors.light}05, transparent 70%)` : 'none'
      }}
    >
      {/* Titre et GIFs */}
      <div className="flex items-center justify-center gap-8 mb-16">
        <img 
          src="/images/AmongUsTwerk.gif"
          alt="Among Us Left"
          className="w-24 h-24 transform -scale-x-100"
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
            className="block text-6xl mt-2 transition-colors duration-500"
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
          src="/images/AmongUsTwerk.gif"
          alt="Among Us Right"
          className="w-24 h-24"
        />
      </div>

      {/* Cercle mystique avec bulles */}
      <div className="relative w-[600px] h-[600px] mb-12">
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
            const pos = calculateBubblePosition(bubble.currentAngle, bubble.radius, bubble.forceCenter);
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
                  opacity: animationPhase === 'finalBubble' 
                    ? isSelected ? 1 : 0
                    : animationPhase === 'complete' 
                      ? 0 
                      : 1,
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
          disabled={animationPhase !== 'idle'}
          className={`absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 
                     w-32 h-32 rounded-full bg-black/50
                     hover:bg-black/40 
                     transition-all duration-500 group
                     border border-white/20
                     flex items-center justify-center z-10
                     ${animationPhase === 'idle' ? 'opacity-100 visible' : 'opacity-0 invisible'}`}
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

      {/* Titre du mini-jeu sélectionné - Cliquable pour navigation */}
      {/* Titre du mini-jeu sélectionné - Cliquable pour navigation */}
{selectedGame && showDescription && (
  <div className="flex flex-col items-center gap-4 mt-8">
    <h2 
      className="text-7xl font-bold text-center relative z-10 transform hover:scale-105 transition-all duration-300"
      style={{ 
        color: selectedGame.colors.light,
        textShadow: `0 0 30px ${selectedGame.colors.light}30`
      }}
    >
      {selectedGame.name}
    </h2>
    <button
      onClick={() => navigate(selectedGame.path)}
      className="px-12 py-4 rounded-xl text-3xl font-bold transition-all duration-300
                bg-black/30 border-2 border-transparent hover:border-current
                transform hover:scale-110"
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
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        .animate-fadeIn {
          animation: fadeIn 1s ease-out forwards;
        }
      `}</style>
    </div>
  );
};

export default WheelPage;
