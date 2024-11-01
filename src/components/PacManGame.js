import React, { useEffect, useRef, useState, useCallback } from 'react';
import GameOverModal from './GameOverModal';
import HighScoresTable from './HighScoresTable';

const PacManGame = ({ onScoreUpdate }) => {
  // ===========================================
  // Constants
  // ===========================================
  const CELL_SIZE = 20;
  const WALL_THICKNESS = 3;
  const NEON_BLUR = 20;
  const CORNER_RADIUS = CELL_SIZE / 3;
  const MOVEMENT_SPEED = 200;

  const DIRECTIONS = {
    RIGHT: 'right',
    LEFT: 'left',
    UP: 'up',
    DOWN: 'down'
  };

  const CELL_TYPES = {
    WALL: 0,
    GOMME: 1,
    EMPTY: 2,
    GHOST_WALL: 3,
    GHOST_DOOR: 4,
    SUPER_POINT: 5,
    FRUIT: 6
  };

  const GAME_STATES = {
    WAITING: 'waiting',
    PLAYING: 'playing',
    PAUSED: 'paused',
    GAME_OVER: 'game_over'
  };

  const POINTS = {
    GOMME: 10,
    SUPER_POINT: 50,
    FRUIT: 100
  };
  
  const COLORS = {
    WALL: '#00C1A0',
    WALL_GLOW: '#00C1A0',
    PACMAN: '#FFFF00',
    POINTS: '#FFFFFF',
    BACKGROUND: '#000000',
  };

  const AMICHETTE_COLORS = [
    { path: '/images/Âmichettes Charly/Amichette_Rouge.gif', color: 'red' },
    { path: '/images/Âmichettes Charly/Amichette_Bleu.gif', color: 'blue' },
    { path: '/images/Âmichettes Charly/Amichette_Verte.gif', color: 'green' },
    { path: '/images/Âmichettes Charly/Amichette_Mauve.gif', color: 'purple' },
    { path: '/images/Âmichettes Charly/Amichette_Doré.gif', color: 'gold' }
  ];

// ===========================================
// Map du labyrinthe
// ===========================================
const MAZE_MAP = [
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0],
  [0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0],  
  [0, 5, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 5, 0], 
  [0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0],
  [0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 6, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0],
  [0, 1, 0, 0, 0, 0, 1, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 1, 0, 0, 0, 0, 1, 0],
  [0, 1, 0, 0, 0, 0, 1, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 1, 0, 0, 0, 0, 1, 0],
  [0, 1, 1, 1, 1, 1, 1, 0, 0, 1, 1, 1, 1, 0, 0, 1, 1, 1, 1, 0, 0, 1, 1, 1, 1, 0, 0, 1, 1, 1, 1, 0, 0, 1, 1, 1, 1, 0, 0, 1, 1, 1, 1, 0, 0, 1, 1, 1, 1, 1, 1, 0],
  [0, 0, 0, 0, 0, 0, 1, 0, 0, 6, 0, 0, 1, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 1, 0, 0, 1, 0, 0, 1, 1, 1, 1, 1, 1, 1, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 1, 1, 1, 1, 1, 1, 1, 0, 0, 1, 0, 0, 1, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 1, 3, 3, 3, 4, 4, 3, 3, 3, 1, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 1, 3, 2, 2, 2, 2, 2, 2, 3, 1, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 0, 0, 0, 0],
  [2, 2, 2, 2, 2, 2, 1, 1, 1, 1, 1, 1, 1, 0, 0, 1, 1, 1, 1, 1, 1, 1, 3, 2, 2, 2, 2, 2, 2, 3, 1, 1, 1, 1, 1, 1, 1, 0, 0, 1, 1, 1, 1, 1, 1, 1, 2, 2, 2, 2, 2, 2],
  [0, 0, 0, 0, 0, 0, 1, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 3, 2, 2, 2, 2, 2, 2, 3, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 1, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 1, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 3, 2, 2, 2, 2, 2, 2, 3, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 1, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 1, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 1, 3, 3, 3, 3, 3, 3, 3, 3, 1, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 1, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 1, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 1, 0, 0, 0, 0, 0, 0], 
  [0, 0, 0, 0, 0, 0, 1, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 1, 0, 0, 0, 0, 0, 0],
  [0, 1, 1, 1, 1, 1, 1, 1 ,1, 1, 1, 1, 1, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0],
  [0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0],
  [0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0],
  [0, 5, 1, 1, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 6, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 1, 1, 1, 0],
  [0, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 0],
  [0, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 0], 
  [0, 1, 1, 1, 1, 1, 1, 0, 0, 1, 1, 1, 1, 0, 0, 1, 1, 1, 1, 0, 0, 1, 1, 1, 1, 0, 0, 1, 1, 1, 1, 0, 0, 1, 1, 1, 1, 0, 0, 1, 1, 1, 1, 0, 0, 1, 1, 1, 1, 1, 5, 0],
  [0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0],
  [0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 6, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0], 
  [0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
];

  // ===========================================
  // Refs
  // ===========================================
  const canvasRef = useRef(null);
  const animationFrameRef = useRef(null);
  const doorImageRef = useRef(null);
  const amichetteImagesRef = useRef({});

  // ===========================================
  // États
  // ===========================================
  const [gameStarted, setGameStarted] = useState(false);
  const [gameState, setGameState] = useState(GAME_STATES.WAITING); // Ajout de l'état manquant
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(3);
  const [level, setLevel] = useState(1);
  const [showGameOver, setShowGameOver] = useState(false);
  const [fruitColor, setFruitColor] = useState(() => 
    AMICHETTE_COLORS[Math.floor(Math.random() * AMICHETTE_COLORS.length)]
  
  );
  
  const [pacman, setPacman] = useState({
    x: 1,
    y: 1,
    direction: DIRECTIONS.RIGHT,
    nextDirection: null
  });

  const [ghosts, setGhosts] = useState([]);
  const [ghostsVulnerable, setGhostsVulnerable] = useState(false);
  const [gameGrid, setGameGrid] = useState(() => {
    return JSON.parse(JSON.stringify(MAZE_MAP));
  });

  const [highScores, setHighScores] = useState(() => {
    const saved = localStorage.getItem('pacmanHighScores');
    return saved ? JSON.parse(saved) : [];
  });

  // Partie 2
  // ===========================================
  // Gestion des mouvements et collisions
  // ===========================================
  const handleKeyDown = useCallback((e) => {
    if (!gameStarted) return;
    
    if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.key)) {
      e.preventDefault();
    }

    let newDirection = null;
    switch (e.key) {
      case 'ArrowRight':
        newDirection = DIRECTIONS.RIGHT;
        break;
      case 'ArrowLeft':
        newDirection = DIRECTIONS.LEFT;
        break;
      case 'ArrowUp':
        newDirection = DIRECTIONS.UP;
        break;
      case 'ArrowDown':
        newDirection = DIRECTIONS.DOWN;
        break;
      default:
        return;
    }

    setPacman(prev => ({
      ...prev,
      nextDirection: newDirection
    }));
  }, [gameStarted]);

  const checkItemCollision = useCallback(() => {
    const cellX = Math.floor(pacman.x);
    const cellY = Math.floor(pacman.y);

    if (cellY >= 0 && cellY < gameGrid.length && cellX >= 0 && cellX < gameGrid[0].length) {
      const cell = gameGrid[cellY][cellX];

      if (cell === CELL_TYPES.GOMME || cell === CELL_TYPES.SUPER_POINT || cell === CELL_TYPES.FRUIT) {
        let points = 0;

        switch (cell) {
          case CELL_TYPES.GOMME:
            points = POINTS.GOMME;
            break;
          case CELL_TYPES.SUPER_POINT:
            points = POINTS.SUPER_POINT;
            setGhostsVulnerable(true);
            setTimeout(() => setGhostsVulnerable(false), 10000);
            break;
          case CELL_TYPES.FRUIT:
            points = POINTS.FRUIT;
            break;
          default:
            break;
        }

        setScore(prev => prev + points);
        setGameGrid(prevGrid => {
          const newGrid = [...prevGrid];
          newGrid[cellY][cellX] = CELL_TYPES.EMPTY;
          return newGrid;
        });
      }
    }
  }, [pacman, gameGrid]);

  useEffect(() => {
    if (gameStarted) {
      checkItemCollision();
    }
  }, [pacman.x, pacman.y, gameStarted, checkItemCollision]);

  useEffect(() => {
    if (gameStarted) {
      window.addEventListener('keydown', handleKeyDown);
      return () => window.removeEventListener('keydown', handleKeyDown);
    }
  }, [gameStarted, handleKeyDown]);

  const isValidMove = (x, y) => {
    if (x < 0 || y < 0 || y >= gameGrid.length || x >= gameGrid[0].length) return false;
    return gameGrid[y][x] !== CELL_TYPES.WALL && gameGrid[y][x] !== CELL_TYPES.GHOST_WALL;
  };

  const getNextPosition = (x, y, direction) => {
    switch (direction) {
      case DIRECTIONS.RIGHT:
        return { x: x + 1, y };
      case DIRECTIONS.LEFT:
        return { x: x - 1, y };
      case DIRECTIONS.UP:
        return { x, y: y - 1 };
      case DIRECTIONS.DOWN:
        return { x, y: y + 1 };
      default:
        return { x, y };
    }
  };

  useEffect(() => {
    if (!gameStarted) return;

    const moveInterval = setInterval(() => {
      setPacman(prev => {
        if (prev.nextDirection) {
          const nextPos = getNextPosition(prev.x, prev.y, prev.nextDirection);
          if (isValidMove(nextPos.x, nextPos.y)) {
            return {
              ...nextPos,
              direction: prev.nextDirection,
              nextDirection: null
            };
          }
        }

        const nextPos = getNextPosition(prev.x, prev.y, prev.direction);
        if (isValidMove(nextPos.x, nextPos.y)) {
          return {
            ...prev,
            ...nextPos
          };
        }

        return prev;
      });
    }, MOVEMENT_SPEED);

    return () => clearInterval(moveInterval);
  }, [gameStarted]);

  // Partie 3
