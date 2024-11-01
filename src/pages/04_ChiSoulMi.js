import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import GameTitle from '../components/GameTitle';
import GameDescription from '../components/GameDescription';
import ApiService from '../services/api';
import ScrollbarTheme from '../components/ScrollbarTheme';

const ChiSoulMiPage = () => {
  // Constantes
  const MATCH_DURATION = 5 * 60; // 5 minutes en secondes
  const ROUND_DURATION = 5; // 5 secondes par round

  // Configuration des couleurs
  const gameColors = {
    main: '#8F0016',
    light: '#B30025',
    dark: '#6B0011',
    gradient: 'linear-gradient(135deg, #B30025, #8F0016, #6B0011)'
  };

  // Configuration des choix
  const choices = [
    { id: 'scissors', image: '/images/Icône du Chi Soul Mi/Ciseaux.png', label: 'Ciseaux', beats: ['lizard', 'paper'] },
    { id: 'paper', image: '/images/Icône du Chi Soul Mi/Papier.png', label: 'Papier', beats: ['rock', 'spock'] },
    { id: 'rock', image: '/images/Icône du Chi Soul Mi/Pierre.png', label: 'Pierre', beats: ['lizard', 'scissors'] },
    { id: 'lizard', image: '/images/Icône du Chi Soul Mi/Lezard.png', label: 'Lézard', beats: ['paper', 'spock'] },
    { id: 'spock', image: '/images/Icône du Chi Soul Mi/Spock.png', label: 'Spock', beats: ['rock', 'scissors'] }
  ];

  // États du jeu
  const [gameType, setGameType] = useState('local');
  const [duelState, setDuelState] = useState({
    id: null,
    status: 'waiting',
    playerRole: null,
    currentChoice: null,
    opponentChoice: null,
    timeLeft: 5,
    roundNumber: 1,
    scores: { player: 0, opponent: 0 }
  });

  // États pour les timers
  const [globalTimer, setGlobalTimer] = useState(MATCH_DURATION);
  const [roundTimer, setRoundTimer] = useState(ROUND_DURATION);
  const [timerActive, setTimerActive] = useState(false);

  // États pour le duel
  const [countdown, setCountdown] = useState(null);
  const [roundResult, setRoundResult] = useState(null);
  const [inviteCode, setInviteCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [duelStatus, setDuelStatus] = useState(null);

  // Contexte d'authentification
  const { user } = useAuth();

  // Effets
  
  useEffect(() => {
  let pollInterval;
  if (duelState.id && duelState.id !== 'local' && duelState.status !== 'completed') {
    pollInterval = setInterval(async () => {
      try {
        const response = await fetch(
          `http://localhost:8080/api/games/chisoulmi/duels/${duelState.id}`,
          {
            headers: {
              'Authorization': `Bearer ${localStorage.getItem('token')}`,
              'Accept': 'application/json'
            },
            mode: 'cors',
            credentials: 'include'
          }
        );

        if (!response.ok) {
          throw new Error('Erreur lors du polling');
        }

        const duel = await response.json();
        updateDuelState(duel);
      } catch (error) {
        console.error('Erreur de polling:', error);
      }
    }, 1000);
  }
  return () => clearInterval(pollInterval);
}, [duelState.id, duelState.status]);

  useEffect(() => {
    let timerInterval;
    if (timerActive && globalTimer > 0) {
      timerInterval = setInterval(() => {
        setGlobalTimer(prev => {
          if (prev <= 1) {
            endDuelByTimeout();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timerInterval);
  }, [timerActive, globalTimer]);

  // Effet pour le timer de round
  useEffect(() => {
    let roundTimerInterval;
    if (duelState.status === 'playing' && !duelState.currentChoice && roundTimer > 0) {
      roundTimerInterval = setInterval(() => {
        setRoundTimer(prev => {
          if (prev <= 1) {
            // Faire un choix aléatoire si le temps est écoulé
            const randomChoice = choices[Math.floor(Math.random() * choices.length)];
            makeChoice(randomChoice.id);
            return ROUND_DURATION;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(roundTimerInterval);
  }, [duelState.status, duelState.currentChoice, roundTimer]);

  // Formattage du temps
  const formatTime = (timeInSeconds) => {
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = timeInSeconds % 60;
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  useEffect(() => {
    let countdownTimer;
    if (gameType === 'online' && duelState.status === 'playing' && !duelState.currentChoice) {
      setCountdown(5);
      countdownTimer = setInterval(() => {
        setCountdown(prev => {
          if (prev <= 1) {
            clearInterval(countdownTimer);
            if (!duelState.currentChoice) {
              const randomChoice = choices[Math.floor(Math.random() * choices.length)];
              makeChoice(randomChoice.id);
            }
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(countdownTimer);
  }, [duelState.status, duelState.currentChoice, gameType]);


  const endDuelByTimeout = async () => {
  if (!duelState.id || duelState.id === 'local') return;
  
  setTimerActive(false);
  try {
    const result = await ApiService.endDuelByTimeout(duelState.id);
    setDuelState(prev => ({
      ...prev,
      status: 'completed',
      winnerId: result.winnerId
    }));
  } catch (error) {
    console.error('Erreur:', error);
    setError(error.message);
  }
};
  // Fonctions pour le mode local
  const makeLocalChoice = (player, choiceId) => {
    if (player === 'player1') {
      setDuelState(prev => ({
        ...prev,
        currentChoice: choiceId,
        status: 'player2Turn'
      }));
    } else {
      setDuelState(prev => ({
        ...prev,
        opponentChoice: choiceId,
        status: 'resolving'
      }));
      resolveLocalRound(duelState.currentChoice, choiceId);
    }
  };

  const resolveLocalRound = (player1Choice, player2Choice) => {
    const p1Choice = choices.find(c => c.id === player1Choice);
    const p2Choice = choices.find(c => c.id === player2Choice);

    let result;
    if (player1Choice === player2Choice) {
      result = 'tie';
    } else if (p1Choice.beats.includes(p2Choice.id)) {
      result = 'player1';
      setDuelState(prev => ({
        ...prev,
        scores: {
          ...prev.scores,
          player: prev.scores.player + 1
        }
      }));
    } else {
      result = 'player2';
      setDuelState(prev => ({
        ...prev,
        scores: {
          ...prev.scores,
          opponent: prev.scores.opponent + 1
        }
      }));
    }

    setRoundResult(result);

    setTimeout(() => {
      if (duelState.scores.player === 3 || duelState.scores.opponent === 3) {
        setDuelState(prev => ({
          ...prev,
          status: 'completed'
        }));
      } else {
        setDuelState(prev => ({
          ...prev,
          currentChoice: null,
          opponentChoice: null,
          status: 'player1Turn',
          roundNumber: prev.roundNumber + 1
        }));
        setRoundResult(null);
      }
    }, 2000);
  };

  const startLocalGame = () => {
    setDuelState({
      id: 'local',
      status: 'player1Turn',
      playerRole: 'local',
      currentChoice: null,
      opponentChoice: null,
      timeLeft: 5,
      roundNumber: 1,
      scores: { player: 0, opponent: 0 }
    });
    setRoundResult(null);
  };

  const resetLocalGame = () => {
    setDuelState({
      id: null,
      status: 'waiting',
      playerRole: null,
      currentChoice: null,
      opponentChoice: null,
      timeLeft: 5,
      roundNumber: 1,
      scores: { player: 0, opponent: 0 }
    });
    setRoundResult(null);
  };

  // Fonctions pour le mode en ligne
  
const createDuel = async () => {
  if (isLoading) return;
  
  setIsLoading(true);
  setError(null);
  
  try {
    const duel = await ApiService.createDuel();
    setDuelStatus({ type: 'created', code: duel.inviteCode });
    setDuelState({
      ...duelState,
      id: duel.id,
      status: 'waiting',
      playerRole: 'creator'
    });
  } catch (error) {
    console.error('Erreur:', error);
    setError(error.message);
  } finally {
    setIsLoading(false);
  }
};


  const joinDuel = async () => {
    if (isLoading || !inviteCode) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await fetch('http://localhost:8080/api/games/chisoulmi/duels/join', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ inviteCode })
      });

      if (!response.ok) {
        throw new Error('Erreur lors de la connexion au duel');
      }

      const duel = await response.json();
      console.log('Duel rejoint:', duel);

      setDuelStatus({ type: 'joined' });
      updateDuelState(duel);
    } catch (error) {
      console.error('Erreur:', error);
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const makeChoice = async (choiceId) => {
  if (!duelState.id || duelState.id === 'local' || duelState.currentChoice) return;

  try {
    const updatedDuel = await ApiService.makeChoice(duelState.id, choiceId);
    if (updatedDuel) {
      updateDuelState(updatedDuel);
    }
  } catch (error) {
    console.error('Erreur:', error);
    setError(error.message);
  }
};


  const updateDuelState = (duel) => {
    const userId = user?.id;
    const isCreator = duel.creatorId === userId;
    
    console.log('Mise à jour du duel:', {
      duelId: duel.id,
      status: duel.status,
      creatorId: duel.creatorId,
      opponentId: duel.opponentId,
      userId: userId,
      isCreator: isCreator
    });

    let gameStatus = duel.status;
    if (duel.status === 'pending') {
      gameStatus = 'waiting';
    } else if (duel.status === 'active') {
      gameStatus = 'playing';
    }

    setDuelState(prev => ({
      ...prev,
      id: duel.id,
      status: gameStatus,
      playerRole: isCreator ? 'creator' : 'opponent',
      currentChoice: isCreator ? duel.creatorChoice : duel.opponentChoice,
      opponentChoice: isCreator ? duel.opponentChoice : duel.creatorChoice,
      winnerId: duel.winnerId,
      scores: {
        player: isCreator ? duel.creatorScore : duel.opponentScore,
        opponent: isCreator ? duel.opponentScore : duel.creatorScore
      }
    }));

    if (duel.status === 'active') {
      setDuelStatus({ type: 'playing' });
    }
  };

  // Composants d'interface
  const OnlineGameInterface = () => {
  if (!duelState.id) return null;

  return (
    <div className="w-full max-w-4xl mx-auto p-6 bg-black/30 rounded-xl">
      <div className="text-center mb-8">
        <h3 className="text-2xl font-bold mb-2" style={{ color: gameColors.light }}>
          {getStatusMessage()}
        </h3>
        {duelState.status === 'waiting' && duelStatus?.code && (
          <div className="mt-4">
            <p className="text-xl mb-2">Code d'invitation :</p>
            <div className="flex items-center justify-center gap-2">
              <span className="text-2xl font-bold text-red-500">
                {duelStatus.code}
              </span>
              <button
                onClick={() => {
                  navigator.clipboard.writeText(duelStatus.code);
                  alert('Code copié !');
                }}
                className="p-2 rounded-lg bg-red-900/20 border-2 border-red-500/30 
                         hover:border-red-500 transition-all duration-300"
              >
                Copier
              </button>
            </div>
            <p className="mt-4 text-gray-400">
              Partagez ce code avec votre adversaire pour qu'il puisse vous rejoindre
            </p>
            <div className="mt-6 animate-bounce">
              <img 
                src="/images/Âmichettes Charly/Amichette_Rouge.gif"
                alt="Waiting animation"
                className="w-16 h-16 mx-auto"
              />
            </div>
          </div>
        )}
        {countdown > 0 && (
          <div className="text-4xl font-bold" style={{ color: gameColors.light }}>
            {countdown}
          </div>
        )}
      </div>

      {/* Interface de jeu existante... */}
      {duelState.status === 'playing' && (
        <div className="grid grid-cols-5 gap-4">
          {choices.map((choice) => (
            <button
              key={choice.id}
              onClick={() => makeChoice(choice.id)}
              disabled={duelState.currentChoice || duelState.status !== 'playing'}
              className={`p-4 rounded-xl transition-all duration-300 
                       ${duelState.currentChoice === choice.id 
                         ? 'bg-red-500/30 border-2 border-red-500' 
                         : 'bg-black/30 border-2 border-transparent hover:border-red-500'}`}
            >
              <img 
                src={choice.image}
                alt={choice.label}
                className="w-full h-32 object-contain mb-2"
              />
              <div className="text-lg font-medium">{choice.label}</div>
            </button>
          ))}
        </div>
      )}

      {/* Affichage des scores */}
      {duelState.status === 'playing' && (
        <div className="mt-6 flex justify-between px-8">
          <div className="text-xl">
            <span className="font-bold">Score :</span> {duelState.scores.player}
          </div>
          <div className="text-xl">
            <span className="font-bold">Round :</span> {duelState.roundNumber}/3
          </div>
        </div>
      )}

      {/* Message de fin */}
      {duelState.status === 'completed' && (
        <div className="mt-8 text-center">
          <h4 className="text-3xl font-bold mb-4" style={{ color: gameColors.light }}>
            {duelState.winnerId === user?.id ? 'Victoire !' : 'Défaite...'}
          </h4>
          <button
            onClick={() => {
              setDuelState({
                id: null,
                status: 'waiting',
                playerRole: null,
                currentChoice: null,
                opponentChoice: null,
                timeLeft: 5,
                roundNumber: 1,
                scores: { player: 0, opponent: 0 }
              });
              setDuelStatus(null);
              setGlobalTimer(MATCH_DURATION);
            }}
            className="px-8 py-4 rounded-xl text-2xl font-bold bg-red-500/20 
                     border-2 border-red-500 hover:bg-red-500/30 transition-all duration-300"
          >
            Nouvelle partie
          </button>
        </div>
      )}
    </div>
  );
};

  const getStatusMessage = () => {
    if (globalTimer === 0) return 'Temps écoulé !';
    
    switch (duelState.status) {
      case 'waiting':
        return "En attente de l'adversaire...";
      case 'playing':
        return duelState.currentChoice 
          ? "En attente du choix de l'adversaire..." 
          : "À vous de jouer !";
      case 'completed':
        return 'Partie terminée';
      default:
        return 'En préparation...';
    }
  };

  // Rendu principal
  return (
    <div className="min-h-screen text-white relative overflow-hidden">
      <GameTitle 
        title="Chi-Soul-Mi"
        type="MALUS"
        colors={gameColors}
        soulImage="/images/Âmichettes Charly/Amichette_Rouge.gif"
      />

      <div className="w-full max-w-4xl mx-auto mb-8">
        {/* Sélecteur de mode */}
        {/* Continuation du rendu principal */}
        <div className="flex justify-center gap-4 p-4">
          <button
            onClick={() => setGameType('local')}
            className={`px-6 py-3 rounded-lg text-xl font-bold transition-all duration-300
                      ${gameType === 'local' 
                        ? 'bg-red-900/40 border-2 border-red-500' 
                        : 'bg-black/30 border-2 border-transparent hover:border-red-500'}`}
          >
            Mode Local
          </button>
          <button
            onClick={() => setGameType('online')}
            className={`px-6 py-3 rounded-lg text-xl font-bold transition-all duration-300
                      ${gameType === 'online' 
                        ? 'bg-red-900/40 border-2 border-red-500' 
                        : 'bg-black/30 border-2 border-transparent hover:border-red-500'}`}
          >
            Mode Online
          </button>
        </div>

        {/* Interface du mode en ligne */}
        {gameType === 'online' && (
          <>
            {!duelState.id ? (
              <div className="mt-4 p-6 rounded-xl bg-black/30 border border-red-500/20">
                <div className="flex flex-col items-center gap-4">
                  {!duelStatus ? (
                    <>
                      <div className="flex gap-4">
                        <button
                          onClick={createDuel}
                          disabled={isLoading}
                          className={`px-6 py-3 rounded-lg text-xl font-bold bg-red-900/20 
                                   border-2 border-red-500/30 hover:border-red-500
                                   transition-all duration-300 ${isLoading ? 'opacity-50' : ''}`}
                        >
                          {isLoading ? 'Création...' : 'Créer un duel'}
                        </button>
                        <div className="flex gap-2">
                          <input
                            type="text"
                            value={inviteCode}
                            onChange={(e) => setInviteCode(e.target.value)}
                            placeholder="Code d'invitation"
                            disabled={isLoading}
                            className="px-4 py-2 rounded-lg bg-black/30 border-2 border-red-500/30 
                                     focus:border-red-500 outline-none transition-all duration-300"
                          />
                          <button
                            onClick={joinDuel}
                            disabled={isLoading || !inviteCode}
                            className={`px-6 py-3 rounded-lg text-xl font-bold bg-red-900/20 
                                     border-2 border-red-500/30 hover:border-red-500
                                     transition-all duration-300 ${isLoading ? 'opacity-50' : ''}`}
                          >
                            {isLoading ? 'Connexion...' : 'Rejoindre'}
                          </button>
                        </div>
                      </div>
                    </>
                  ) : duelStatus.type === 'created' ? (
                    <div className="text-center">
                      <p className="text-xl mb-2">Code d'invitation :</p>
                      <div className="flex items-center gap-2 justify-center">
                        <span className="text-2xl font-bold text-red-500">{duelStatus.code}</span>
                        <button
                          onClick={() => {
                            navigator.clipboard.writeText(duelStatus.code);
                            alert('Code copié !');
                          }}
                          className="p-2 rounded-lg bg-red-900/20 border-2 border-red-500/30 
                                   hover:border-red-500 transition-all duration-300"
                        >
                          Copier
                        </button>
                      </div>
                      <p className="mt-4 text-gray-400">En attente d'un adversaire...</p>
                    </div>
                  ) : (
                    <div className="text-center">
                      <p className="text-xl text-red-500">Connecté au duel !</p>
                    </div>
                  )}

                  {error && (
                    <div className="mt-4 p-4 bg-red-900/20 border border-red-500 rounded-lg">
                      <p className="text-red-500">{error}</p>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <OnlineGameInterface />
            )}
          </>
        )}

        {/* Mode local */}
        {gameType === 'local' && (
          <div className="mt-4 p-6 rounded-xl bg-black/30 border border-red-500/20">
            <div className="text-center mb-8">
              <h3 className="text-2xl font-bold" style={{ color: gameColors.light }}>
                Mode Local (Hot Seat)
              </h3>
              <p className="text-gray-400 mt-2">
                Jouez à tour de rôle sur le même appareil
              </p>
            </div>

            <div className="grid grid-cols-2 gap-8">
              {/* Joueur 1 */}
              <div className="text-center">
                <h4 className="text-xl font-bold mb-4">Joueur 1</h4>
                <div className="grid grid-cols-3 gap-2">
                  {choices.map((choice) => (
                    <button
                      key={choice.id}
                      onClick={() => makeLocalChoice('player1', choice.id)}
                      disabled={duelState.status !== 'player1Turn'}
                      className={`p-2 rounded-lg transition-all duration-300
                                ${duelState.currentChoice === choice.id 
                                  ? 'bg-red-500/30 border-2 border-red-500' 
                                  : 'bg-black/30 border-2 border-transparent hover:border-red-500'}`}
                    >
                      <img 
                        src={choice.image}
                        alt={choice.label}
                        className="w-full h-16 object-contain"
                      />
                    </button>
                  ))}
                </div>
                <div className="mt-4 text-2xl font-bold">
                  Score: {duelState.scores.player}
                </div>
              </div>

              {/* Joueur 2 */}
              <div className="text-center">
                <h4 className="text-xl font-bold mb-4">Joueur 2</h4>
                <div className="grid grid-cols-3 gap-2">
                  {choices.map((choice) => (
                    <button
                      key={choice.id}
                      onClick={() => makeLocalChoice('player2', choice.id)}
                      disabled={duelState.status !== 'player2Turn'}
                      className={`p-2 rounded-lg transition-all duration-300
                                ${duelState.opponentChoice === choice.id 
                                  ? 'bg-red-500/30 border-2 border-red-500' 
                                  : 'bg-black/30 border-2 border-transparent hover:border-red-500'}`}
                    >
                      <img 
                        src={choice.image}
                        alt={choice.label}
                        className="w-full h-16 object-contain"
                      />
                    </button>
                  ))}
                </div>
                <div className="mt-4 text-2xl font-bold">
                  Score: {duelState.scores.opponent}
                </div>
              </div>
            </div>

            {/* Résultat du tour */}
            {roundResult && (
              <div className="mt-8 text-center">
                <h3 className="text-3xl font-bold" style={{ color: gameColors.light }}>
                  {roundResult === 'tie' ? 'Égalité !' : 
                   `Victoire du Joueur ${roundResult === 'player1' ? '1' : '2'} !`}
                </h3>
                <p className="mt-2">Round {duelState.roundNumber} / 3</p>
              </div>
            )}

            {/* Commandes du jeu local */}
            <div className="mt-8 flex justify-center gap-4">
              {duelState.status === 'waiting' ? (
                <button
                  onClick={startLocalGame}
                  className="px-6 py-3 rounded-lg text-xl font-bold bg-red-900/20 
                           border-2 border-red-500/30 hover:border-red-500
                           transition-all duration-300"
                >
                  Commencer la partie
                </button>
              ) : (
                <button
                  onClick={resetLocalGame}
                  className="px-6 py-3 rounded-lg text-xl font-bold bg-black/30 
                           border-2 border-red-500/30 hover:border-red-500
                           transition-all duration-300"
                >
                  Abandonner
                </button>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Description du jeu */}
      <GameDescription
        mainColor="#8F0016"
        soulImage="/images/Âmichettes Charly/Amichette_Rouge.gif"
      >
        <p>
          <strong>Chi-Soul-Mi</strong> est une version améliorée du traditionnel 
          Pierre-Papier-Ciseaux, incluant deux nouveaux éléments : Lézard et Spock.
        </p>

        <div className="space-y-6 pl-8">
          <p>
            <strong>Les règles sont les suivantes :</strong>
          </p>
          <ul className="list-disc space-y-4">
            <li>Les Ciseaux coupent le Papier et décapitent le Lézard</li>
            <li>Le Papier recouvre la Pierre et réfute Spock</li>
            <li>La Pierre écrase le Lézard et casse les Ciseaux</li>
            <li>Le Lézard mange le Papier et empoisonne Spock</li>
            <li>Spock casse les Ciseaux et vaporise la Pierre</li>
          </ul>
        </div>

        <div className="bg-black/40 p-6 rounded-lg mt-8">
          <p>
            <strong>Modes de jeu disponibles :</strong>
          </p>
          <ul className="list-disc pl-6 mt-4 space-y-2">
            <li>
              <strong>Mode Local :</strong> Jouez à deux sur le même appareil
            </li>
            <li>
              <strong>Mode Online :</strong> Affrontez d'autres joueurs en ligne
            </li>
          </ul>
        </div>
      </GameDescription>
    </div>

      {/* Contenu principal */}
      <div className="relative z-10 p-8">
        {/* En-tête avec scores */}
        <div className="flex justify-between items-start mb-12">
          {/* Joueur 1 */}
          <div className="text-center">
            <input
              type="text"
              value={player1Name}
              onChange={(e) => setPlayer1Name(e.target.value)}
              className="bg-transparent text-3xl font-bold mb-4 text-center outline-none border-b-2 border-transparent hover:border-red-500 focus:border-red-500"
              style={{ color: gameColors.light }}
            />
            <div className="text-5xl font-bold mb-2" style={{ color: gameColors.main }}>
              {player1Score}
            </div>
            <div className="text-xl opacity-70">
              Total: {totalPlayer1Score}
            </div>
          </div>

          {/* Timer central */}
          <div className="text-6xl font-bold" style={{ color: gameColors.light }}>
            {gameState === 'setup' ? setupTimer : gameTimer}
          </div>

          {/* Joueur 2 */}
          <div className="text-center">
            <input
              type="text"
              value={player2Name}
              onChange={(e) => setPlayer2Name(e.target.value)}
              className="bg-transparent text-3xl font-bold mb-4 text-center outline-none border-b-2 border-transparent hover:border-red-500 focus:border-red-500"
              style={{ color: gameColors.light }}
            />
            <div className="text-5xl font-bold mb-2" style={{ color: gameColors.main }}>
              {player2Score}
            </div>
            <div className="text-xl opacity-70">
              Total: {totalPlayer2Score}
            </div>
          </div>
        </div>

        {/* Phase de préparation */}
        {gameState === 'setup' && (
          <div className="text-center">
            <h2 className="text-4xl font-bold mb-8" style={{ color: gameColors.light }}>
              Êtes-vous prêts ?
            </h2>
            <div className="flex justify-center gap-12">
              <button
                onClick={() => setPlayer1Ready(true)}
                className={`px-8 py-4 rounded-xl text-2xl font-bold transition-all duration-300
                          ${player1Ready 
                            ? 'bg-green-500/20 border-2 border-green-500' 
                            : 'bg-red-500/20 border-2 border-red-500 hover:bg-red-500/30'}`}
                disabled={player1Ready}
              >
                {player1Name} {player1Ready ? '✓' : 'Prêt ?'}
              </button>
              <button
                onClick={() => setPlayer2Ready(true)}
                className={`px-8 py-4 rounded-xl text-2xl font-bold transition-all duration-300
                          ${player2Ready 
                            ? 'bg-green-500/20 border-2 border-green-500' 
                            : 'bg-red-500/20 border-2 border-red-500 hover:bg-red-500/30'}`}
                disabled={player2Ready}
              >
                {player2Name} {player2Ready ? '✓' : 'Prêt ?'}
              </button>
            </div>
          </div>
        )}

        {/* Phase de jeu */}
        {gameState === 'playing' && (
          <div className="grid grid-cols-2 gap-16">
            {/* Zone Joueur 1 */}
            <div className="space-y-8">
              <h3 className="text-3xl font-bold text-center mb-8" style={{ color: gameColors.light }}>
                {player1Name}
              </h3>
              <div className="grid grid-cols-3 gap-4">
                {choices.map((choice) => (
                  <button
                    key={choice.id}
                    onClick={() => setPlayer1Choice(choice.id)}
                    disabled={showResult || player1Choice}
                    className={`relative p-4 rounded-xl transition-all duration-300 
                              ${player1Choice === choice.id 
                                ? 'bg-red-500/30 border-2 border-red-500' 
                                : 'bg-black/30 border-2 border-transparent hover:border-red-500'}`}
                  >
                    <img 
                      src={choice.image}
                      alt={choice.label}
                      className="w-full h-32 object-contain mb-2"
                    />
                    <div className="text-lg font-medium">{choice.label}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Zone Joueur 2 */}
            <div className="space-y-8">
              <h3 className="text-3xl font-bold text-center mb-8" style={{ color: gameColors.light }}>
                {player2Name}
              </h3>
              <div className="grid grid-cols-3 gap-4">
                {choices.map((choice) => (
                  <button
                    key={choice.id}
                    onClick={() => setPlayer2Choice(choice.id)}
                    disabled={showResult || player2Choice}
                    className={`relative p-4 rounded-xl transition-all duration-300 
                              ${player2Choice === choice.id 
                                ? 'bg-red-500/30 border-2 border-red-500' 
                                : 'bg-black/30 border-2 border-transparent hover:border-red-500'}`}
                  >
                    <img 
                      src={choice.image}
                      alt={choice.label}
                      className="w-full h-32 object-contain mb-2"
                    />
                    <div className="text-lg font-medium">{choice.label}</div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Affichage du résultat */}
        {showResult && (
          <div className="absolute inset-0 bg-black/80 flex items-center justify-center">
            <div className="text-center">
              <h2 className="text-6xl font-bold mb-8" style={{ color: gameColors.light }}>
                {winner === 'tie' 
                  ? 'Égalité !' 
                  : winner === 'player1' 
                    ? `${player1Name} gagne !` 
                    : `${player2Name} gagne !`}
              </h2>
              <div className="text-2xl">
                Manche {round} / 3
              </div>
            </div>
          </div>
        )}

        {/* Bouton nouvelle partie */}
        {(gameState === 'setup' && round === 1) && (
          <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2">
            <button
              onClick={endGame}
              className="px-8 py-4 rounded-xl text-2xl font-bold bg-red-500/20 
                       border-2 border-red-500 hover:bg-red-500/30 transition-all duration-300"
            >
              Nouvelle partie
            </button>
          </div>
        )}
      </div>

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
      {/* Barre de Défilement */}
      <style jsx>{`
      ::-webkit-scrollbar {
        width: 10px;
      }

      ::-webkit-scrollbar-track {
        background: rgba(139, 0, 17, 0.1);
        border-radius: 5px;
      }

      ::-webkit-scrollbar-thumb {
        background: rgba(179, 0, 37, 0.3);
        border-radius: 5px;
      }

      ::-webkit-scrollbar-thumb:hover {
        background: rgba(179, 0, 37, 0.5);
      }
    `}</style>
  </div>

  );
};

export default ChiSoulMiPage;
