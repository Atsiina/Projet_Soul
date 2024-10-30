import React, { useState, useEffect, useCallback } from 'react';

const SoulEaterGameComponent = ({ onScoreUpdate }) => {
  // Configuration du jeu
  const CELL_SIZE = 25;
  const GRID_SIZE = 28;
  const GAME_SPEED = 250;
  const GHOST_BASE_SPEED = 400;

  // Assets paths
  const ASSETS = {
    player: {
      normal: '/images/Assets pour Soul Eater/SoulEvansWin.png',
      eating: '/images/Assets pour Soul Eater/SoulEvansCrunch.png'
    },
    ghosts: {
      blue: '/images/Assets pour Soul Eater/Soul_Eater_Logo_VBleu_avec_âmichette_bleu.gif',
      gold: '/images/Assets pour Soul Eater/Soul_Eater_Logo_VDoré_avec_âmichette_doré.gif',
      purple: '/images/Assets pour Soul Eater/Soul_Eater_Logo_VMauve_avec_âmichette_mauve.gif',
      green: '/images/Assets pour Soul Eater/Soul_Eater_Logo_VVert_avec_âmichette_verte.gif'
    }
  };

  // Configuration des âmes
  const SOUL_TYPES = {
    SMALL: {
      type: 'small',
      points: 1,
      image: '/images/Âmichettes Charly/Amichette_Verte.gif',
      size: 'w-4/5 h-4/5'
    },
    BLUE: {
      type: 'blue',
      points: 10,
      image: '/images/Âmichettes Charly/Amichette_Bleu.gif',
      size: 'w-3/4 h-3/4'
    },
    PURPLE: {
      type: 'purple',
      points: 15,
      image: '/images/Âmichettes Charly/Amichette_Mauve.gif',
      size: 'w-3/4 h-3/4'
    },
    RED: {
      type: 'red',
      points: 25,
      image: '/images/Âmichettes Charly/Amichette_Rouge.gif',
      size: 'w-3/4 h-3/4'
    },
    GOLD: {
      type: 'gold',
      points: 50,
      image: '/images/Âmichettes Charly/Amichette_Doré.gif',
      size: 'w-3/4 h-3/4'
    }
  };

  // Configuration des fantômes
  const GHOST_CONFIG = {
    BLUE: {
      name: 'blue',
      image: ASSETS.ghosts.blue,
      behavior: 'follower',
      speed: 0.5,
      startPos: { x: 13, y: 11 }
    },
    GOLD: {
      name: 'gold',
      image: ASSETS.ghosts.gold,
      behavior: 'ambusher',
      speed: 0.45,
      startPos: { x: 14, y: 11 }
    },
    PURPLE: {
      name: 'purple',
      image: ASSETS.ghosts.purple,
      behavior: 'strategic',
      speed: 0.4,
      startPos: { x: 13, y: 12 }
    },
    GREEN: {
      name: 'green',
      image: ASSETS.ghosts.green,
      behavior: 'random',
      speed: 0.35,
      startPos: { x: 14, y: 12 }
    }
  };

  // États du jeu
  const [gameState, setGameState] = useState({
    grid: [],
    player: {
      x: 14,
      y: 23,
      direction: 'left',
      nextDirection: 'left',
      isEating: false,
      powerMode: false
    },
    ghosts: [],
    score: 0,
    isPlaying: false,
    level: 1,
    remainingSouls: 0
  });

  const [requestedDirection, setRequestedDirection] = useState(null);

  // Partie 2
  // Fonctions utilitaires
  const countRemainingSouls = useCallback((grid) => {
    return grid.reduce((total, row) => 
      total + row.reduce((rowTotal, cell) => 
        rowTotal + (cell > 1 ? 1 : 0), 0
      ), 0
    );
  }, []);

  const isValidMove = useCallback((x, y) => {
    if (y < 0 || y >= GRID_SIZE || x < 0 || x >= GRID_SIZE) return false;
    return gameState.grid[y][x] !== 0;
  }, [gameState.grid, GRID_SIZE]);

  const getRotationStyle = (direction) => {
    switch (direction) {
      case 'up':
        return 'rotate(270deg)';
      case 'down':
        return 'rotate(90deg)';
      case 'left':
        return 'rotate(0deg)';
      case 'right':
        return 'rotate(0deg) scaleX(-1)';
      default:
        return 'rotate(0deg)';
    }
  };

  const createMaze = useCallback(() => {
    const baseLayout = [
      [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
      [0,2,2,2,2,2,2,2,2,2,2,2,2,0,0,2,2,2,2,2,2,2,2,2,2,2,2,0],
      [0,2,0,0,0,0,2,0,0,0,0,0,2,0,0,2,0,0,0,0,0,2,0,0,0,0,2,0],
      [0,3,0,0,0,0,2,0,0,0,0,0,2,0,0,2,0,0,0,0,0,2,0,0,0,0,3,0],
      [0,2,0,0,0,0,2,0,0,0,0,0,2,0,0,2,0,0,0,0,0,2,0,0,0,0,2,0],
      [0,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,0],
      [0,2,0,0,0,0,2,0,0,2,0,0,0,0,0,0,0,0,2,0,0,2,0,0,0,0,2,0],
      [0,2,0,0,0,0,2,0,0,2,0,0,0,0,0,0,0,0,2,0,0,2,0,0,0,0,2,0],
      [0,2,2,2,2,2,2,0,0,2,2,2,2,0,0,2,2,2,2,0,0,2,2,2,2,2,2,0],
      [0,0,0,0,0,0,2,0,0,0,0,0,1,0,0,1,0,0,0,0,0,2,0,0,0,0,0,0],
      [0,0,0,0,0,0,2,0,0,0,0,0,1,0,0,1,0,0,0,0,0,2,0,0,0,0,0,0],
      [0,0,0,0,0,0,2,0,0,1,1,1,1,1,1,1,1,1,1,0,0,2,0,0,0,0,0,0],
      [0,0,0,0,0,0,2,0,0,1,0,0,0,0,0,0,0,0,1,0,0,2,0,0,0,0,0,0],
      [0,0,0,0,0,0,2,1,1,1,0,1,1,1,1,1,1,0,1,1,1,2,0,0,0,0,0,0],
      [0,0,0,0,0,0,2,0,0,1,0,1,1,1,1,1,1,0,1,0,0,2,0,0,0,0,0,0],
      [0,0,0,0,0,0,2,0,0,1,0,0,0,0,0,0,0,0,1,0,0,2,0,0,0,0,0,0],
      [0,0,0,0,0,0,2,0,0,1,1,1,1,1,1,1,1,1,1,0,0,2,0,0,0,0,0,0],
      [0,0,0,0,0,0,2,0,0,1,0,0,0,0,0,0,0,0,1,0,0,2,0,0,0,0,0,0],
      [0,0,0,0,0,0,2,1,1,1,1,1,1,0,0,1,1,1,1,1,1,2,0,0,0,0,0,0],
      [0,2,2,2,2,2,2,2,2,2,2,2,2,0,0,2,2,2,2,2,2,2,2,2,2,2,2,0],
      [0,2,0,0,0,0,2,0,0,0,0,0,2,0,0,2,0,0,0,0,0,2,0,0,0,0,2,0],
      [0,2,0,0,0,0,2,0,0,0,0,0,2,0,0,2,0,0,0,0,0,2,0,0,0,0,2,0],
      [0,3,2,2,0,0,2,2,2,2,2,2,2,1,1,2,2,2,2,2,2,2,0,0,2,2,3,0],
      [0,0,0,2,0,0,2,0,0,2,0,0,0,0,0,0,0,0,2,0,0,2,0,0,2,0,0,0],
      [0,0,0,2,0,0,2,0,0,2,0,0,0,0,0,0,0,0,2,0,0,2,0,0,2,0,0,0],
      [0,2,2,2,2,2,2,0,0,2,2,2,2,0,0,2,2,2,2,0,0,2,2,2,2,2,2,0],
      [0,2,0,0,0,0,0,0,0,0,0,0,2,0,0,2,0,0,0,0,0,0,0,0,0,0,2,0],
      [0,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,0],
      [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]
    ];

    // Ajouter les âmes spéciales de manière aléatoire
    const maze = baseLayout.map(row => [...row]);
    let specialSoulsCount = 0;
    const maxSpecialSouls = 4;

    while (specialSoulsCount < maxSpecialSouls) {
      const x = Math.floor(Math.random() * GRID_SIZE);
      const y = Math.floor(Math.random() * GRID_SIZE);
      if (maze[y][x] === 2) {
        maze[y][x] = 4 + specialSoulsCount; // 4=bleu, 5=mauve, 6=rouge, 7=doré
        specialSoulsCount++;
      }
    }

    return maze;
  }, [GRID_SIZE]);

  // Initialisation du jeu
  const initGame = useCallback(() => {
    const maze = createMaze();
    const initialGhosts = Object.values(GHOST_CONFIG).map(ghost => ({
      ...ghost,
      x: ghost.startPos.x,
      y: ghost.startPos.y,
      direction: 'up',
      isVulnerable: false
    }));

    setGameState(prev => ({
      ...prev,
      grid: maze,
      player: {
        x: 14,
        y: 23,
        direction: 'left',
        nextDirection: 'left',
        isEating: false,
        powerMode: false
      },
      ghosts: initialGhosts,
      score: 0,
      isPlaying: true,
      level: 1,
      remainingSouls: countRemainingSouls(maze)
    }));
  }, [createMaze, GHOST_CONFIG, countRemainingSouls]);

// Partie 3
// Logique de mouvement des fantômes
const moveGhostToTarget = useCallback((ghost, target) => {
  const possibleMoves = [
    { x: ghost.x - 1, y: ghost.y, dir: 'left' },
    { x: ghost.x + 1, y: ghost.y, dir: 'right' },
    { x: ghost.x, y: ghost.y - 1, dir: 'up' },
    { x: ghost.x, y: ghost.y + 1, dir: 'down' }
  ].filter(move => isValidMove(move.x, move.y));

  if (possibleMoves.length === 0) return ghost;

  // Calcul de la meilleure direction selon la distance
  const bestMove = possibleMoves.reduce((best, move) => {
    const distance = Math.hypot(move.x - target.x, move.y - target.y);
    return distance < best.distance ? { ...move, distance } : best;
  }, { ...possibleMoves[0], distance: Infinity });

  return {
    ...ghost,
    x: bestMove.x,
    y: bestMove.y,
    direction: bestMove.dir
  };
}, [isValidMove]);

const moveGhostAway = useCallback((ghost, player) => {
  const possibleMoves = [
    { x: ghost.x - 1, y: ghost.y, dir: 'left' },
    { x: ghost.x + 1, y: ghost.y, dir: 'right' },
    { x: ghost.x, y: ghost.y - 1, dir: 'up' },
    { x: ghost.x, y: ghost.y + 1, dir: 'down' }
  ].filter(move => isValidMove(move.x, move.y));

  if (possibleMoves.length === 0) return ghost;

  // Choix du mouvement qui éloigne le plus du joueur
  const bestMove = possibleMoves.reduce((best, move) => {
    const distance = Math.hypot(move.x - player.x, move.y - player.y);
    return distance > best.distance ? { ...move, distance } : best;
  }, { ...possibleMoves[0], distance: -Infinity });

  return {
    ...ghost,
    x: bestMove.x,
    y: bestMove.y,
    direction: bestMove.dir
  };
}, [isValidMove]);

const moveGhostStrategic = useCallback((ghost, player, ghosts) => {
  const blueGhost = ghosts.find(g => g.name === 'blue');
  if (!blueGhost) return moveGhostToTarget(ghost, player);

  // Position stratégique basée sur la position du fantôme bleu
  const targetPos = {
    x: player.x + (blueGhost.x - player.x) / 2,
    y: player.y + (blueGhost.y - player.y) / 2
  };

  return moveGhostToTarget(ghost, targetPos);
}, [moveGhostToTarget]);

const moveGhostRandom = useCallback((ghost) => {
  const possibleMoves = [
    { x: ghost.x - 1, y: ghost.y, dir: 'left' },
    { x: ghost.x + 1, y: ghost.y, dir: 'right' },
    { x: ghost.x, y: ghost.y - 1, dir: 'up' },
    { x: ghost.x, y: ghost.y + 1, dir: 'down' }
  ].filter(move => isValidMove(move.x, move.y));

  if (possibleMoves.length === 0) return ghost;

  // Sélection aléatoire d'une direction possible
  const randomMove = possibleMoves[Math.floor(Math.random() * possibleMoves.length)];
  
  return {
    ...ghost,
    x: randomMove.x,
    y: randomMove.y,
    direction: randomMove.dir
  };
}, [isValidMove]);

const moveGhosts = useCallback(() => {
  setGameState(prev => ({
    ...prev,
    ghosts: prev.ghosts.map(ghost => {
      // Si vulnérable, fuir le joueur
      if (ghost.isVulnerable) {
        return moveGhostAway(ghost, prev.player);
      }

      // Comportement spécifique selon le type de fantôme
      switch (ghost.behavior) {
        case 'follower': // Bleu - poursuite directe
          return moveGhostToTarget(ghost, prev.player);
        
        case 'ambusher': // Doré - anticipation
          const anticipatedPos = {
            x: prev.player.x + (prev.player.direction === 'right' ? 4 : 
                prev.player.direction === 'left' ? -4 : 0),
            y: prev.player.y + (prev.player.direction === 'down' ? 4 : 
                prev.player.direction === 'up' ? -4 : 0)
          };
          return moveGhostToTarget(ghost, anticipatedPos);
        
        case 'strategic': // Mauve - stratégie combinée
          return moveGhostStrategic(ghost, prev.player, prev.ghosts);
        
        case 'random': // Vert - comportement aléatoire
          return Math.random() < 0.3 ? 
                 moveGhostRandom(ghost) : 
                 moveGhostToTarget(ghost, prev.player);
        
        default:
          return ghost;
      }
    })
  }));
}, [moveGhostAway, moveGhostToTarget, moveGhostRandom, moveGhostStrategic]);

// Gestion des collisions avec les fantômes
const checkGhostCollisions = useCallback(() => {
  const { player, ghosts } = gameState;
  const collision = ghosts.find(ghost => 
    ghost.x === player.x && ghost.y === player.y
  );

  if (collision) {
    if (player.powerMode) {
      // Le joueur mange le fantôme
      setGameState(prev => ({
        ...prev,
        score: prev.score + 200,
        ghosts: prev.ghosts.map(ghost => 
          ghost === collision ? {
            ...ghost,
            x: ghost.startPos.x,
            y: ghost.startPos.y,
            isVulnerable: false
          } : ghost
        )
      }));
    } else {
      // Game Over
      setGameState(prev => ({
        ...prev,
        isPlaying: false
      }));
    }
  }
}, [gameState]);

// Partie 4
// Gestion du mouvement du joueur
const movePlayer = useCallback(() => {
  const { player } = gameState;
  let newX = player.x;
  let newY = player.y;
  let newDirection = player.direction;

  // Vérifier d'abord si la direction demandée est possible
  if (requestedDirection) {
    switch (requestedDirection) {
      case 'up':
        if (isValidMove(player.x, player.y - 1)) {
          newY -= 1;
          newDirection = 'up';
          setRequestedDirection(null);
        }
        break;
      case 'down':
        if (isValidMove(player.x, player.y + 1)) {
          newY += 1;
          newDirection = 'down';
          setRequestedDirection(null);
        }
        break;
      case 'left':
        if (isValidMove(player.x - 1, player.y)) {
          newX -= 1;
          newDirection = 'left';
          setRequestedDirection(null);
        }
        break;
      case 'right':
        if (isValidMove(player.x + 1, player.y)) {
          newX += 1;
          newDirection = 'right';
          setRequestedDirection(null);
        }
        break;
    }
  }

  // Si pas de nouvelle direction, continuer dans la direction actuelle
  if (newX === player.x && newY === player.y) {
    switch (player.direction) {
      case 'up':
        if (isValidMove(player.x, player.y - 1)) newY -= 1;
        break;
      case 'down':
        if (isValidMove(player.x, player.y + 1)) newY += 1;
        break;
      case 'left':
        if (isValidMove(player.x - 1, player.y)) newX -= 1;
        break;
      case 'right':
        if (isValidMove(player.x + 1, player.y)) newX += 1;
        break;
    }
  }

  // Gestion des tunnels
  if (newX < 0) newX = GRID_SIZE - 1;
  if (newX >= GRID_SIZE) newX = 0;

  // Vérification de la collecte d'âmes
  const cellContent = gameState.grid[newY][newX];
  let isEating = false;
  let powerMode = player.powerMode;
  let score = gameState.score;
  let remainingSouls = gameState.remainingSouls;

  if (cellContent > 1) {
    isEating = true;
    switch (cellContent) {
      case 2: // Petite âme verte
        score += SOUL_TYPES.SMALL.points;
        remainingSouls--;
        break;
      case 3: // Power âme
        powerMode = true;
        score += 50;
        remainingSouls--;
        // Désactiver le power mode après un délai
        setTimeout(() => {
          setGameState(prev => ({
            ...prev,
            player: { ...prev.player, powerMode: false },
            ghosts: prev.ghosts.map(ghost => ({ ...ghost, isVulnerable: false }))
          }));
        }, 8000);
        // Rendre les fantômes vulnérables
        setGameState(prev => ({
          ...prev,
          ghosts: prev.ghosts.map(ghost => ({ ...ghost, isVulnerable: true }))
        }));
        break;
      case 4: // Âme bleue
        score += SOUL_TYPES.BLUE.points;
        remainingSouls--;
        break;
      case 5: // Âme mauve
        score += SOUL_TYPES.PURPLE.points;
        remainingSouls--;
        break;
      case 6: // Âme rouge
        score += SOUL_TYPES.RED.points;
        remainingSouls--;
        break;
      case 7: // Âme dorée
        score += SOUL_TYPES.GOLD.points;
        remainingSouls--;
        break;
    }

    // Animation de manger
    setTimeout(() => {
      setGameState(prev => ({
        ...prev,
        player: { ...prev.player, isEating: false }
      }));
    }, 100);
  }

  // Mise à jour de l'état du jeu
  setGameState(prev => ({
    ...prev,
    player: {
      ...prev.player,
      x: newX,
      y: newY,
      direction: newDirection,
      isEating,
      powerMode
    },
    grid: prev.grid.map((row, y) => 
      row.map((cell, x) => 
        x === newX && y === newY ? 1 : cell
      )
    ),
    score,
    remainingSouls
  }));

  // Notification du score
  onScoreUpdate(score);

  // Vérification de la fin du niveau
  if (remainingSouls === 0) {
    setTimeout(() => {
      setGameState(prev => ({
        ...prev,
        level: prev.level + 1,
        isPlaying: false
      }));
    }, 500);
  }
}, [gameState, requestedDirection, isValidMove, GRID_SIZE, SOUL_TYPES, onScoreUpdate]);

// Gestion des événements
useEffect(() => {
  const handleKeyPress = (e) => {
    if (!gameState.isPlaying) return;

    switch (e.key) {
      case 'ArrowUp':
        setRequestedDirection('up');
        e.preventDefault();
        break;
      case 'ArrowDown':
        setRequestedDirection('down');
        e.preventDefault();
        break;
      case 'ArrowLeft':
        setRequestedDirection('left');
        e.preventDefault();
        break;
      case 'ArrowRight':
        setRequestedDirection('right');
        e.preventDefault();
        break;
    }
  };

  window.addEventListener('keydown', handleKeyPress);
  return () => window.removeEventListener('keydown', handleKeyPress);
}, [gameState.isPlaying]);

// Boucle principale du jeu
useEffect(() => {
  if (!gameState.isPlaying) return;

  const playerLoop = setInterval(movePlayer, GAME_SPEED);
  const ghostLoop = setInterval(moveGhosts, GAME_SPEED * 1.5);
  const collisionLoop = setInterval(checkGhostCollisions, GAME_SPEED / 2);

  return () => {
    clearInterval(playerLoop);
    clearInterval(ghostLoop);
    clearInterval(collisionLoop);
  };
}, [gameState.isPlaying, movePlayer, moveGhosts, checkGhostCollisions, GAME_SPEED]);
return (

// Partie 5 (rendu)
// Rendu du jeu
  <div className="relative z-10 mx-auto mt-8 bg-black/50 backdrop-blur-sm rounded-xl p-4 border border-[#00C1A0]/30">
    {/* Container du jeu */}
    <div 
      className="relative mx-auto bg-black/50 backdrop-blur-sm rounded-xl p-8 border border-[#00C1A0]/30"
      style={{
        width: `${Math.min(CELL_SIZE * GRID_SIZE + 200, window.innerWidth - 32)}px`,
        maxWidth: '1400px',
        margin: '0 auto'
      }}
    >
      {/* Titre du jeu */}
      <h1 className="text-6xl font-bold text-[#00C1A0] text-center mb-8">Soul Eater Game</h1>

      {/* Grille de jeu */}
      <div 
        className="relative mx-auto"
        style={{
          width: `${CELL_SIZE * GRID_SIZE}px`,
          height: `${CELL_SIZE * GRID_SIZE}px`,
          backgroundColor: '#000',
          border: '2px solid #00C1A0',
          borderRadius: '8px',
          overflow: 'hidden'
        }}
      >
        {/* Murs et chemins */}
        {gameState.grid.map((row, y) => (
          row.map((cell, x) => (
            <div
              key={`${x}-${y}`}
              className={`absolute ${cell === 0 ? 'bg-[#00755E]' : ''}`}
              style={{
                left: `${x * CELL_SIZE}px`,
                top: `${y * CELL_SIZE}px`,
                width: `${CELL_SIZE}px`,
                height: `${CELL_SIZE}px`,
              }}
            >
              {/* Rendu des âmes */}
              {cell > 1 && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <img
                    src={
                      cell === 2 ? SOUL_TYPES.SMALL.image :
                      cell === 3 ? SOUL_TYPES.GOLD.image :
                      cell === 4 ? SOUL_TYPES.BLUE.image :
                      cell === 5 ? SOUL_TYPES.PURPLE.image :
                      cell === 6 ? SOUL_TYPES.RED.image :
                      SOUL_TYPES.GOLD.image
                    }
                    alt="Soul"
                    className={`
                      ${cell === 2 ? SOUL_TYPES.SMALL.size : 'w-4/5 h-4/5'}
                      object-contain
                      transform-gpu
                    `}
                  />
                </div>
              )}
            </div>
          ))
        ))}

        {/* Soul Evans */}
        <div
          className="absolute transition-all duration-100"
          style={{
            left: `${gameState.player.x * CELL_SIZE}px`,
            top: `${gameState.player.y * CELL_SIZE}px`,
            width: `${CELL_SIZE}px`,
            height: `${CELL_SIZE}px`,
            transform: getRotationStyle(gameState.player.direction),
            transformOrigin: 'center',
            zIndex: 20
          }}
        >
          <img
            src={gameState.player.isEating ? ASSETS.player.eating : ASSETS.player.normal}
            alt="Soul Evans"
            className="w-full h-full object-contain"
          />
        </div>

        {/* Fantômes */}
        {gameState.ghosts.map((ghost) => (
          <div
            key={ghost.name}
            className="absolute transition-all duration-100"
            style={{
              left: `${ghost.x * CELL_SIZE}px`,
              top: `${ghost.y * CELL_SIZE}px`,
              width: `${CELL_SIZE}px`,
              height: `${CELL_SIZE}px`,
              filter: ghost.isVulnerable ? 'brightness(0.5)' : 'none',
              transform: `scale(1.2)`,
              zIndex: 10
            }}
          >
            <img
              src={ghost.image}
              alt={`Ghost ${ghost.name}`}
              className="w-full h-full object-contain"
            />
          </div>
        ))}
      </div>

      {/* Score et niveau */}
      <div className="flex justify-between items-center mt-4 px-4">
        <div className="text-[#00C1A0] text-2xl font-bold">Level: {gameState.level}</div>
        <div className="text-[#00C1A0] text-2xl font-bold">Score: {gameState.score}</div>
      </div>
    </div>

    {/* Écran de démarrage / Game Over */}
    {!gameState.isPlaying && (
      <div className="absolute inset-0 flex items-center justify-center bg-black/80 backdrop-blur-sm z-50">
        <div className="text-center p-8 bg-black/50 rounded-xl border border-[#00C1A0]/30">
          <h2 className="text-4xl font-bold text-[#00C1A0] mb-4">
            {gameState.score > 0 ? 'Game Over!' : 'Soul Eater Game'}
          </h2>
          {gameState.score > 0 && (
            <p className="text-2xl text-white mb-4">Score Final: {gameState.score}</p>
          )}
          <button
            onClick={initGame}
            className="px-8 py-4 bg-[#00C1A0] text-white text-xl font-bold rounded-lg
                    hover:bg-[#00D9B5] transition-colors duration-300
                    shadow-lg hover:shadow-[#00C1A0]/50"
          >
            {gameState.score > 0 ? 'Réessayer' : 'Commencer'}
          </button>
        </div>
      </div>
    )}

    {/* Styles CSS */}
    <style jsx>{`
      @keyframes float {
        0%, 100% { transform: translateY(0); }
        50% { transform: translateY(-5px); }
      }

      @keyframes blink {
        0%, 100% { opacity: 1; }
        50% { opacity: 0.5; }
      }

      .animate-float {
        animation: float 2s ease-in-out infinite;
      }

      .ghost-vulnerable {
        animation: blink 0.5s ease-in-out infinite;
      }
    `}</style>
  </div>
);
};

export default SoulEaterGameComponent;