// ===========================================
// Initialisation et Animations
// ===========================================
useEffect(() => {
  // Chargement des images
  const doorImage = new Image();
  doorImage.src = '/images/Assets pour Soul Eater/Blue_Flame.gif';
  doorImageRef.current = doorImage;

  AMICHETTE_COLORS.forEach(color => {
    const img = new Image();
    img.src = color.path;
    amichetteImagesRef.current[color.path] = img;
  });
}, []);

// ===========================================
// Fonctions de rendu
// ===========================================

const getWallNeighbors = (grid, x, y) => {
  const isWall = (x, y) => {
    if (x < 0 || y < 0 || y >= grid.length || x >= grid[0].length) return false;
    return grid[y][x] === CELL_TYPES.WALL || grid[y][x] === CELL_TYPES.GHOST_WALL;
  };

  return {
    top: isWall(x, y - 1),
    bottom: isWall(x, y + 1),
    left: isWall(x - 1, y),
    right: isWall(x + 1, y),
    topLeft: isWall(x - 1, y - 1),
    topRight: isWall(x + 1, y - 1),
    bottomLeft: isWall(x - 1, y + 1),
    bottomRight: isWall(x + 1, y + 1)
  };
};

const drawWalls = (ctx) => {
  ctx.strokeStyle = COLORS.WALL;
  ctx.lineWidth = WALL_THICKNESS;
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';
  ctx.shadowColor = COLORS.WALL_GLOW;
  ctx.shadowBlur = NEON_BLUR;

  const isWall = (x, y) => {
    if (x < 0 || y < 0 || y >= gameGrid.length || x >= gameGrid[0].length) return false;
    return gameGrid[y][x] === CELL_TYPES.WALL || gameGrid[y][x] === CELL_TYPES.GHOST_WALL;
  };

  const findNextPoint = (x, y, visited) => {
    const directions = [
      [0, -1], // haut
      [1, 0],  // droite
      [0, 1],  // bas
      [-1, 0]  // gauche
    ];

    for (const [dx, dy] of directions) {
      const newX = x + dx;
      const newY = y + dy;
      const key = `${newX},${newY}`;
      
      if (isWall(newX, newY) && !visited.has(key)) {
        return [newX, newY];
      }
    }
    return null;
  };

  const traceShape = (startX, startY) => {
    const visited = new Set();
    const path = [];
    let currentX = startX;
    let currentY = startY;

    while (true) {
      const key = `${currentX},${currentY}`;
      if (visited.has(key)) break;

      visited.add(key);
      path.push([currentX, currentY]);

      const nextPoint = findNextPoint(currentX, currentY, visited);
      if (!nextPoint) break;

      [currentX, currentY] = nextPoint;
    }

    if (path.length > 0) {
      ctx.beginPath();
      
      // Points de départ pour le tracé
      const startPoint = path[0];
      ctx.moveTo(startPoint[0] * CELL_SIZE + CELL_SIZE/2, startPoint[1] * CELL_SIZE + CELL_SIZE/2);

      for (let i = 1; i < path.length; i++) {
        const [x, y] = path[i];
        const prevX = path[i-1][0];
        const prevY = path[i-1][1];

        if (x !== prevX && y !== prevY) {
          const cpX = prevX * CELL_SIZE + CELL_SIZE/2;
          const cpY = y * CELL_SIZE + CELL_SIZE/2;
          ctx.quadraticCurveTo(
            cpX,
            cpY,
            x * CELL_SIZE + CELL_SIZE/2,
            y * CELL_SIZE + CELL_SIZE/2
          );
        } else {
          ctx.lineTo(x * CELL_SIZE + CELL_SIZE/2, y * CELL_SIZE + CELL_SIZE/2);
        }
      }

      // Vérification de la fermeture du chemin
      const startPos = path[0];
      const endPos = path[path.length - 1];
      
      if (Math.abs(startPos[0] - endPos[0]) <= 1 && Math.abs(startPos[1] - endPos[1]) <= 1) {
        ctx.closePath();
      }

      ctx.stroke();
    }
  };

  const visited = new Set();
  for (let y = 0; y < gameGrid.length; y++) {
    for (let x = 0; x < gameGrid[0].length; x++) {
      const key = `${x},${y}`;
      if (isWall(x, y) && !visited.has(key)) {
        traceShape(x, y);
        let current = [x, y];
        while (current) {
          visited.add(`${current[0]},${current[1]}`);
          current = findNextPoint(current[0], current[1], visited);
        }
      }
    }
  }
};

