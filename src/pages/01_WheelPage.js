import React, { useState, useEffect } from 'react';

// Configuration des couleurs pour chaque mini-jeu
const gameColors = {
  questDesAmes: {
    main: '#00C1A0',
    light: '#33CFB3',
    dark: '#00A88B'
  },
  echoDeLAme: {
    main: '#008B71',
    light: '#00A88B',
    dark: '#007761'
  },
  chiSoulMi: {
    main: '#00755E',
    light: '#008B71',
    dark: '#005F4C'
  },
  reliquesPerdues: {
    main: '#006B55',
    light: '#008B71',
    dark: '#005544'
  },
  labyrintheDeLEsprit: {
    main: '#005F4C',
    light: '#007761',
    dark: '#004C3D'
  }
};

const games = [
  {
    id: 'questDesAmes',
    name: "Quête des âmes",
    type: "BONUS",
    colors: gameColors.questDesAmes,
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
  const [isSpinning, setIsSpinning] = useState(false);
  const [selectedGame, setSelectedGame] = useState(null);
  const [showDescription, setShowDescription] = useState(false);
  const [wheelBubbles, setWheelBubbles] = useState([]);

  // Logique d'animation (comme dans la troisième partie)
  useEffect(() => {
    const generateWheelBubbles = () => {
      return games.map((game, index) => ({
        id: game.id,
        color: game.colors.main,
        angle: (360 / games.length) * index,
        radius: 200, // Augmenté pour suivre la nouvelle taille de roue
        size: Math.random() * (80 - 60) + 60, // Bulles plus grandes
        wobble: {
          radius: Math.random() * 30, // Plus d'amplitude
          speed: Math.random() * (2 - 0.5) + 0.5 // Vitesse réduite
        }
      }));
    };

    setWheelBubbles(generateWheelBubbles());
  }, []);

  useEffect(() => {
    if (!isSpinning) {
      const animateWheelBubbles = () => {
        setWheelBubbles(prev => prev.map(bubble => ({
          ...bubble,
          angle: bubble.angle + (bubble.wobble.speed * 0.05), // Réduit de 0.1 à 0.05
          radius: bubble.radius + Math.sin(Date.now() / 2000 * bubble.wobble.speed) * bubble.wobble.radius // Ralentit la pulsation
        })));
      };

      const intervalId = setInterval(animateWheelBubbles, 50);
      return () => clearInterval(intervalId);
    }
  }, [isSpinning]);

  const spinWheel = () => {
    if (!isSpinning) {
      setIsSpinning(true);
      setShowDescription(false);
      
      const convergeDuration = 3000;
      const selectedIndex = Math.floor(Math.random() * games.length);
      const selectedGame = games[selectedIndex];

      setTimeout(() => {
        setSelectedGame(selectedGame);
        setIsSpinning(false);
        
        setTimeout(() => {
          setShowDescription(true);
        }, 1000);
      }, convergeDuration);
    }
  };

  const calculateBubblePosition = (angle, radius) => {
    const centerX = 180;
    const centerY = 180;
    const radian = (angle * Math.PI) / 180;
    return {
      x: centerX + Math.cos(radian) * radius,
      y: centerY + Math.sin(radian) * radius
    };
  };

  return (
    <div 
      className="min-h-screen flex flex-col items-center justify-start pt-12 relative z-10 transition-colors duration-1000"
      style={{
        backgroundColor: selectedGame ? `${selectedGame.colors.dark}10` : 'transparent'
      }}
    >
      {/* Titre et GIFs */}
      <div className="flex items-center justify-center gap-8 mb-16">
        <img 
          src="/images/AmongUsTwerk.gif"
          alt="Among Us Left"
          className="w-24 h-24 transform -scale-x-100"
        />
        <h1 className="text-8xl font-bold text-white text-center">
          {selectedGame ? selectedGame.type : "BONUS ou MALUS"}
          <span className="block text-6xl mt-2">du CUL</span>
        </h1>
        <img 
          src="/images/AmongUsTwerk.gif"
          alt="Among Us Right"
          className="w-24 h-24"
        />
      </div>

      {/* Cercle mystique avec bulles */}
      <div className="relative w-[600px] h-[600px] mb-12">
        <div 
          className="absolute inset-0 rounded-full transition-all duration-1000"
          style={{
            background: selectedGame 
              ? `radial-gradient(circle at center, ${selectedGame.colors.light}20, transparent)`
              : 'radial-gradient(circle at center, #00C1A010, transparent)',
            boxShadow: selectedGame 
              ? `0 0 30px ${selectedGame.colors.main}30`
              : '0 0 30px rgba(0, 193, 160, 0.1)'
          }}
        />

        {/* Bulles animées */}
        <div className="absolute inset-0 rounded-full overflow-hidden">
          {wheelBubbles.map(bubble => {
            const pos = calculateBubblePosition(bubble.angle, bubble.radius);
            return (
              <div
                key={bubble.id}
                className="absolute rounded-full transition-transform duration-300"
                style={{
                  width: `${bubble.size}px`,
                  height: `${bubble.size}px`,
                  left: `${pos.x}px`,
                  top: `${pos.y}px`,
                  transform: 'translate(-50%, -50%)',
                  background: `radial-gradient(circle at 30% 30%, ${bubble.color}, ${bubble.color}90)`,
                  boxShadow: `0 0 20px ${bubble.color}50`,
                  opacity: isSpinning ? '0.6' : '0.8'
                }}
              />
            );
          })}
        </div>

        {/* Bouton central */}
        <button
          onClick={spinWheel}
          disabled={isSpinning}
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 
                   w-32 h-32 rounded-full bg-black/50
                   hover:bg-[#00C1A0]/30 disabled:opacity-50
                   transition-all duration-500 group
                   border border-[#00C1A0]/30
                   flex items-center justify-center"
        >
          <span className="text-white/90 text-2xl font-medium">
            {isSpinning ? "..." : "Invoquer"}
          </span>
          <div className="absolute inset-0 rounded-full 
                       bg-[#00C1A0]/10 group-hover:bg-[#00C1A0]/20 
                       animate-ping" />
        </button>
      </div>

      {/* Description du jeu sélectionné */}
      {selectedGame && showDescription && (
        <div className="max-w-4xl w-full mx-auto text-center animate-fadeIn"> {/* Augmenté de 3xl à 4xl */}
  <div className="bg-black/40 backdrop-blur-sm rounded-xl p-12 border border-[#00C1A0]/30"> {/* Padding augmenté */}
    <h2 className="text-5xl font-bold mb-8" style={{ color: selectedGame.colors.light }}> {/* Taille augmentée */}
      {selectedGame.name}
    </h2>
    
    <p className="text-3xl mb-10 text-white/90">{selectedGame.shortDesc}</p> {/* Taille augmentée */}

    {selectedGame.preparation.length > 0 && (
      <div className="mb-8"> {/* Espacement augmenté */}
        <h3 className="text-2xl font-bold mb-4 text-white">PRÉPARATION :</h3>
        <ul className="space-y-3 text-xl"> {/* Taille et espacement augmentés */}
          {selectedGame.preparation.map((prep, index) => (
            <li key={index} className="text-white/80">{prep}</li>
          ))}
        </ul>
      </div>
    )}

    <div className="mb-8">
      <h3 className="text-2xl font-bold mb-4 text-white">{selectedGame.rules.title} :</h3>
      {selectedGame.rules.content && (
        <p className="mb-4 text-xl text-white/80">{selectedGame.rules.content}</p>
      )}
      <ul className="space-y-3 text-xl">
        {selectedGame.rules.details.map((detail, index) => (
          <li key={index} className="text-white/80">{detail}</li>
        ))}
      </ul>
    </div>

    <div className="mt-10 p-6 bg-black/30 rounded-lg"> {/* Padding augmenté */}
      <h3 className="text-2xl font-bold mb-3 text-white">AVERTISSEMENT :</h3>
      <p className="text-xl text-white/80">{selectedGame.warning}</p>
    </div>
  </div>
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