import React, { useEffect, useRef, useState } from 'react';

const PacManGame = ({ onScoreUpdate }) => {
  // Constants
  const CELL_SIZE = 15;
  const WALL_THICKNESS = 2; // Épaisseur réduite des murs
  const NEON_BLUR = 4;     // Intensité de l'effet néon
  const COLORS = {
    WALL: '#0000FF',           // Bleu principal pour les murs
    WALL_GLOW: '#4444FF',      // Lueur des murs
    PACMAN: '#FFFF00',         // Jaune pour Pacman
    POINTS: '#FFFFFF',         // Blanc pour les points
    BACKGROUND: '#000000',     // Noir pour le fond
  };

  // États
  const canvasRef = useRef(null);
  const [gameStarted, setGameStarted] = useState(false);
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(3);
  const [level, setLevel] = useState(1);

  // Position initiale de Pac-Man
  const [pacman, setPacman] = useState({ x: 26, y: 23, direction: 'right' });

  // Positions des fantômes
  const [ghosts, setGhosts] = useState([
    { x: 25, y: 11, direction: 'up', color: '#FF0000' },
    { x: 24, y: 13, direction: 'up', color: '#00FFFF' },
    { x: 25, y: 13, direction: 'up', color: '#FFB8FF' },
    { x: 26, y: 13, direction: 'up', color: '#FFB852' }
  ]);

  // Configuration du canvas
  const CANVAS_WIDTH = CELL_SIZE * MAZE_MAP[0].length;
  const CANVAS_HEIGHT = CELL_SIZE * MAZE_MAP.length + 40; // +40 pour la zone de score

  useEffect(() => {
    if (!gameStarted) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    
    // Configuration HD
    const scale = window.devicePixelRatio;
    canvas.style.width = CANVAS_WIDTH + 'px';
    canvas.style.height = CANVAS_HEIGHT + 'px';
    canvas.width = CANVAS_WIDTH * scale;
    canvas.height = CANVAS_HEIGHT * scale;
    ctx.scale(scale, scale);

    let animationFrameId;
    let lastTimestamp = 0;
    const FPS = 60;
    const frameInterval = 1000 / FPS;

    const gameLoop = (timestamp) => {
      if (timestamp - lastTimestamp >= frameInterval) {
        lastTimestamp = timestamp;
        
        // Effacer et redessiner
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        drawGame(ctx);
      }
      
      animationFrameId = requestAnimationFrame(gameLoop);
    };

    gameLoop();
    return () => cancelAnimationFrame(animationFrameId);
  }, [gameStarted]);

  // Fonction principale de dessin
  const drawGame = (ctx) => {
    drawBackground(ctx);
    drawMaze(ctx);
    drawPacMan(ctx);
    drawGhosts(ctx);
    drawStats(ctx);
  };

  // Dessin du fond
  const drawBackground = (ctx) => {
    ctx.fillStyle = COLORS.BACKGROUND;
    ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
  };

  // Dessin du labyrinthe avec effet néon
  const drawMaze = (ctx) => {
    // Fonction pour trouver les groupes de murs connectés
    const findWallGroups = () => {
      const visited = new Set();
      const groups = [];
  
      const findGroup = (startX, startY) => {
        const group = [];
        const stack = [{x: startX, y: startY}];
        
        while (stack.length > 0) {
          const {x, y} = stack.pop();
          const key = `${x},${y}`;
          
          if (visited.has(key)) continue;
          
          visited.add(key);
          group.push({x, y});
          
          // Vérifier les cellules adjacentes (y compris en diagonale)
          for (let dx = -1; dx <= 1; dx++) {
            for (let dy = -1; dy <= 1; dy++) {
              const newX = x + dx;
              const newY = y + dy;
              
              if (newX >= 0 && newX < MAZE_MAP[0].length &&
                  newY >= 0 && newY < MAZE_MAP.length &&
                  MAZE_MAP[newY][newX] === 0 &&
                  !visited.has(`${newX},${newY}`)) {
                stack.push({x: newX, y: newY});
              }
            }
          }
        }
        
        return group;
      };
  
      // Parcourir la grille pour trouver tous les groupes
      for (let y = 0; y < MAZE_MAP.length; y++) {
        for (let x = 0; x < MAZE_MAP[0].length; x++) {
          const key = `${x},${y}`;
          if (!visited.has(key) && MAZE_MAP[y][x] === 0) {
            groups.push(findGroup(x, y));
          }
        }
      }
  
      return groups;
    };
  
    // Fonction pour dessiner le contour d'un groupe
    const drawGroupOutline = (group) => {
      const points = [];
      const radius = 8; // Rayon des coins arrondis
      
      // Trouver les points du contour
      const minX = Math.min(...group.map(p => p.x));
      const maxX = Math.max(...group.map(p => p.x));
      const minY = Math.min(...group.map(p => p.y));
      const maxY = Math.max(...group.map(p => p.y));
  
      // Configuration du style
      ctx.strokeStyle = '#00C1A0';
      ctx.lineWidth = 2;
      ctx.lineJoin = 'round';
      ctx.lineCap = 'round';
      
      // Dessiner le contour avec coins arrondis
      ctx.beginPath();
      
      // Point de départ
      ctx.moveTo((minX * CELL_SIZE) + radius, minY * CELL_SIZE);
      
      // Côté supérieur
      ctx.lineTo((maxX * CELL_SIZE) + CELL_SIZE - radius, minY * CELL_SIZE);
      ctx.quadraticCurveTo(
        (maxX * CELL_SIZE) + CELL_SIZE,
        minY * CELL_SIZE,
        (maxX * CELL_SIZE) + CELL_SIZE,
        minY * CELL_SIZE + radius
      );
      
      // Côté droit
      ctx.lineTo((maxX * CELL_SIZE) + CELL_SIZE, (maxY * CELL_SIZE) + CELL_SIZE - radius);
      ctx.quadraticCurveTo(
        (maxX * CELL_SIZE) + CELL_SIZE,
        (maxY * CELL_SIZE) + CELL_SIZE,
        (maxX * CELL_SIZE) + CELL_SIZE - radius,
        (maxY * CELL_SIZE) + CELL_SIZE
      );
      
      // Côté inférieur
      ctx.lineTo((minX * CELL_SIZE) + radius, (maxY * CELL_SIZE) + CELL_SIZE);
      ctx.quadraticCurveTo(
        minX * CELL_SIZE,
        (maxY * CELL_SIZE) + CELL_SIZE,
        minX * CELL_SIZE,
        (maxY * CELL_SIZE) + CELL_SIZE - radius
      );
      
      // Côté gauche
      ctx.lineTo(minX * CELL_SIZE, minY * CELL_SIZE + radius);
      ctx.quadraticCurveTo(
        minX * CELL_SIZE,
        minY * CELL_SIZE,
        (minX * CELL_SIZE) + radius,
        minY * CELL_SIZE
      );
  
      // Effet néon
      ctx.shadowColor = '#00C1A0';
      ctx.shadowBlur = 15;
      ctx.stroke();
  
      // Effet de brillance
      ctx.shadowBlur = 0;
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 1;
      ctx.globalAlpha = 0.3;
      ctx.stroke();
      ctx.globalAlpha = 1.0;
    };
  
    // Dessiner le fond
    ctx.fillStyle = '#000000';
    ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
  
    // Trouver et dessiner les groupes de murs
    const wallGroups = findWallGroups();
    wallGroups.forEach(group => drawGroupOutline(group));
  
    // Dessiner les points et super-points
    MAZE_MAP.forEach((row, y) => {
      row.forEach((cell, x) => {
        const blockX = x * CELL_SIZE;
        const blockY = y * CELL_SIZE;
  
        if (cell === 1) { // Point normal
          ctx.fillStyle = '#FFFFFF';
          ctx.beginPath();
          ctx.arc(
            blockX + CELL_SIZE/2,
            blockY + CELL_SIZE/2,
            2,
            0,
            Math.PI * 2
          );
          ctx.fill();
        } else if (cell === 4) { // Super point
          ctx.fillStyle = '#FFFFFF';
          ctx.beginPath();
          ctx.arc(
            blockX + CELL_SIZE/2,
            blockY + CELL_SIZE/2,
            6,
            0,
            Math.PI * 2
          );
          ctx.fill();
        }
      });
    });
  };

  // Dessin de Pac-Man
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
    ctx.beginPath();
    ctx.arc(0, 0, radius, mouthAngle, 2 * Math.PI - mouthAngle);
    ctx.lineTo(0, 0);
    ctx.fill();

    ctx.restore();
  };

  // Dessin des fantômes
  const drawGhosts = (ctx) => {
    ghosts.forEach(ghost => {
      const x = ghost.x * CELL_SIZE;
      const y = ghost.y * CELL_SIZE;

      // Corps du fantôme avec effet de lueur
      ctx.shadowColor = ghost.color;
      ctx.shadowBlur = NEON_BLUR;
      ctx.fillStyle = ghost.color;

      ctx.beginPath();
      ctx.arc(
        x + CELL_SIZE/2,
        y + CELL_SIZE/2 - 2,
        CELL_SIZE/2 - 2,
        Math.PI,
        0,
        false
      );

      // Base ondulée
      const waveHeight = 3;
      ctx.lineTo(x + CELL_SIZE, y + CELL_SIZE - 2);
      for (let i = 0; i < 3; i++) {
        const curveX = x + CELL_SIZE * (1 - i/3);
        ctx.quadraticCurveTo(
          curveX - CELL_SIZE/6,
          y + CELL_SIZE + waveHeight - 2,
          curveX - CELL_SIZE/3,
          y + CELL_SIZE - 2
        );
      }
      ctx.lineTo(x, y + CELL_SIZE/2 - 2);
      ctx.fill();

      // Réinitialiser l'effet de lueur
      ctx.shadowBlur = 0;

      // Yeux
      ctx.fillStyle = 'white';
      const eyeSize = 3;
      ctx.beginPath();
      ctx.arc(x + CELL_SIZE/3, y + CELL_SIZE/2, eyeSize, 0, Math.PI * 2);
      ctx.arc(x + 2*CELL_SIZE/3, y + CELL_SIZE/2, eyeSize, 0, Math.PI * 2);
      ctx.fill();

      // Pupilles
      ctx.fillStyle = 'blue';
      const pupilSize = 1.5;
      ctx.beginPath();
      ctx.arc(x + CELL_SIZE/3, y + CELL_SIZE/2, pupilSize, 0, Math.PI * 2);
      ctx.arc(x + 2*CELL_SIZE/3, y + CELL_SIZE/2, pupilSize, 0, Math.PI * 2);
      ctx.fill();
    });
  };

  // Dessin des statistiques
  const drawStats = (ctx) => {
    ctx.fillStyle = COLORS.BACKGROUND;
    ctx.fillRect(0, CANVAS_HEIGHT - 40, CANVAS_WIDTH, 40);
    
    ctx.fillStyle = COLORS.POINTS;
    ctx.font = '20px Arial';
    ctx.textAlign = 'left';
    ctx.fillText(`Score: ${score}`, 10, CANVAS_HEIGHT - 15);
    
    ctx.textAlign = 'center';
    ctx.fillText(`Level ${level}`, CANVAS_WIDTH/2, CANVAS_HEIGHT - 15);
    
    for (let i = 0; i < lives; i++) {
      const x = CANVAS_WIDTH - 30 - (i * 30);
      const y = CANVAS_HEIGHT - 20;
      
      ctx.fillStyle = COLORS.PACMAN;
      ctx.beginPath();
      ctx.arc(x, y, 8, 0.2 * Math.PI, 1.8 * Math.PI);
      ctx.lineTo(x, y);
      ctx.fill();
    }
  };

  // Rendu du composant
  return (
    <div className="flex flex-col items-center gap-4">
      <canvas
        ref={canvasRef}
        className="border-2 border-[#00C1A0] rounded-lg"
        style={{
          maxWidth: '100%',
          height: 'auto',
          backgroundColor: COLORS.BACKGROUND
        }}
      />
      
      {!gameStarted ? (
        <button 
          onClick={() => setGameStarted(true)}
          className="px-6 py-2 bg-[#00C1A0] text-black rounded-lg 
                    hover:bg-[#00D9B5] transition-colors"
        >
          Commencer
        </button>
      ) : (
        <div className="flex gap-4">
          <div className="text-xl text-[#00C1A0]">Score: {score}</div>
          <div className="text-xl text-[#00C1A0]">Vies: {lives}</div>
          <div className="text-xl text-[#00C1A0]">Niveau: {level}</div>
        </div>
      )}
    </div>
  );
};