const drawPacMan = (ctx) => {
  const x = pacman.x * CELL_SIZE + CELL_SIZE/2;
  const y = pacman.y * CELL_SIZE + CELL_SIZE/2;
  const radius = CELL_SIZE/2 - 2;
  const mouthAngle = 0.2 * Math.PI;

  ctx.save();
  ctx.translate(x, y);
  
  const rotationAngles = {
    'right': 0,
    'up': -Math.PI/2,
    'left': Math.PI,
    'down': Math.PI/2
  };
  ctx.rotate(rotationAngles[pacman.direction] || 0);

  ctx.fillStyle = COLORS.PACMAN;
  ctx.shadowColor = COLORS.PACMAN;
  ctx.shadowBlur = NEON_BLUR / 2;
  ctx.beginPath();
  ctx.arc(0, 0, radius, mouthAngle, 2 * Math.PI - mouthAngle);
  ctx.lineTo(0, 0);
  ctx.fill();

  ctx.restore();
};

const drawSpecialElements = (ctx) => {
  const timestamp = Date.now();

  for (let y = 0; y < gameGrid.length; y++) {
    for (let x = 0; x < gameGrid[0].length; x++) {
      const cell = gameGrid[y][x];
      const centerX = x * CELL_SIZE + CELL_SIZE/2;
      const centerY = y * CELL_SIZE + CELL_SIZE/2;
      const cellX = x * CELL_SIZE;
      const cellY = y * CELL_SIZE;

      switch (cell) {
        case CELL_TYPES.GOMME:
          ctx.fillStyle = COLORS.POINTS;
          ctx.beginPath();
          ctx.arc(centerX, centerY, 3, 0, Math.PI * 2);
          ctx.fill();
          break;

        case CELL_TYPES.SUPER_POINT:
          const pulseScale = 1 + Math.sin(timestamp / 200) * 0.2;
          ctx.fillStyle = COLORS.POINTS;
          ctx.beginPath();
          ctx.arc(centerX, centerY, 10 * pulseScale, 0, Math.PI * 2);
          ctx.fill();
          ctx.shadowColor = COLORS.POINTS;
          ctx.shadowBlur = 8;
          ctx.fill();
          ctx.shadowBlur = 0;
          break;

        case CELL_TYPES.GHOST_DOOR:
          if (doorImageRef.current && doorImageRef.current.complete) {
            // Dessiner la porte avec une taille légèrement plus grande
            const doorScale = 1.2;
            const doorSize = CELL_SIZE * doorScale;
            const doorOffsetX = (doorSize - CELL_SIZE) / 2;
            const doorOffsetY = (doorSize - CELL_SIZE) / 2;
            
            ctx.drawImage(
              doorImageRef.current,
              cellX - doorOffsetX,
              cellY - doorOffsetY,
              doorSize,
              doorSize
            );
          }
          break;

        case CELL_TYPES.FRUIT:
          const floatOffset = Math.sin(timestamp / 500) * 3;
          const amichetteImg = amichetteImagesRef.current[fruitColor.path];
          
          if (amichetteImg && amichetteImg.complete) {
            const scale = 0.8;
            const adjustedSize = CELL_SIZE * scale;
            const offsetX = (adjustedSize - CELL_SIZE) / 2;
            const offsetY = (adjustedSize - CELL_SIZE) / 3;
            
            ctx.drawImage(
              amichetteImg,
              cellX - offsetX,
              cellY + floatOffset - offsetY,
              adjustedSize,
              adjustedSize
            );
          }
          break;
      }
    }
  }
};

// ===========================================
// Game Loop
// ===========================================
useEffect(() => {
  if (gameState !== GAME_STATES.PLAYING) return;

  const canvas = canvasRef.current;
  if (!canvas) return;
  
  const ctx = canvas.getContext('2d');
  
  // Ajustement de la taille du canvas
  const container = canvas.parentElement;
  const containerWidth = container.clientWidth;
  const containerHeight = container.clientHeight;

  const gridWidth = gameGrid[0].length * CELL_SIZE;
  const gridHeight = gameGrid.length * CELL_SIZE;

  canvas.style.width = '100%';
  canvas.style.height = '100%';
  canvas.width = containerWidth * window.devicePixelRatio;
  canvas.height = containerHeight * window.devicePixelRatio;

  ctx.scale(
    (containerWidth / gridWidth) * window.devicePixelRatio,
    (containerHeight / gridHeight) * window.devicePixelRatio
  );

  const gameLoop = () => {
    if (gameState !== GAME_STATES.PLAYING) return;

    ctx.clearRect(0, 0, gridWidth, gridHeight);
    ctx.fillStyle = COLORS.BACKGROUND;
    ctx.fillRect(0, 0, gridWidth, gridHeight);
    
    drawWalls(ctx);
    drawSpecialElements(ctx);
    drawPacMan(ctx);

    animationFrameRef.current = requestAnimationFrame(gameLoop);
  };

  gameLoop();

  return () => {
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
    }
  };
}, [gameState, gameGrid, pacman]);