// Définition de la carte du labyrinthe
const MAZE_MAP = [
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0],
    [0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0],  
    [0, 4, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 4, 0], 
    [0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0],
    [0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0],
    [0, 1, 0, 0, 0, 0, 1, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 1, 0, 0, 0, 0, 1, 0],
    [0, 1, 0, 0, 0, 0, 1, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 1, 0, 0, 0, 0, 1, 0],
    [0, 1, 1, 1, 1, 1, 1, 0, 0, 1, 1, 1, 1, 0, 0, 1, 1, 1, 1, 0, 0, 1, 1, 1, 1, 0, 0, 1, 1, 1, 1, 0, 0, 1, 1, 1, 1, 0, 0, 1, 1, 1, 1, 0, 0, 1, 1, 1, 1, 1, 1, 0],
    [0, 0, 0, 0, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 1, 0, 0, 1, 0, 0, 1, 1, 1, 1, 1, 1, 1, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 1, 1, 1, 1, 1, 1, 1, 0, 0, 1, 0, 0, 1, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 1, 3, 3, 3, 3, 3, 3, 3, 3, 1, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 0, 0, 0, 0],
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
    [0, 4, 1, 1, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 1, 1, 1, 0],
    [0, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 0],
    [0, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 0], 
    [0, 1, 1, 1, 1, 1, 1, 0, 0, 1, 1, 1, 1, 0, 0, 1, 1, 1, 1, 0, 0, 1, 1, 1, 1, 0, 0, 1, 1, 1, 1, 0, 0, 1, 1, 1, 1, 0, 0, 1, 1, 1, 1, 0, 0, 1, 1, 1, 1, 1, 1, 0],
    [0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0],
    [0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0], 
    [0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  ];

  export default PacManGame;