// ===========================================
// Effet de pause
// ===========================================
useEffect(() => {
  if (gameState === GAME_STATES.PAUSED) {
    const ctx = canvasRef.current?.getContext('2d');
    if (ctx) {
      // Ajout d'un overlay semi-transparent
      ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
      ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);

      // Texte PAUSE
      const centerX = ctx.canvas.width / (2 * window.devicePixelRatio);
      const centerY = ctx.canvas.height / (2 * window.devicePixelRatio);

      ctx.save();
      ctx.scale(1/window.devicePixelRatio, 1/window.devicePixelRatio);
      ctx.fillStyle = '#00C1A0';
      ctx.font = '48px Arial';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('PAUSE', centerX * window.devicePixelRatio, centerY * window.devicePixelRatio);
      ctx.restore();
    }
  }
}, [gameState]);

// Partie 4
// ===========================================
// Gestion du jeu
// ===========================================
const startGame = () => {
  console.log('Démarrage du jeu');
  setGameGrid(JSON.parse(JSON.stringify(MAZE_MAP)));
  setPacman({
    x: 1,
    y: 1,
    direction: DIRECTIONS.RIGHT,
    nextDirection: null
  });
  setScore(0);
  setLives(3);
  setLevel(1);
  setGameStarted(true);
  setGameState(GAME_STATES.PLAYING);
};

const togglePause = () => {
  setGameState(prev => 
    prev === GAME_STATES.PLAYING ? GAME_STATES.PAUSED : GAME_STATES.PLAYING
  );
};

const handleGameOver = () => {
  setShowGameOver(true);
  setGameState(GAME_STATES.GAME_OVER);
  setGameStarted(false);
  if (animationFrameRef.current) {
    cancelAnimationFrame(animationFrameRef.current);
  }
};

const handleScoreSubmit = (newScore) => {
  const updatedScores = [...highScores, newScore]
    .sort((a, b) => b.score - a.score)
    .slice(0, 5);
  
  setHighScores(updatedScores);
  localStorage.setItem('pacmanHighScores', JSON.stringify(updatedScores));
  setShowGameOver(false);
  setScore(0);
  setLives(3);
  setLevel(1);
  setGameState(GAME_STATES.WAITING);
};

const resumeGame = () => {
  if (gameState === GAME_STATES.PAUSED) {
    setGameState(GAME_STATES.PLAYING);
  }
};

// ===========================================
// Gestion des niveaux
// ===========================================
const checkLevelCompletion = useCallback(() => {
  const hasRemainingDots = gameGrid.some(row => 
    row.some(cell => cell === CELL_TYPES.GOMME || cell === CELL_TYPES.SUPER_POINT)
  );

  if (!hasRemainingDots) {
    setLevel(prev => prev + 1);
    startNextLevel();
  }
}, [gameGrid]);

const startNextLevel = () => {
  setGameGrid(JSON.parse(JSON.stringify(MAZE_MAP)));
  setPacman({
    x: 1,
    y: 1,
    direction: DIRECTIONS.RIGHT,
    nextDirection: null
  });
};

// ===========================================
// Gestion des vies
// ===========================================
const loseLife = () => {
  setLives(prev => prev - 1);
  if (lives <= 1) {
    handleGameOver();
  } else {
    resetPosition();
  }
};

const resetPosition = () => {
  setPacman({
    x: 1,
    y: 1,
    direction: DIRECTIONS.RIGHT,
    nextDirection: null
  });
};

// Partie 5
// ===========================================
// Rendu du composant
// ===========================================
return (
  <div className="flex flex-col items-center gap-4 p-4">
    <div className="w-full max-w-[1200px]">
      {/* Section d'information du jeu */}
      <div className="flex justify-center items-center mb-6 bg-black/40 backdrop-blur-sm p-4 rounded-xl border border-[#00C1A0]/30">
        <div className="grid grid-cols-3 gap-16 text-2xl font-bold">
          <div className="text-center">
            <span className="text-[#00C1A0]">Score: {score}</span>
          </div>
          <div className="text-center">
            <span className="text-[#00C1A0]">Vies: {lives}</span>
          </div>
          <div className="text-center">
            <span className="text-[#00C1A0]">Niveau: {level}</span>
          </div>
        </div>
      </div>

      {/* Zone de jeu */}
      <div className="aspect-[4/3] relative mb-6">
        <canvas
          ref={canvasRef}
          className="border-4 border-[#00C1A0] rounded-xl bg-black 
                    shadow-[0_0_30px_rgba(0,193,160,0.3)]
                    absolute top-0 left-0 w-full h-full"
        />

        {/* Overlay de pause */}
        {gameState === GAME_STATES.PAUSED && (
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm 
                         flex flex-col items-center justify-center">
            <h2 className="text-6xl font-bold text-[#00C1A0] mb-8">PAUSE</h2>
            <p className="text-white text-xl mb-4">
              Appuyez sur Échap pour continuer
            </p>
            <button
              onClick={resumeGame}
              className="px-8 py-4 text-xl bg-[#00C1A0] text-black rounded-xl 
                        hover:bg-[#00D9B5] transition-colors
                        shadow-[0_0_20px_rgba(0,193,160,0.3)]"
            >
              Reprendre
            </button>
          </div>
        )}
      </div>

      {/* Bouton de démarrage */}
      {gameState === GAME_STATES.WAITING && (
        <div className="flex justify-center mt-6">
          <button 
            onClick={startGame}
            className="px-8 py-4 text-xl bg-[#00C1A0] text-black rounded-xl 
                      hover:bg-[#00D9B5] transition-colors
                      shadow-[0_0_20px_rgba(0,193,160,0.3)]"
          >
            Commencer
          </button>
        </div>
      )}
    </div>

    {/* Table des scores */}
    <div className="w-full max-w-[1200px]">
      <HighScoresTable scores={highScores} />
    </div>

    {/* Modal de fin de partie */}
    {showGameOver && (
      <GameOverModal
        score={score}
        onSubmit={handleScoreSubmit}
        onClose={() => setShowGameOver(false)}
      />
    )}
  </div>
);
};

export default PacManGame;